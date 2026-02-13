import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// =====================
// Configuração Vite para Netlify
// =====================
export default defineConfig({
  base: "./", // ⚡ Importante para Netlify, garante que caminhos funcionem
  root: path.resolve("./client"), // sua pasta de código fonte
  plugins: [react(), tailwindcss(), jsxLocPlugin()],
  resolve: {
    alias: {
      "@": path.resolve("./client/src"),
      "@shared": path.resolve("./shared"),
      "@assets": path.resolve("./attached_assets"),
    },
  },
  build: {
    outDir: path.resolve("./dist"), // pasta final que você vai subir no Netlify
    emptyOutDir: true, // limpa dist antes do build
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    allowedHosts: ["localhost", "127.0.0.1"],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});