<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import FormCard from "../FormCard/FormCard.svelte";
	import { UserRole } from "../../enum";

	export let params: {
		sender?: string;
		signer_name?: string;
		ip?: string;
		esign_type?: string;
		auth_type?: string;
		verified?: string;
		sign_version?: string;
		photo_capture?: string;
		show_download_btn?: string;
	};

	export let requestId: string;
</script>

<div class="flex grow items-center justify-center bg-lightGrey min-h-screen">
	<FormCard
		request_id={requestId}
		sender={params.sender ?? ""}
		signer_name={params.signer_name ?? ""}
		esign_type={params.esign_type ?? ""}
		otp_mode={params.esign_type ?? ""}
		role={UserRole.SIGNER}
		ip={params.ip ?? ""}
		auth_type={params.auth_type ?? ""}
		verified={params.verified ?? ""}
		sign_version={params.sign_version ?? ""}
	/>
</div>
