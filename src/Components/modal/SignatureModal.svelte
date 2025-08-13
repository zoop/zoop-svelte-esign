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

	const requestId: string = "689b1a0f3be2becded3c3466";

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
		class="bg-black bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center p-4"
	>
		<div class="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8 relative">
			<!-- Close button -->
			<button
				type="button"
				class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
				on:click={closeModal}
			>
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path
						d="M12 4L4 12M4 4l8 8"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
				</svg>
			</button>

			<!-- Icon -->
			<div class="flex justify-center mb-6">
				<div
					class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
				>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path
							d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8"
							stroke="#10B981"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z"
							stroke="#10B981"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M8 12L11 15L16 9"
							stroke="#10B981"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
			</div>

			<!-- Title -->
			<h2 class="text-xl font-semibold text-gray-900 text-center mb-8">
				Select Mode of Signature
			</h2>

			<!-- Tabs -->
			<div class="flex justify-center gap-1 border-b border-gray-200 mb-6">
				<button
					type="button"
					on:click={() => (activeTab = "type")}
					class="px-4 py-2 text-sm font-medium transition-colors relative {activeTab ===
					'type'
						? 'text-blue-600 border-b-2 border-blue-600'
						: 'text-gray-600 hover:text-gray-900'}"
				>
					Type
				</button>
				<button
					type="button"
					on:click={switchToDrawTab}
					class="px-4 py-2 text-sm font-medium transition-colors relative {activeTab ===
					'draw'
						? 'text-blue-600 border-b-2 border-blue-600'
						: 'text-gray-600 hover:text-gray-900'}"
				>
					Draw
				</button>
				<button
					type="button"
					on:click={() => (activeTab = "upload")}
					class="px-4 py-2 text-sm font-medium transition-colors relative {activeTab ===
					'upload'
						? 'text-blue-600 border-b-2 border-blue-600'
						: 'text-gray-600 hover:text-gray-900'}"
				>
					Upload
				</button>
			</div>

			<!-- Tab Content -->
			<div class="min-h-[300px]">
				{#if activeTab === "type"}
					<div class="space-y-4">
						<select
							bind:value={selectedFont}
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
						>
							{#each fonts as font}
								<option value={font}>{font}</option>
							{/each}
						</select>

						<input
							type="text"
							bind:value={signatureText}
							placeholder="Enter your signature"
							class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-center"
						/>

						<div
							class="flex min-h-[120px] items-center justify-center rounded-lg bg-gray-50 border p-6 text-3xl"
							style="font-family: {selectedFont}"
						>
							{signatureText || "Preview will appear here"}
						</div>

						<button
							type="button"
							on:click={saveTypedSignature}
							class="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={!signatureText.trim()}
						>
							Save Typed Signature
						</button>
					</div>
				{:else if activeTab === "draw"}
					<div class="space-y-4">
						{#if !isLibraryLoaded}
							<div class="text-center text-gray-500 py-8">
								Loading signature pad...
							</div>
						{:else}
							<div class="border-2 border-gray-200 rounded-lg bg-white">
								<canvas
									bind:this={canvasRef}
									width="400"
									height="180"
									class="w-full cursor-crosshair rounded-lg"
									style="touch-action: none; display: block;"
								></canvas>
							</div>

							<div class="flex gap-3">
								<button
									type="button"
									on:click={clearCanvas}
									class="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
									disabled={!isLibraryLoaded}
								>
									Clear
								</button>
								<button
									type="button"
									on:click={saveDrawnSignature}
									class="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									disabled={!isLibraryLoaded}
								>
									Save Signature
								</button>
							</div>
						{/if}
					</div>
				{:else if activeTab === "upload"}
					<div class="text-center py-12">
						<div
							class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
						>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
								<path
									d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
									stroke="#6B7280"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M7 10L12 5L17 10"
									stroke="#6B7280"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M12 5V15"
									stroke="#6B7280"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</div>
						<h3 class="text-lg font-medium text-gray-900 mb-2">
							Upload Coming Soon
						</h3>
						<p class="text-gray-500">Upload feature coming soon.</p>
					</div>
				{/if}
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
