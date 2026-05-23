import { defineConfig } from 'tsdown';

export default defineConfig({
  outDir: 'dist-bundle',
  format: 'cjs',
  target: 'node24',
  sourcemap: true,
  deps: {
    skipNodeModulesBundle: true,
  },
  checks: {
    /** We deliberately ship a CJS bundle for Node / PM2 compatibility. */
    legacyCjs: false,
  },
});
