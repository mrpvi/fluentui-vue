import { rm } from 'node:fs/promises';

await Promise.all([
  rm(new URL('../dist/style.js', import.meta.url), { force: true }),
  rm(new URL('../dist/style.d.ts', import.meta.url), { force: true }),
]);
