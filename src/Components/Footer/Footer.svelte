<script>
	import PrimaryButton from "../Button/PrimaryButton.svelte";
	export let onProceed = () => {};
</script>

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
			<PrimaryButton text="Proceed" onClick={onProceed} />
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
