import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
// import { defineConfig } from "vite";
// import { createVuePlugin } from "vite-plugin-vue2";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  server: {
    // Increase the limit to 64kb
    maxHeaderSize: 65536 * 16
  }
});
