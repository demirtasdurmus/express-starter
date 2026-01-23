#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Minifies static assets (JS and CSS) for production builds
 * Only runs when NODE_ENV is 'production'
 */

const path = require('path');
const { existsSync } = require('fs');
const dotenv = require('dotenv');
const { execSync } = require('child_process');
dotenv.config();

const isProduction = process.env.MINIFY_ASSETS === 'true';

if (!isProduction) {
  console.log('⏭️  Skipping asset minification, export MINIFY_ASSETS=true to enable');
  process.exit(0);
}

const publicDir = path.join(process.cwd(), 'public');
const jsFile = path.join(publicDir, 'js', 'main.js');
const cssFile = path.join(publicDir, 'css', 'style.css');
const nodeModulesBin = path.join(process.cwd(), 'node_modules', '.bin');

console.log('🔨 Minifying static assets...');

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

  // Minify CSS
  if (existsSync(cssFile)) {
    console.log('  → Minifying style.css...');
    const cssnanoPath = path.join(nodeModulesBin, 'cssnano');
    execSync(`"${cssnanoPath}" "${cssFile}" "${cssFile}"`, {
      stdio: 'inherit',
    });
    console.log('  ✅ style.css minified');
  }

  console.log('✨ Asset minification complete!');
} catch (error) {
  console.error('❌ Error minifying assets:', error.message);
  process.exit(1);
}
