<script lang="ts">
	export let nextStep: () => void;

	import { ChevronLeft } from "@lucide/svelte";
	import PrimaryButton from "../Button/PrimaryButton.svelte";
	import SignatureModal from "../modal/SignatureModal.svelte";
	import { createQuery } from "@tanstack/svelte-query";
	import { fetchDocumentInfo } from "../../lib/api/documentInfo/documentInfo";
	import PdfViewer from "../PdfViewer/PdfViewer.svelte";

	let showSignatureModal = false;
	let error = "";
	let signBoxes = [];
	let url = "";
	const requestId = "688b4648beb6410aafb4ef17";

	const documentInfoQuery = createQuery({
		queryKey: ["documentInfo", requestId],
		queryFn: () => fetchDocumentInfo({ requestId }),
	});

	// use $documentInfoQuery to access actual data
	$: if ($documentInfoQuery.isSuccess && typeof window !== "undefined") {
		const { url: documentUrl, sign } = $documentInfoQuery.data.document;
		url = documentUrl;
		signBoxes = sign;
	}
</script>

<div>
	<!-- NAVBAR MOBILE -->
	<div
		class="items-center flex justify-start gap-1 z-10 px-6 w-full md:hidden my-5"
	>
		<ChevronLeft size={20} strokeWidth={2} />
		<span class="text-sm text-gray-700 font-bold">eSign Loan Agreement</span>
	</div>

	<!-- NAVBAR WEB -->
	<div
		class="hidden md:flex items-center justify-between gap-4 z-10 px-6 py-4 w-full"
	>
		<!-- <div class="flex items-center gap-2">
			<img src="static/assets/zoop.svg" alt="Zoop Logo" class="h-6" />
			<span class="text-gray-400">|</span>
			<span class="text-sm text-gray-700">Journey Name</span>
		</div> -->

		<div class="flex items-center text-xs text-gray-500">
			<span>Powered by</span>
			<img src="static/assets/zoop.svg" alt="Zoop Logo" class="ml-1 h-4" />
		</div>
	</div>

	<div class="mx-auto font-sans">
		{#if $documentInfoQuery.isSuccess}
			<PdfViewer
				url={$documentInfoQuery.data.document.url}
				signBoxes={$documentInfoQuery.data.document.sign}
				zoom={1.5}
			/>
		{/if}

		<div
			class="fixed bottom-0 left-0 w-full px-4 py-2 bg-white md:static md:px-6 rounded-t-xl md:rounded-none shadow md:shadow-none"
		>
			<div class="flex flex-col md:flex-row items-center justify-between gap-4">
				<!-- Terms and Conditions -->
				<p class="text-center md:text-left text-xs text-gray-500">
					By proceeding, you are agreeing to the
					<a href="#" class="underline">Terms and Conditions</a> and
					<a href="#" class="underline">Privacy Policy</a>
				</p>

				<!-- Proceed Button -->
				<div class="w-full md:w-auto">
					<PrimaryButton text="Proceed" onClick={nextStep} />
				</div>
			</div>

			<!-- Mobile Only: Powered by -->
			<div class="mt-3 text-center text-xs text-gray-500 md:hidden">
				Powered by
				<img
					src="static/assets/zoop.svg"
					alt="Zoop Logo"
					class="ml-1 inline h-4 align-middle"
				/>
			</div>
		</div>

		{#if showSignatureModal}
			<SignatureModal on:close={() => (showSignatureModal = false)} />
		{/if}
		<div>
			<button
				class="inset-shadow-md mt-2 cursor-pointer rounded-md bg-blue-400 px-8 py-2 text-white shadow-md"
				on:click={() => (showSignatureModal = true)}
				>Sign
			</button>
		</div>

		<!-- Error State -->
		{#if error}
			<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-6">
				<p class="text-sm text-red-800">{error}</p>
			</div>
		{/if}
	</div>
</div>

<style>
	@media (max-width: 640px) {
		.max-w-6xl {
			max-width: 100%;
		}
	}
</style>
