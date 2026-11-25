import path from 'node:path';
import {
  CANONICAL_REFERENCE_FILES,
  DISTRIBUTED_RULES,
  DISTRIBUTED_SKILLS,
  TEMPLATE_COPY_EXCLUDE,
} from './distribution-inventory.js';
import { copyFileSafe, copyTreeSafe, writeJsonPretty } from './fs-utils.js';
import { buildManifest, fileEntry, MANIFEST_RELATIVE } from './manifest.js';
import { resolveUserPath, validateDestinationInsidePolicy, validateProjectName } from './paths.js';

/**
 * @param {{ portfolioRoot: string; projectName: string; destPath?: string }} opts
 */
export async function createProject(opts) {
  const nameCheck = validateProjectName(opts.projectName);
  if (!nameCheck.valid) {
    throw new Error(nameCheck.reason);
  }

  const dest =
    opts.destPath ??
    path.join(opts.portfolioRoot, 'projects', opts.projectName);
  const resolvedDest = resolveUserPath(dest, opts.portfolioRoot);

  const policy = validateDestinationInsidePolicy(resolvedDest, opts.portfolioRoot);
  if (!policy.safe) {
    throw new Error(policy.reason);
  }

  const templateDir = path.join(opts.portfolioRoot, 'project-template');
  const refsCanonical = path.join(opts.portfolioRoot, 'docs', 'reference');
  const rulesDir = path.join(opts.portfolioRoot, '.cursor', 'rules');
  const skillsDir = path.join(opts.portfolioRoot, '.cursor', 'skills');

  const manifestEntries = [];

  await copyTreeSafe(templateDir, resolvedDest, TEMPLATE_COPY_EXCLUDE, false);

  for (const rule of DISTRIBUTED_RULES) {
    const src = path.join(rulesDir, rule);
    const destFile = path.join(resolvedDest, '.cursor', 'rules', rule);
    await copyFileSafe(src, destFile);
    manifestEntries.push(await fileEntry(resolvedDest, destFile, 'rule', true));
  }

  for (const skill of DISTRIBUTED_SKILLS) {
    const src = path.join(skillsDir, skill, 'SKILL.md');
    const destFile = path.join(resolvedDest, '.cursor', 'skills', skill, 'SKILL.md');
    await copyFileSafe(src, destFile);
    manifestEntries.push(await fileEntry(resolvedDest, destFile, 'skill', true));
  }

  for (const ref of CANONICAL_REFERENCE_FILES) {
    const src = path.join(refsCanonical, ref);
    const destFile = path.join(resolvedDest, 'docs', 'reference', ref);
    await copyFileSafe(src, destFile);
    manifestEntries.push(await fileEntry(resolvedDest, destFile, 'reference', true));
  }

  const scaffold = path.join(resolvedDest, 'docs', 'reference', 'project-context.md');
  manifestEntries.push(await fileEntry(resolvedDest, scaffold, 'manifest-scaffold', true));

  const manifest = await buildManifest(resolvedDest, opts.projectName, manifestEntries);
  const manifestPath = path.join(resolvedDest, MANIFEST_RELATIVE);
  await writeJsonPretty(manifestPath, manifest);

  return {
    projectRoot: resolvedDest,
    manifestPath,
    manifest,
    summary: {
      rules: DISTRIBUTED_RULES.length,
      skills: DISTRIBUTED_SKILLS.length,
      references: CANONICAL_REFERENCE_FILES.length + 1,
      templateCopied: true,
    },
  };
}