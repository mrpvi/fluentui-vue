import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const consumer = await mkdtemp(resolve(tmpdir(), 'fluent-vue-consumer-'));
const packageDirectory = resolve(consumer, 'node_modules/@local/fluent-vue');

try {
  const packed = JSON.parse(
    execFileSync('npm', ['pack', '--json', '--pack-destination', consumer], {
      cwd: root,
      encoding: 'utf8',
    }),
  );
  const tarball = resolve(consumer, packed[0].filename);

  await mkdir(packageDirectory, { recursive: true });
  execFileSync('tar', ['-xzf', tarball, '--strip-components=1', '-C', packageDirectory]);
  await symlink(resolve(root, 'node_modules/vue'), resolve(consumer, 'node_modules/vue'), 'dir');
  await mkdir(resolve(consumer, 'src'));

  await writeFile(
    resolve(consumer, 'index.html'),
    '<div id="app"></div><script type="module" src="/src/main.ts"></script>\n',
  );
  await writeFile(
    resolve(consumer, 'src/main.ts'),
    `import { createApp, h } from 'vue';
import { FButton, FField, FInput, FLabel, FLink, FText, FTextarea } from '@local/fluent-vue';
import '@local/fluent-vue/style.css';

createApp({
  render: () =>
    h('main', [
      h(FText, { as: 'h1', size: 700, weight: 'semibold' }, () => 'Fluent Vue'),
      h(FLabel, { for: 'standalone-email', required: true }, () => 'Standalone email'),
      h(FInput, { id: 'standalone-email', type: 'email', required: true }),
      h(
        FField,
        {
          label: 'Email address',
          hint: 'Use your work email.',
          required: true,
        },
        { default: () => h(FInput, { type: 'email' }) },
      ),
      h(
        FField,
        {
          label: 'Biography',
          hint: 'Write a short profile.',
        },
        {
          default: () =>
            h(FTextarea, {
              defaultValue: 'Native Vue components',
              resize: 'vertical',
            }),
        },
      ),
      h(FLink, { href: '#docs', inline: true }, () => 'Read documentation'),
      h(FButton, { appearance: 'primary' }, () => 'Save'),
    ]),
}).mount('#app');
`,
  );

  execFileSync(resolve(root, 'node_modules/.bin/vite'), ['build'], {
    cwd: consumer,
    stdio: 'inherit',
  });
} finally {
  await rm(consumer, { recursive: true, force: true });
}
