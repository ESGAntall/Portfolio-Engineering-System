# ADR O-003: Task Classification

## Status

Accepted (bổ sung policy hardening — UI regression risk; không đổi status ADR)

## Context

Hybrid workflow cần tiêu chí phân loại task nhỏ/lớn ổn định, không phụ thuộc số file. Validation dry-run: redesign một surface và báo "done" cần làm rõ thêm.

## Decision

Phân loại theo **risk và impact** — **không** mặc định mọi thay đổi UI là task lớn.

### Task nhỏ

- Phạm vi **module độc lập**.
- Không thay đổi architecture, API contract hoặc **data model** (đã xác định rõ loại field/state nếu có thêm field).
- Không ảnh hưởng đáng kể tới module khác.
- Requirement **rõ ràng**.

### Task lớn

Một trong các điều (một điều đủ): cross-module/layer; đổi architecture, API, database/data contract; authn/authz hoặc security-sensitive; refactor regression risk cao; requirement mơ hồ hoặc nhiều phương án; redesign **nhiều** màn hình.

**UI — một màn hình hoặc một surface** vẫn có thể là task lớn nếu **risk/impact thực tế** (không cần đếm file):

- Nhiều trạng thái hoặc tương tác quan trọng.
- Nguy cơ regression hành vi hiện tại.
- Ảnh hưởng nhiều component hoặc module.
- Thay đổi navigation, responsive behavior hoặc **data flow**.
- Phạm vi chưa rõ; cần nhiều quyết định thiết kế.

Thay đổi UI **đơn giản, rõ ràng**, một component, ít state, không đụng flow/navigation → có thể **nhỏ** nếu thỏa đủ điều kiện task nhỏ.

### Task lớn — trước implement

- **Analysis** (impact, dependency).
- **Implementation plan** (bước, giai đoạn).
- **Verification criteria**.
- Chờ **user approval**.

**Không** dùng số lượng file là tiêu chí duy nhất.

### Field / data model

Thêm field (`updatedAt`, `createdAt`, `status`, `lastViewedAt`, …): xác định persistent vs runtime-only vs derived trước classify; chưa rõ + có thể đụng schema/contract → không coi nhỏ cho đến khi clarify (skill `requirement-orchestrator`).

## Consequences

- Rule `10-workflow-and-approval.mdc` và skill `requirement-orchestrator` align với ADR này.
- Nghi ngờ → coi là lớn (rule 10).
- Báo done/ship/merge → `quality-gate` (rule 10 trigger; chi tiết rule 30 + skill).