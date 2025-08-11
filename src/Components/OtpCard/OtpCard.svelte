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

	// Subscriptions
	$: brandingContext = $brandingStore;
	$: sharedData = $gatewayStore.sharedData;

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
				requestId: request_id,
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

<div class="rounded-xl border bg-white p-7 shadow-md w-full max-w-md mx-auto">
	<h2 class="text-lg font-semibold mb-2">Verify OTP</h2>
	<p class="text-sm text-gray-600 mb-4">
		OTP has been sent to <span class="font-medium">{sender}</span>
	</p>

	<Input
		id="otp"
		type="text"
		placeholder="Enter 6-digit OTP"
		bind:value={otp}
		maxlength={6}
	/>

	{#if formState.message}
		<p
			class={formState.error
				? "text-red-600 text-sm mt-2"
				: "text-green-600 text-sm mt-2"}
		>
			{formState.message}
		</p>
	{/if}

	<div class="mt-4 flex items-center justify-between">
		<PrimaryButton
			text="Verify"
			onClick={() => verifyOTP(otp)}
			disabled={otp.length !== 6}
		/>

		<button
			class="text-sm text-purple-600 hover:underline disabled:opacity-50"
			on:click={resendOTP}
			disabled={countdown > 0 || resendOtpLoading}
		>
			{#if countdown > 0}
				Resend OTP in {countdown}s
			{:else if resendOtpLoading}
				Sending...
			{:else}
				Resend OTP
			{/if}
		</button>
	</div>
</div>
