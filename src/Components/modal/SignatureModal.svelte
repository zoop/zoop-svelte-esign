<script>
	import { createEventDispatcher, onMount, tick } from 'svelte';

	let activeTab = 'type';
	let selectedFont = 'Pacifico';
	let signatureText = 'Melvin';
	let canvasRef;
	let signaturePad;
	let isLibraryLoaded = false;

	const dispatch = createEventDispatcher();
	const fonts = ['Pacifico', 'Great Vibes', 'Dancing Script', 'Satisfy'];

	function closeModal() {
		dispatch('close');
	}

	function clearCanvas() {
		if (signaturePad) {
			signaturePad.clear();
		}
	}

	function saveDrawnSignature() {
		if (signaturePad && !signaturePad.isEmpty()) {
			const drawData = signaturePad.toDataURL('image/png');
			console.log('🖊️ Base64 Signature:', drawData);
			dispatch('signature-saved', { signature: drawData, type: 'drawn' });
		} else {
			alert('Please provide a signature first.');
		}
	}

	function saveTypedSignature() {
		const tempCanvas = document.createElement('canvas');
		const tempCtx = tempCanvas.getContext('2d');

		tempCanvas.width = 400;
		tempCanvas.height = 150;

		tempCtx.fillStyle = '#fff';
		tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

		tempCtx.fillStyle = '#000';
		tempCtx.font = `48px ${selectedFont}`;
		tempCtx.textAlign = 'center';
		tempCtx.textBaseline = 'middle';
		tempCtx.fillText(signatureText, tempCanvas.width / 2, tempCanvas.height / 2);

		const dataURL = tempCanvas.toDataURL('image/png');
		console.log('✍️ Typed Signature:', dataURL);
		dispatch('signature-saved', {
			signature: dataURL,
			type: 'typed',
			text: signatureText,
			font: selectedFont
		});
	}

	async function initializeSignaturePad() {
		if (!canvasRef || !window.SignaturePad) return;

		await tick(); // Wait for DOM to be ready

		signaturePad = new window.SignaturePad(canvasRef, {
			backgroundColor: 'rgba(255, 255, 255, 1)',
			penColor: 'rgb(0, 0, 0)',
			velocityFilterWeight: 0.7,
			minWidth: 0.5,
			maxWidth: 2.5,
			throttle: 16,
			minDistance: 5
		});

		// Resize canvas properly
		function resizeCanvas() {
			const ratio = Math.max(window.devicePixelRatio || 1, 1);
			const canvas = canvasRef;
			const rect = canvas.getBoundingClientRect();

			canvas.width = rect.width * ratio;
			canvas.height = rect.height * ratio;
			canvas.getContext('2d').scale(ratio, ratio);

			signaturePad.clear();
		}

		resizeCanvas();

		// Add resize listener
		window.addEventListener('resize', resizeCanvas);

		console.log('✅ SignaturePad initialized successfully');
	}

	async function switchToDrawTab() {
		activeTab = 'draw';
		await tick(); // Wait for tab to render

		if (isLibraryLoaded && canvasRef) {
			initializeSignaturePad();
		}
	}

	onMount(() => {
		// Load signature_pad library
		const script = document.createElement('script');
		script.src = 'https://cdn.jsdelivr.net/npm/signature_pad@4.0.0/dist/signature_pad.umd.min.js';
		script.onload = () => {
			isLibraryLoaded = true;
			console.log('📚 SignaturePad library loaded');

			// Initialize if we're already on draw tab
			if (activeTab === 'draw' && canvasRef) {
				initializeSignaturePad();
			}
		};
		script.onerror = () => {
			console.error('❌ Failed to load SignaturePad library');
		};
		document.head.appendChild(script);
	});
</script>

<div class="bg-opacity-30 fixed inset-0 z-50 flex items-center justify-center bg-black">
	<div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
		<!-- Header -->
		<div class="mb-4 text-center text-xl font-semibold">Select Mode of Signature</div>

		<!-- Tabs -->
		<div class="flex justify-center gap-4 border-b pb-2 text-sm font-medium">
			<button
				on:click={() => (activeTab = 'type')}
				class={activeTab === 'type' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}
			>
				Type
			</button>
			<button
				on:click={switchToDrawTab}
				class={activeTab === 'draw' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}
			>
				Draw
			</button>
			<button
				on:click={() => (activeTab = 'upload')}
				class={activeTab === 'upload'
					? 'border-b-2 border-blue-600 text-blue-600'
					: 'text-gray-600'}
			>
				Upload
			</button>
		</div>

		<!-- Tab Content -->
		{#if activeTab === 'type'}
			<div class="mt-4 space-y-4 text-center">
				<select bind:value={selectedFont} class="w-full rounded border px-3 py-2">
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
		{:else if activeTab === 'draw'}
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
		{:else if activeTab === 'upload'}
			<div class="mt-4 text-center text-gray-500">Upload feature coming soon.</div>
		{/if}

		<!-- Close -->
		<div class="mt-6 text-center">
			<button on:click={closeModal} class="text-sm text-blue-500 underline hover:text-blue-700"
				>Close</button
			>
		</div>
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Dancing+Script&family=Great+Vibes&family=Pacifico&family=Satisfy&display=swap');
</style>
