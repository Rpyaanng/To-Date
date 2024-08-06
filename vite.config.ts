import path from "path"
import react from "@vitejs/plugin-react"
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import { ngrok } from 'vite-plugin-ngrok'
import { defineConfig, loadEnv } from "vite"


export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react(), TanStackRouterVite(), ngrok({ authtoken: env.VITE_NGROK_AUTHTOKEN })],
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
  }
})
