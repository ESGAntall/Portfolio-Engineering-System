# Task classification (reference — O-003)

**Project-facing reference** derived from portfolio engineering decision **O-003**. Áp dụng trong application repository này.

## Decision summary

Phân loại theo **risk và impact**. Không mặc định mọi thay đổi UI là task lớn.

### Task nhỏ (tất cả điều sau)

- Phạm vi **module độc lập**.
- Không thay đổi architecture, API contract hoặc **data model** (đã xác định rõ field/state nếu có).
- Không ảnh hưởng đáng kể tới module khác.
- Requirement **rõ ràng**.

### Task lớn (một điều đủ)

- Cross-module hoặc cross-layer.
- Đổi architecture, API, database hoặc data contract.
- Authentication, authorization hoặc security-sensitive.
- Refactor có rủi ro regression cao.
- Requirement mơ hồ hoặc nhiều phương án.
- Redesign nhiều màn hình.

**UI — một màn hình hoặc surface** có thể là task lớn khi: nhiều trạng thái/tương tác quan trọng; nguy cơ regression; ảnh hưởng nhiều component/module; đổi navigation, responsive hoặc data flow; phạm vi chưa rõ.

UI đơn giản, một component, ít state → có thể **nhỏ** nếu thỏa đủ điều kiện task nhỏ.

### Task lớn — trước implement

Analysis, implementation plan, verification criteria, **chờ user approval**.

**Không** dùng số lượng file là tiêu chí duy nhất.

### Field / data model

Thêm field (`updatedAt`, `createdAt`, `status`, …): xác định **persistent** | **runtime-only** | **derived** trước classify. Chưa rõ và có thể đụng schema/contract → không coi nhỏ cho đến khi clarify.

### Nghi ngờ

Coi là **lớn** (rule `10-workflow-and-approval.mdc`).

### Báo hoàn thành

Báo done/ship/merge → skill `quality-gate` (rule 10; chi tiết rule 30).