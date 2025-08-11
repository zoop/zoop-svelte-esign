<script lang="ts">
	import { onMount } from "svelte";

	import { AnalyticsEventKey, UserRole } from "../../enum";

	import { get } from "svelte/store";

	import { Input } from "@zoop-svelte/svelte-components";
	import PrimaryButton from "../Button/PrimaryButton.svelte";
	import SignatureModal from "../modal/SignatureModal.svelte";

	import { trackAnalyticsEvent } from "../../lib/mixpanel/mixPanelAnalytics";
	import { callApi } from "../../lib/api/callApi";
	import { brandingStore } from "../../stores/branding";

	export let request_id: string;
	export let sender: string;
	export let esign_type: string;
	export let otp_mode: string;
	export let ip: string;
	export let signer_name: string;
	export let role: UserRole;
	export let auth_type: string;
	export let verified = "";
	export let sign_version = "v1";
	export let photo_capture: boolean = false;
	export let show_download_btn: string = "";

	let countdown = 30;
	let loading = false;
	let resendOtpLoading = false;
	let resendAttempts = 0;
	let drawSignatureModalFlag = !!verified;
	let otp = "";
	let formError = false;
	let formMessage = "";
	let otpTitle = {
		error: false,
		message: `OTP has been sent to ${sender}`,
	};

	let mediaStream: MediaStream | null = null;
	const brandingContext = get(brandingStore);

	const handleChange = (val: string) => {
		otp = val;
	};

	// const requestCameraPermission = async () => {
	// 	try {
	// 		if (!navigator.mediaDevices?.getUserMedia) {
	// 			throw new Error("getUserMedia is not supported");
	// 		}
	// 		mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
	// 	} catch (err) {
	// 		console.error("Camera permission error", err);
	// 	}
	// };

	const resendOTP = async () => {
		try {
			resendOtpLoading = true;
			const resp = await callApi("put", "/otp/resend", {
				requestId: request_id,
				otp_mode,
				role,
			});
			if (!resp.success) {
				otpTitle = {
					error: true,
					message:
						resendAttempts === 3
							? "Too many attempts! Try again in 15 minutes."
							: resp.response_message,
				};
			} else {
				otpTitle = {
					error: false,
					message: `OTP resent to ${sender}`,
				};
				resendAttempts++;
				countdown = resendAttempts === 3 ? 900 : 30;
				if (resendAttempts === 3) resendAttempts = 0;
			}
		} catch (err: any) {
			otpTitle = {
				error: true,
				message: "Error resending OTP",
			};
			countdown = resendAttempts % 3 === 0 ? 900 : 30;
			resendAttempts++;
		} finally {
			resendOtpLoading = false;
		}
	};

	const verifyOTP = async () => {
		try {
			loading = true;
			const resp = await callApi("put", "/otp/verify", {
				requestId: request_id,
				otp,
				otp_mode: "EMAIL",
				role,
			});
			if (!resp.success) {
				formError = true;
				formMessage = resp.response_message;
			} else {
				formError = false;
				formMessage = "";
				if (!auth_type) drawSignatureModalFlag = true;
			}
		} catch (err: any) {
			formError = true;
			formMessage =
				err?.response?.data?.response_message || "Verification failed";
		} finally {
			loading = false;
		}
	};

	let countdownInterval: NodeJS.Timeout;

	onMount(() => {
		trackAnalyticsEvent(AnalyticsEventKey.AUTHENTICATION_SCREEN_LOADED);
		// if (photo_capture) requestCameraPermission();

		countdownInterval = setInterval(() => {
			if (countdown > 0) countdown--;
		}, 1000);
	});

	// onDestroy(() => {
	// 	if (mediaStream) {
	// 		mediaStream.getTracks().forEach((track) => track.stop());
	// 		stopCamera(mediaStream);
	// 	}
	// 	clearInterval(countdownInterval);
	// });
</script>

{#if !drawSignatureModalFlag}
	<div class="bg-white max-w-md rounded-lg p-6 text-sm shadow-md text-center">
		<h2 class="text-base font-medium">
			{auth_type
				? role === UserRole.APPROVER
					? "Approver Authentication"
					: "Signer Authentication"
				: brandingContext.document_name || "Esign Authentication"}
		</h2>
		<p class="text-gray-500">Transaction ID: {request_id}</p>
		<hr class="my-4" />

		{#if otpTitle.error}
			<div class="text-red-500">{otpTitle.message}</div>
		{:else}
			<div class="text-green-600">{otpTitle.message}</div>
		{/if}

		<div class="mt-4">
			<label class="block mb-1 font-semibold">Enter OTP</label>
			<Input
				bind:value={otp}
				placeholder="Enter OTP"
				type="text"
				class="w-full"
				error={formError}
			/>
			{#if formError}
				<p class="text-red-500 text-xs mt-1">{formMessage}</p>
			{/if}
		</div>

		<div class="flex justify-between items-center mt-4">
			<span class="text-sm text-gray-500">Did not receive OTP?</span>
			{#if countdown === 0}
				<PrimaryButton text={"Resend"} onClick={resendOTP} />
			{:else}
				<span class="text-sm text-green-700"
					>Resend in {Math.floor(countdown / 60)}:{(countdown % 60)
						.toString()
						.padStart(2, "0")}</span
				>
			{/if}
		</div>

		<PrimaryButton
			text={"Verify"}
			onClick={verifyOTP}
			disabled={otp.length !== 6}
		/>

		<hr class="my-6" />
		<p class="text-gray-500 text-xs">
			Current Time: {new Date().toLocaleString()}
		</p>
		<p class="text-gray-500 text-xs mt-2">
			By proceeding, I agree to the
			<a
				class="text-blue-600 font-medium"
				href={brandingContext.terms_and_conditions_link}
				target="_blank">Terms</a
			>
			and
			<a
				class="text-blue-600 font-medium"
				href="https://stack.zoop.one/privacy-policy"
				target="_blank">Privacy Policy</a
			>
		</p>
		{#if ip}
			<p class="text-xs text-gray-400 mt-2">IP Address: {ip}</p>
		{/if}
	</div>
{:else}
	<SignatureModal on:close={() => (drawSignatureModalFlag = false)} />
{/if}

<!-- {#if showSignatureModal}
			<SignatureModal on:close={() => (showSignatureModal = false)} />
		{/if} -->
<!-- <div>
			<button
				class="inset-shadow-md mt-2 cursor-pointer rounded-md bg-blue-400 px-8 py-2 text-white shadow-md"
				on:click={() => (showSignatureModal = true)}
				>Sign
			</button>
		</div> -->
