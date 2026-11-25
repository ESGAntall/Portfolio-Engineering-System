# Code graph

Policy: [docs/reference/O-002-codebase-graph.md](../reference/O-002-codebase-graph.md). Chi tiết vận hành: file này + `.cursor/code-graph-manifest.json`.

## Policy

- **Source code** = source of truth.
- **Graphify** = công cụ ưu tiên khi project **đã có source** (không bắt buộc ngay sau copy template).
- Không giả định graph tồn tại hoặc luôn mới.
- Fallback: project map, symbol search, dependency analysis (skill `codebase-graph`).

## Query

_(Điền sau khi Graphify hoặc công cụ khác được setup — ví dụ: MCP prompts, CLI, path index.)_

## Refresh

1. Kiểm tra Python, uv/pipx nếu dùng Graphify (trước khi cài).
2. Chạy refresh theo toolchain đã chọn.
3. **Verify** graph mới (spot-check symbols/paths).
4. Chỉ sau verify: cập nhật `.cursor/code-graph-manifest.json` (`generatedAt`, `commit`, `generator`, `graphify.refreshVerifiedAt`).
5. **Không** xóa graph/index cũ trước bước verify.

## Freshness

- _(vd. regen sau release hoặc khi đụng cross-module — điền theo team)_

## Scope

- Roots: _(điền, vd. src/)_
- Excluded: _(generated, vendor, …)_