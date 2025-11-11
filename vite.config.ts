import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/filmes': {
        target: 'https://apifilmes-wheat.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/filmes/, '/filmes'),
        secure: false,
        headers: {
          'Referer': 'https://apifilmes-wheat.vercel.app',
          'Origin': 'https://apifilmes-wheat.vercel.app',
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
            proxyReq.setHeader('Referer', 'https://apifilmes-wheat.vercel.app');
            proxyReq.setHeader('Origin', 'https://apifilmes-wheat.vercel.app');
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/api': {
        target: 'http://appservidor.erremepe.com:80',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/ajax/appv'),
        secure: false,
        headers: {
          'Referer': 'http://appservidor.erremepe.com',
          'Origin': 'http://appservidor.erremepe.com',
        },
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Referer', 'http://appservidor.erremepe.com');
            proxyReq.setHeader('Origin', 'http://appservidor.erremepe.com');
          });
        },
      },
      '/embed': {
        target: 'https://embed.warezcdn.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/embed/, ''),
        secure: false,
        headers: {
          'Referer': 'https://embed.warezcdn.com',
          'Origin': 'https://embed.warezcdn.com',
        },
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Referer', 'https://embed.warezcdn.com');
            proxyReq.setHeader('Origin', 'https://embed.warezcdn.com');
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
          });
        },
      },
    }
  },
  plugins: [dyadComponentTagger(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));