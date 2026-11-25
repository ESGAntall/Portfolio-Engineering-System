---
name: quality-gate
description: Evidence-based done/ship/merge/release — checklist theo phạm vi task nhỏ/lớn; PASS, BLOCKED, NOT RUN. Dùng khi user báo done, ship, merge, release, hoàn thành tính năng, hoặc báo cáo kết quả implementation.
---

# Quality Gate

## Mục đích

Hoàn thành có **bằng chứng**, phù hợp **phạm vi** thay đổi — không checklist toàn repo cho task cục bộ.

Trigger cũng từ rule `10-workflow-and-approval` (báo cáo hoàn thành).

## Khi nào kích hoạt

- User: done, ship, merge, release, hoàn thành tính năng, báo cáo kết quả implementation (hoặc tương đương).
- Kết thúc slice `engineering-workflow`.
- Thay đổi rule/skill/doc portfolio (consistency gate).

## Khi nào không kích hoạt

- Giữa chừng implement.
- Chỉ brainstorm/plan (orchestrator phase).

## Input

- Classification task **nhỏ** | **lớn** (hoặc suy từ phạm vi).
- AC / diff thực tế.
- Lệnh verify: `docs/testing/`, CI, rule `30-quality-gates.mdc`.

## Checklist theo phạm vi

### Task nhỏ

- Scope recap vs AC.
- Chạy verify **liên quan** (lint/test/build document cho phần đụng).
- Không bắt buộc full regression suite trừ khi thay đổi đụng critical path.

### Task lớn / ship / release

- Trên, cộng regression (product doc / user), CI nếu trong scope, docs/CHANGELOG theo policy.

### Không liên quan → bỏ qua

- Ví dụ: chỉ sửa markdown portfolio → không chạy e2e app; vẫn NOT RUN hoặc manual check nếu cần.

## Trạng thái (bắt buộc)

| Status | Ý nghĩa |
|--------|---------|
| **PASS** | Đã chạy/kiểm với evidence (command output, cite kiểm tra) |
| **BLOCKED** | Đã chạy, fail, hoặc thiếu điều kiện ship |
| **NOT RUN** | Chưa thực hiện — **không** coi là PASS |

Verdict tổng: **PASS** chỉ khi mọi item **bắt buộc cho scope** là PASS; có BLOCKED → verdict blocked; NOT RUN trên item bắt buộc → không verdict PASS.

## Quy trình

1. Scope recap + phân loại nhỏ/lớn.
2. Liệt kê gate items **phù hợp scope** (không liệt kê thừa).
3. Chạy hoặc đánh dấu NOT RUN có lý do.
4. Regression/docs nếu scope yêu cầu.
5. Bảng: gate item | status | evidence.
6. Verdict + debt/blocker.

## Output bắt buộc

- Bảng gate với PASS | BLOCKED | NOT RUN.
- Không tuyên bố PASS cho kiểm tra chưa thực hiện.

## Phối hợp

- Fail → `engineering-workflow` hoặc debug.
- Impact chưa cover → `codebase-graph` / thêm test.