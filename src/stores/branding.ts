import { writable } from "svelte/store";

export const brandingStore = writable({
  white_label: "N",
  logo_url: "",
  primary_color: "#175cff",
  hover_color: "#0E3288",
  document_name: "",
  terms_and_conditions_link: "https://stack.zoop.one/terms-and-conditions",
  terms_modal_text: "ZOOP",
  is_clientside_redirect: false,
});
