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
	<div class="flex items-center justify-center min-h-screen p-4">
		<div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-8 relative">
			<!-- Icon -->
			<div class="flex justify-center mb-6">
				<div
					class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
				>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path
							d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z"
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
				{role === UserRole.APPROVER
					? "Approver Authentication"
					: "Signer Authentication"}
			</h2>

			<!-- Description -->
			<p class="text-sm text-gray-600 text-center mb-8">
				Enter the {auth_type === AuthType.EMAIL
					? "email address"
					: "WhatsApp number"} ending with
				<span class="font-medium">
					{auth_type === AuthType.EMAIL
						? `****${sender.slice(-8)}`
						: `****${sender.slice(-4)}`}
				</span>. The verification code will be sent within 10 minutes.
			</p>

			<!-- Input Field -->
			<div class="mb-6">
				<label class="block text-sm font-medium text-gray-700 mb-2">
					{auth_type === AuthType.EMAIL ? "Email Address" : "WhatsApp Number"}
				</label>
				<input
					type={auth_type === AuthType.EMAIL ? "email" : "tel"}
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors {formState.error
						? 'border-red-500 focus:ring-red-500 focus:border-red-500'
						: ''}"
					placeholder={hintText}
					bind:value={
						formState[auth_type === AuthType.EMAIL ? "email" : "whatsapp"]
					}
				/>
				{#if formState.error}
					<p class="text-red-500 text-sm mt-2">{formState.message}</p>
				{/if}
			</div>

			<!-- Verification Note -->
			<p class="text-xs text-gray-500 text-center mb-6">
				Did not receive an {auth_type === AuthType.EMAIL ? "email" : "message"}?
				<button class="text-blue-600 font-medium hover:underline">
					Resend in 00:30
				</button>
			</p>

			<!-- Send Button -->
			<div class="flex items-center justify-center">
				<PrimaryButton
					text="Send Otp"
					onClick={() => {
						const validEmail =
							auth_type === AuthType.EMAIL &&
							formState.email.toLowerCase() === sender.toLowerCase();
						const validWhatsapp =
							auth_type === AuthType.WHATSAPP && formState.whatsapp === sender;

						if (validEmail || validWhatsapp) {
							sendOtp();
						} else {
							formState = {
								...formState,
								error: true,
								message:
									auth_type === AuthType.EMAIL
										? "Incorrect email address"
										: "Incorrect WhatsApp number",
							};
						}
					}}
					disabled={!formState[
						auth_type === AuthType.EMAIL ? "email" : "whatsapp"
					]}
				/>
			</div>
			<!-- Footer -->
			<div class="mt-8 pt-6 border-t border-gray-200">
				<p class="text-xs text-gray-500 text-center mb-2">
					Current Time: {dateStr}
				</p>

				<p class="text-xs text-gray-500 text-center leading-relaxed">
					By proceeding, I agree to the
					<a
						href={brandingContext.terms_and_conditions_link}
						class="text-blue-600 font-medium hover:underline"
						target="_blank"
						rel="noreferrer"
					>
						Terms and Conditions
					</a>
					and
					<a
						href="https://stack.zoop.one/privacy-policy"
						class="text-blue-600 font-medium hover:underline"
						target="_blank"
						rel="noreferrer"
					>
						Privacy Policy
					</a>
				</p>

				{#if ip}
					<p class="text-xs text-gray-400 text-center mt-2">
						IP Address: {ip}
					</p>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<OtpCard {request_id} {sender} otp_mode={auth_type} {role} {ip} {auth_type} />
{/if}
