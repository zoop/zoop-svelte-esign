<script lang="ts">
	export let resultData: any;
</script>

<div class="p-4 bg-red-100 text-red-800 rounded">
	❌ Signature submission failed.
	<pre>{JSON.stringify(resultData, null, 2)}</pre>
</div>
