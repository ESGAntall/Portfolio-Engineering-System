import path from 'node:path';

/** Project-relative path with forward slashes (manifest storage). */
export function toPosixRelative(projectRoot, absolutePath) {
  const rel = path.relative(projectRoot, absolutePath);
  return rel.split(path.sep).join('/');
}

/**
 * @param {string} projectName
 * @returns {{ valid: boolean; reason?: string }}
 */
export function validateProjectName(projectName) {
  if (!projectName || typeof projectName !== 'string') {
    return { valid: false, reason: 'Project name is required.' };
  }
  if (projectName.includes('..') || projectName.includes('/') || projectName.includes('\\')) {
    return { valid: false, reason: 'Project name must not contain path separators or "..".' };
  }
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(projectName)) {
    return {
      valid: false,
      reason:
        'Project name must start with alphanumeric and contain only letters, digits, ., _, -.',
    };
  }
  return { valid: true };
}

/**
 * @param {string} resolvedDest
 * @param {string} portfolioRoot
 * @returns {{ safe: boolean; reason?: string }}
 */
export function validateDestinationInsidePolicy(resolvedDest, portfolioRoot) {
  const normDest = path.resolve(resolvedDest);
  const normPortfolio = path.resolve(portfolioRoot);
  if (normDest === normPortfolio) {
    return { safe: false, reason: 'Destination cannot be the portfolio root.' };
  }
  return { safe: true };
}

/**
 * Resolve user --path and ensure no traversal escape via project name segments.
 * @param {string} rawPath
 * @param {string} portfolioRoot
 */
export function resolveUserPath(rawPath, portfolioRoot) {
  const resolved = path.isAbsolute(rawPath)
    ? path.resolve(rawPath)
    : path.resolve(portfolioRoot, rawPath);
  return resolved;
}