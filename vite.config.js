import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.BASE_PATH || "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        portfolio: resolve(import.meta.dirname, "portfolio/index.html"),
        notFound: resolve(import.meta.dirname, "404.html"),
      },
    },
  },
});
