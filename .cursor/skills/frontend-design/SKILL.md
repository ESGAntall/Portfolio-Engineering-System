---
name: frontend-design
description: Thiết kế và chỉnh UI cụ thể theo hybrid system — parity tính năng, art direction product, a11y baseline. Dùng khi screen/component/flow UI, redesign cục bộ, hoặc implement giao diện (mọi framework).
---

# Frontend Design

## Mục đích

Dẫn dắt **quyết định UI ở tầng product** (layout, component usage, states) trong khi tuân baseline portfolio và art direction của app.

## Khi nào kích hoạt

- Screen mới, redesign component, flow wizard/form.
- Chọn pattern: empty/loading/error/success.
- User nói UI, UX, layout, responsive, accessibility cho feature cụ thể.

## Khi nào không kích hoạt

- Chỉ cập nhật token/tài liệu dùng chung portfolio → `portfolio-design-system`.
- Backend-only, CLI, không có surface UI.
- Task lớn chưa plan → `requirement-orchestrator` trước.

## Input cần thiết

- User goal và màn hình/luồng hiện tại (hoặc wireframe).
- `docs/design-system/` và art direction note của project.
- `portfolio/design-principles.md` (baseline).

## Quy trình từng bước

1. **Parity check** — Liệt kê hành vi UI hiện có phải giữ.
2. **Constraints** — Platform (web/desktop/mobile), density, locale nếu có.
3. **Pattern pick** — Chọn từ design-system doc; nếu thiếu pattern → đề xuất + ghi doc.
4. **States** — Default, loading, empty, error, disabled, focus (a11y).
5. **Implementation note** — Gợi ý cấu trúc component phù hợp stack **thực tế của repo** (không đổi stack).
6. **Visual QA** — Tiêu chí kiểm tra (breakpoint, keyboard, contrast) theo project capability.

## Output bắt buộc

- Mô tả cấu trúc UI (có thể bullet hierarchy).
- State matrix ngắn.
- Delta so với UI cũ (nếu redesign).
- Cập nhật doc đề xuất (path cụ thể).

## Điều kiện hoàn thành

- Không mất hành vi đã commit parity list trừ khi user đồng ý.
- Pattern mới hoặc lệch design-system được documented.

## Phối hợp skill khác

- `portfolio-design-system` — khi thay đổi lan sang token/primitive chung.
- `engineering-workflow` — implement sau khi UI quyết định rõ.
- `quality-gate` — visual/regression checklist trong `docs/testing/`.