<script lang="ts">
	export let nextStep: () => void;

	import { Buffer } from "buffer";
	import { ChevronLeft, InfoIcon } from "@lucide/svelte";
	import PrimaryButton from "../Button/PrimaryButton.svelte";
	// import SignatureModal from "../modal/SignatureModal.svelte";
	import { createQuery } from "@tanstack/svelte-query";
	import { fetchDocumentInfo } from "../../lib/api/documentInfo/documentInfo";
	import PdfViewer from "../PdfViewer/PdfViewer.svelte";

	// import Footer from "../Footer/Footer.svelte";
	import { fetchSecuritySettings } from "../../lib/api/security/securitySettings";
	import { gatewayStore } from "../../stores/gateway";
	import SecurityStepRenderer from "../SecurityStepRenderer/SecurityStepRenderer.svelte";
	import { fetchBrandingInfo } from "../../lib/api/branding/brandingInfo";
	import { brandingStore } from "../../stores/branding";
	import {
		AnalyticsEventKey,
		EsignOption,
		EsignType,
		ESP,
		UserRole,
	} from "../../enum";
	import { trackAnalyticsEvent } from "../../lib/mixpanel/mixPanelAnalytics";
	import { callApi } from "../../lib/api/callApi";
	import EsignSelection from "../EsignSelection/EsignSelection.svelte";

	import NavBar from "../NavBar/NavBar.svelte";
	import AuthenticationScreen from "../AuthenticationScreen/AuthenticationScreen.svelte";
	import EsignForm from "../EsignForm/EsignForm.svelte";
	import { redirectUrls } from "../../config/aadhaar-esp.config";
	import { decryptUsingAes } from "../../../public/utils/aes.util";

	const {
		cdslRedirectUrl,
		emudhraRedirectUrl,
		nsdlRedirectUrl,
		vsignRedirectUrl,
		newVsignRedirectUrl,
	} = redirectUrls;

	export let orgName: string;
	let error = "";
	let signBoxes = [];
	let url = "";
	let stepsComplete = false;
	let fetchDocInfo = false;
	let loading = false;
	let showEsignSelection = false;
	let showAuthScreen = false;
	let authParams = {};
	let mediaStream: MediaStream | null = null;
	let esp = "";
	let espXml: string = "";
	const publicUrl = "http://localhost:3000";
	let custId = "";

	export let request_id: string;
	export let uid: string;
	export let show_download_btn: boolean;
	export let brandingContext: { primary_color: string; hover_color: string };

	let espFormRef: HTMLFormElement;

	// This reactive statement runs when `espXml` changes
	$: if (espXml && espFormRef) {
		espFormRef.submit();
	}

	const requestId = "6899ca176ec67d7ebe202895";

	const documentInfoQuery = createQuery({
		queryKey: ["documentInfo", requestId],
		queryFn: () => fetchDocumentInfo({ requestId }),
	});

	const brandingInfoQuery = createQuery({
		queryKey: ["brandingInfo", requestId],
		queryFn: () => fetchBrandingInfo({ requestId }),
	});

	const securitySettingsQuery = createQuery({
		queryKey: ["securitySettings", requestId],
		queryFn: () => fetchSecuritySettings({ requestId }),
	});

	// use $documentInfoQuery to access actual data
	$: if ($documentInfoQuery.isSuccess && typeof window !== "undefined") {
		const { url: documentUrl, sign } = $documentInfoQuery.data.document;
		url = documentUrl;
		signBoxes = sign;
	}

	$: if ($brandingInfoQuery.isSuccess) {
		const branding = $brandingInfoQuery.data;
		orgName = branding.org_name ?? "ZOOP";
		brandingStore.set({
			white_label: branding.white_label ?? "N",
			logo_url: branding.logo_url ?? "",
			primary_color: branding.primary_color ?? "#175cff",
			hover_color: branding.hover_color ?? "#0E3288",
			document_name: branding.document_name ?? "",
			terms_modal_text: branding.terms_modal_text ?? "ZOOP",
			terms_and_conditions_link:
				branding.terms_and_conditions_link ??
				"https://stack.zoop.one/terms-and-conditions",
			is_clientside_redirect: branding.is_clientside_redirect ?? false,
		});
	}

	$: if ($securitySettingsQuery.isSuccess) {
		const { shared_data, security_settings_order, security_settings_details } =
			$securitySettingsQuery.data;

		gatewayStore.setSteps({
			steps: security_settings_order,
			sharedData: shared_data,
			emailAuthentication:
				security_settings_details?.EMAIL_AUTHENTICATION || {},
			passwordProtection: security_settings_details?.PASSWORD_PROTECTION || {},
			photoAndLocationCapture:
				security_settings_details?.PHOTO_AND_LOCATION || {},
		});
	}

	function setError(val) {
		error = val;
	}

	$: documentInfo = $documentInfoQuery.data;
	$: securitySettings = $securitySettingsQuery.data;

	// === MAIN ACTION === //
	async function handleProceedToSign() {
		console.log("🚀 handleProceedToSign triggered");
		console.log("📄 documentInfo:", documentInfo);
		console.log("🔒 securitySettings:", securitySettings);

		try {
			console.log("⏳ Setting loading = true");

			trackAnalyticsEvent(
				AnalyticsEventKey.DOCUMENT_PREVIEW_PROCEED_CTA_CLICKED
			);
			console.log(
				"📊 Analytics event tracked:",
				AnalyticsEventKey.DOCUMENT_PREVIEW_PROCEED_CTA_CLICKED
			);

			// 1️⃣ Aadhaar-specific logic
			if (documentInfo?.esign_type === EsignType.AADHAAR) {
				console.log(
					"🪪 Detected Aadhaar eSign type → Triggering secondary photo capture (currently ignored)."
				);
			}

			// 2️⃣ Redirect if multiple esign options
			if (
				documentInfo?.esign_options?.length &&
				documentInfo?.auth_mode_options
			) {
				console.log(
					"🔀 Multiple eSign options detected → Redirecting to eSign Type Selection."
				);
				redirectToEsignTypeSelection();
				return;
			}

			// 3️⃣ Send OTP if applicable
			if (shouldSendOtp()) {
				console.log("📩 OTP sending condition met → Calling sendOtp()");
				await sendOtp(securitySettings?.shared_data?.esign_type);
				return;
			}

			// 4️⃣ Final fallback
			if (!loading) {
				console.log("✅ No other conditions met → Proceeding with onConfirm()");
				await onConfirm();
			} else {
				console.log("⚠ Skipping onConfirm because loading is true");
			}
		} catch (err) {
			console.error("❌ Error during the signing process:", err);
		} finally {
			loading = false;
			console.log("🏁 Finished handleProceedToSign → loading set to false");
			// stopCamera(mediaStream);
		}
	}

	// === HELPERS === //
	function shouldSendOtp(): boolean {
		const type = securitySettings?.shared_data?.esign_type;
		const shouldSend =
			type === EsignType.EMAIL ||
			type === EsignType.WHATSAPP ||
			type === EsignType.SMS;

		console.log(`🤔 shouldSendOtp? Type = ${type}, Result = ${shouldSend}`);
		return shouldSend;
	}

	function redirectToEsignTypeSelection() {
		console.log("📍 redirectToEsignTypeSelection called");

		const esignOptions: string[] = [];
		const authModeOptions: Record<string, string[]> = {};

		if (documentInfo?.esign_options?.includes(EsignOption.AADHAAR)) {
			console.log("🪪 Adding Aadhaar to eSign options");
			esignOptions.push(EsignOption.AADHAAR);
			authModeOptions[EsignOption.AADHAAR] = documentInfo.auth_mode_options
				?.length
				? documentInfo.auth_mode_options
				: ["OTP"];
		}

		if (
			documentInfo?.esign_options?.includes(EsignOption.EMAIL) ||
			documentInfo?.esign_options?.includes(EsignOption.WHATSAPP)
		) {
			console.log(
				"📨 Adding DIGITAL options (Email/WhatsApp) to eSign options"
			);
			esignOptions.push("DIGITAL");
			authModeOptions["DIGITAL"] = [];

			if (documentInfo?.esign_options?.includes(EsignOption.EMAIL)) {
				console.log("   ✉ EMAIL option detected");
				authModeOptions["DIGITAL"].push("EMAIL");
			}
			if (documentInfo?.esign_options?.includes(EsignOption.WHATSAPP)) {
				console.log("   💬 WHATSAPP option detected");
				authModeOptions["DIGITAL"].push(EsignOption.WHATSAPP);
			}
		}

		const queryParams = new URLSearchParams({
			esign_options: esignOptions.join(","),
			auth_mode_options: JSON.stringify(authModeOptions),
			uid,
			sign_version: documentInfo.sign_version,
			photo_capture: documentInfo?.security_settings?.photo_capture,
			show_download_btn: (show_download_btn ?? false).toString(),
			primary_color: brandingContext.primary_color,
			hover_color: brandingContext.hover_color,
		});

		showEsignSelection = true;
	}

	async function sendOtp(esignType: string) {
		loading = true;
		try {
			const resp: any = await callApi("put", `/otp/send`, {
				requestId: requestId,
				role: UserRole.SIGNER,
				otp_mode: documentInfo.esign_type,
				purpose: "Signing",
			});

			if (!resp.success) {
				console.error("Error sending the otp:", resp);
			} else {
				const { data } = resp;

				authParams = {
					esign_type: resp.verified ? documentInfo.esign_type : esignType,
					show_download_btn: (show_download_btn ?? false).toString(),
					signer_name: resp.verified
						? documentInfo.signer_name
						: data.signer_name,
					sign_version: documentInfo.sign_version ?? "",
					photo_capture: documentInfo.security_settings?.photo_capture ?? "",
					verified: resp.verified ? "true" : "false",
					sender: resp.verified ? "" : data.sender,
					ip: resp.verified ? "" : data.ip,
					auth_type: documentInfo.esign_type ?? "",
				};

				showAuthScreen = true;
			}
		} catch (err: any) {
			console.error("Failed to send OTP for signing:", err);
			const data = err?.response?.data ?? { response_message: "Unknown Error" };
			console.error("Error sending the otp:", data);
		}
		loading = false;
	}

	async function onConfirm() {
		loading = true;

		try {
			console.log("📡 Sending POST request to confirm signing...");
			const response: any = await callApi(
				"post",
				`/nsdl-xml/${requestId}?show_download_btn=Y`,
				{}
			);
			console.log("✅ API Response received:", response);

			loading = false;

			if (
				!response.success &&
				response.response_message === "Signing in progress"
			) {
				console.warn(
					"⚠ Signing still in progress → setting internal error:",
					response
				);
				error = response;
			} else if (response.success) {
				espXml = response.xml;
				esp = response.esp;
			} else {
				console.warn("❓ Unexpected API response:", response);
			}
		} catch (err: any) {
			console.error("❌ Error while confirming the signing request:", err);

			const data = err?.response?.data ?? { response_message: "Unknown Error" };

			loading = false;

			error = data;
		}
	}

	$: if (documentInfo && publicUrl && uid) {
		const brandingPayload = {
			userAadhaarLast4Digit: documentInfo?.verify_uid
				? decryptUsingAes(uid).slice(-4)
				: "",
			logoURL: `${publicUrl}/images/zoop-new-logo.svg`,
			buttonColour: "",
			headerColour: "",
		};

		custId = Buffer.from(JSON.stringify(brandingPayload), "utf-8").toString(
			"base64"
		);
	}

	$: isSecurityReady =
		$securitySettingsQuery.isSuccess &&
		Boolean($securitySettingsQuery.data?.shared_data?.group_id);
	$: hasSecuritySteps = $gatewayStore.steps.length > 0;
	$: if (isSecurityReady && !hasSecuritySteps && !stepsComplete) {
		console.log("No steps. Skipping to PDF viewer...");
		stepsComplete = true;
		fetchDocInfo = true;
	}

	console.log("=== EsignForm props === from page");
	console.log("ESP:", esp);
	console.log("espXml:", espXml);

	console.log("uid:", uid);
	console.log("custId:", custId);
	console.log("=======================");
</script>

<div>
	<!-- NAVBAR MOBILE -->
	<div
		class="items-center flex justify-start gap-1 z-10 px-6 w-full md:hidden my-5"
	>
		<ChevronLeft size={20} strokeWidth={2} />
		<span class="text-sm text-gray-700 font-bold">eSign Loan Agreement</span>
	</div>

	<!-- NAVBAR WEB -->
	<NavBar />
	<div class="mx-auto font-sans">
		<!-- Show EsignSelection or AuthScreen first -->
		{#if showEsignSelection}
			<EsignSelection
				requestId={request_id}
				{uid}
				{documentInfo}
				{brandingContext}
				{show_download_btn}
				on:back={() => (showEsignSelection = false)}
			/>
		{:else if showAuthScreen}
			<AuthenticationScreen
				params={authParams}
				requestId={request_id}
				on:back={() => (showAuthScreen = false)}
			/>
		{:else if isSecurityReady}
			{#if hasSecuritySteps && !stepsComplete}
				<SecurityStepRenderer
					{orgName}
					role={UserRole.SIGNER}
					setInternalError={setError}
					onAllStepsComplete={() => {
						stepsComplete = true;
						fetchDocInfo = true;
					}}
					{mediaStream}
					setMediaStream={(stream) => (mediaStream = stream)}
				/>
			{:else if $documentInfoQuery?.data?.document}
				<PdfViewer
					url={$documentInfoQuery.data.document.url}
					signBoxes={$documentInfoQuery.data.document.sign}
					zoom={1.5}
				/>
				<div class="z-[2]">
					<div>
						{#if !$documentInfoQuery.data.esign_type}
							<!-- No content -->
						{:else if $documentInfoQuery.data.esign_type === "AADHAAR"}
							<div class="ml-2 mr-2">
								<InfoIcon />
							</div>
							<div>
								By proceeding you authorize to be redirected to ESP portal for
								electronically signing the documents as per CCA guidelines
							</div>
						{:else}
							<div class="ml-2 mr-2">
								<InfoIcon />
							</div>
							<div>
								By proceeding you will receive
								{$documentInfoQuery.data.esign_type === "EMAIL"
									? "an email"
									: `a ${$documentInfoQuery.data.esign_type.toLowerCase()} message`}
								with OTP
							</div>
						{/if}
					</div>

					<div class="flex">
						<PrimaryButton
							text="Proceed to Sign"
							onClick={handleProceedToSign}
						/>
					</div>
				</div>
			{:else}
				<p>Loading document...</p>
			{/if}
		{/if}

		<EsignForm
			esp={esp as ESP}
			bind:refObj={espFormRef}
			{espXml}
			verify_uid={documentInfo?.verify_uid}
			{uid}
			{custId}
			urls={{
				vsign: vsignRedirectUrl,
				newVsign: newVsignRedirectUrl,
				nsdl: nsdlRedirectUrl,
				cdsl: cdslRedirectUrl,
				emudhra: emudhraRedirectUrl,
			}}
		/>

		<!-- Error State -->
		{#if error}
			<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-6">
				<p class="text-sm text-red-800">{error}</p>
			</div>
		{/if}
	</div>
</div>

<style>
	@media (max-width: 640px) {
		.max-w-6xl {
			max-width: 100%;
		}
	}
</style>
