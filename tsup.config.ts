import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist-bundle',
  format: ['cjs'], // 'esm' is for modern browsers, 'cjs' is for Node.js, adapt as needed
  target: 'node24',
  platform: 'node',
  sourcemap: true,
  clean: true,
  minify: process.env.MINIFY_ASSETS === 'true',
  splitting: false,
  treeshake: true,
  skipNodeModulesBundle: true,
});
