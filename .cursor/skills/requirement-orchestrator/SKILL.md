---
name: requirement-orchestrator
description: Điểm vào phân tích và điều phối task portfolio — phân loại scope, gợi ý skill/rule tiếp theo, không tự triển khai mọi loại công việc. Dùng khi yêu cầu mơ hồ, task lớn, đa module, redesign, hoặc cần approval trước implement.
---

# Requirement Orchestrator

## Mục đích

Chuẩn hóa **đầu vào** task: hiểu mục tiêu, phân loại (nhỏ/lớn), chọn hướng xử lý và skill phù hợp. **Không** thay thế implementation skill và **không** tự code toàn bộ pipeline.

## Khi nào kích hoạt

- User mô tả feature/epic/refactor/redesign mà chưa có kế hoạch.
- Không rõ thuộc repo nào hoặc touch nhiều module.
- Cần phân tích impact trước khi sửa.
- User nói "plan", "phân tích", "điều phối", hoặc task vượt ngưỡng workflow rule.
- Thêm field/data chưa rõ persistent vs runtime (xem bước Clarify).

## Khi nào không kích hoạt

- Thay đổi cục bộ đã rõ (gồm **data model đã classify**) → `engineering-workflow`.
- User đã approve plan và chỉ thực thi bước N → `engineering-workflow`.
- Chỉ hỏi read-only.

## Input cần thiết

| Input | Bắt buộc | Ghi chú |
|-------|----------|---------|
| Mục tiêu user | Có | Paraphrase lại để xác nhận |
| Repository / app | Có nếu multi-repo | `portfolio/portfolio-registry.md` |
| Ràng buộc | Khuyến nghị | Hỏi nếu thiếu và ảnh hưởng classify |
| Phạm vi tính năng hiện tại | Task lớn/UI | Parity khi redesign |

## Clarify — field / data model

Khi user thêm field như `updatedAt`, `createdAt`, `status`, `lastViewedAt` (hoặc tương tự):

1. Xác định: **persistent** (DB/storage/API contract) | **runtime-only** | **derived/computed**.
2. Chưa rõ và có thể đụng **schema** hoặc **data contract** → **hỏi user** hoặc liệt kê **assumption** trước classify/implement.
3. Persistent/contract impact mà chưa confirm → **không** classify nhỏ; có thể task lớn.

**Không** coi nhỏ chỉ vì thay đổi nằm trong một file.

## Quy trình từng bước

1. **Clarify** — Goal, out-of-scope, assumptions; gồm bước field/data nếu áp dụng.
2. **Classify** — Rule `10` + ADR `O-003` (risk/impact; UI một surface — tiêu chí regression O-003; **không** dùng số file làm tiêu chí duy nhất).
3. **Discover context** — README, `docs/product/`, ADR; map code → `codebase-graph` khi cần.
4. **Route** — UI → design skills; báo done/ship → `quality-gate`.
5. **Plan (task lớn)** — Analysis, plan, **verification criteria**; **dừng** chờ approval.
6. **Handoff (task nhỏ)** — AC ngắn; route `engineering-workflow`.

## Output bắt buộc

- **Classification**: nhỏ | lớn + lý do.
- **Recommended path**: skill/rule có thứ tự.
- **Task lớn**: plan + verification criteria + "chờ phê duyệt".
- **Task nhỏ**: AC tối đa ~5 bullet.

## Điều kiện hoàn thành

- Bước kế tiếp rõ.
- Không implement đáng kể khi task lớn chưa approve.
- Assumption quan trọng được liệt kê.

## Phối hợp skill khác

| Skill | Vai trò |
|-------|---------|
| `codebase-graph` | Impact / dependency |
| `engineering-workflow` | Sau approval |
| `frontend-design`, `portfolio-design-system` | UI/UX |
| `quality-gate` | Done/ship/merge (rule 10) |

**Orchestrator không** chạy thay toàn bộ skill trên trong một lượt trừ khi user yêu cầu từng phase.