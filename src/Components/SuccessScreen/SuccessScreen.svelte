<script lang="ts">
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
</script>

<div class="p-4 bg-green-100 text-green-800 rounded space-y-4">
	<div>✅ Signature submitted successfully!</div>

	<!-- Show download button -->
	<button
		on:click={downloadPDF}
		class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
	>
		Download PDF
	</button>

	<!-- Optional: show debug data -->
	<details class="bg-white text-black p-2 rounded">
		<summary>View Response Data</summary>
		<pre class="text-sm">{JSON.stringify(resultData, null, 2)}</pre>
	</details>
</div>
