# `.gitignore` bootstrap (bắt buộc)

Mỗi application repository **phải** có root `.gitignore`. Template ship file mặc định tại repo root (copy từ `project-template/.gitignore`).

## Workflow bắt buộc (Agent / dev)

Thực hiện **trước** `npm install`, `pip install`, build, hoặc generate artifacts:

1. **Inspect stack** — framework, language, package manager, test runner, CI (sau khi user/project xác định).
2. **Inspect tooling** — build output dirs, cache dirs, IDE files đã xuất hiện hoặc sẽ xuất hiện.
3. **Create or update** root `.gitignore` (giữ block generic từ template; merge, không xóa bừa).
4. **Add stack-specific rules only when applicable** (vd. `target/` cho Rust, `.venv/` cho Python).
5. **Preserve** rules generic đã có; tránh pattern rộng (`*`, ignore `src/`) có thể che source.
6. **Verify** against cấu trúc thật: `git status`, không ignore lockfile, config, `docs/`, `.env.example`.
7. **Report** trong PR hoặc handoff: rule nào generic vs stack-specific (bullet ngắn).

Không coi bước này là tùy chọn trong project bootstrap.

## Generic vs stack-specific

| Loại | Ví dụ trong template |
|------|----------------------|
| Generic | `node_modules/`, `dist/`, `.env` / `.env.*`, `!.env.example`, OS/IDE local, `coverage/` |
| Stack-specific | Commented hints: `target/`, `.next/`, `__pycache__/`, … — bỏ comment khi dùng stack |

## Portfolio relationship

- App repo là Git repo **độc lập**; history/remote không thuộc portfolio meta repo.
- Clone app vào `projects/<id>/` (hoặc path khác) — portfolio `.gitignore` có `/projects/`; không commit nhầm child repo vào portfolio.