import fs from 'node:fs';
import path from 'node:path';
import { copyFile, mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';

/**
 * @param {string} dir
 */
export async function directoryIsEmptyOrMissing(dir) {
  try {
    const st = await stat(dir);
    if (!st.isDirectory()) {
      return { exists: true, empty: false, isFile: true };
    }
    const entries = await readdir(dir);
    return { exists: true, empty: entries.length === 0, isFile: false };
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'ENOENT') {
      return { exists: false, empty: true, isFile: false };
    }
    throw err;
  }
}

/**
 * Copy file; fails if dest exists (no silent overwrite).
 * @param {string} src
 * @param {string} dest
 */
export async function copyFileSafe(src, dest) {
  await mkdir(path.dirname(dest), { recursive: true });
  try {
    await stat(dest);
    throw new Error(`Refusing to overwrite existing file: ${dest}`);
  } catch (err) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'ENOENT') {
      await copyFile(src, dest);
      return;
    }
    if (err instanceof Error && err.message.startsWith('Refusing to overwrite')) {
      throw err;
    }
    throw err;
  }
}

/**
 * Recursive copy from srcDir to destDir; skips excludeRelative paths (posix, relative to src root).
 * @param {string} srcDir
 * @param {string} destDir
 * @param {Set<string>} excludeRelative posix paths like docs/reference/foo.md
 * @param {boolean} mergeIntoExisting when true, dest parent may exist (still no file overwrite)
 */
export async function copyTreeSafe(srcDir, destDir, excludeRelative, mergeIntoExisting = false) {
  const state = await directoryIsEmptyOrMissing(destDir);
  if (state.exists && !state.empty && !mergeIntoExisting) {
    throw new Error(`Refusing to copy into non-empty destination: ${destDir}`);
  }
  if (!state.exists) {
    await mkdir(destDir, { recursive: true });
  }

  await walkCopy(srcDir, destDir, srcDir, excludeRelative);
}

/**
 * @param {string} currentSrc
 * @param {string} currentDest
 * @param {string} srcRoot
 * @param {Set<string>} excludeRelative
 */
async function walkCopy(currentSrc, currentDest, srcRoot, excludeRelative) {
  const entries = await readdir(currentSrc, { withFileTypes: true });
  for (const ent of entries) {
    const srcPath = path.join(currentSrc, ent.name);
    const destPath = path.join(currentDest, ent.name);
    const rel = path.relative(srcRoot, srcPath).split(path.sep).join('/');
    if (excludeRelative.has(rel)) {
      continue;
    }
    if (ent.isDirectory()) {
      await mkdir(destPath, { recursive: true });
      await walkCopy(srcPath, destPath, srcRoot, excludeRelative);
    } else if (ent.isFile()) {
      try {
        await stat(destPath);
        throw new Error(`Refusing to overwrite existing file: ${destPath}`);
      } catch (err) {
        if (err && typeof err === 'object' && 'code' in err && err.code === 'ENOENT') {
          await copyFile(srcPath, destPath);
        } else if (err instanceof Error && err.message.startsWith('Refusing to overwrite')) {
          throw err;
        } else {
          throw err;
        }
      }
    }
  }
}

export async function writeJsonPretty(filePath, data) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

/**
 * @param {string} filePath
 */
export async function readJson(filePath) {
  const raw = await readFile(filePath, 'utf8');
  return JSON.parse(raw);
}