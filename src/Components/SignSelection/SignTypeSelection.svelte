<script lang="ts">
	export let esign_options: string[] = [];
	export let esignMethod: string = "";
	export let primary_color: string = "#000";
	export let onChange: (value: string) => void = () => {};

	let dropdownOpen = false;

	const esignOptionsAvailable = [
		esign_options.includes("AADHAAR")
			? { value: "AADHAAR", label: "Aadhaar Sign" }
			: null,
		esign_options.includes("DIGITAL")
			? { value: "DIGITAL", label: "Digital Sign" }
			: null,
	].filter(Boolean) as { value: string; label: string }[];

	const isDisabled = esignOptionsAvailable.length <= 1;

	function handleSelect(value: string) {
		onChange(value);
		dropdownOpen = false;
	}
</script>

{#if isDisabled}
	<div class="relative mt-3">
		<input
			type="text"
			disabled
			value={esignMethod}
			class="relative inline-flex h-[44px] w-[65%] items-center rounded-lg border border-gray-300 bg-white p-1 px-4 py-2.5 text-center font-medium text-base text-typography-body1 cursor-not-allowed outline-none"
			style="outline: 2px solid {primary_color}"
		/>
	</div>
{:else}
	<div class="relative mt-3">
		<button
			type="button"
			class="relative inline-flex h-[44px] w-full items-center justify-between rounded-lg border border-gray-300 bg-white p-1 px-4 py-2.5 text-center font-medium focus:outline-none text-base cursor-pointer"
			class:text-typography-body1={!!esignMethod}
			class:text-typography-body3={!esignMethod}
			on:click={() => (dropdownOpen = !dropdownOpen)}
			style="outline: 2px solid {primary_color}"
		>
			{esignMethod || "Select Sign Method"}

			<svg
				class="ms-3 h-2.5 w-2.5 ml-5 text-[#8E8E8E]"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 10 6"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="m1 1 4 4 4-4"
				/>
			</svg>
		</button>

		{#if dropdownOpen}
			<ul
				class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg"
			>
				{#each esignOptionsAvailable as option}
					<li
						class="p-2 py-2 text-sm text-gray-700 cursor-pointer hover:bg-lightGrey"
						on:click={() => handleSelect(option.value)}
					>
						{option.label}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
{/if}
