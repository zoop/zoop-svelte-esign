<script>
	import { Eye, EyeOff } from "@lucide/svelte";

	let aadhaar = "";
	let show = false;

	let agreed = false;

	const handleCancel = () => {
		// Your cancel logic here
		console.log("Cancelled");
	};

	const handleSendOtp = () => {
		if (agreed) {
			// Your send OTP logic here
			console.log("OTP sent");
		} else {
			alert("Please agree to the Terms & Conditions.");
		}
	};

	function toggleVisibility() {
		show = !show;
	}
</script>

<div class="relative bg-green-50 p-4 pb-14 md:p-6 md:pb-20">
	<div class="pt-6 pb-4 md:pt-6 md:pb-4 max-w-[90%] mx-auto">
		<h3 class="text-left text-xl font-light leading-snug md:text-2xl">
			<span class="font-semibold">eSign</span>
			using Aadhaar number/VID
		</h3>
		<div class="my-3 h-[1px] w-[30%] border-b border-[#BBBBBB]"></div>
		<p class="text-left text-sm text-gray-400">
			OTP will be sent to your Aadhaar-linked mobile number
		</p>
	</div>
	<div
		class="max-w-[90%] mx-auto p-4 rounded-xl border border-[#E6E6E6] bg-white shadow-sm"
	>
		<label class="text-sm text-[#6A6A6A] font-medium"
			>Enter Aadhaar Number/Virtual ID</label
		>
		<div class="relative">
			<input
				type={show ? "text" : "password"}
				bind:value={aadhaar}
				placeholder="e.g. 1234 5678 9012"
				class="w-full px-4 py-3 pr-10 text-sm border border-[#E6E6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D0EED1] bg-white"
			/>
			<button
				type="button"
				class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
				on:click={toggleVisibility}
				aria-label="Toggle visibility"
			>
				{#if show}
					<EyeOff />
				{:else}
					<Eye />
				{/if}
			</button>
		</div>
	</div>
</div>

<!-- Fixed Footer -->
<div class="fixed bottom-0 w-full">
	<div
		class="relative w-[90%] mx-auto mb-4 rounded-lg p-[1px] bg-gradient-to-br from-[#A8F5C0] via-[#D4FEE1] to-[#A8F5C0]"
	>
		<div class="rounded-lg bg-white p-5 text-xs text-black">
			<p class="mb-2 font-medium">
				I hereby authorize CDSL Ventures Limited to:
			</p>
			<ol class="list-decimal pl-4 space-y-1 text-[11px] text-[#595959]">
				<li>
					Use my Aadhaar / Virtual ID details (as applicable) for the purpose of
					eSign of documents requested using Digitech Solutions Private Limited
					Technologies Private Limited eSign to authenticate my identity through
					the Aadhaar based e-KYC services of UIDAI.
				</li>
				<li>
					Authenticate my Aadhaar / Virtual ID through OTP or Biometric for
					authenticating my identity through the Aadhaar Auth...
				</li>
			</ol>
		</div>
	</div>

	<div class="border border-[#D9D9D9] bg-white p-4 shadow-sm">
		<div class="mb-3 flex items-center space-x-2 text-xs">
			<input
				id="terms"
				type="checkbox"
				bind:checked={agreed}
				class="h-4 w-4 rounded border-gray-300 text-[#000000]"
			/>
			<label for="terms" class="text-sm text-[#000000]">
				I agree to all the <span class="font-medium underline"
					>Terms & Conditions</span
				>.
			</label>
		</div>

		<div class="flex w-full items-center gap-3">
			<button
				class="w-full rounded-md border border-[#D9D9D9] bg-white px-4 py-2 text-sm font-medium text-[#000000] hover:bg-gray-50"
				on:click={handleCancel}
			>
				Cancel
			</button>
			<button
				class="w-full rounded-md bg-[#000000] px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
				on:click={handleSendOtp}
			>
				Send OTP
			</button>
		</div>

		<p class="mt-3 text-center text-[10px] text-[#9E9E9E]">
			Powered by <span class="font-semibold">ZOOP</span>
		</p>
	</div>
</div>
