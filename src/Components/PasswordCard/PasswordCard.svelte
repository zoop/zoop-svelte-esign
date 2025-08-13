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

<div class="flex items-center justify-center min-h-screen p-4">
	<form on:submit|preventDefault={handleSubmit}>
		<div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 relative">
			<!-- Icon -->
			<div class="flex justify-center mb-6">
				<div
					class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
				>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path
							d="M18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11Z"
							stroke="#10B981"
							stroke-width="2"
						/>
						<path
							d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
							stroke="#10B981"
							stroke-width="2"
						/>
						<circle cx="12" cy="16" r="2" fill="#10B981" />
					</svg>
				</div>
			</div>

			<!-- Title -->
			<h2 class="text-xl font-semibold text-gray-900 text-center mb-2">
				Enter Password
			</h2>

			<!-- Description -->
			<p class="text-sm text-gray-600 text-center mb-8">
				Passcode is necessary to access
				<span class="font-medium text-gray-900">
					{passwordProtection?.document_name ?? "this document"}
				</span>
			</p>

			<!-- Password Input -->
			<div class="mb-6">
				<label class="block text-sm font-medium text-gray-700 mb-2">
					Password
				</label>
				<div class="relative">
					<input
						type={showPassword ? "text" : "password"}
						bind:value={password}
						placeholder="Enter password"
						on:focus={() => (incorrectPasswordError = "")}
						class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors {validationError ||
						incorrectPasswordError
							? 'border-red-500 focus:ring-red-500 focus:border-red-500'
							: ''}"
					/>
					<button
						type="button"
						class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
						on:click={togglePasswordVisibility}
					>
						{#if showPassword}
							<EyeIcon size={20} />
						{:else}
							<EyeClosed size={20} />
						{/if}
					</button>
				</div>

				{#if validationError}
					<p class="text-red-500 text-sm mt-2">{validationError}</p>
				{/if}
				{#if incorrectPasswordError}
					<p class="text-red-500 text-sm mt-2">{incorrectPasswordError}</p>
				{/if}
			</div>

			<!-- Support Note -->
			<p class="text-xs text-gray-500 text-center mb-6">
				Facing an issue?
				<button type="button" class="text-blue-600 font-medium hover:underline">
					Contact document owner
				</button>
				for support.
			</p>

			<!-- Submit Button -->
			<PrimaryButton
				type="submit"
				text={loading ? "Processing..." : "Proceed"}
				onClick={handleSubmit}
				className="w-full py-3 rounded-lg font-medium  disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={!password || loading}
			/>
		</div>
	</form>
</div>
