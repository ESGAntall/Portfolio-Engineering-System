import path from 'node:path';
import {
  CANONICAL_REFERENCE_FILES,
  CLI_VERSION,
  DISTRIBUTED_RULES,
  DISTRIBUTED_SKILLS,
  TEMPLATE_VERSION,
  REFERENCE_CLASSIFICATION,
} from './distribution-inventory.js';

export function getInfo(portfolioRoot) {
  return {
    cliVersion: CLI_VERSION,
    templateVersion: TEMPLATE_VERSION,
    portfolioRoot,
    commands: ['create', 'verify', 'doctor', 'info', 'help'],
    distribution: {
      mode: 'copy',
      autoSync: false,
      rules: DISTRIBUTED_RULES,
      skills: DISTRIBUTED_SKILLS,
      canonicalReferences: CANONICAL_REFERENCE_FILES.map((f) => path.posix.join('docs/reference', f)),
      referenceScaffold: 'docs/reference/project-context.md',
      excluded: {
        rules: ['90-portfolio-meta-local.mdc'],
        skills: ['portfolio-design-system'],
      },
      referenceClassification: REFERENCE_CLASSIFICATION,
      sources: {
        rules: '.cursor/rules/',
        skills: '.cursor/skills/',
        policyReferences: 'docs/reference/',
        template: 'project-template/',
      },
    },
  };
}