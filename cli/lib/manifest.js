import path from 'node:path';
import {
  CANONICAL_REFERENCE_FILES,
  CLI_VERSION,
  DISTRIBUTED_RULES,
  DISTRIBUTED_SKILLS,
  MANIFEST_SCHEMA_VERSION,
  TEMPLATE_VERSION,
} from './distribution-inventory.js';
import { sha256File } from './hash.js';
import { toPosixRelative } from './paths.js';

export const MANIFEST_RELATIVE = '.portfolio/manifest.json';

/**
 * @typedef {{ relativePath: string; category: string; required: boolean; distributedSha256: string }} ManifestFileEntry
 */

/**
 * Build manifest file entries from project root after create.
 * @param {string} projectRoot
 * @param {string} projectName
 * @param {ManifestFileEntry[]} entries
 */
export async function buildManifest(projectRoot, projectName, entries) {
  const referenceDocuments = CANONICAL_REFERENCE_FILES.map((f) => `docs/reference/${f}`);
  referenceDocuments.push('docs/reference/project-context.md');

  return {
    schemaVersion: MANIFEST_SCHEMA_VERSION,
    cliVersion: CLI_VERSION,
    templateVersion: TEMPLATE_VERSION,
    initializedAt: new Date().toISOString(),
    projectName,
    distribution: {
      mode: 'copy',
      autoSync: false,
    },
    rules: [...DISTRIBUTED_RULES],
    skills: [...DISTRIBUTED_SKILLS],
    referenceDocuments,
    files: entries,
  };
}

/**
 * @param {string} projectRoot
 * @param {string} absolutePath
 * @param {string} category
 * @param {boolean} required
 * @returns {Promise<ManifestFileEntry>}
 */
export async function fileEntry(projectRoot, absolutePath, category, required = true) {
  const relativePath = toPosixRelative(projectRoot, absolutePath);
  const distributedSha256 = await sha256File(absolutePath);
  return { relativePath, category, required, distributedSha256 };
}

/**
 * @param {unknown} manifest
 */
export function validateManifestShape(manifest) {
  const errors = [];
  if (!manifest || typeof manifest !== 'object') {
    return ['Manifest is not an object.'];
  }
  const m = manifest;
  if (m.schemaVersion !== MANIFEST_SCHEMA_VERSION) {
    errors.push(`Unsupported schemaVersion: ${m.schemaVersion}`);
  }
  if (!Array.isArray(m.files)) {
    errors.push('files must be an array.');
  }
  for (const f of m.files || []) {
    if (!f.relativePath || typeof f.relativePath !== 'string') {
      errors.push('Each file entry needs relativePath.');
    }
    if (f.relativePath && (f.relativePath.includes('..') || path.isAbsolute(f.relativePath))) {
      errors.push(`Invalid manifest relativePath: ${f.relativePath}`);
    }
    if (!f.distributedSha256 || typeof f.distributedSha256 !== 'string') {
      errors.push(`Missing distributedSha256 for ${f.relativePath}`);
    }
  }
  return errors;
}