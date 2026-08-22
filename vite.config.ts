import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      include: ['src'],
      exclude: ['src/style.ts'],
      tsconfigPath: './tsconfig.json',
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, 'src/index.ts'),
        style: resolve(import.meta.dirname, 'src/style.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        entryName === 'index' ? (format === 'es' ? 'index.js' : 'index.cjs') : `${entryName}.js`,
      cssFileName: 'style',
    },
    rolldownOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    exclude: ['tests/browser/**', 'node_modules/**', 'dist/**'],
    css: true,
  },
});
