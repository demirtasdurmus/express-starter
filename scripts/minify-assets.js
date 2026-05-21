#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Minifies static assets (JS and CSS) for production builds.
 * Runs only when MINIFY_ASSETS=true.
 */

const path = require('path');
const fs = require('fs');
const { existsSync } = fs;
const fsPromises = fs.promises;
const postcss = require('postcss');
const dotenv = require('dotenv');
const cssnano = require('cssnano');
const { execSync } = require('child_process');

dotenv.config();

const willMinifyAssets = process.env.MINIFY_ASSETS === 'true';

if (!willMinifyAssets) {
  console.log('⏭️  Skipping asset minification, export MINIFY_ASSETS=true to enable');
  process.exit(0);
}

const publicDir = path.join(process.cwd(), 'public');
const jsFile = path.join(publicDir, 'js', 'main.js');
const cssFile = path.join(publicDir, 'css', 'style.css');
const nodeModulesBin = path.join(process.cwd(), 'node_modules', '.bin');

console.log('🔨 Minifying static assets...');

async function minifyCss(filePath) {
  const css = await fsPromises.readFile(filePath, 'utf8');
  const result = await postcss([cssnano()]).process(css, { from: filePath });
  await fsPromises.writeFile(filePath, result.css, 'utf8');
}

(async () => {
  try {
    // Minify JavaScript
    if (existsSync(jsFile)) {
      console.log('  → Minifying main.js...');
      const terserPath = path.join(nodeModulesBin, 'terser');
      execSync(`"${terserPath}" "${jsFile}" -o "${jsFile}" --compress --mangle`, {
        stdio: 'inherit',
      });
      console.log('  ✅ main.js minified');
    }

    // Minify CSS (PostCSS + cssnano; replaces deprecated cssnano-cli stack)
    if (existsSync(cssFile)) {
      console.log('  → Minifying style.css...');
      await minifyCss(cssFile);
      console.log('  ✅ style.css minified');
    }

    console.log('✨ Asset minification complete!');
  } catch (error) {
    console.error('❌ Error minifying assets:', error.message);
    process.exit(1);
  }
})();
