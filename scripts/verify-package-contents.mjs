import { execFileSync } from 'node:child_process';

const packed = JSON.parse(
  execFileSync('npm', ['pack', '--dry-run', '--json'], {
    encoding: 'utf8',
  }),
)[0];

const files = packed.files.map((file) => file.path).sort();
const requiredFiles = [
  'CHANGELOG.md',
  'LICENSE',
  'README.md',
  'THIRD_PARTY_NOTICES.md',
  'UPSTREAM.md',
  'dist/index.cjs',
  'dist/index.d.ts',
  'dist/index.js',
  'dist/style.css',
  'package.json',
];

for (const requiredFile of requiredFiles) {
  if (!files.includes(requiredFile)) {
    throw new Error(`Packed package is missing ${requiredFile}.`);
  }
}

const forbiddenPatterns = [
  /^tests\//,
  /^playground\//,
  /^scripts\//,
  /^src\//,
  /(?:^|\/)playwright-report\//,
  /(?:^|\/)test-results\//,
  /\.tgz$/,
];
const forbiddenFiles = files.filter((file) =>
  forbiddenPatterns.some((pattern) => pattern.test(file)),
);

if (forbiddenFiles.length > 0) {
  throw new Error(`Packed package contains forbidden files:\n${forbiddenFiles.join('\n')}`);
}

console.log(`Packed package contains ${files.length} approved files (${packed.size} bytes).`);
