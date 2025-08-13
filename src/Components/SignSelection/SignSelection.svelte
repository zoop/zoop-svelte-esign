<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";

	import { getContext } from "svelte";

	import { AnalyticsEventKey } from "../../enum";
	import PrimaryButton from "../Button/PrimaryButton.svelte";
	import TransactionFailure from "../TransactionFailure/TransactionFailure.svelte";
	import SelectTypeHeading from "./SelectTypeHeading.svelte";
	import SignTypeSelection from "./SignTypeSelection.svelte";
	import { trackAnalyticsEvent } from "../../lib/mixpanel/mixPanelAnalytics";
	import { authOptionTrackMap } from "../../lib/mixpanel/mixpanelAuthMapping";

	export let request_id: string;
	export let esign_options: string[] = [];
	export let auth_mode_options: Record<string, string[]> = {};
	export let onProceed: (values: {
		esignMethod: string;
		authMethod: string;
	}) => Promise<void>;
	export let primary_color: string;
	export let hover_color: string;

	let showErrorComponent = false;

	let esignMethod = esign_options[0];
	let authMethod = auth_mode_options[esignMethod]?.[0];
	let authOptions = auth_mode_options[esignMethod] || [];
	let loading = false;
	let errors = { esignMethod: "", authMethod: "" };
	let error_msg;

	function handleEsignChange(value: string) {
		esignMethod = value;
		authOptions = auth_mode_options[value];
		authMethod = authOptions[0];
		errors.esignMethod = "";
	}

	async function handleSubmit() {
		if (!esignMethod) errors.esignMethod = "esign method is required";
		if (!authMethod) errors.authMethod = "authentication method is required";
		if (!esignMethod || !authMethod) return;

		try {
			loading = true;
			await onProceed({ esignMethod, authMethod });
			trackAnalyticsEvent(AnalyticsEventKey.PREFERENCE_PROCEED_CTA_CLICKED);
		} catch (err) {
			let error_msg = "";
			if (err === "Signing in progress") {
				error_msg = "Document is being signed. Try again later!";
			}
			showErrorComponent = true;
		} finally {
			loading = false;
		}
	}
</script>

{#if showErrorComponent}
	<TransactionFailure {request_id} {error_msg} redirect_url="" />
{:else}
	<div class="fixed inset-0 overflow-y-auto">
		<div class="flex min-h-full items-center justify-center p-4 text-center">
			<div
				class="w-[548px] max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
			>
				<h3
					class="text-lg font-bold leading-4 text-[#232323] border-b pb-3 border-lightGrey mb-5"
				>
					Choose your preferences
				</h3>

				<form class="max-w-md mx-auto" on:submit|preventDefault={handleSubmit}>
					<SelectTypeHeading stepNumber={1} label="Sign Type">
						<SignTypeSelection
							{esign_options}
							bind:esignMethod
							on:change={(e) => handleEsignChange(e.detail)}
						/>
						{#if errors.esignMethod}
							<p class="text-red-500 text-sm">{errors.esignMethod}</p>
						{/if}
					</SelectTypeHeading>

					<SelectTypeHeading stepNumber={2} label="Authentication method">
						{#each authOptions as option}
							<section class="mt-3 flex flex-col gap-2">
								<div class="flex">
									<input
										id={option}
										type="radio"
										name="authMethod"
										value={option}
										bind:group={authMethod}
										on:change={() => {
											const event = authOptionTrackMap[option];
											if (event)
												trackAnalyticsEvent(event as AnalyticsEventKey);
											errors.authMethod = "";
										}}
										class="m-0 grid h-5 w-5 cursor-pointer appearance-none items-center justify-center rounded-full border border-gray-300 bg-white checked:border-transparent checked:bg-current"
									/>
									<label
										for={option}
										class="ml-1 cursor-pointer text-sm text-[#515151]"
									>
										{option === "EMAIL"
											? "Email OTP verification"
											: option === "WHATSAPP"
												? "WhatsApp OTP verification"
												: option === "OTP"
													? "OTP verification"
													: option === "FMR"
														? "Biometric verification"
														: option === "IIR"
															? "Iris verification"
															: option === "FIA"
																? "Face Verification (Available only on ZoopSign’s Android App)"
																: option}
									</label>
								</div>
							</section>
						{/each}
						{#if errors.authMethod}
							<p class="text-red-500 text-sm">{errors.authMethod}</p>
						{/if}
					</SelectTypeHeading>

					<div class="mt-4 flex justify-center">
						<PrimaryButton
							text="Proceed"
							onClick={handleSubmit}
							disabled={!esignMethod || !authMethod || loading}
						/>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
