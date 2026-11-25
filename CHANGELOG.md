# Changelog

All notable changes to **portfolio-engineering-system** (meta repo).

## [Unreleased]

### Added (C-02 + Local CLI v0.1)

- `cli/` — `create`, `verify`, `doctor`, `info`, `help`; marker `.portfolio-root`; manifest `.portfolio/manifest.json` (schema v1).
- C-02 contract: canonical `docs/reference/` only (no duplicate policy in `project-template/`); scaffold `project-context.md` stays in template.
- Tests: `cli/test/run-tests.js` (29 cases, temp dirs only).

### Changed (C-01 portability)

- Shared rules 00–30 → `docs/reference/` paths; rule `90-portfolio-meta-local` (meta only, not distributed).
- Distributable skills retargeted; `portfolio-design-system` marked PORTFOLIO_ONLY.
- Canonical policy bundle: `docs/reference/`; template chỉ scaffold `project-context.md` + README stub.

### Changed

- Separate specs: `portfolio/project-specs/<id>/` (tracked) vs local clones `projects/<id>/` (gitignored); NOTEAI specs moved from inside NOTEAI repo.
- `.gitignore` — `/projects/` (+ legacy `/portfolio/projects/` until clones relocated).
- `portfolio/engineering-standards.md` — repository independence; backend/data project-specific; technology strategy (directions, not mandates).
- Registry, template `docs/architecture/`, NOTEAI architecture banner (NOTEAI-only constraints).
- NOTEAI: registry URL; specs under `portfolio/project-specs/noteai/` (moved out of NOTEAI app repo).

### Changed (policy hardening)

- O-003 — UI regression risk (một surface); field/data clarification; task lớn = analysis + plan + verification criteria.
- Rule `10` — quality-gate trigger (done/ship/merge/…); field clarify ngắn.
- Rule `30` — mở rộng globs source/test/CI; PASS/BLOCKED/NOT RUN; scope checklist.
- Skill `quality-gate` — trigger và verdict align rule 10/30; checklist theo phạm vi.
- Skill `requirement-orchestrator` — field persistent/runtime/derived; UI classify O-003.

### Added

- ADR [O-001](docs/decisions/O-001-skills-and-rules-distribution.md), [O-002](docs/decisions/O-002-codebase-graph.md), [O-003](docs/decisions/O-003-task-classification.md) under `docs/decisions/`.
- NOTEAI entry in `portfolio/portfolio-registry.md` (PLANNED).

### Changed

- `portfolio/engineering-standards.md` — chốt O-001–O-003; bỏ open-decisions tạm.
- Rule `10-workflow-and-approval.mdc` — classification theo risk/impact (O-003).
- Rule `20-ui-ux-system.mdc` — globs UI source + design-system; project-local cho framework khác.
- Skills `codebase-graph`, `requirement-orchestrator` — align ADR O-002/O-003.
- `portfolio/design-principles.md` — bảng áp dụng rule 20.
- `project-template/` — O-001 copy-first, O-002 graph manifest/doc, repo-only skills.

### Added (foundation)

- Initial foundation: Cursor rules (00–30), six portfolio skills, portfolio docs, `project-template/`.