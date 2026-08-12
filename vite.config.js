import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages project URL: https://lukka117.github.io/solary-web/
  base: command === 'build' ? '/solary-web/' : '/',
  plugins: [react(), tailwindcss()],
}))
