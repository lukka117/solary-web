import { cpSync, rmSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Copy Vite `dist/` to the repo root so GitHub Pages (branch: main, folder: /)
 * serves the production build instead of the Vite source index.html.
 */
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

if (!existsSync(dist)) {
  console.error('Missing dist/. Run npm run build first.');
  process.exit(1);
}

const assetsDir = resolve(root, 'assets');
if (existsSync(assetsDir)) {
  rmSync(assetsDir, { recursive: true, force: true });
}

for (const name of readdirSync(dist)) {
  cpSync(resolve(dist, name), resolve(root, name), { recursive: true });
}

writeFileSync(resolve(root, '.nojekyll'), '');
console.log('Published dist/ to repo root for GitHub Pages.');
