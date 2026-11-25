---
name: portfolio-design-system
description: "PORTFOLIO META ONLY — không phân phối cho application repos. Duy trì portfolio/design-principles, template design-system, cross-app patterns. Dùng khi sửa chuẩn design portfolio hoặc project-template trong meta repo."
---

# Portfolio Design System

**Distribution:** `PORTFOLIO_ONLY` (D-02). Child application repositories dùng `docs/reference/design-principles.md` + `frontend-design`.

Chỉ kích hoạt khi workspace là **portfolio-engineering-system** (xem rule `90-portfolio-meta-local.mdc`).

## Mục đích

Định nghĩa **lớp chung** portfolio (accessibility, spacing logic, feedback patterns) — không thay art direction từng app.

## Khi nào kích hoạt

- Sửa `portfolio/design-principles.md` (đồng bộ `docs/reference/design-principles.md`; app nhận bản qua CLI `create`).
- Sửa template `project-template/docs/design-system/`.
- Đồng bộ pattern cross-app.

## Khi nào không kích hoạt

- UI một màn hình trong **app repo** → `frontend-design`.
- Implement component trong app → `engineering-workflow`.

## Quy trình (tóm tắt)

1. Gap analysis vs `portfolio/design-principles.md`.
2. Layering: must / should / product-only.
3. Cập nhật `portfolio/design-principles.md`; đối chiếu **§1–§6** từng section với `docs/reference/design-principles.md` (semantic parity, portable paths, không đưa meta-only vào snapshot).
4. Cập nhật template stubs khi cần (không duplicate policy ref trong template).
5. Adoption note cho app repos (không ép deadline); **không** sửa repo app đã bootstrap trừ khi user yêu cầu.
6. Thay đổi "must" → user approve.

## Output

- Diff docs, migration note, open questions → ADR meta `docs/decisions/` nếu cần.