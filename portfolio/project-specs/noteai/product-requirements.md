# NOTEAI — Product requirements

Chi tiết hành vi sản phẩm. Ràng buộc kỹ thuật: [architecture.md](architecture.md). Dữ liệu: [data-model.md](data-model.md). PPL: [prompt-processing-layer.md](prompt-processing-layer.md).

## 1. Mở ứng dụng & phạm vi

- Web app standalone trong portfolio; state trên `localStorage`.
- **Không** login, đăng ký, Google Login, demo login, logout.
- Không đồng bộ cloud mặc định.

## 2. Check-in

### FR-CHECKIN-1 — Tự động khi init và khi ngày có thể đổi

- **Init app:** tính ngày local `YYYY-MM-DD`; nếu chưa có check-in cho ngày đó → tạo một (không field `is_demo`).
- **Tab visible lại:** nếu ngày local có thể đã đổi so với lần check-in gần nhất → chạy lại logic ngày hiện tại (tối đa một check-in / ngày).
- **Reload / mở lại:** không duplicate cùng ngày.
- Đổi ngày local → cho phép check-in ngày mới (một bản ghi).

### FR-CHECKIN-2 — Lịch sử thật

- **Không** seed check-in trong demo, Re-fill, hoặc Activity demo.

### FR-CHECKIN-3 — Tách Activity

- Check-in **không** thay thế bằng activity; collections khác nhau.

## 3. Notes (Ghi chú)

- CRUD; demo `is_demo: true` + ID deterministic; user `false` + ID random.

## 4. Knowledge & Knowledge Map

### FR-KNOW-1 — Knowledge (Tài liệu)

- CRUD nội dung trên entity **Knowledge**.

### FR-KNOW-2 — Node trên map

- **Node** chỉ là biểu diễn map của Knowledge (`knowledgeId`); không trùng lặp body.
- Tạo Knowledge → tạo Node map 1–1 (layout trên Node).

### FR-KNOW-3 — Quan hệ NodeGraphEdge

- User tạo/xóa edge giữa **Node** (source/target do user chọn).
- Không prerequisite mặc định; 1-1, 1-N, N-1, N-N qua nhiều bản ghi.
- **Không** cạnh ngược tự động.
- **Cấm** AI tạo/gợi ý/sửa edge hoặc NoteKnowledgeLink.

### FR-KNOW-4 — Xóa

- Xóa **edge**: chỉ edge.
- **Delete Knowledge**: xóa Knowledge, MapNode, edge liên quan, NoteKnowledgeLink trỏ `knowledgeId`; **không** xóa Note.
- **Remove from map** (nếu có UI): xóa MapNode + edge incident; **giữ** Knowledge và Note.

### FR-KNOW-5 — Note ↔ Knowledge

- Link qua `knowledgeId`; tách khỏi NodeGraphEdge.

## 5. Chat

### FR-CHAT-1 — Một hội thoại

- Một conversation persisted; không UI tạo/đổi/xóa nhiều conversation; không session ẩn.

### FR-CHAT-2 — Messages

- Lưu `localStorage`; reload giữ nguyên.
- Mọi message `is_demo: false` (không seed chat demo).

## 6. AI context selection

### FR-CTX-1 — Lần đầu

- Chọn **tất cả** Note + Knowledge hiện có.

### FR-CTX-2 — Persist & tái sử dụng

- User bỏ chọn từng tài liệu; lưu preference; lần sau giữ choice.

### FR-CTX-3 — Đồng bộ thư viện

| Sự kiện | Hành vi |
|---------|---------|
| Tạo Note/Knowledge mới | **Thêm** id vào selection (kể cả khi user đã bỏ chọn tất cả trước đó — **không** chọn lại doc cũ) |
| Xóa tài liệu | Loại id khỏi selection |
| User bỏ chọn hết | Gửi AI: context thư viện rỗng — **không** silent select-all |
| Clear / Re-fill Demo | **Không** reset `aiContextSelection` |
| Re-fill tạo demo mới (id mới) | Coi như doc mới → thêm vào selection; không bật lại doc user đã bỏ chọn |

### FR-CTX-4 — PPL

- Chỉ Note + Knowledge **được chọn** (theo `knowledgeId` / `noteId`) — không đưa map layout vào context trừ khi ADR mở rộng.

### FR-CTX-5 — Token

- Budget và relevance: [prompt-processing-layer.md](prompt-processing-layer.md).

## 7. Gọi AI (client → runtime → Gemini)

- Không API key trên client.
- Runtime: shared quota; không cam kết per-user quota strict; **có thể** IP rate limit chống lạm dụng.
- Token/cost guards; lỗi an toàn.

## 8. Activity history

Ghi event (`is_demo: false` cho thao tác user):

- Create/edit/delete Note.
- Create/edit/delete Knowledge.
- Create/delete NodeGraphEdge.
- Create/delete NoteKnowledgeLink.
- Gửi câu hỏi AI.

**Không** log view/open điều hướng.

Demo có thể seed **Activity** `is_demo: true`; **không** seed check-in.

## 9. Local data management

| Capability | Requirement |
|------------|-------------|
| Schema | [data-model.md](data-model.md) |
| Clear Demo | Chỉ `is_demo: true`; dọn orphan; không check-in; confirm |
| Re-fill Demo | **Skip-existing** — chỉ tạo thiếu; không overwrite demo/user |
| Export/import | JSON; confirm (policy merge: ADR) |

## 10. Demo data

- Re-fill/Clear theo [data-model.md](data-model.md).
- Va chạm ID demo/user: không overwrite user.

## User flows (tóm tắt)

1. Mở app → check-in ngày nếu thiếu → load store.
2. CRUD Knowledge/Note/map; activity log.
3. Chọn context AI (persist).
4. Chat → PPL → runtime.
5. Export/import; Clear/Re-fill demo (confirm).

**Critical paths:** check-in idempotent theo ngày; Re-fill không đụng user + không overwrite demo existing; empty context không auto-all; doc mới sau deselect-all chỉ thêm doc mới; delete Knowledge không xóa Note.