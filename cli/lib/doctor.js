import fs from 'node:fs';
import path from 'node:path';
import { readdir, readFile } from 'node:fs/promises';
import {
  CANONICAL_REFERENCE_FILES,
  DISTRIBUTED_RULES,
  DISTRIBUTED_SKILLS,
  TEMPLATE_POLICY_DUPLICATE_CHECK,
} from './distribution-inventory.js';
import { verifyProject } from './verify.js';
import { resolvePortfolioRoot } from './resolve-root.js';
import { validateManifestShape, MANIFEST_RELATIVE } from './manifest.js';
import { readJson } from './fs-utils.js';
import { scanPortfolioOnlyDependencies } from './portfolio-only-scan.js';

/**
 * @param {string} portfolioRoot
 */
export async function doctorPortfolio(portfolioRoot) {
  const issues = [];
  const warnings = [];
  const checks = [];

  const template = path.join(portfolioRoot, 'project-template');
  checks.push({ name: 'project-template', ok: fs.existsSync(template) });
  if (!fs.existsSync(template)) issues.push('Missing project-template/.');

  for (const rule of DISTRIBUTED_RULES) {
    const p = path.join(portfolioRoot, '.cursor', 'rules', rule);
    const ok = fs.existsSync(p);
    checks.push({ name: `rule:${rule}`, ok });
    if (!ok) issues.push(`Missing canonical rule: ${rule}`);
  }

  for (const skill of DISTRIBUTED_SKILLS) {
    const p = path.join(portfolioRoot, '.cursor', 'skills', skill, 'SKILL.md');
    const ok = fs.existsSync(p);
    checks.push({ name: `skill:${skill}`, ok });
    if (!ok) issues.push(`Missing canonical skill: ${skill}`);
  }

  for (const ref of CANONICAL_REFERENCE_FILES) {
    const p = path.join(portfolioRoot, 'docs', 'reference', ref);
    const ok = fs.existsSync(p);
    checks.push({ name: `reference:${ref}`, ok });
    if (!ok) issues.push(`Missing canonical reference: docs/reference/${ref}`);
  }

  const dupes = TEMPLATE_POLICY_DUPLICATE_CHECK.map((f) =>
    path.join(template, 'docs', 'reference', f),
  );
  for (const d of dupes) {
    if (fs.existsSync(d)) {
      warnings.push(`Template should not duplicate policy reference: ${path.relative(portfolioRoot, d)}`);
    }
  }

  const gitignore = path.join(portfolioRoot, '.gitignore');
  if (fs.existsSync(gitignore)) {
    const body = await readFile(gitignore, 'utf8');
    if (!body.includes('/projects/')) {
      warnings.push('Root .gitignore may not exclude /projects/.');
    }
  }

  return { scope: 'portfolio', portfolioRoot, issues, warnings, checks, ok: issues.length === 0 };
}

/**
 * @param {string} projectRoot
 */
export async function doctorProject(projectRoot) {
  const issues = [];
  const warnings = [];
  const verify = await verifyProject(projectRoot);

  if (!verify.manifestValid) {
    issues.push(...verify.manifestErrors);
  }

  const manifestPath = path.join(projectRoot, MANIFEST_RELATIVE);
  if (fs.existsSync(manifestPath)) {
    try {
      const m = await readJson(manifestPath);
      const shapeErrors = validateManifestShape(m);
      if (shapeErrors.length) issues.push(...shapeErrors);
    } catch {
      issues.push('Manifest JSON parse failed.');
    }
  } else {
    issues.push('Missing .portfolio/manifest.json');
  }

  for (const rel of [
    'docs/reference/design-principles.md',
    'docs/reference/O-003-task-classification.md',
    '.cursor/rules/10-workflow-and-approval.mdc',
  ]) {
    const p = path.join(projectRoot, ...rel.split('/'));
    if (!fs.existsSync(p)) {
      issues.push(`Expected bootstrap file missing: ${rel}`);
    }
  }

  const scanDirs = [
    { dir: path.join(projectRoot, '.cursor', 'rules'), exts: ['.mdc'] },
    { dir: path.join(projectRoot, '.cursor', 'skills'), exts: ['.md'] },
    { dir: path.join(projectRoot, 'docs', 'design-system'), exts: ['.md'] },
  ];
  for (const { dir, exts } of scanDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = await listFilesRecursive(dir, exts);
    for (const file of files) {
      const content = await readFile(file, 'utf8');
      const findings = scanPortfolioOnlyDependencies(content);
      for (const f of findings) {
        warnings.push(
          `Portfolio-only dependency (${f.id}) in ${path.relative(projectRoot, file)}: ${f.detail}`,
        );
      }
    }
  }

  if (verify.locallyModified > 0) {
    warnings.push(
      `${verify.locallyModified} distributed file(s) locally modified (allowed; re-run verify).`,
    );
  }

  return {
    scope: 'project',
    projectRoot,
    issues,
    warnings,
    verify,
    ok: issues.length === 0,
  };
}

/**
 * @param {string} dir
 * @param {string[]} exts
 */
async function listFilesRecursive(dir, exts) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await listFilesRecursive(full, exts)));
    } else if (exts.some((x) => e.name.endsWith(x))) {
      out.push(full);
    }
  }
  return out;
}

/**
 * @param {{ entryFileUrl: string; portfolioRootOverride?: string; projectPath?: string }} opts
 */
export async function runDoctor(opts) {
  const portfolioRoot = resolvePortfolioRoot({
    entryFileUrl: opts.entryFileUrl,
    portfolioRootOverride: opts.portfolioRootOverride,
  });
  const portfolioReport = await doctorPortfolio(portfolioRoot);

  let projectReport = null;
  if (opts.projectPath) {
    projectReport = await doctorProject(path.resolve(opts.projectPath));
  }

  return { portfolioRoot, portfolioReport, projectReport };
}