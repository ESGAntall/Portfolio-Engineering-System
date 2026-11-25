# Architecture

- Context diagram (khi có hệ thống)
- Module boundaries và dependency rules
- External services và trust boundaries

## Backend, database, framework

- **Không** bắt buộc backend hoặc database — quyết định theo requirement **repo này** (ADR `docs/decisions/`).
- Portfolio `engineering-standards.md` (mục Technology strategy) là **hướng tham khảo**; **không** mandate stack cho repo này.
- Ghi rõ: có/không backend, persistence, auth, deploy — theo sản phẩm thực tế.

## Code graph (tùy chọn)

Tạo `code-graph.md` tại đây mô tả:

- Công cụ hoặc quy trình refresh index (nếu dùng)
- Liên kết tới `.cursor/code-graph-manifest.json`
- Ai chịu trách nhiệm cập nhật sau refactor lớn

Không giả định plugin cụ thể đã cài.