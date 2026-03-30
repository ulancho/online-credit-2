import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [react(), svgr()],
    resolve: {
      alias: {
        '@': srcDir,
        Common: resolve(srcDir, 'common'),
        Modules: resolve(srcDir, 'modules'),
        Assets: resolve(srcDir, 'assets'),
      },
      extensions: ['.tsx', '.ts', '.js'],
      preserveSymlinks: false,
    },
    server: {
      proxy: {
        '/svc-biz-ib-cbk-private-credits/v1/api/webview': {
          target: 'https://preprodib.mbank.kg',
          changeOrigin: true,
          secure: true,
        },
        '/svc-common-directory/v2': {
          target: 'https://preprodib.mbank.kg',
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
