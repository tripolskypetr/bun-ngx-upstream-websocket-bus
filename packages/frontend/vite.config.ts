import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "chrome87",
    outDir: "build",
    assetsInlineLimit: 0,
  },
  server: {
    proxy: {
      "/api/v1": {
        target: "http://localhost:80",
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, "/api/v1"),
      },
    },
  },
});
