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
         target: 'http://localhost:3000',
         changeOrigin: true,
         secure: false,
         configure: (proxy) => {
           proxy.on('proxyReq', (proxyReq, req) => {
             const auth = req.headers.authorization;
             if (auth) {
               proxyReq.setHeader('authorization', auth);
             }
           });
         },
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
