import preact from "@preact/preset-vite";
import { defineConfig } from "vite";
import { stylex } from "vite-plugin-stylex-dev";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [preact(), stylex()],
});
