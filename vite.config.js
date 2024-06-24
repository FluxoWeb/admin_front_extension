import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import replace from '@rollup/plugin-replace';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [
    react(),
    replace({
      preventAssignment: true,
      'process.env.BACK_URL': JSON.stringify(process.env.BACK_URL),
    }),
  ],

  server: {
    host: true,
    strictPort: true,
    port: 3000,
  },
})
