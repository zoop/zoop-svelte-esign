<script lang="ts">
	import { createQuery } from "@tanstack/svelte-query";
	import Esp from "../Esp/Esp.svelte";
	import Home from "../Home/Home.svelte";
	import Viewer from "../Viewer/Viewer.svelte";

	import { fetchSecuritySettings } from "../../lib/api/security/securitySettings";
	import { fetchBrandingInfo } from "../../lib/api/branding/brandingInfo";
	import { fetchDocumentInfo } from "../../lib/api/documentInfo/documentInfo";
	import TransactionComplete from "../Transaction/TransactionComplete.svelte";
	import TransactionFailure from "../TransactionFailure/TransactionFailure.svelte";

	const requestId = "689c6332dfadc7b499b06661";

	// Stepper logic
	let currentStep = 0;
	const steps = [Home, Viewer, Esp];
	$: CurrentStepComponent = steps[currentStep] || null;

	function nextStep() {
		if (currentStep < steps.length - 1) {
			currentStep += 1;
		}
	}

	// Queries
	const securitySettingsQuery = createQuery({
		queryKey: ["securitySettings", requestId],
		queryFn: async () => {
			try {
				return await fetchSecuritySettings({ requestId });
			} catch (err: any) {
				const resp = err?.response?.data;
				// Special case: treat "Transaction completed" as valid data, not error
				if (
					resp?.response_message?.includes(
						"Transaction completed. Please create new transaction."
					)
				) {
					return resp;
				}
				throw err;
			}
		},
	});

	const documentInfoQuery = createQuery({
		queryKey: ["documentInfo", requestId],
		queryFn: () => fetchDocumentInfo({ requestId }),
	});

	const brandingInfoQuery = createQuery({
		queryKey: ["brandingInfo", requestId],
		queryFn: () => fetchBrandingInfo({ requestId }),
	});

	// Derived states
	$: branding = $brandingInfoQuery.data?.branding || {};

	// Check if transaction completed — decide as soon as securitySettingsQuery finishes
	$: isTransactionComplete =
		!!$securitySettingsQuery.data?.response_message?.includes(
			"Transaction completed"
		);

	// If not completed, check for errors
	$: hasError =
		!isTransactionComplete &&
		($securitySettingsQuery.isError ||
			$documentInfoQuery.isError ||
			$brandingInfoQuery.isError);

	// Error message to show
	$: errorMessage =
		$securitySettingsQuery.error?.message ||
		$documentInfoQuery.error?.message ||
		$brandingInfoQuery.error?.message ||
		"Request failed";
</script>

<!-- Transaction Completed Screen -->
{#if isTransactionComplete}
	<TransactionComplete {branding} />

	<!-- Generic Failure Screen -->
{:else if hasError}
	<TransactionFailure
		error_msg={errorMessage}
		request_id={requestId}
		{branding}
	/>

	<!-- Stepper -->
{:else if CurrentStepComponent}
	<svelte:component this={CurrentStepComponent} {nextStep} />

	<!-- Fallback -->
{:else}
	<p class="text-center">No step found.</p>
{/if}
