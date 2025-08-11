<script lang="ts">
	import { onMount } from "svelte";

	import { get } from "svelte/store";
	import { gatewayStore } from "../../stores/gateway";
	import { brandingStore } from "../../stores/branding";
	import { AuthType, UserRole } from "../../enum";
	import OtpCard from "../OtpCard/OtpCard.svelte";
	import PrimaryButton from "../Button/PrimaryButton.svelte";
	import { Input } from "@zoop-svelte/svelte-components";
	import { callApi } from "../../lib/api/callApi";

	export let role: UserRole;

	const brandingContext = get(brandingStore);
	const { sharedData } = get(gatewayStore);

	const email = sharedData?.signer_email ?? sharedData?.approver_email ?? "";
	const whatsapp =
		sharedData?.signer_whatsapp_number ??
		sharedData?.approver_whatsapp_number ??
		"";
	const signerName = sharedData.signer_name ?? sharedData.approver_name ?? "";
	const request_id = sharedData.request_id ?? sharedData.approver_id;
	const auth_type = sharedData.auth_type;
	const sender = auth_type === AuthType.EMAIL ? email : whatsapp;
	const ip = sharedData.ip;
	const esign_type = sharedData.esign_type;

	const esignMap = {
		AADHAAR: "Aadhaar",
		EMAIL: "Email",
		WHATSAPP: "WhatsApp",
	};

	let formCardFlag = false;
	let loading = false;
	let widthClass = "";
	let paddingClass = "p-7";

	let formState = {
		email: "",
		whatsapp: "",
		error: false,
		message: "",
	};
	console.log("formState", formState);
	let maskedSender = "";
	let hintText = "Please enter your text";

	if (auth_type === AuthType.EMAIL) {
		const [local, domain] = sender.split("@");
		maskedSender = local.slice(0, 2).padEnd(local.length, "*") + "@" + domain;
		hintText = `Hint: ${maskedSender}`;
	}

	if (auth_type === AuthType.WHATSAPP) {
		const last4 = sender.slice(-4);
		const first3 = sender.slice(0, 3);
		maskedSender = first3 + last4.padStart(sender.length - 3, "*");
		hintText = `Hint: ${maskedSender}`;
	}

	const handleChange = (value: string) => {
		formState = {
			...formState,
			error: false,
			message: "",
			[auth_type === AuthType.EMAIL ? "email" : "whatsapp"]: value,
		};
	};

	async function sendOtp() {
		try {
			// trackAnalyticsEvent("AUTH_SEND_OTP_CTA_CLICKED");
			loading = true;

			const resp: any = await callApi("put", "/otp/send", {
				requestId: request_id,
				otp_mode: auth_type,
				role,
			});

			if (!resp.success) {
				formState = {
					...formState,
					error: true,
					message: resp.response_message,
				};
			} else {
				formCardFlag = true;
			}
		} catch (err: any) {
			formState = {
				...formState,
				error: true,
				message: err.response?.data?.response_message || "Something went wrong",
			};
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		if (typeof window !== "undefined") {
			if (window.innerWidth < 300) {
				widthClass = "w-[150px]";
				paddingClass = "p-3";
			}
		}
	});

	const currentDate = new Date();
	const dateStr = `${("0" + currentDate.getDate()).slice(-2)}/${("0" + (currentDate.getMonth() + 1)).slice(-2)}/${currentDate.getFullYear()} ${("0" + currentDate.getHours()).slice(-2)}:${("0" + currentDate.getMinutes()).slice(-2)}:${("0" + currentDate.getSeconds()).slice(-2)}`;
</script>

{#if !formCardFlag}
	<!-- Auth Form Card UI (same as React, but in Svelte) -->
	<div
		class="flex max-w-full items-center justify-center text-center text-xs text-greyscale-dark2 font-web-text-small-semibold"
	>
		<div
			class="rounded-lg bg-white shadow-[-4px_4px_12px_2px_rgba(21,_48,_112,_0.04)] max-w-[456px] min-w-[200px] m-auto"
		>
			<div class={`inset-0 ${paddingClass} overflow-hidden`}>
				<h2
					class="text-base font-medium w-[212px] h-[23px] whitespace-nowrap text-ellipsis overflow-hidden"
				>
					{role === UserRole.APPROVER
						? "Approver Authentication"
						: "Signer Authentication"}
				</h2>

				<p class="p-4 h-6 text-primary-grey-dark">
					Confirm {auth_type === AuthType.EMAIL
						? "Email ID"
						: "WhatsApp Number"} for Verification
				</p>

				<div
					class="w-[401px] h-px border-t border-primary-grey-light my-4 mx-auto"
				></div>

				<div class={`mx-auto justify-center ${widthClass}`}>
					Please enter the invited {auth_type === AuthType.EMAIL
						? "Email ID"
						: "WhatsApp Number"}
				</div>

				<div class="mt-2 text-xl font-semibold">
					Enter {auth_type === AuthType.EMAIL ? "Email" : "WhatsApp Number"}
				</div>

				<div class="flex flex-col gap-2">
					<Input
						type="text"
						class="w-full mt-4"
						placeholder={hintText}
						bind:value={
							formState[auth_type === AuthType.EMAIL ? "email" : "whatsapp"]
						}
						error={formState.error}
					/>

					{#if formState.error}
						<p class="text-red-500 text-sm">{formState.message}</p>
					{/if}
				</div>

				<div class="text-sm text-primary-grey-default mt-4 mb-4">
					Verify your {auth_type === AuthType.EMAIL ? "email" : "WhatsApp"} to proceed
					with {esignMap[esign_type]} eSign
				</div>

				<div class="flex justify-center">
					<PrimaryButton
						text="Send Otp"
						onClick={() => {
							const validEmail =
								auth_type === AuthType.EMAIL &&
								formState.email.toLowerCase() === sender.toLowerCase();
							const validWhatsapp =
								auth_type === AuthType.WHATSAPP &&
								formState.whatsapp === sender;
							console.log("check---", formState.email.toLowerCase());
							console.log("hell", sender.toLowerCase());
							if (validEmail || validWhatsapp) {
								sendOtp();
							} else {
								formState = {
									...formState,
									error: true,
									message:
										auth_type === AuthType.EMAIL
											? "Incorrect email ID"
											: "Incorrect WhatsApp Number",
								};
							}
						}}
					/>
				</div>

				<div
					class="w-[401px] h-px border-t border-primary-grey-light my-8 mx-auto"
				></div>

				<p class="text-xs text-center">
					Current Time : {dateStr}
				</p>

				<p class="text-3xs text-center w-[90%] text-greyscale-dark-3 mx-auto">
					By proceeding, I agree to the
					<a
						href={brandingContext.terms_and_conditions_link}
						class="font-medium"
						target="_blank"
						rel="noreferrer"
						style="color: {brandingContext.primary_color};"
					>
						Terms and Conditions
					</a>
					and
					<a
						href="https://stack.zoop.one/privacy-policy"
						class="font-medium"
						target="_blank"
						rel="noreferrer"
						style="color: {brandingContext.primary_color};"
					>
						Privacy Policy
					</a>
				</p>

				{#if ip}
					<p class="text-3xs text-primary-grey-default text-center pt-2">
						IP Address : {ip}
					</p>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<OtpCard {request_id} {sender} otp_mode={auth_type} {role} {ip} {auth_type} />
{/if}
