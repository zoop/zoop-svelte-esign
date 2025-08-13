<script lang="ts">
	import { ESP } from "../../enum";

	// Props
	let {
		esp,
		refObj = $bindable<null | HTMLFormElement>(), // bindable so parent can do bind:refObj
		espXml,
		urls,
		verify_uid,
		uid,
		custId,
	} = $props<{
		esp: ESP;
		refObj?: HTMLFormElement | null;
		espXml: string;
		urls: {
			vsign?: string;
			newVsign?: string;
			nsdl?: string;
			cdsl?: string;
			emudhra?: string;
		};
		verify_uid?: boolean;
		uid?: string | string[];
		custId?: string;
	}>();
</script>

{#if esp === "VSIGN"}
	<form
		bind:this={refObj}
		method="post"
		id="authPageForm"
		encType="multipart/form-data"
		action={verify_uid
			? `${urls.newVsign}/${uid}/navesignauthpage`
			: urls.vsign}
	>
		<input type="hidden" name="txnref" value={espXml} />
	</form>
{:else if esp === "NSDL"}
	<form
		bind:this={refObj}
		method="post"
		id="nsdlEsignForm"
		encType="multipart/form-data"
		action={urls.nsdl}
	>
		<input type="hidden" name="msg" value={espXml} />
	</form>
{:else if esp === "CDSL"}
	<form
		bind:this={refObj}
		method="post"
		id="esignForm"
		name="esignForm"
		action={urls.cdsl}
	>
		<input type="hidden" name="ESIGN_REQUEST_XML" value={espXml} />
		<input type="hidden" name="CONSENT_ID" value="1" />
	</form>
{:else if esp === "EMUDHRA"}
	<form
		bind:this={refObj}
		method="post"
		id="emudhraEsignForm"
		action={urls.emudhra}
	>
		<input type="text" name="txnref" value={espXml} />
		<input type="text" name="custUI" value={custId} />
		<input type="submit" value="GateWay Redirect" />
	</form>
{/if}
