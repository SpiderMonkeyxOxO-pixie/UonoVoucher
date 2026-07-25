import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // dist/ is cleaned by scripts/generate-sitemap.js (prebuild) instead, since
    // some hosts (aaPanel) drop a chattr +i immutable .user.ini into the web
    // root that neither vite's own emptyOutDir nor `rm -rf` can delete — the
    // prebuild cleanup skips that one file instead of failing outright.
    emptyOutDir: false,
  },
})
