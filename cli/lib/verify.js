import path from 'node:path';
import { validateManifestShape, MANIFEST_RELATIVE } from './manifest.js';
import { sha256File } from './hash.js';
import { readJson } from './fs-utils.js';
import { stat } from 'node:fs/promises';

/**
 * @typedef {'missing' | 'unchanged' | 'locallyModified'} FileStatus
 */

/**
 * @param {string} projectRoot
 */
export async function verifyProject(projectRoot) {
  const manifestPath = path.join(projectRoot, MANIFEST_RELATIVE);
  const report = {
    projectRoot,
    manifestPath,
    manifestValid: false,
    manifestErrors: [],
    files: [],
    missingRequired: 0,
    locallyModified: 0,
    unchanged: 0,
    ok: false,
  };

  let manifest;
  try {
    manifest = await readJson(manifestPath);
  } catch {
    report.manifestErrors.push('Manifest missing or unreadable.');
    return report;
  }

  report.manifestErrors = validateManifestShape(manifest);
  report.manifestValid = report.manifestErrors.length === 0;

  for (const entry of manifest.files || []) {
    const abs = path.join(projectRoot, ...entry.relativePath.split('/'));
    /** @type {FileStatus} */
    let status = 'missing';
    let currentHash = null;
    try {
      await stat(abs);
      currentHash = await sha256File(abs);
      status =
        currentHash === entry.distributedSha256 ? 'unchanged' : 'locallyModified';
    } catch {
      status = 'missing';
    }

    const row = {
      relativePath: entry.relativePath,
      status,
      required: !!entry.required,
      category: entry.category,
      distributedSha256: entry.distributedSha256,
      currentSha256: currentHash,
    };
    report.files.push(row);
    if (status === 'missing' && entry.required) report.missingRequired += 1;
    if (status === 'locallyModified') report.locallyModified += 1;
    if (status === 'unchanged') report.unchanged += 1;
  }

  report.ok = report.manifestValid && report.missingRequired === 0;
  return report;
}