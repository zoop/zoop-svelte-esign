<script lang="ts">
	import PrimaryButton from "../Button/PrimaryButton.svelte";

	export let resultData: any;

	function downloadPDF(): void {
		if (!resultData?.document?.signed_url) {
			alert("Signed URL not available.");
			return;
		}

		// Create an invisible link and trigger download
		const link = document.createElement("a");
		link.href = resultData.document.signed_url;
		link.download = "signed-document.pdf";
		link.target = "_blank"; // optional: open in new tab instead
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
	console.log(resultData);
</script>

<div class="flex items-center justify-center min-h-screen bg-opacity-75 p-4">
	<div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 relative">
		<!-- Success Icon -->
		<div class="flex justify-center mb-6">
			<div
				class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
			>
				<svg width="32" height="32" viewBox="0 0 24 24" fill="none">
					<path
						d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
						stroke="#10B981"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
		</div>

		<!-- Title -->
		<h2 class="text-xl font-semibold text-gray-900 text-center mb-2">
			Signature Submitted Successfully!
		</h2>

		<!-- Description -->
		<p class="text-sm text-gray-600 text-center mb-8">
			Your document has been signed and is ready for download. The signed
			document will be available shortly.
		</p>

		<!-- Download Button -->
		<PrimaryButton
			text="Download PDF"
			onClick={downloadPDF}
			className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
			disabled={!resultData?.signed_url}
		/>

		<!-- Optional Debug Section -->
		{#if resultData}
			<details class="bg-gray-50 rounded-lg p-4">
				<summary
					class="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 select-none"
				>
					View Response Data
				</summary>
				<div class="mt-3 max-h-48 overflow-auto">
					<pre
						class="text-xs text-gray-600 whitespace-pre-wrap break-words">{JSON.stringify(
							resultData,
							null,
							2
						)}</pre>
				</div>
			</details>
		{/if}
	</div>
</div>
