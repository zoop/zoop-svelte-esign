<script lang="ts">
	import { onMount } from "svelte";
	import { createEventDispatcher } from "svelte";

	export let url: string;
	export let signBoxes: {
		page_num: number;
		x_coord: number;
		y_coord: number;
		signer_name: string;
	}[] = [];
	export let zoom = 1.5;

	let pages = [];
	let thumbnails = [];
	let loading = false;
	let error = "";
	let pdfjsLib;

	const dispatch = createEventDispatcher();

	onMount(() => {
		loadPdfJsAndRender();
	});

	async function loadPdfJsAndRender() {
		try {
			loading = true;
			if (!window.pdfjsLib) {
				await new Promise((resolve, reject) => {
					const script = document.createElement("script");
					script.src =
						"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
					script.onload = resolve;
					script.onerror = () => reject("Failed to load PDF.js");
					document.head.appendChild(script);
				});
			}

			pdfjsLib = window.pdfjsLib;
			pdfjsLib.GlobalWorkerOptions.workerSrc =
				"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

			await loadPDFfromURL();
		} catch (err) {
			error = err?.message || "Unknown error";
			dispatch("error", error);
		} finally {
			loading = false;
		}
	}

	function scrollToPage(pageNum: number) {
		const el = document.getElementById(`page-${pageNum}`);
		if (el) el.scrollIntoView({ behavior: "smooth" });
	}

	async function loadPDFfromURL() {
		const loadingTask = pdfjsLib.getDocument({
			url,
			cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
			cMapPacked: true,
		});

		const pdf = await loadingTask.promise;
		const renderedPages = [];
		const renderedThumbnails = [];

		for (let i = 1; i <= pdf.numPages; i++) {
			const page = await pdf.getPage(i);

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
	}

	// function zoomIn() {
	// zoom += 0.25;
	// loadPDFfromURL();
	// }

	// function zoomOut() {
	//	zoom = Math.max(0.5, zoom - 0.25);
	//	loadPDFfromURL();
	//}
	console.log("url", url);
</script>

<!-- Zoom Controls -->
<!-- <div class="mb-6 flex items-center justify-center gap-3">
				<button on:click={zoomOut} class="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300">
					➖ Zoom Out
				</button>
				<button on:click={zoomIn} class="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300">
					➕ Zoom In
				</button>
			</div> -->

{#if loading}
	<div class="py-12 text-center">
		<div
			class="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-gray-600"
		></div>
		<p class="text-xl text-gray-600">Loading PDF... Please wait ⏳</p>
	</div>
{:else}
	<div class="flex space-x-2">
		{#if thumbnails.length > 0}
			<div
				class="gap-4 overflow-y-auto rounded bg-gray-100 p-3 max-h-[85vh] hidden lg:flex flex-col"
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

		{#if pages.length > 0}
			<div class="flex-1 overflow-y-auto px-4 bg-gray-100 rounded h-[85vh]">
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
                      text-overflow: ellipsis;"
									>
										<span class="truncate max-w-full">{box.signer_name}</span>
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
{/if}

{#if error}
	<div class="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
		<p class="text-sm text-red-800">{error}</p>
	</div>
{/if}
