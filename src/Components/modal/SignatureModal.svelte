<script lang="ts">
	import { createEventDispatcher, onMount, tick } from "svelte";

	import SuccessComponent from "../SuccessScreen/SuccessScreen.svelte";
	import FailureComponent from "../FailureScreen/FailureScreen.svelte";
	import { esignDoc } from "../../lib/api/esignDoc/esignDoc";

	type Stage = "signing" | "loading" | "success" | "error";

	interface BrandingContext {
		logo_url?: string;
		primary_color?: string;
		hover_color?: string;
		is_clientside_redirect?: boolean;
	}

	interface EsignResponseData {
		show_download_btn?: boolean;
		success_redirect_duration?: number;
		redirect_url?: string;
		device_info?: Record<string, unknown>;
		esign_type?: string;
		payload?: any;
		branding?: BrandingContext;
		error_msg?: string;
		request_id?: string;
	}

	interface EsignResponse {
		status: "success" | "error";
		data: EsignResponseData;
	}

	let activeTab: "type" | "draw" | "upload" = "type";
	let selectedFont: string = "Pacifico";
	let signatureText: string = "Melvin";
	let canvasRef: HTMLCanvasElement | null = null;
	let signaturePad: any; // from signature_pad library
	let isLibraryLoaded: boolean = false;

	let stage: Stage = "signing";
	let resultData: EsignResponseData | null = null;

	const requestId: string = "6899ca176ec67d7ebe202895";

	const dispatch = createEventDispatcher();
	const fonts: string[] = [
		"Pacifico",
		"Great Vibes",
		"Dancing Script",
		"Satisfy",
	];

	function closeModal(): void {
		dispatch("close");
	}

	function clearCanvas(): void {
		if (signaturePad) signaturePad.clear();
	}

	async function saveDrawnSignature(): Promise<void> {
		if (signaturePad && !signaturePad.isEmpty()) {
			const drawData: string = signaturePad.toDataURL("image/png");
			stage = "loading";
			const resp: EsignResponse = await esignDoc(requestId, drawData);
			stage = resp.status === "success" ? "success" : "error";
			resultData = resp.data;
		} else {
			alert("Please provide a signature first.");
		}
	}

	async function saveTypedSignature(): Promise<void> {
		const tempCanvas: HTMLCanvasElement = document.createElement("canvas");
		const tempCtx = tempCanvas.getContext("2d");

		if (!tempCtx) return;

		tempCanvas.width = 400;
		tempCanvas.height = 150;

		tempCtx.fillStyle = "#fff";
		tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
		tempCtx.fillStyle = "#000";
		tempCtx.font = `48px ${selectedFont}`;
		tempCtx.textAlign = "center";
		tempCtx.textBaseline = "middle";
		tempCtx.fillText(
			signatureText,
			tempCanvas.width / 2,
			tempCanvas.height / 2
		);

		const dataURL: string = tempCanvas.toDataURL("image/png");

		stage = "loading";
		const resp: EsignResponse = await esignDoc(requestId, dataURL);
		stage = resp.status === "success" ? "success" : "error";
		resultData = resp.data;
	}

	async function initializeSignaturePad(): Promise<void> {
		if (!canvasRef || !(window as any).SignaturePad) return;
		await tick();

		signaturePad = new (window as any).SignaturePad(canvasRef, {
			backgroundColor: "rgba(255, 255, 255, 1)",
			penColor: "rgb(0, 0, 0)",
		});

		function resizeCanvas(): void {
			const ratio = Math.max(window.devicePixelRatio || 1, 1);
			const rect = canvasRef!.getBoundingClientRect();
			canvasRef!.width = rect.width * ratio;
			canvasRef!.height = rect.height * ratio;
			canvasRef!.getContext("2d")!.scale(ratio, ratio);
			signaturePad.clear();
		}
		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);
	}

	async function switchToDrawTab(): Promise<void> {
		activeTab = "draw";
		await tick();
		if (isLibraryLoaded && canvasRef) initializeSignaturePad();
	}

	onMount(() => {
		const script = document.createElement("script");
		script.src =
			"https://cdn.jsdelivr.net/npm/signature_pad@4.0.0/dist/signature_pad.umd.min.js";
		script.onload = () => {
			isLibraryLoaded = true;
			if (activeTab === "draw" && canvasRef) initializeSignaturePad();
		};
		document.head.appendChild(script);
	});
</script>

{#if stage === "signing"}
	<!-- Your existing signature box -->
	<div
		class="bg-opacity-30 fixed inset-0 z-50 flex items-center justify-center bg-black"
	>
		<div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
			<!-- Header -->
			<div class="mb-4 text-center text-xl font-semibold">
				Select Mode of Signature
			</div>

			<!-- Tabs -->
			<div class="flex justify-center gap-4 border-b pb-2 text-sm font-medium">
				<button
					on:click={() => (activeTab = "type")}
					class={activeTab === "type"
						? "border-b-2 border-blue-600 text-blue-600"
						: "text-gray-600"}
				>
					Type
				</button>
				<button
					on:click={switchToDrawTab}
					class={activeTab === "draw"
						? "border-b-2 border-blue-600 text-blue-600"
						: "text-gray-600"}
				>
					Draw
				</button>
				<button
					on:click={() => (activeTab = "upload")}
					class={activeTab === "upload"
						? "border-b-2 border-blue-600 text-blue-600"
						: "text-gray-600"}
				>
					Upload
				</button>
			</div>

			<!-- Tab Content -->
			{#if activeTab === "type"}
				<div class="mt-4 space-y-4 text-center">
					<select
						bind:value={selectedFont}
						class="w-full rounded border px-3 py-2"
					>
						{#each fonts as font}
							<option value={font}>{font}</option>
						{/each}
					</select>
					<input
						type="text"
						bind:value={signatureText}
						placeholder="Enter your signature"
						class="w-full rounded border px-3 py-2 text-center"
					/>
					<div
						class="flex min-h-[100px] items-center justify-center rounded bg-gray-100 p-4 text-3xl"
						style="font-family: {selectedFont}"
					>
						{signatureText}
					</div>
					<button
						on:click={saveTypedSignature}
						class="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
					>
						Save Typed Signature
					</button>
				</div>
			{:else if activeTab === "draw"}
				<div class="mt-4 space-y-4 text-center">
					{#if !isLibraryLoaded}
						<div class="text-gray-500">Loading signature pad...</div>
					{/if}
					<div class="rounded border-2 border-gray-200 bg-white">
						<canvas
							bind:this={canvasRef}
							width="400"
							height="150"
							class="w-full cursor-crosshair rounded"
							style="touch-action: none; display: block;"
						></canvas>
					</div>
					<div class="flex justify-center gap-4">
						<button
							on:click={clearCanvas}
							class="rounded border px-4 py-2 hover:bg-gray-100"
							disabled={!isLibraryLoaded}
						>
							Clear
						</button>
						<button
							on:click={saveDrawnSignature}
							class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
							disabled={!isLibraryLoaded}
						>
							Save Signature
						</button>
					</div>
				</div>
			{:else if activeTab === "upload"}
				<div class="mt-4 text-center text-gray-500">
					Upload feature coming soon.
				</div>
			{/if}

			<!-- Close -->
			<div class="mt-6 text-center">
				<button
					on:click={closeModal}
					class="text-sm text-blue-500 underline hover:text-blue-700"
					>Close</button
				>
			</div>
		</div>
	</div>
{:else if stage === "loading"}
	<!-- Loader -->
	<div
		class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
	>
		<div class="text-white text-xl animate-pulse">Signing in progress...</div>
	</div>
{:else if stage === "success"}
	<SuccessComponent {resultData} />
{:else if stage === "error"}
	<FailureComponent {resultData} />
{/if}

<style>
	@import url("https://fonts.googleapis.com/css2?family=Dancing+Script&family=Great+Vibes&family=Pacifico&family=Satisfy&display=swap");
</style>
