# Codebase graph (reference — O-002)

**Project-facing reference** derived from portfolio engineering decision **O-002**. Áp dụng trong **application repository có source code**.

## Decision summary

- **Graphify** ưu tiên khi project có source và user đồng ý tích hợp.
- Trước đề xuất cài: kiểm tra **Python**, **uv/pipx**, môi trường.
- **Source code** = source of truth; graph có thể absent/stale.
- **Fallback**: project map (`docs/architecture/`), symbol search, dependency analysis có kiểm chứng.
- Cập nhật `.cursor/code-graph-manifest.json` và `docs/architecture/code-graph.md` theo kết quả **thực tế**.
- **Không** xóa graph/index cũ trước khi verify graph mới hợp lệ.

## Repository không có application source

Repo chỉ docs/skills/rules mà không có app source → không đề xuất cài Graphify; dùng fallback (skill `codebase-graph`).

## Skill

Quy trình chi tiết: skill `codebase-graph`.