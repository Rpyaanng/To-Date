import path from "path"
import react from "@vitejs/plugin-react"
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), TanStackRouterVite(),],
  server: {
    host: true,
    watch: {
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
