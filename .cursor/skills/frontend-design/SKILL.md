---
name: frontend-design
description: Thiết kế và chỉnh UI cụ thể theo hybrid system — parity tính năng, art direction product, a11y baseline. Dùng khi screen/component/flow UI, redesign, hoặc implement giao diện.
---

# Frontend Design

## Mục đích

Quyết định UI **product layer** (layout, components, states) tuân baseline và art direction của repo này.

## Khi nào kích hoạt

- Screen mới, redesign component, flow wizard/form.
- Pattern empty/loading/error/success.
- User nói UI, UX, layout, responsive, accessibility cho feature cụ thể.

## Khi nào không kích hoạt

- Chỉ sửa baseline reference `docs/reference/design-principles.md` cho toàn portfolio → làm trong **portfolio meta repo** với skill `portfolio-design-system` (không phân phối cho app).
- Backend-only, không có surface UI.
- Task lớn chưa plan → `requirement-orchestrator` trước.

## Input

- User goal và màn hình/luồng hiện tại.
- `docs/design-system/` (product).
- `docs/reference/design-principles.md` (baseline).

## Quy trình

1. **Parity check** — Hành vi UI hiện có phải giữ.
2. **Constraints** — Platform, density, locale.
3. **Pattern pick** — Từ `docs/design-system/`; thiếu → đề xuất + ghi doc.
4. **States** — Default, loading, empty, error, disabled, focus (a11y).
5. **Implementation note** — Stack **thực tế của repo**; không đổi stack.
6. **Visual QA** — Breakpoint, keyboard, contrast.

## Output

- Cấu trúc UI, state matrix, delta redesign, doc paths cập nhật.

## Phối hợp

- `engineering-workflow`, `quality-gate`