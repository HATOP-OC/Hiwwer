import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Proxy API requests to backend during development
    proxy: {
      '/v1': {
        // Беремо URL з ENV і прибираємо суфікс '/v1'
        target: process.env.VITE_API_BASE_URL?.replace(/\/v1$/,'') || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        // проксі передає повний шлях без модифікації
      },
    },
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
