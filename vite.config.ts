import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // استفاده از base نسبی تا پروژه هم در ریشه دامنه و هم در زیرمسیر
  // GitHub Pages (مثل /smartpick/) درست کار کند.
  base: "./",

  server: {
    port: 5173,
    open: true,
  },

  build: {
    outDir: "dist",
    sourcemap: false,
    // هدف مدرن‌تر باعث خروجی کوچک‌تر و سریع‌تر می‌شود.
    target: "es2022",
  },
});