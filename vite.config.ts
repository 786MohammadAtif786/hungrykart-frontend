
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

//const BACKEND = "http://127.0.0.1:3000";
const BACKEND = "https://hungrykart-backend.onrender.com"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": BACKEND,
      "/uploads": BACKEND,
    },
  },
});