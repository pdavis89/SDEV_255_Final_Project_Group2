import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/SDEV_255_FINAL_PROJECT_GROUP2/client/',
})