<script lang="ts">
	import { gatewayStore } from "../../stores/gateway";

	// import LocationAndPhotoCaptureModal from "../Common/LocationAndPhotoCaptureModal.svelte";
	import { SecurityStep, UserRole } from "../../enum";
	import AuthCard from "../AuthCard/AuthCard.svelte";
	import PasswordCard from "../PasswordCard/PasswordCard.svelte";

	export let role: UserRole;
	export let orgName: string;
	export let setInternalError: (e: any) => void;
	export let onAllStepsComplete: () => void;
	export let mediaStream: MediaStream | null;
	export let setMediaStream: (stream: MediaStream | null) => void;

	// Reactive store access
	$: {
		const { steps: s, currentStepIndex: idx, sharedData: sd } = $gatewayStore;

		steps = s;
		currentStepIndex = idx;
		sharedData = sd;

		if (idx >= s.length && onAllStepsComplete) {
			onAllStepsComplete();
		}
	}

	let steps = [];
	let currentStepIndex = 0;
	let sharedData: any = {};

	$: currentStep = steps[currentStepIndex];
</script>

{#if currentStep === SecurityStep.EMAIL_AUTHENTICATION}
	<div class="flex grow items-center justify-center bg-lightGrey">
		<AuthCard {role} />
	</div>
{:else if currentStep === SecurityStep.PASSWORD_PROTECTION}
	<div class="flex grow items-center justify-center bg-lightGrey">
		<PasswordCard {role} />
	</div>
{:else if currentStep === SecurityStep.PHOTO_AND_LOCATION}
	<div class="flex grow items-center justify-center bg-lightGrey">
		<!-- <LocationAndPhotoCaptureModal
			signerEmail={sharedData.signer_email || ""}
			signerWhatsappNumber={sharedData.signer_whatsapp_number || ""}
			{orgName}
			request_id={sharedData.request_id}
			{setInternalError}
			termsAndConditionsLink={sharedData.terms_link}
			termsOrgNamesText={sharedData.terms_text}
			{role}
			{mediaStream}
			{setMediaStream}
		/> -->
		hello
	</div>
{/if}
