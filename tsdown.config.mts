import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist-bundle',
  format: 'cjs',
  target: 'node24',
  platform: 'node',
  /** Keep `.js` so `start:bundle`, Docker, and docs stay unchanged (default for `node` is `.cjs`). */
  fixedExtension: false,
  sourcemap: true,
  clean: true,
  minify: process.env.MINIFY_ASSETS === 'true',
  treeshake: true,
  deps: {
    skipNodeModulesBundle: true,
  },
  checks: {
    /** We deliberately ship a CJS bundle for Node / PM2 compatibility. */
    legacyCjs: false,
  },
});
