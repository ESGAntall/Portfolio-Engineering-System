---
name: codebase-graph
description: Code graph cho impact analysis — Graphify ưu tiên trên app repos (O-002 reference); kiểm tra tồn tại/stale; fallback map/search; cập nhật manifest thực tế.
---

# Codebase Graph

## Mục đích

Impact analysis với **source code là source of truth**. Graph (ưu tiên **Graphify** khi đã tích hợp) là chỉ mục hỗ trợ — có thể absent, stale, hoặc thay bằng fallback.

Policy: `docs/reference/O-002-codebase-graph.md`.

## Khi nào kích hoạt

- Refactor/rename cross-module, đổi public API, xóa module.
- Task lớn cần boundary/dependency map.
- Sau merge lớn — kiểm tra graph còn hợp lệ.

## Khi nào không kích hoạt

- Thay đổi module độc lập, requirement rõ (task nhỏ).
- Repository **không có application source** (chỉ docs/config) → fallback only; không đề xuất Graphify.

## Input

- Repo root, phạm vi (symbol, folder, feature).
- `docs/architecture/code-graph.md`, `.cursor/code-graph-manifest.json` nếu có.

## Quy trình (tóm tắt)

1. **Repo có source?** Không → search-only / architecture map.
2. **Graph tồn tại?** Manifest + `code-graph.md` + tool index nếu có.
3. **Stale?** So metadata với HEAD; spot-check.
4. **Graphify** — chỉ khi có source + user/task cần; kiểm tra Python/uv/pipx trước đề xuất cài.
5. **Fallback** — project map, symbol search (citation), dependency analysis.
6. **Impact** — bảng component | vai trò | rủi ro | test.
7. **Update** — manifest sau refresh thành công; **không** xóa graph cũ trước verify graph mới.

## Output bắt buộc

- Trạng thái: `present | absent | stale | unknown`
- Nguồn + mức tin cậy
- Impact summary có citation khi có

## Phối hợp

- `requirement-orchestrator`, `engineering-workflow`, `quality-gate`