<script lang="ts">
	import { onMount } from "svelte";

	import { AnalyticsEventKey, UserRole } from "../../enum";
	import { passwordSchema } from "../../validations/password-verification";
	import { get } from "svelte/store";
	import { gatewayStore } from "../../stores/gateway";
	import PrimaryButton from "../Button/PrimaryButton.svelte";
	import { EyeClosed, EyeIcon } from "@lucide/svelte";
	import { callApi } from "../../lib/api/callApi";
	import { trackAnalyticsEvent } from "../../lib/mixpanel/mixPanelAnalytics";

	export let role: UserRole;

	let password = "";
	let showPassword = false;
	let loading = false;
	let incorrectPasswordError = "";
	let validationError = "";

	let sharedData: any;
	let passwordProtection: any;

	onMount(() => {
		const { sharedData: s, passwordProtection: p } = get(gatewayStore);
		sharedData = s;
		passwordProtection = p;
	});

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	async function handleSubmit() {
		validationError = "";
		incorrectPasswordError = "";

		try {
			await passwordSchema.validate({ password: password.trim() });
		} catch (err: any) {
			validationError = err.errors?.[0] || "Invalid password";
			return;
		}

		loading = true;
		try {
			trackAnalyticsEvent(AnalyticsEventKey.PASSWORD_VERIFY_CTA_CLICKED);
			const res: any = await callApi("post", "/verify-password", {
				group_id: sharedData.group_id,
				request_id: sharedData.request_id || sharedData.approver_id,
				password: password.trim(),
				role,
			});

			if (res.success) {
				gatewayStore.completeStep();
			} else {
				incorrectPasswordError = "Incorrect password, please try again";
			}
		} catch (err) {
			incorrectPasswordError = "Incorrect password, please try again";
			console.error("Password verification failed", err);
		} finally {
			loading = false;
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<div
		class="flex flex-col justify-center px-7 py-6 text-sm rounded-xl border border-primary-grey-light shadow-md max-w-[550px] bg-white"
	>
		<div
			class="pb-2.5 text-base font-semibold border-b border-[#D1D5DB] text-neutral-800"
		>
			Enter Password
		</div>

		<div class="mt-3 text-neutral-800 leading-5">
			Passcode is necessary to access
			<span class="font-semibold text-neutral-800">
				{passwordProtection?.document_name ?? "this document"}
			</span>
		</div>

		<div class="relative mt-4">
			<div
				class="flex relative flex-col text-xs bg-neutral-100 text-neutral-400"
			>
				<input
					type={showPassword ? "text" : "password"}
					bind:value={password}
					placeholder="Password"
					on:focus={() => (incorrectPasswordError = "")}
					class="px-4 py-3 w-full bg-gray-50 rounded-lg border border-gray-400"
				/>
				<div
					class="absolute right-0 mr-3 flex items-center cursor-pointer top-3"
					on:click={togglePasswordVisibility}
				>
					{#if showPassword}
						<EyeIcon size={20} />
					{:else}
						<EyeClosed size={20} />
					{/if}
				</div>
			</div>

			{#if validationError}
				<div class="text-xs text-red-400 mt-1">{validationError}</div>
			{/if}
			{#if incorrectPasswordError}
				<div class="text-xs text-red-400 mt-1">{incorrectPasswordError}</div>
			{/if}
		</div>

		<div class="mt-5 text-xs text-neutral-600">
			Facing an issue? Contact document owner for support.
		</div>

		<div class="flex justify-center gap-4 pt-4">
			<PrimaryButton
				type="submit"
				text="Proceed"
				onClick={handleSubmit}
				disabled={!password || loading}
			/>
		</div>
	</div>
</form>
