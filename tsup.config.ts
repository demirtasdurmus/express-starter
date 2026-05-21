import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist-bundle',
  format: ['esm', 'cjs'],
  target: 'node24',
  platform: 'node',
  sourcemap: true,
  clean: true,
  minify: process.env.MINIFY_ASSETS === 'true',
  splitting: false,
  treeshake: true,
  skipNodeModulesBundle: true,
});
