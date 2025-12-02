import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));

function readProjectVersion(): string {
  try {
    const pomPath = resolve(process.cwd(), 'pom.xml');
    const pomContents = readFileSync(pomPath, 'utf8');
    const match = pomContents.match(/<projectVersion>([^<]+)<\/projectVersion>/);

    return match?.[1].trim() ?? 'unknown';
  } catch (error) {
    console.warn('Unable to read project version from pom.xml:', error);
    return 'unknown';
  }
}

const projectVersion = readProjectVersion();

export default defineConfig({
  base: '/',
  plugins: [react()],
  define: {
    __PROJECT_VERSION__: JSON.stringify(projectVersion),
  },
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
      '/svc-biz-ib-cbk-mbank-id-auth': {
        target: 'https://mbank-idtest.cbk.kg',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
