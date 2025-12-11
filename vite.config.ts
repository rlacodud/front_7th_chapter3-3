import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        // target: 'https://jsonplaceholder.typicode.com',
        target: "https://dummyjson.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
