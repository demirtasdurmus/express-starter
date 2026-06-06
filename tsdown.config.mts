import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/index.ts',
  outDir: 'dist-bundle',
  target: 'node24',
  sourcemap: true,
  tsconfig: 'tsconfig.build.json',
  deps: {
    skipNodeModulesBundle: true,
  },
});
