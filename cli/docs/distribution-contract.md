# C-02 distribution contract (v0.1)

## Reference bundle classification

| File | Role | Canonical source | In project after `create` |
|------|------|------------------|---------------------------|
| `README.md` | Shared policy index | `docs/reference/README.md` | `docs/reference/README.md` |
| `design-principles.md` | Shared policy (curated snapshot) | `docs/reference/design-principles.md` | same path; **không** copy `portfolio/design-principles.md` |
| `O-002-codebase-graph.md` | Shared policy | `docs/reference/O-002-codebase-graph.md` | same |
| `O-003-task-classification.md` | Shared policy | `docs/reference/O-003-task-classification.md` | same |
| `project-context.md` | **Project scaffold** (editable) | `project-template/docs/reference/project-context.md` | same |

**No duplicate policy files** in `project-template/docs/reference/` — template chỉ giữ scaffold `project-context.md` và README stub *mô tả* (stub README **không** copy sang app; app nhận canonical `README.md`).

## Full inventory

### From `project-template/`

- `.gitignore`, `README.md`
- `.cursor/code-graph-manifest.json`, `.cursor/rules/99-project-local.mdc`, `.cursor/skills/README.md`
- `docs/product/`, `docs/architecture/`, `docs/design-system/`, `docs/decisions/`, `docs/testing/`, `docs/engineering/`
- `docs/reference/project-context.md` only (policy paths excluded)

### Copied from portfolio root

- Rules: `00-portfolio-baseline.mdc`, `10-workflow-and-approval.mdc`, `20-ui-ux-system.mdc`, `30-quality-gates.mdc`
- Skills: `requirement-orchestrator`, `engineering-workflow`, `codebase-graph`, `frontend-design`, `quality-gate`
- References: four policy files from `docs/reference/`

### Generated

- `.portfolio/manifest.json`

### Never distributed

- `90-portfolio-meta-local.mdc`
- `portfolio-design-system`
- `portfolio/*` (gồm `portfolio/design-principles.md` — authoring only), `docs/decisions/O-00*` (ADR originals — app uses reference snapshots)

**Design principles:** CLI phân phối `docs/reference/design-principles.md` — equivalent policy §1–§6, không gồm § meta-only của authoring. Không migration/sync tự động sang app đã tạo (v0.1).