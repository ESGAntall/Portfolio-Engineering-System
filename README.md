# Portfolio Engineering System

Meta-repository: AI engineering workflow, Cursor Rules, Cursor Skills, chuẩn và template. **Mỗi app là Git repo riêng** — không runtime dependency chéo (xem [engineering-standards](portfolio/engineering-standards.md): repository independence, backend project-specific, technology strategy).

**Không** chứa source ứng dụng. **Không** cài Graphify tại đây.

## Cấu trúc

| Path | Nội dung |
|------|----------|
| `.cursor/rules/` | Rules portfolio (baseline, workflow, UI, quality) |
| `.cursor/skills/` | Skills điều phối và workflow (**repo-only**, không mirror `~/.cursor/skills/`) |
| `portfolio/` | Registry, design principles, engineering standards |
| `docs/decisions/` | ADR O-001, O-002, O-003 |
| `project-template/` | Skeleton app repo (includes `.gitignore` + gitignore bootstrap doc) |

## ADR đã chốt

| ID | Tóm tắt |
|----|---------|
| [O-001](docs/decisions/O-001-skills-and-rules-distribution.md) | Copy rules/skills; sync script versioned sau; không ghi đè local |
| [O-002](docs/decisions/O-002-codebase-graph.md) | Graphify ưu tiên trên app repos; fallback; source = truth |
| [O-003](docs/decisions/O-003-task-classification.md) | Risk & impact; UI surface; field/data clarify |

## Bắt đầu nhanh

1. [engineering-standards.md](portfolio/engineering-standards.md), [design-principles.md](portfolio/design-principles.md).
2. App mới: `node cli/bin/portfolio.js create <name>` — xem [cli/README.md](cli/README.md).
3. Task mơ hồ hoặc lớn → skill **requirement-orchestrator**.

## Local CLI (v0.1)

| Command | Mô tả |
|---------|--------|
| `create` | Bootstrap app repo vào `projects/<name>` hoặc `--path` |
| `verify` | Manifest + distributed files |
| `doctor` | Portfolio / project health |
| `info` | Version và distribution summary |

## Registry

[portfolio/portfolio-registry.md](portfolio/portfolio-registry.md) — NOTEAI ([specs](portfolio/project-specs/noteai/README.md), PLANNED).

## Rules

| Rule | alwaysApply | Ghi chú |
|------|-------------|---------|
| `00-portfolio-baseline.mdc` | yes | |
| `10-workflow-and-approval.mdc` | yes | O-003; trigger quality-gate khi done/ship |
| `20-ui-ux-system.mdc` | no | UI source globs + design-system docs |
| `30-quality-gates.mdc` | no | Glob: test docs, TS/JS/Vue/Svelte/Python, tests, e2e, GitHub workflows (xem rule file) |

## Changelog

[CHANGELOG.md](CHANGELOG.md)