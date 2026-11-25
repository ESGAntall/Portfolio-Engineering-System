---
name: engineering-workflow
description: Thực thi slice có kiểm soát sau khi task đã được classify và (nếu lớn) đã approve — đọc repo, implement tối thiểu, verify, handoff. Dùng khi plan đã có hoặc task nhỏ rõ ràng.
---

# Engineering Workflow

## Mục đích

Triển khai thay đổi theo **slice reviewable**, khớp convention repo và quality gates — không thay orchestrator khi scope chưa rõ.

## Khi nào kích hoạt

- Plan đã approved (task lớn) hoặc task nhỏ với AC rõ.
- User yêu cầu implement/fix/refactor cụ thể trong một repo.

## Khi nào không kích hoạt

- Chưa có classification/plan cho task lớn → `requirement-orchestrator`.
- Chỉ cần UI exploration → `frontend-design` (có thể quay lại workflow sau).
- Chỉ review quality → `quality-gate` (read-only).

## Input cần thiết

- Acceptance criteria hoặc bước trong plan đã approve.
- Verify commands từ `docs/testing/` hoặc README.
- Danh sách file/path được phép đụng (nếu user giới hạn).

## Quy trình từng bước

1. **Re-anchor** — Đọc lại AC; xác nhận slice hiện tại (một PR mental).
2. **Context** — Đọc code xung quanh; nếu cross-cutting → nhắc `codebase-graph`.
3. **Implement** — Diff tối thiểu; match style hiện có; không đổi unrelated.
4. **Verify** — Chạy lệnh thật; ghi output; không invent pass.
5. **Document** — ADR/docs nếu behavior/architecture đổi.
6. **Handoff** — Tóm tắt file đổi, kết quả verify, slice tiếp theo (nếu có).

## Output bắt buộc

- Danh sách file thay đổi + mô tả ngắn từng nhóm.
- Kết quả verify (command + outcome).
- Blocker hoặc debt ghi rõ, không ẩn.

## Điều kiện hoàn thành

- Mọi AC của **slice hiện tại** đạt hoặc blocker được báo.
- Task lớn: không bắt đầu slice mới vượt plan trừ khi user mở rộng.

## Phối hợp skill khác

| Tình huống | Skill |
|------------|-------|
| Slice đụng UI system | `frontend-design` |
| Sau refactor rộng | `codebase-graph` refresh |
| Trước merge/ship | `quality-gate` |
| Scope creep | quay lại `requirement-orchestrator` |