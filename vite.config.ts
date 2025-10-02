import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': '/src' } },
  server: {
    proxy: {
      '/svc-biz-ib-cbk-mbank-id-auth': {
        target: 'https://preprodib.mbank.kg',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
