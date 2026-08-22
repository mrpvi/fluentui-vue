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
    `import { createApp, h, ref } from 'vue';
import {
  FButton,
  FCheckbox,
  FDivider,
  FField,
  FImage,
  FInput,
  FLabel,
  FLink,
  FText,
  FTextarea,
  FluentVue,
  packageVersion,
  type ButtonAppearance,
  type CheckboxValue,
  type DividerAppearance,
  type FluentTheme,
  type ImageFit,
  type ImageShape,
  type TextareaResize,
} from '@local/fluent-vue';
import '@local/fluent-vue/style.css';

const accepted = ref<CheckboxValue>('mixed');
const appearance: ButtonAppearance = 'primary';
const resize: TextareaResize = 'vertical';
const dividerAppearance: DividerAppearance = 'brand';
const imageFit: ImageFit = 'cover';
const imageShape: ImageShape = 'rounded';
const theme: FluentTheme = 'light';

createApp({
  render: () =>
    h('main', { 'data-version': packageVersion, 'data-theme': theme }, [
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
              resize,
            }),
        },
      ),
      h(FCheckbox, {
        modelValue: accepted.value,
        'onUpdate:modelValue': value => (accepted.value = value),
        label: 'Accept terms',
      }),
      h(FLink, { href: '#docs', inline: true }, () => 'Read documentation'),
      h(FDivider, { appearance: dividerAppearance }, () => 'Review'),
      h(FDivider, { vertical: true, 'aria-label': 'Column boundary' }),
      h(FImage, {
        src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=',
        alt: 'Packed consumer image',
        fit: imageFit,
        shape: imageShape,
        bordered: true,
        width: 64,
        height: 48,
      }),
      h(FButton, { appearance }, () => 'Save'),
    ]),
})
  .use(FluentVue)
  .mount('#app');
`,
  );
  await writeFile(
    resolve(consumer, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          strict: true,
          skipLibCheck: true,
          noEmit: true,
        },
        include: ['src/**/*.ts'],
      },
      null,
      2,
    ),
  );

  execFileSync(resolve(root, 'node_modules/.bin/vue-tsc'), ['--noEmit', '-p', 'tsconfig.json'], {
    cwd: consumer,
    stdio: 'inherit',
  });
  execFileSync(resolve(root, 'node_modules/.bin/vite'), ['build'], {
    cwd: consumer,
    stdio: 'inherit',
  });

  console.log('Packed consumer typecheck and production build passed.');
} finally {
  await rm(consumer, { recursive: true, force: true });
}
