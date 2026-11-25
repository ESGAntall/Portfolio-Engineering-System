# ADR O-002: Codebase Graph

## Status

Accepted

## Context

Cần impact analysis và navigation codebase trong app repos mà không coi graph là luôn có hoặc luôn đúng.

## Decision

**Graphify** là công cụ **ưu tiên mặc định** cho **application repositories** có source code.

Ràng buộc và hành vi:

- **Không** cài Graphify trong `portfolio-engineering-system` (meta, không app source).
- Chỉ tích hợp Graphify khi **khởi tạo project có source code**.
- Trước khi đề xuất cài: kiểm tra **Python**, **uv/pipx** và môi trường; không assume đã cài.
- **Không** giả định graph tồn tại hoặc luôn mới — luôn chạy checklist tồn tại/stale (skill `codebase-graph`).
- **Source code** luôn là source of truth; graph là chỉ mục phụ trợ.
- **Fallback**: project map, symbol search, dependency analysis thủ công/có kiểm chứng.
- Cập nhật `.cursor/code-graph-manifest.json` theo **kết quả thực tế** (query/refresh đã chạy).
- Tài liệu hóa query và refresh trong `docs/architecture/code-graph.md`.
- **Không** tự động xóa graph/index cũ trước khi xác minh graph mới hợp lệ.

## Consequences

- Skill `codebase-graph` mô tả Graphify-first + fallback + manifest.
- Template manifest có trường `generator` / Graphify metadata khi adopt.
- Portfolio meta repo không có graph artifact bắt buộc.