<script>
	import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
	import Stepper from "./Components/Stepper/Stepper.svelte";

	const queryClient = new QueryClient();

	const themeUrl = `https://krfnyyhaxavgpomntoev.supabase.co/functions/v1/theme-resolver?ref=${encodeURIComponent(window.location.href)}`;
</script>

<svelte:head>
	<link rel="stylesheet" href={themeUrl} crossorigin="use-credentials" />
</svelte:head>

<QueryClientProvider client={queryClient}>
	<Stepper />
</QueryClientProvider>
