---
name: requirement-orchestrator
description: Điểm vào phân tích và điều phối task — phân loại scope, route skill/rule, không tự triển khai mọi loại công việc. Dùng khi yêu cầu mơ hồ, task lớn, đa module, redesign, hoặc cần approval trước implement.
---

# Requirement Orchestrator

## Mục đích

Chuẩn hóa **đầu vào** task: hiểu mục tiêu, phân loại (nhỏ/lớn), chọn hướng xử lý và skill phù hợp. **Không** thay thế implementation skill và **không** tự code toàn bộ pipeline.

## Khi nào kích hoạt

- User mô tả feature/epic/refactor/redesign mà chưa có kế hoạch.
- Touch nhiều module hoặc không rõ scope.
- Cần phân tích impact trước khi sửa.
- User nói "plan", "phân tích", "điều phối", hoặc task vượt ngưỡng workflow rule.
- Thêm field/data chưa rõ persistent vs runtime.

## Khi nào không kích hoạt

- Thay đổi cục bộ đã rõ (data model đã classify) → `engineering-workflow`.
- User đã approve plan và chỉ thực thi bước N → `engineering-workflow`.
- Chỉ hỏi read-only.

## Input cần thiết

| Input | Bắt buộc | Ghi chú |
|-------|----------|---------|
| Mục tiêu user | Có | Paraphrase lại để xác nhận |
| Project identity | Khuyến nghị | `docs/reference/project-context.md`, `README.md` |
| Ràng buộc | Khuyến nghị | Hỏi nếu thiếu và ảnh hưởng classify |
| Phạm vi tính năng hiện tại | Task lớn/UI | Parity khi redesign (`docs/product/`) |

## Clarify — field / data model

Khi user thêm field như `updatedAt`, `createdAt`, `status`, `lastViewedAt`:

1. Xác định: **persistent** | **runtime-only** | **derived/computed**.
2. Chưa rõ và có thể đụng **schema** hoặc **data contract** → **hỏi user** hoặc liệt kê **assumption**.
3. Persistent/contract impact mà chưa confirm → **không** classify nhỏ.

**Không** coi nhỏ chỉ vì thay đổi nằm trong một file.

## Quy trình từng bước

1. **Clarify** — Goal, out-of-scope, assumptions; field/data nếu áp dụng.
2. **Classify** — Rule `10` + `docs/reference/O-003-task-classification.md`.
3. **Discover context** — README, `docs/product/`, `docs/decisions/`; map code → `codebase-graph` khi cần.
4. **Route** — UI → `frontend-design`; done/ship → `quality-gate`.
5. **Plan (task lớn)** — Analysis, plan, verification criteria; **dừng** chờ approval.
6. **Handoff (task nhỏ)** — AC ngắn; route `engineering-workflow`.

## Output bắt buộc

- **Classification**: nhỏ | lớn + lý do.
- **Recommended path**: skill/rule có thứ tự.
- **Task lớn**: plan + verification criteria + "chờ phê duyệt".
- **Task nhỏ**: AC tối đa ~5 bullet.

## Phối hợp skill khác

| Skill | Vai trò |
|-------|---------|
| `codebase-graph` | Impact / dependency |
| `engineering-workflow` | Sau approval |
| `frontend-design` | UI/UX |
| `quality-gate` | Done/ship/merge (rule 10) |

**Orchestrator không** chạy thay toàn bộ skill trên trong một lượt trừ khi user yêu cầu từng phase.