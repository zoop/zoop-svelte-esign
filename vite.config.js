import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
	plugins: [svelte(), tailwindcss()],
	server: {
		port: 3000,
		proxy: {
			"/api": {
				target: "https://esign-staging.zoop.plus",
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/api/, "/api"),
			},
		},
	},
});
