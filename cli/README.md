# Portfolio Local CLI (v0.1)

CLI **local only** — không publish npm, không `npx`. Thực thi chiến lược **COPY** (ADR O-001) từ portfolio meta repository.

## Yêu cầu

- **Node.js** ≥ 18
- Không dependency npm bắt buộc (chỉ `node:fs`, `path`, `crypto`, …)

## Chạy

Từ portfolio root (hoặc bất kỳ cwd nào — CLI resolve root qua `cli/bin/portfolio.js` + marker `.portfolio-root`):

```bash
node cli/bin/portfolio.js help
node cli/bin/portfolio.js info
node cli/bin/portfolio.js create my-app
node cli/bin/portfolio.js create my-app --path "D:/dev/my app"
node cli/bin/portfolio.js verify ./projects/my-app
node cli/bin/portfolio.js doctor ./projects/my-app
```

Override root: `--portfolio-root <path>` hoặc env `PORTFOLIO_ROOT`.

## `create`

1. Default đích: `<portfolio-root>/projects/<project-name>`
2. Copy `project-template/` (skeleton)
3. Copy rules **00–30** từ `.cursor/rules/`
4. Copy skills distributable (loại trừ `portfolio-design-system`)
5. Copy policy references từ canonical `docs/reference/`
6. Giữ scaffold `docs/reference/project-context.md` từ template
7. Ghi `.portfolio/manifest.json`

**Không:** `git init`, push, cài package, generate source app, xóa/ghi đè file có sẵn.

## `verify` / `doctor`

- **verify:** manifest + file hashes; `locallyModified` = thông tin, không auto-fail (O-001 local customization).
- **doctor:** layout portfolio + (tùy chọn) project; cảnh báo tham chiếu portfolio-only trong rules/skills.

## Manifest

- Path: `.portfolio/manifest.json`
- Schema: [docs/manifest-schema.md](docs/manifest-schema.md)
- `schemaVersion`: `1` — không auto-sync v0.1

## Distribution contract (C-02)

Nguồn định nghĩa: `cli/lib/distribution-inventory.js`

| Artifact | Canonical source |
|----------|------------------|
| Rules 00–30 | `.cursor/rules/` |
| Skills (5) | `.cursor/skills/<name>/SKILL.md` |
| Policy refs | `docs/reference/` (README, design-principles, O-002, O-003) |
| project-context | `project-template/docs/reference/project-context.md` |
| Rule 99 | `project-template/.cursor/rules/99-project-local.mdc` |

**Excluded:** rule 90, skill `portfolio-design-system`, `portfolio/*`, registry.

## Tests

```bash
node cli/test/run-tests.js
```

## Giới hạn v0.1

- Không sync versioned portfolio → app
- Không sửa file tồn tại khi create
- Không chứng minh Cursor runtime activation (chỉ kiểm tra tĩnh)