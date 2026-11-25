---
name: portfolio-design-system
description: Duy trì lớp design chung portfolio — principles, shared patterns, token guidelines — không thay art direction từng app. Dùng khi chuẩn hóa cross-app hoặc cập nhật portfolio/design-principles và template design-system.
---

# Portfolio Design System

## Mục đích

Định nghĩa **lớp chung** (accessibility, spacing rhythm, typography scale logic, feedback patterns) để các app **kế thừa có chọn lọc**, không đồng nhất visual.

## Khi nào kích hoạt

- Sửa `portfolio/design-principles.md` hoặc template `docs/design-system/` trong `project-template`.
- Đồng bộ pattern (form error, toast, modal focus trap) giữa nhiều app.
- User hỏi "chuẩn portfolio" cho UI.

## Khi nào không kích hoạt

- Chỉ một màn hình trong một app → `frontend-design`.
- Implement code component trong app cụ thể → `engineering-workflow` (+ `frontend-design` nếu cần).

## Input cần thiết

- Phạm vi: portfolio-wide hay chỉ template/docs.
- Danh sách app bị ảnh hưởng (từ registry) nếu đổi chuẩn bắt buộc.
- Art direction conflicts đã biết.

## Quy trình từng bước

1. **Gap analysis** — So principles hiện tại vs nhu cầu; ghi open questions.
2. **Layering** — Tách "must" (a11y, focus) vs "should" (spacing) vs "product-only".
3. **Doc update** — `portfolio/design-principles.md` + template stubs.
4. **Adoption note** — Hướng dẫn app merge vào `docs/design-system/` local không xóa brand.
5. **Approval** — Thay đổi "must" cần user approve (portfolio-level).

## Output bắt buộc

- Diff tài liệu rõ ràng (must/should/product).
- Migration note cho app repos (bullet, không ép deadline).
- Open decisions → `portfolio/engineering-standards.md` hoặc ADR portfolio nếu tạo sau này.

## Điều kiện hoàn thành

- Không contradict hybrid rule (art direction riêng).
- Template và portfolio doc đồng bộ.

## Phối hợp skill khác

- `requirement-orchestrator` — khi đổi chuẩn ảnh hưởng nhiều repo.
- `frontend-design` — app áp dụng xuống screen.
- `quality-gate` — a11y checklist cập nhật trong `docs/testing/` template.