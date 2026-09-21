import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this as a project page at /frontend-toolkit/, not
  // the domain root — only when built in CI (GITHUB_ACTIONS is set there),
  // so `npm run dev`/local `npm run build` are unaffected.
  base: process.env.GITHUB_ACTIONS ? '/frontend-toolkit/' : '/',
  plugins: [react(), tailwindcss(),],
})
