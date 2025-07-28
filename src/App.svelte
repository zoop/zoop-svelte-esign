<script>
	import Home from "./routes/Home.svelte";
	import Viewer from "./routes/Viewer.svelte";
	import "./app.css"; // Tailwind CSS entry file
	import Esp from "./routes/Esp.svelte";

	let CurrentPage;

	const path = window.location.pathname;

	if (path === "/viewer") {
		CurrentPage = Viewer;
	} else if (path === "/esp") {
		CurrentPage = Esp;
	} else {
		CurrentPage = Home;
	}

	// Dynamically generate the theme URL
	const themeUrl = `https://krfnyyhaxavgpomntoev.supabase.co/functions/v1/theme-resolver?ref=${encodeURIComponent(window.location.href)}`;
</script>

<svelte:head>
	<link rel="stylesheet" href={themeUrl} crossorigin="use-credentials" />
</svelte:head>
<svelte:component this={CurrentPage} />
