---
name: quality-gate
description: Evidence-based done/ship/merge/release — checklist theo phạm vi; PASS, BLOCKED, NOT RUN. Dùng khi user báo done, ship, merge, release, hoàn thành tính năng, hoặc báo cáo implementation.
---

# Quality Gate

## Mục đích

Hoàn thành có **bằng chứng**, phù hợp **phạm vi** — trong **application repository**.

Trigger: rule `10-workflow-and-approval.mdc`.

## Khi nào kích hoạt

- User: done, ship, merge, release, hoàn thành tính năng, báo cáo kết quả implementation.
- Kết thúc slice `engineering-workflow`.

## Khi nào không kích hoạt

- Giữa chừng implement.
- Chỉ brainstorm/plan.
- Thay đổi **portfolio meta repository** (rules/skills/registry toàn portfolio) → dùng checklist trong rule `90-portfolio-meta-local.mdc` **trong meta repo**, không skill này.

## Input

- Task nhỏ | lớn (từ phạm vi).
- AC / diff thực tế.
- Lệnh verify: `docs/testing/`, CI, rule `30-quality-gates.mdc`.

## Checklist theo phạm vi

### Task nhỏ

- Scope vs AC; verify **liên quan**; không bắt buộc full suite trừ critical path.

### Task lớn / ship / release

- Trên + regression (`docs/product/` / user), CI trong scope, docs/CHANGELOG theo policy.

### Không liên quan → bỏ qua

- Ví dụ chỉ doc → không ép e2e.

## Trạng thái

**PASS** | **BLOCKED** | **NOT RUN** — NOT RUN không được coi là PASS.

Verdict **PASS** chỉ khi mọi item bắt buộc cho scope là PASS.

## Output

- Bảng gate | status | evidence.
- Verdict + debt/blocker.