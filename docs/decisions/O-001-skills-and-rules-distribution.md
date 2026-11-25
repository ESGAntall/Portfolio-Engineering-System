# ADR O-001: Skills and Rules Distribution

## Status

Accepted

## Context

Portfolio cần một cách phân phối Cursor rules/skills tới nhiều application repository độc lập, với nguồn chuẩn duy nhất và khả năng tùy biến local.

## Decision

**COPY + VERSIONED SYNC SCRIPT (tương lai).**

- `portfolio-engineering-system` là **source of truth** cho rules/skills portfolio.
- Project mới nhận rules/skills qua **`project-template/`** (copy vào app repo khi bootstrap).
- Mỗi project **hoạt động độc lập** sau copy (không phụ thuộc submodule để chạy Cursor).
- Thiết kế **script đồng bộ phiên bản** sẽ được thêm sau; **không** triển khai script trong giai đoạn BUILD FOUNDATION / ADR này.
- Sync tương lai **không ghi đè** file project-local (vd. `99-project-local.mdc`, skill chỉnh riêng app).

## Skills cá nhân

Phân phối **repository-only**: không mirror portfolio skills vào `~/.cursor/skills/`.

## Consequences

- App README ghi nguồn copy và (sau này) lệnh sync + version portfolio đã sync.
- Submodule/subtree **không** là chuẩn; chỉ dùng nếu ADR project override.
- Template và `portfolio/engineering-standards.md` phản ánh copy-first.