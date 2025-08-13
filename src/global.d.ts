export { };

declare global {
  interface Window {
    pdfjsLib: typeof pdfjsLib;
  }
}

declare module "*.svelte" {
  import { SvelteComponent } from "svelte";
  export default class extends SvelteComponent { }
}
