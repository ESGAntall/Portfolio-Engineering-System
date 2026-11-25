# Project-facing reference (portable)

Tài liệu **trong application repository** — không cần mở portfolio meta repo.

| File | Nguồn | Mục đích |
|------|--------|----------|
| [design-principles.md](design-principles.md) | **Curated snapshot** (authoring: `portfolio/design-principles.md` trong meta repo) | Baseline UI/UX cho rule 20, skill `frontend-design` — cùng policy §1–§6, **không** bắt buộc byte-identical |
| [O-003-task-classification.md](O-003-task-classification.md) | Engineering decision O-003 (reference) | Task nhỏ/lớn — rule 10, orchestrator |
| [O-002-codebase-graph.md](O-002-codebase-graph.md) | Engineering decision O-002 (reference) | Code graph — skill `codebase-graph` |
| [project-context.md](project-context.md) | Project-local | Registry link, remote URL — điền khi bootstrap |

ADR gốc O-001–O-003 nằm trong portfolio meta repo; bản **reference** này chỉ chứa nội dung cần cho app.

**Design principles:** SoT chỉnh sửa = `portfolio/design-principles.md` (gồm hướng dẫn Cursor meta). File trong thư mục này = snapshot phân phối cho application repos (CLI `create`); đồng bộ §1–§6 thủ công sau khi đổi authoring — không auto-sync.