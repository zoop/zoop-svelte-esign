<script lang="ts">
	export let message: string = "Something went wrong.";
	export let branding: {
		logo_url?: string;
		primary_color?: string;
		org_name?: string;
	} = {};
</script>

<div class="flex flex-col items-center justify-center h-screen text-center p-4">
	{#if branding?.logo_url}
		<img
			src={branding.logo_url}
			alt="Logo"
			class="mb-4 max-h-16 object-contain"
		/>
	{/if}

	<h1
		class="text-2xl font-bold mb-2"
		style="color: {branding?.primary_color || '#b91c1c'}"
	>
		Error
	</h1>

	<p class="text-gray-700 mb-4">{message}</p>

	<a
		href="/"
		class="mt-2 inline-block rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
	>
		Go Home
	</a>
</div>
