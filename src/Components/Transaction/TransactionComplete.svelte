<script lang="ts">
	// Props from parent
	export let branding: {
		logo_url?: string;
		primary_color?: string;
		org_name?: string;
	} = {};
</script>

<div
	class="flex flex-col items-center justify-center h-screen text-center p-6 bg-gray-50"
>
	<!-- Logo -->
	{#if branding?.logo_url}
		<img
			src={branding.logo_url}
			alt="Logo"
			class="mb-8 max-h-16 object-contain"
		/>
	{/if}

	<!-- Check Icon -->
	<div
		class="flex items-center justify-center w-24 h-24 rounded-full border-4 mb-6"
		style="border-color: {branding?.primary_color || '#16a34a'}"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-12 w-12"
			fill="none"
			viewBox="0 0 24 24"
			stroke={branding?.primary_color || "#16a34a"}
			stroke-width="2"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
		</svg>
	</div>

	<!-- Title -->
	<h1
		class="text-2xl font-bold mb-2"
		style="color: {branding?.primary_color || '#16a34a'}"
	>
		Transaction Completed
	</h1>

	<!-- Subtitle -->
	<p class="text-gray-500 max-w-md">
		Your current transaction has already been completed.
	</p>
</div>
