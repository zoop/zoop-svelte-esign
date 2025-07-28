<script>
	import { ChevronLeft } from "@lucide/svelte";
	import { onMount } from "svelte";
	import SignatureModal from "../Components/modal/SignatureModal.svelte";
	import PrimaryButton from "../Components/Button/PrimaryButton.svelte";

	let showSignatureModal = false;

	let pages = [];
	let thumbnails = [];
	let loading = false;
	let error = "";
	let pdfjsLib;
	let signBoxes = [];
	let url = "";
	let zoom = 1.5;

	onMount(async () => {
		const response = {
			document: {
				document: {
					url: "https://storage.googleapis.com/staging-esign-storage/68834e1f92d12a17f28bd99e?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=zoop-esign-dev-stage%40zoop-one-development.iam.gserviceaccount.com%2F20250728%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250728T055115Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=323d0211012afa4564953eac208d578c0c6c46f8cda1ea74919f049ef97ad2fea7fbbe99518f3b537e2f20c77c8fbe201767364394678d0b68c101d7d4b25e898ea2905354b44ce9ece4210eec14e783e689c882e8fdb324cd77177c51b9d0ef3ba7017e78192f246232a0d05a4ee2af0aefe2aead3de5719dc35a86aeeb64383efc43c7fad673220a332280f749ed81feeb73bd9175fd420cdc850993124f94de3bc43ecb0000f685a8444a02a8739d19bceb71f893b05aa4b676fe15f1fb0849397e340e981e0fe5837b3f029d3a07c016dd1ba91fe2979316f8c3b23f7e49757124abe8632d8f7f38f1b720e7b7f12ba5fdfb336d8615bfc7d699f9511cb3",
					sign: [
						{ page_num: 1, x_coord: 500, y_coord: 400, signer_name: "amal" },
						{ page_num: 2, x_coord: 0, y_coord: 0, signer_name: "amal" },
					],
					name: "hello",
				},
			},
		};

		const { url: documentUrl, sign } = response.document.document;
		url = documentUrl;
		signBoxes = sign;

		if (typeof window === "undefined" || typeof document === "undefined")
			return;

		if (!window.pdfjsLib) {
			const script = document.createElement("script");
			script.src =
				"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
			script.onload = async () => {
				pdfjsLib = window.pdfjsLib;
				pdfjsLib.GlobalWorkerOptions.workerSrc =
					"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
				await loadPDFfromURL();
			};
			script.onerror = () => (error = "Failed to load PDF.js");
			document.head.appendChild(script);
		} else {
			pdfjsLib = window.pdfjsLib;
			await loadPDFfromURL();
		}
	});

	// function zoomIn() {
	// zoom += 0.25;
	// loadPDFfromURL();
	// }

	// function zoomOut() {
	//	zoom = Math.max(0.5, zoom - 0.25);
	//	loadPDFfromURL();
	//}

	function scrollToPage(pageNum) {
		const el = document.getElementById(`page-${pageNum}`);
		if (el) el.scrollIntoView({ behavior: "smooth" });
	}

	async function loadPDFfromURL() {
		try {
			loading = true;
			const loadingTask = pdfjsLib.getDocument({
				url,
				cMapUrl:
					"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
				cMapPacked: true,
			});
			const pdf = await loadingTask.promise;
			const renderedPages = [];
			const renderedThumbnails = [];

			for (let i = 1; i <= pdf.numPages; i++) {
				const page = await pdf.getPage(i);

				// Render full-size image
				const viewport = page.getViewport({ scale: zoom });
				const canvas = document.createElement("canvas");
				const context = canvas.getContext("2d");
				canvas.width = viewport.width;
				canvas.height = viewport.height;
				await page.render({ canvasContext: context, viewport }).promise;
				const imageDataUrl = canvas.toDataURL("image/png");

				renderedPages.push({
					pageNum: i,
					imageUrl: imageDataUrl,
					width: canvas.width,
					height: canvas.height,
					totalPages: pdf.numPages,
				});

				// Render thumbnail
				const thumbViewport = page.getViewport({ scale: 0.3 });
				const thumbCanvas = document.createElement("canvas");
				const thumbContext = thumbCanvas.getContext("2d");
				thumbCanvas.width = thumbViewport.width;
				thumbCanvas.height = thumbViewport.height;
				await page.render({
					canvasContext: thumbContext,
					viewport: thumbViewport,
				}).promise;
				const thumbUrl = thumbCanvas.toDataURL("image/png");

				renderedThumbnails.push({ pageNum: i, imageUrl: thumbUrl });
			}

			pages = renderedPages;
			thumbnails = renderedThumbnails;
			loading = false;
		} catch (err) {
			console.error(err);
			error = `Failed to load PDF: ${err.message}`;
			loading = false;
		}
	}

	function handleRedirect() {
		window.location.href = "/esp";
	}
</script>

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
	<div class="flex items-center gap-2">
		<img src="static/assets/zoop.svg" alt="Zoop Logo" class="h-6" />
		<span class="text-gray-400">|</span>
		<span class="text-sm text-gray-700">Journey Name</span>
	</div>

	<div class="flex items-center text-xs text-gray-500">
		<span>Powered by</span>
		<img src="static/assets/zoop.svg" alt="Zoop Logo" class="ml-1 h-4" />
	</div>
</div>

<div class="mx-auto font-sans">
	<!-- Zoom Controls -->
	<!-- <div class="mb-6 flex items-center justify-center gap-3">
		<button on:click={zoomOut} class="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300">
			➖ Zoom Out
		</button>
		<button on:click={zoomIn} class="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300">
			➕ Zoom In
		</button>
	</div> -->

	<!-- Loading State -->
	{#if loading}
		<div class="py-12 text-center">
			<div
				class="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-gray-600"
			></div>
			<p class="text-xl text-gray-600">Loading PDF... Please wait ⏳</p>
		</div>
	{/if}

	<!-- Error State -->
	{#if error}
		<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-6">
			<p class="text-sm text-red-800">{error}</p>
		</div>
	{/if}

	<div class="flex space-x-2">
		<!-- Thumbnails -->
		{#if thumbnails.length > 0}
			<div
				class="gap-4 overflow-y-auto overflow-x-hidden rounded bg-gray-100 p-3 max-h-[91vh] hidden lg:flex flex-col"
			>
				{#each thumbnails as { pageNum, imageUrl }}
					<div
						on:click={() => scrollToPage(pageNum)}
						class="cursor-pointer text-center text-xs text-gray-600 hover:opacity-80"
					>
						<img
							src={imageUrl}
							alt="Page {pageNum}"
							class="w-20 rounded shadow"
						/>
						<p>Page {pageNum}</p>
					</div>
				{/each}
			</div>
		{/if}

		<!-- PDF Pages -->
		{#if pages.length > 0}
			<div class="flex-1 overflow-y-auto px-4 bg-gray-100 rounded h-[91vh]">
				<div class="mx-auto md:max-w-4xl py-8">
					<div class="flex flex-col items-center space-y-8">
						{#each pages as { pageNum, imageUrl, width, height, totalPages }}
							<div
								id={"page-" + pageNum}
								class="relative w-full max-w-[1000px] rounded-xl bg-white p-4 shadow-lg"
								style="aspect-ratio: {width} / {height};"
							>
								<img
									src={imageUrl}
									alt="PDF Page {pageNum}"
									class="h-full w-full object-contain rounded-lg"
								/>

								<!-- Signature Boxes -->
								{#each signBoxes.filter((b) => b.page_num === pageNum) as box}
									{@const boxWidthRatio = 100 / width}
									{@const boxHeightRatio = 40 / height}
									{@const leftRatio = (width - box.x_coord - 100) / width}
									{@const topRatio = (height - box.y_coord - 40) / height}

									<div
										class="absolute flex items-center justify-center rounded border-2 border-dashed border-purple-500 bg-purple-50 px-2 py-1 text-sm font-medium text-center text-[#7E22CE]"
										style="
		top: {topRatio * 100}%;
		left: {leftRatio * 100}%;
		width: {boxWidthRatio * 100}%;
		height: {boxHeightRatio * 100}%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	"
									>
										<span class="truncate max-w-full">
											{box.signer_name}
										</span>
									</div>
								{/each}

								<p class="mt-4 text-center text-sm font-medium text-gray-600">
									Page {pageNum} of {totalPages}
								</p>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>

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
				<PrimaryButton text="Proceed" onClick={handleRedirect} />
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
</div>

<style>
	@media (max-width: 640px) {
		.max-w-6xl {
			max-width: 100%;
		}
	}
</style>
