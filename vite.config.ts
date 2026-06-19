import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    port: 8080,
    host: true,
  },
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Vite/Rollup in newer versions expects manualChunks to be a function.
        manualChunks(id) {
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom")
          ) {
            return "vendor";
          }
          if (id.includes("node_modules/recharts")) return "charts";
          if (id.includes("node_modules/lucide-react")) return "icons";
          if (
            id.includes("node_modules/react-hook-form") ||
            id.includes("node_modules/@hookform/resolvers") ||
            id.includes("node_modules/zod")
          ) {
            return "forms";
          }
          return undefined;
        },
      },
    },
    chunkSizeWarningLimit: 1500,
  },
});
