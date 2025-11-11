import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(() => ({
  base: '/',
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
      '/api/series': {
        target: 'https://apifilmes-wheat.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/series/, '/series'),
        secure: false,
        headers: {
          'Referer': 'https://apifilmes-wheat.vercel.app',
          'Origin': 'https://apifilmes-wheat.vercel.app',
        },
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Referer', 'https://apifilmes-wheat.vercel.app');
            proxyReq.setHeader('Origin', 'https://apifilmes-wheat.vercel.app');
          });
        },
      },
      '/api/animes': {
        target: 'https://apifilmes-wheat.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/animes/, '/animes'),
        secure: false,
        headers: {
          'Referer': 'https://apifilmes-wheat.vercel.app',
          'Origin': 'https://apifilmes-wheat.vercel.app',
        },
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Referer', 'https://apifilmes-wheat.vercel.app');
            proxyReq.setHeader('Origin', 'https://apifilmes-wheat.vercel.app');
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
    }
  },
  plugins: [dyadComponentTagger(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
