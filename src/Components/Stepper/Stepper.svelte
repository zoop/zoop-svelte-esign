<script lang="ts">
	import { createQuery } from "@tanstack/svelte-query";
	import Esp from "../Esp/Esp.svelte";
	import Home from "../Home/Home.svelte";
	import Viewer from "../Viewer/Viewer.svelte";

	import { fetchSecuritySettings } from "../../lib/api/securitySettings";

	let currentStep = 0;

	let CurrentStepComponent: any;

	// Array of step components
	const steps = [Home, Viewer, Esp];

	// Computed current component
	$: CurrentStepComponent = steps?.[currentStep] || null;

	function nextStep() {
		if (currentStep < steps.length - 1) {
			currentStep += 1;
		}
	}

	function previousStep() {
		if (currentStep > 0) {
			currentStep -= 1;
		}
	}

	function resetSteps() {
		currentStep = 0;
	}

	const requestId = "68834e1f92d12a17f28bd9a0";

	const securitySettingsQuery = createQuery({
		queryKey: ["securitySettings", requestId],
		queryFn: () => fetchSecuritySettings({ requestId }),
	});

	$: if ($securitySettingsQuery.data) {
		console.log("Security Settings:", $securitySettingsQuery.data);
	}
</script>

{#if $securitySettingsQuery.isLoading}
	<p class="text-center">Loading...</p>
{:else if $securitySettingsQuery.isError}
	<p class="text-center text-red-500">
		Error: {$securitySettingsQuery.error.message}
	</p>
{/if}

{#if CurrentStepComponent}
	<svelte:component this={CurrentStepComponent} {nextStep} />
{:else}
	<p>No step found.</p>
{/if}

<!-- Navigation Buttons -->
<div class="mt-4 space-x-2">
	<button on:click={previousStep} disabled={currentStep === 0}>
		Previous
	</button>
	<button on:click={nextStep} disabled={currentStep === steps.length - 1}>
		Next
	</button>
	<button on:click={resetSteps}>Reset</button>
</div>

<!-- Optional Step Indicator -->
<p class="text-sm mt-2 text-gray-500">
	Step {currentStep + 1} of {steps.length}
</p>
