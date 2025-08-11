<script lang="ts">
	import { onMount } from "svelte";

	import { AnalyticsEventKey } from "../../enum";
	import notifySdkWithData from "../../lib/config/notifySdkWithData";
	import { failureMessageMap } from "../../../public/constants/failureMessagesMap";
	import { trackAnalyticsEvent } from "../../lib/mixpanel/mixPanelAnalytics";

	export let request_id: string = "";
	export let error_msg: string = "";
	export let redirect_url: string = "";
	export let branding: any = {};

	// Set default error if unknown
	$: resolvedError = failureMessageMap[error_msg]
		? error_msg
		: "Internal Error";

	onMount(() => {
		if (branding?.logo_url && branding?.update_logo_url) {
			branding.update_logo_url(branding.logo_url);
		}

		if (
			branding?.is_clientside_redirect &&
			branding?.update_is_clientside_redirect
		) {
			branding.update_is_clientside_redirect(branding.is_clientside_redirect);
		}

		trackAnalyticsEvent(AnalyticsEventKey.ESIGN_RESULT_STATUS_FAILURE);

		notifySdkWithData(
			"web",
			{},
			{
				native: "handleEsignError",
				web: "esign-error",
			}
		);
	});
</script>

<div class="flex flex-col grow h-screen bg-greyscale-grey3 overflow-hidden">
	<!-- Your failure UI -->
	<div class="p-4">
		<h1 class="text-red-600 text-2xl font-bold mb-2">Signing Failed</h1>
		<p class="text-gray-800 mb-4">{failureMessageMap[resolvedError]}</p>
		<p class="text-sm text-gray-600">Request ID: {request_id}</p>
	</div>
	<!-- <Footer /> -->
</div>
