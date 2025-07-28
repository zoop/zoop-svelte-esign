<script lang="ts">
	import { Button } from "@zoop-svelte/svelte-components";

	export let text: string = "Click";
	export let onClick: () => void;
	export let type: "button" | "submit" | "reset" = "button";
	export let className: string = "";
	export let disabled: boolean = false;
</script>

<Button on:click={onClick} {type} class={className} {disabled}>
	{text}
</Button>
