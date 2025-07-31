<script lang="ts">
	export let nextStep: () => void;

	import { ChevronLeft } from "@lucide/svelte";
	import PrimaryButton from "../Button/PrimaryButton.svelte";
</script>

<div
	class="flex min-h-screen flex-col text-black md:items-center md:justify-center md:px-4 md:py-8"
>
	<!-- Card wrapper -->
	<div
		class="w-full md:max-w-lg md:rounded-xl md:border md:border-gray-200 md:shadow-sm overflow-hidden"
	>
		<!-- Mobile header -->
		<h2 class="my-5 flex items-center gap-2 px-4 text-2xl font-bold md:hidden">
			<ChevronLeft size={24} strokeWidth={2} />
			eSign Document
		</h2>

		<!-- Green header section -->
		<div class="relative bg-green-50 p-4 pb-14 md:p-6 md:pb-20">
			<div class="pt-6 pb-4 md:pt-6 md:pb-4">
				<div class="mb-4 flex justify-start">
					<img
						src="static/assets/signedDocument.svg"
						alt="Illustration"
						class="h-20 w-20"
					/>
				</div>

				<h3 class="text-left text-xl font-light leading-snug md:text-2xl">
					Sign your document with <span class="font-semibold"
						>Aadhaar eSign</span
					>
				</h3>
				<div class="my-3 h-[1px] w-[30%] border-b border-[#BBBBBB]"></div>
				<p class="text-left text-sm text-gray-600">
					Verify your identity with your Aadhaar and digitally sign the
					documents to finish the process.
				</p>
			</div>

			<!-- Floating file preview -->
			<div
				class="absolute -bottom-6 left-0 right-0 mx-auto flex w-[90%] items-center justify-between rounded-lg border border-[#EEEEEE] bg-white p-3 shadow-sm"
			>
				<div class="flex items-center gap-3">
					<div class="rounded bg-gray-100 p-2">
						<img
							src="static/assets/filePdf.svg"
							alt="PDF Icon"
							class="h-8 w-8"
						/>
					</div>
					<span class="text-sm truncate max-w-[180px]">vehicleloan.pdf</span>
				</div>
				<svg
					class="h-4 w-4 text-gray-500"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						d="M7.05 4.05a1 1 0 011.414 0L13 8.586a1 1 0 010 1.414l-4.536 4.536a1 1 0 01-1.414-1.414L10.586 10 7.05 6.464a1 1 0 010-1.414z"
					/>
				</svg>
			</div>
		</div>

		<!-- Spacer -->
		<div class="h-8 md:h-12"></div>

		<!-- Footer -->
		<div
			class="fixed bottom-0 md:static flex flex-col justify-between px-4 pt-12 pb-4 md:px-6 md:pb-6"
		>
			<PrimaryButton text="Proceed" onClick={nextStep} />

			<p class="mt-3 text-center text-xs text-gray-500">
				By proceeding, you are agreeing to the
				<a href="#" class="underline">Terms and Conditions</a> and
				<a href="#" class="underline">Privacy Policy</a>
			</p>

			<div class="mt-3 text-center text-xs text-gray-500">
				Powered by
				<img
					src="static/assets/zoop.svg"
					alt="Zoop Logo"
					class="ml-1 inline h-4"
				/>
			</div>
		</div>
	</div>
</div>
