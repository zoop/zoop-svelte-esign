<script lang="ts">
	export let stepNumber: number;
	export let label: string;
</script>

<div class="flex mb-5">
	<div
		class="w-5 h-5 flex items-center text-sm justify-center rounded-full border border-blue-200 bg-blue-50 text-gray-700 font-medium"
	>
		{stepNumber}
	</div>
	<div class="flex items-start flex-col ml-2 w-full">
		<h2 class="text-base font-semibold text-gray-900">{label}</h2>
		<div>
			<slot />
		</div>
	</div>
</div>
