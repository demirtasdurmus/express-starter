#!/usr/bin/env node

import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { minify } from 'terser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_DIR = join(__dirname, '..', 'dist');

async function getAllJsFiles(dir, fileList = []) {
  const files = await readdir(dir);

  for (const file of files) {
    const filePath = join(dir, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      await getAllJsFiles(filePath, fileList);
    } else if (file.endsWith('.js') && !file.endsWith('.min.js')) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

async function minifyFile(filePath) {
  try {
    const code = await readFile(filePath, 'utf8');
    const sourceMapPath = filePath + '.map';
    let sourceMap = null;

    try {
      const sourceMapContent = await readFile(sourceMapPath, 'utf8');
      sourceMap = JSON.parse(sourceMapContent);
    } catch {
      // Source map doesn't exist, that's okay
    }

    const result = await minify(code, {
      compress: {
        drop_console: false, // Keep console statements
        drop_debugger: true,
        pure_funcs: [], // You can add functions to remove here if needed
      },
      mangle: {
        reserved: [], // Add any names you want to preserve
      },
      format: {
        comments: false,
      },
      sourceMap: sourceMap
        ? {
            content: sourceMap,
            filename: filePath.replace(DIST_DIR, ''),
            url: filePath.replace(DIST_DIR, '') + '.map',
          }
        : false,
    });

    await writeFile(filePath, result.code, 'utf8');

    if (result.map && sourceMap) {
      await writeFile(sourceMapPath, result.map, 'utf8');
    }

    console.log(`✓ Minified: ${filePath.replace(DIST_DIR + '/', '')}`);
  } catch (error) {
    console.error(`✗ Error minifying ${filePath}:`, error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('Starting minification...\n');
    const jsFiles = await getAllJsFiles(DIST_DIR);

    if (jsFiles.length === 0) {
      console.log('No JavaScript files found to minify.');
      return;
    }

    console.log(`Found ${jsFiles.length} file(s) to minify:\n`);

    for (const file of jsFiles) {
      await minifyFile(file);
    }

    console.log(`\n✓ Successfully minified ${jsFiles.length} file(s).`);
  } catch (error) {
    console.error('Minification failed:', error);
    process.exit(1);
  }
}

main();

