import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { enquiryApiPlugin } from './src/server/viteEnquiryPlugin.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), enquiryApiPlugin()],
})

