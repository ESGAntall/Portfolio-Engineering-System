# Engineering Standards (Portfolio)

Áp dụng cho **mọi repository ứng dụng** trừ khi ADR project ghi override có lý do.

Tham chiếu ADR meta: [docs/decisions/](../docs/decisions/README.md).

Chuẩn **workflow/rules/skills** (O-001–O-003) là portfolio-wide. **Stack, backend, database** là **project-specific** — xem các mục dưới.

## Repository independence

- `portfolio-engineering-system` và **mỗi** application repository là **Git repository riêng biệt**.
- Portfolio repo: chuẩn engineering, Cursor rules/skills, template, registry, `portfolio/*.md` và tài liệu meta được **track** trong repo portfolio.
- Application repo: source code, docs cục bộ, cấu hình cục bộ, **`.gitignore` riêng** (template generic + adapt stack).
- **`portfolio/project-specs/<id>/`**: specifications và scaffold plan do portfolio **track** (không phải source app).
- **Root `projects/<id>/`** (tùy chọn): workspace local cho clone repo app — **gitignored** (`/projects/`). Clone có thể ở path khác trên máy dev.
- Phân phối rules/skills/template theo [O-001](../docs/decisions/O-001-skills-and-rules-distribution.md) — **copy**, không runtime dependency chéo repo.
- **Không** giả định mọi clone nằm chung parent directory trên disk.
- **Không** import/run code giữa repos; liên kết chỉ qua tài liệu, registry URL, và quy trình copy/sync (khi có).

## Backend & data (project-specific)

- **Không** có kiến trúc backend bắt buộc cho toàn portfolio.
- Mỗi project quyết định **độc lập** trong phân tích requirement/kiến trúc có cần backend hay không.
- Nếu cần backend: chọn framework, database, auth, deploy, hạ tầng theo **requirement thực tế** của project đó (ADR trong repo app).
- **Không** ép Node.js, Express, NestJS, hay database cụ thể lên mọi project.
- **Không** suy rộng ràng buộc của **một** project (vd. NOTEAI: app data `localStorage` + Managed AI Runtime riêng cho Gemini) thành rule portfolio — chi tiết NOTEAI tại [project-specs/noteai/](project-specs/noteai/README.md).

## Technology strategy (directions, not mandates)

Portfolio hướng tới kỹ năng thực tế trong hệ sinh thái web/app hiện đại. Các hướng **tham khảo**, **không** bắt buộc cho mọi repo:

| Hướng | Ví dụ (không exhaustive) |
|-------|----------------------------|
| Frontend | React, Next.js và framework web liên quan |
| Backend (khi project cần) | Node.js, Express, NestJS |
| Systems / performance | Rust |
| Backend / cloud services | Golang |
| Desktop / mobile / cross-platform | Framework phù hợp từng sản phẩm |
| Data & infra (khi project cần) | PostgreSQL, MongoDB, Redis, Docker, … |

**Chọn công nghệ** cân nhắc: (1) product requirements, (2) technical fit, (3) performance/scalability, (4) security/maintainability, (5) market relevance, (6) learning & portfolio value.

**Không** thêm stack chỉ để “đủ công nghệ” trên giấy. Ghi lựa chọn trong `docs/architecture/` và ADR của **repo app**.

## Workflow

- Hybrid: task nhỏ/lớn theo **risk & impact** — [O-003](../docs/decisions/O-003-task-classification.md) (gồm UI một surface + clarification field/data), rule `10-workflow-and-approval.mdc`.
- Điểm vào: skill `requirement-orchestrator`.
- Báo **done / ship / merge / release / hoàn thành / báo cáo implementation** → skill `quality-gate` (trigger rule 10; checklist rule `30-quality-gates.mdc`).

## Git ignore policy

| Repo | Policy |
|------|--------|
| **Portfolio** | `/projects/` — local child clones không được track. `portfolio/project-specs/` **được** track. Tạm thời `/portfolio/projects/` vẫn gitignored nếu clone legacy còn trên disk — bỏ rule khi không còn clone ở path đó. |
| **Application** | Ship `project-template/.gitignore`; adapt theo `docs/engineering/gitignore.md` trước install/build. |

Child repo **history và remote** độc lập; portfolio không track app source.

## Project specs vs local clones

| | `portfolio/project-specs/<id>/` | `projects/<id>/` (optional) |
|--|--------------------------------|-----------------------------|
| Nội dung | Specs, constraints, scaffold plan | Git clone (source, `.git`, LICENSE, …) |
| Portfolio Git | **Track** | **Ignore** |
| Remote app | Link trong registry | `origin` của repo app |

## Repository layout (app)

- Tối thiểu theo `project-template/`: docs/product, architecture, design-system, decisions, testing, engineering (gitignore bootstrap).
- ADR cho quyết định kiến trúc đáng kể.

## Code change

- Diff tối thiểu; khớp convention hiện có.
- Không đổi stack/framework vì tiện agent.
- Long-running / I/O: không block UI (desktop) hoặc pattern async phù hợp platform.

## Verification

- Lệnh verify trong `docs/testing/README.md`.
- Skill `quality-gate`: scope theo task nhỏ/lớn; trạng thái **PASS | BLOCKED | NOT RUN** — không gọi NOT RUN là PASS.
- Rule `30-quality-gates.mdc`: glob kích hoạt khi làm việc với source/test/CI phổ biến (xem rule file).

## Rules & skills distribution — [O-001](../docs/decisions/O-001-skills-and-rules-distribution.md)

- Portfolio repo = **source of truth** cho `.cursor/rules/` và `.cursor/skills/` chuẩn.
- App mới: **COPY** qua Local CLI `node cli/bin/portfolio.js create` (v0.1) hoặc thủ công tương đương — `project-template/` + rules/skills + canonical `docs/reference/`; manifest `.portfolio/manifest.json`.
- Project chạy **độc lập** sau copy.
- **Versioned sync script**: planned, chưa triển khai; khi có, sync **không ghi đè** tùy biến local (`99-project-local.mdc`, skills/rules chỉnh riêng).
- **Không** mirror skills vào `~/.cursor/skills/`.

## Code intelligence (graph) — [O-002](../docs/decisions/O-002-codebase-graph.md)

- **Graphify** ưu tiên mặc định cho **app repos có source**; không cài trong portfolio meta repo.
- Trước đề xuất cài Graphify: kiểm tra Python, uv/pipx, môi trường.
- Source code = source of truth; graph có thể absent/stale.
- Fallback: project map, symbol search, dependency analysis.
- Manifest `.cursor/code-graph-manifest.json` + `docs/architecture/code-graph.md` (query/refresh thực tế).
- Không xóa graph cũ trước khi verify graph mới.
- Skill `codebase-graph` là quy trình chuẩn.

## UI rules

- Rule `20-ui-ux-system.mdc`: source UI globs + `docs/design-system/`; framework khác → glob trong `99-project-local.mdc`.

## Decisions index (portfolio meta)

| ID | Chủ đề | Trạng thái |
|----|--------|------------|
| O-001 | Copy + future versioned sync; repo-only skills | Accepted |
| O-002 | Graphify preferred; fallbacks; no install in meta repo | Accepted |
| O-003 | Risk/impact task classification | Accepted |