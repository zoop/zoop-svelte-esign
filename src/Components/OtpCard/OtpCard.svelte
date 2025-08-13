<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { brandingStore } from "../../stores/branding";
	import { gatewayStore } from "../../stores/gateway";
	import PrimaryButton from "../Button/PrimaryButton.svelte";
	import { Input } from "@zoop-svelte/svelte-components";
	import { callApi } from "../../lib/api/callApi";

	export let request_id: string;
	export let sender: string;
	export let otp_mode: string;
	export let role: string;
	export let ip: string;
	export let auth_type: string;

	let countdown = 30;
	let resendOtpLoading = false;
	let loading = false;
	let resendAttempts = 0;
	let otp = "";
	let intervalId: ReturnType<typeof setInterval>;
	let formState = { error: false, message: "" };

	const requestId = "689c6332dfadc7b499b06661";

	onMount(() => {
		startCountdown();
	});

	onDestroy(() => {
		clearInterval(intervalId);
	});

	function startCountdown() {
		countdown = 30;
		intervalId = setInterval(() => {
			if (countdown > 0) {
				countdown -= 1;
			} else {
				clearInterval(intervalId);
			}
		}, 1000);
	}

	async function verifyOTP(otp: string) {
		loading = true;
		formState = { error: false, message: "" };

		try {
			const resp: any = await callApi("put", "/otp/verify", {
				requestId: requestId,
				otp,
				otp_mode,
				role,
			});

			if (!resp.success) {
				formState = {
					error: true,
					message: resp.response_message || "OTP verification failed",
				};
			} else {
				// Dispatch COMPLETE_STEP on success
				gatewayStore.completeStep();

				formState = {
					error: false,
					message: "OTP Verified Successfully",
				};
			}
		} catch (err: any) {
			formState = {
				error: true,
				message:
					err?.response?.data?.response_message || "Something went wrong",
			};
		} finally {
			loading = false;
		}
	}

	async function resendOTP() {
		if (resendOtpLoading || countdown > 0) return;

		resendOtpLoading = true;
		formState = { error: false, message: "" };

		try {
			// await resendOtpApi({ request_id, sender, auth_type });
			await new Promise((r) => setTimeout(r, 1000));
			startCountdown();
			resendAttempts += 1;
			formState = { error: false, message: "OTP resent successfully" };
		} catch (error) {
			formState = { error: true, message: "Failed to resend OTP" };
		} finally {
			resendOtpLoading = false;
		}
	}
</script>

<div class="flex items-center justify-center min-h-screen bg-opacity-75 p-4">
	<div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 relative">
		<div class="flex justify-center mb-6">
			<div
				class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
			>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path
						d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"
						fill="#10B981"
					/>
					<circle cx="12" cy="12" r="2" fill="#10B981" />
				</svg>
			</div>
		</div>

		<!-- Title -->
		<h2 class="text-xl font-semibold text-gray-900 text-center mb-2">
			Verify with OTP
		</h2>

		<!-- Description -->
		<p class="text-sm text-gray-600 text-center mb-8">
			Enter the 6-digit OTP sent to your mobile number ending with
			<span class="font-medium">****{sender.slice(-4)}</span>. The code is valid
			for 10 minutes.
		</p>

		<!-- OTP Input -->
		<div class="mb-6">
			<Input
				id="otp"
				type="text"
				class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-center text-lg font-mono tracking-widest {formState.error
					? 'border-red-500 focus:ring-red-500 focus:border-red-500'
					: ''}"
				placeholder="Enter 6-digit OTP"
				bind:value={otp}
				maxlength={6}
			/>

			{#if formState.message}
				<p
					class={formState.error
						? "text-red-500 text-sm mt-2 text-center"
						: "text-green-600 text-sm mt-2 text-center"}
				>
					{formState.message}
				</p>
			{/if}
		</div>

		<!-- Resend Note -->
		<p class="text-xs text-gray-500 text-center mb-6">
			Did not receive an OTP?
			<PrimaryButton
				text={countdown > 0
					? `Resend in ${String(Math.floor(countdown / 60)).padStart(2, "0")}:${String(countdown % 60).padStart(2, "0")}`
					: resendOtpLoading
						? "Sending..."
						: "Resend OTP"}
				onClick={resendOTP}
				className="text-blue-600 font-medium hover:underline  border-none p-0 inline"
				disabled={countdown > 0 || resendOtpLoading}
			/>
		</p>

		<!-- Verify Button -->
		<div class="w-full flex items-center justify-center">
			<PrimaryButton
				text="Verify"
				onClick={() => verifyOTP(otp)}
				disabled={otp.length !== 6}
			/>
		</div>
	</div>
</div>
