import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MARKER = '.portfolio-root';
const SKILL_PROBE = path.join('.cursor', 'skills', 'requirement-orchestrator', 'SKILL.md');
const STANDARDS_PROBE = path.join('portfolio', 'engineering-standards.md');
const CLI_DIR_NAME = 'cli';

/**
 * @param {string} dir
 */
function isPortfolioRoot(dir) {
  const marker = path.join(dir, MARKER);
  if (fs.existsSync(marker) && fs.statSync(marker).isFile()) {
    const skill = path.join(dir, SKILL_PROBE);
    const standards = path.join(dir, STANDARDS_PROBE);
    return fs.existsSync(skill) && fs.existsSync(standards);
  }
  return false;
}

/**
 * Directory containing portfolio.js entry (cli/bin -> cli -> portfolio root).
 * @param {string} entryFileUrl import.meta.url from bin/portfolio.js
 */
export function portfolioRootFromCliEntry(entryFileUrl) {
  const binDir = path.dirname(fileURLToPath(entryFileUrl));
  const cliDir = path.dirname(binDir);
  if (path.basename(cliDir) !== CLI_DIR_NAME) {
    return null;
  }
  const candidate = path.dirname(cliDir);
  return isPortfolioRoot(candidate) ? candidate : null;
}

/**
 * Walk upward from startDir (max 32 levels).
 * @param {string} startDir
 */
export function findPortfolioRootFromCwd(startDir) {
  let current = path.resolve(startDir);
  for (let i = 0; i < 32; i++) {
    if (isPortfolioRoot(current)) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return null;
}

/**
 * @param {{ portfolioRootOverride?: string; cwd?: string; entryFileUrl: string }} opts
 */
export function resolvePortfolioRoot(opts) {
  const envRoot = process.env.PORTFOLIO_ROOT;
  const override = opts.portfolioRootOverride || envRoot;

  if (override) {
    const resolved = path.resolve(override);
    if (!isPortfolioRoot(resolved)) {
      throw new Error(
        `PORTFOLIO_ROOT / --portfolio-root is not a valid portfolio root (missing ${MARKER} or canonical files): ${resolved}`,
      );
    }
    return resolved;
  }

  const fromEntry = portfolioRootFromCliEntry(opts.entryFileUrl);
  if (fromEntry) {
    return fromEntry;
  }

  const fromCwd = findPortfolioRootFromCwd(opts.cwd || process.cwd());
  if (fromCwd) {
    return fromCwd;
  }

  throw new Error(
    'Could not resolve portfolio root. Set PORTFOLIO_ROOT, use --portfolio-root, or run the CLI from a portfolio clone (marker .portfolio-root).',
  );
}