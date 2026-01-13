import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig((env) => {
  const isSsrBuild = 'ssrBuild' in env ? Boolean((env as { ssrBuild?: boolean }).ssrBuild) : false;
  return {
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: isSsrBuild ? 'dist/server' : 'dist/client',
    ssrManifest: !isSsrBuild
  }
}});
