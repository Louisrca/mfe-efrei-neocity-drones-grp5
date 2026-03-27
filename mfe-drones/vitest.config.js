import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("__dirname:", __dirname);
console.log("shared path:", path.resolve(__dirname, "../../shared"));

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      loader: { ".js": "jsx", ".jsx": "jsx" },
    },
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.[jt]sx?$/,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./setupTests.js",
  },
  resolve: {
    alias: {
      shared: path.resolve(__dirname, "../shared"),
    },
  },
});
