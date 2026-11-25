/**
 * C-02 distribution contract (v0.1) — single source for create / verify / doctor.
 */

export const CLI_VERSION = '0.1.0';
export const TEMPLATE_VERSION = '1';
export const MANIFEST_SCHEMA_VERSION = 1;

/** Shared rules (canonical: portfolio-root/.cursor/rules/) */
export const DISTRIBUTED_RULES = [
  '00-portfolio-baseline.mdc',
  '10-workflow-and-approval.mdc',
  '20-ui-ux-system.mdc',
  '30-quality-gates.mdc',
];

/** Excluded: 90-portfolio-meta-local.mdc, 99-project-local.mdc (template) */

export const DISTRIBUTED_SKILLS = [
  'requirement-orchestrator',
  'engineering-workflow',
  'codebase-graph',
  'frontend-design',
  'quality-gate',
];

/** Excluded skill: portfolio-design-system */

/**
 * Policy references — canonical: portfolio-root/docs/reference/
 * project-context.md is scaffold only (project-template).
 */
export const CANONICAL_REFERENCE_FILES = [
  'README.md',
  'design-principles.md',
  'O-002-codebase-graph.md',
  'O-003-task-classification.md',
];

export const TEMPLATE_REFERENCE_SCAFFOLD = 'docs/reference/project-context.md';

/** Template-only stub; not a canonical policy duplicate (C-02). */
export const TEMPLATE_REFERENCE_STUBS = new Set(['README.md']);

/** Policy files that must not be duplicated under project-template/docs/reference/ */
export const TEMPLATE_POLICY_DUPLICATE_CHECK = CANONICAL_REFERENCE_FILES.filter(
  (f) => !TEMPLATE_REFERENCE_STUBS.has(f),
);

/** Paths under project-template/ not copied (filled by CLI or excluded policy dupes) */
/** Template stubs under docs/reference/ — canonical policy files come from portfolio docs/reference/ */
export const TEMPLATE_COPY_EXCLUDE = new Set([
  'docs/reference/README.md',
  'docs/reference/design-principles.md',
  'docs/reference/O-002-codebase-graph.md',
  'docs/reference/O-003-task-classification.md',
]);

/**
 * Reference bundle classification (C-02 Phase A).
 * @type {Record<string, { role: string, canonical: string }>}
 */
export const REFERENCE_CLASSIFICATION = {
  'README.md': {
    role: 'shared-policy',
    canonical: 'docs/reference/README.md',
  },
  'design-principles.md': {
    role: 'shared-policy',
    canonical: 'docs/reference/design-principles.md',
  },
  'O-002-codebase-graph.md': {
    role: 'shared-policy',
    canonical: 'docs/reference/O-002-codebase-graph.md',
  },
  'O-003-task-classification.md': {
    role: 'shared-policy',
    canonical: 'docs/reference/O-003-task-classification.md',
  },
  'project-context.md': {
    role: 'project-scaffold',
    canonical: 'project-template/docs/reference/project-context.md',
  },
};