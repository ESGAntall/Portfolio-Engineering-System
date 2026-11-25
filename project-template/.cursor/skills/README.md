# Shared skills (O-001)

**Canonical source (bootstrap):** portfolio meta repo `.cursor/skills/` — runtime chỉ dùng bản đã copy trong app repo.

## Cách dùng

1. **Copy** skills từ portfolio `.cursor/skills/` **trừ** `portfolio-design-system` (portfolio meta only).
2. Mỗi app **độc lập** sau copy; tùy chỉnh skill local nếu cần (không bị sync tương lai ghi đè — xem ADR O-001).
3. **Không** mirror vào `~/.cursor/skills/`.

## Sync tương lai

Versioned sync script (planned, chưa triển khai) sẽ merge rules/skills portfolio → app mà **bỏ qua** `99-project-local.mdc` và paths local đã khai báo.

Cursor load skills qua `name` + `description` trong từng `SKILL.md`.

Không dùng `~/.cursor/skills-cursor/` (reserved).