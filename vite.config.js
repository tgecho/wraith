import { defineConfig } from "vite";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [
    svelte({
      preprocess: vitePreprocess(),
    }),
  ],
  server: {
    proxy: {
      "/v1": {
        target: "http://localhost:11434",
        hostRewrite: true,
      },
    },
  },
});
