import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

/**
 * @param {Buffer | string} data
 * @returns {string} lowercase hex sha256
 */
export function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

/**
 * @param {string} filePath
 * @returns {Promise<string>}
 */
export async function sha256File(filePath) {
  const buf = await readFile(filePath);
  return sha256(buf);
}