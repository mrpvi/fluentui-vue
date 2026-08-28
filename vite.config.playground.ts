import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/fluentui-vue/',
  plugins: [vue()],
  build: {
    outDir: 'dist-playground',
    emptyOutDir: true,
  },
});
