# Shared skills (O-001)

**Source of truth:** `portfolio-engineering-system/.cursor/skills/`

## Cách dùng

1. **Copy** toàn bộ thư mục skills từ portfolio repo vào `.cursor/skills/` tại app repo khi bootstrap.
2. Mỗi app **độc lập** sau copy; tùy chỉnh skill local nếu cần (không bị sync tương lai ghi đè — xem ADR O-001).
3. **Không** mirror vào `~/.cursor/skills/`.

## Sync tương lai

Versioned sync script (planned, chưa triển khai) sẽ merge rules/skills portfolio → app mà **bỏ qua** `99-project-local.mdc` và paths local đã khai báo.

Cursor load skills qua `name` + `description` trong từng `SKILL.md`.

Không dùng `~/.cursor/skills-cursor/` (reserved).