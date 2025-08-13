<script lang="ts">
	import { onMount } from "svelte";

	import { AnalyticsEventKey, AuthMode, EsignType, UserRole } from "../../enum";
	import { callApi } from "../../lib/api/callApi";
	import { redirectUrls } from "../../config/aadhaar-esp.config";

	import { decryptUsingAes } from "../../../public/utils/aes.util";
	import SignSelection from "../SignSelection/SignSelection.svelte";
	import { trackAnalyticsEvent } from "../../lib/mixpanel/mixPanelAnalytics";

	const {
		cdslRedirectUrl,
		emudhraRedirectUrl,
		nsdlRedirectUrl,
		vsignRedirectUrl,
		newVsignRedirectUrl,
	} = redirectUrls;

	export let requestId: string;
	export let uid: string;
	export let documentInfo: {
		esign_type?: string;
		security_settings?: {
			photo_capture?: boolean;
		};
		esign_options?: any[];
		auth_mode_options?: any[];
	};
	export let brandingContext;
	export let show_download_btn: boolean;

	let esp = "";
	let espXml = "";
	let verifyUid = false;
	let custId = "";
	let espFormRef;
	let errorMessage = "";
	let authModeOptions = {};
	let esignOptions: string[] = [];

	const VALID_ESIGN_OPTIONS = ["DIGITAL", "AADHAAR"] as const;

	const VALID_AUTH_MODE_VALUES = {
		AADHAAR: ["OTP", "FMR", "IIR", "FIA"],
		DIGITAL: ["EMAIL", "WHATSAPP"],
	} as const;

	type EsignOption = (typeof VALID_ESIGN_OPTIONS)[number];
	type ValidAuthValues = (typeof VALID_AUTH_MODE_VALUES)[EsignOption];
	type AuthOptions = Record<EsignOption, string[]>;

	function validateAuthModeOptions(options: any): options is AuthOptions {
		if (
			typeof options !== "object" ||
			options === null ||
			Array.isArray(options)
		)
			return false;

		return Object.entries(options).every(([key, values]) => {
			if (!VALID_ESIGN_OPTIONS.includes(key as EsignOption)) return false;

			if (!Array.isArray(values)) return false;

			const validKey = key as EsignOption;
			const validValues = VALID_AUTH_MODE_VALUES[validKey];

			return (
				values.length === 0 ||
				values.every((value) =>
					(validValues as readonly string[]).includes(value)
				)
			);
		});
	}

	onMount(() => {
		trackAnalyticsEvent(AnalyticsEventKey.PREFERENCE_SCREEN_LOADED);

		if (documentInfo?.esign_options) {
			const validOptions = documentInfo.esign_options.filter((option) =>
				VALID_ESIGN_OPTIONS.includes(option.trim())
			);
			if (validOptions.length > 0) {
				esignOptions = validOptions;
			} else {
				errorMessage = "Invalid Sign Options";
				return;
			}
		}

		if (
			documentInfo?.auth_mode_options &&
			validateAuthModeOptions(documentInfo.auth_mode_options)
		) {
			authModeOptions = documentInfo.auth_mode_options;
		} else {
			errorMessage = "Invalid Authentication Options";
		}
	});

	async function callUpdateEsignTypeApi(
		esign_type: EsignType,
		auth_mode?: AuthMode
	) {
		await callApi("post", `/api/v5/update-esign-type`, {
			request_id: requestId,
			esign_type,
			auth_mode,
		});
	}

	async function generateXml() {
		const response: any = await callApi(
			"post",
			`/api/v5/nsdl-xml/${requestId}?show_download_btn=${show_download_btn}`,
			{}
		);
		return response;
	}

	async function sendOtp(esignType: EsignType) {
		const resp: any = await callApi("put", `/api/v5/otp/send`, {
			requestId,
			role: UserRole.SIGNER,
			otp_mode: esignType,
			purpose: "Signing",
		});
		if (!resp.success) {
			throw new Error(resp.response_message || "OTP sending failed");
		}
		const { data } = resp;
		const eventDetail = {
			sender: data.sender,
			esign_type: esignType,
			show_download_btn,
			ip: data.ip,
			name: data.signer_name,
			photo_capture: documentInfo.security_settings?.photo_capture,
		};
		const e = new CustomEvent("authredirect", { detail: eventDetail });
		dispatchEvent(e);
	}

	async function handleProceed(values: any) {
		try {
			if (values.esignMethod === "DIGITAL") {
				trackAnalyticsEvent(
					AnalyticsEventKey.PREFERENCE_SIGN_TYPE_DIGITAL_CLICKED
				);
				await callUpdateEsignTypeApi(values.authMethod);
				await sendOtp(values.authMethod);
			} else {
				trackAnalyticsEvent(
					AnalyticsEventKey.PREFERENCE_SIGN_TYPE_AADHAAR_CLICKED
				);
				await callUpdateEsignTypeApi(EsignType.AADHAAR, values.authMethod);
				const xmlResponse: any = await generateXml();

				if (
					!xmlResponse.success &&
					xmlResponse.response_message === "Signing in progress"
				) {
					throw new Error("Signing in progress");
				} else if (xmlResponse.success) {
					espXml = xmlResponse.xml;
					verifyUid = xmlResponse.verify_uid;
					custId = btoa(
						JSON.stringify({
							userAadhaarLast4Digit: verifyUid
								? decryptUsingAes(uid).slice(-4)
								: "",
							logoURL: `${import.meta.env.VITE_API_URL}/images/zoop-new-logo.svg`,
							buttonColour: "",
							headerColour: "",
						})
					);
					esp = xmlResponse.esp;
				}
			}
		} catch (error) {
			console.error("Error while updating esign type:", error);
		}
	}
</script>

<div class="flex grow items-center justify-center bg-lightGrey">
	{#if esignOptions.length && Object.keys(authModeOptions).length > 0}
		<SignSelection
			request_id={requestId}
			esign_options={esignOptions}
			auth_mode_options={authModeOptions}
			primary_color={brandingContext?.primary_color}
			hover_color={brandingContext?.hover_color}
			onProceed={(e) => handleProceed(e)}
		/>
	{/if}

	{#if esp === "VSIGN" && espXml}
		<form
			bind:this={espFormRef}
			method="post"
			id="authPageForm"
			encType="multipart/form-data"
			action={verifyUid
				? `${newVsignRedirectUrl}/${uid}/navesignauthpage`
				: vsignRedirectUrl}
		>
			<input type="hidden" name="txnref" value={espXml} />
		</form>
	{/if}

	{#if esp === "NSDL" && espXml}
		<form
			bind:this={espFormRef}
			method="post"
			id="nsdlEsignForm"
			encType="multipart/form-data"
			action={nsdlRedirectUrl}
		>
			<input type="hidden" name="msg" value={espXml} />
		</form>
	{/if}

	{#if esp === "CDSL" && espXml}
		<form
			bind:this={espFormRef}
			method="post"
			id="esignForm"
			action={cdslRedirectUrl}
		>
			<input type="hidden" name="ESIGN_REQUEST_XML" value={espXml} />
			<input type="hidden" name="CONSENT_ID" value="1" />
		</form>
	{/if}

	{#if esp === "EMUDHRA" && espXml}
		<form
			bind:this={espFormRef}
			method="post"
			id="emudhraEsignForm"
			action={emudhraRedirectUrl}
		>
			<input type="text" name="txnref" value={espXml} />
			<input type="text" name="custUI" value={custId} />
			<input type="submit" value="Gateway Redirect" />
		</form>
	{/if}
</div>
