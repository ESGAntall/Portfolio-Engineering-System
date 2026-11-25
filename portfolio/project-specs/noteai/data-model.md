# NOTEAI — Data model & local persistence

Áp dụng cho implementation client. **Không** có persistence server cho các entity dưới đây.

## Knowledge và Node (quyết định canonical)

| Khái niệm | Spec entity | Ý nghĩa |
|-----------|-------------|---------|
| **Knowledge** (Tài liệu) | `knowledge[]` | Nội dung tài liệu thật trong thư viện (title, body, …) |
| **Node** (Knowledge Map) | `mapNodes[]` | **Biểu diễn** của một Knowledge trên bản đồ — tham chiếu `knowledgeId`, **không** nhân đôi body |

- Mỗi Node **bắt buộc** tham chiếu đúng một `knowledgeId`.
- CRUD nội dung tài liệu = thao tác trên **Knowledge**; map đọc cùng nội dung qua `knowledgeId`.
- Tạo Knowledge mới: app **phải** tạo Node map tương ứng (1–1) để hiển thị trên Knowledge Map (layout trên Node: ADR).
- **Không** lưu bản copy nội dung tài liệu trong Node.

### Xóa và dọn dẹp

| Thao tác | Knowledge | Map Node | NodeGraphEdge | NoteKnowledgeLink | Note |
|----------|-----------|----------|---------------|-------------------|------|
| **Delete Knowledge** (xóa tài liệu) | Xóa | Xóa node của `knowledgeId` | Xóa edge incident với node đó | Xóa link trỏ `knowledgeId` | **Giữ** |
| **Remove from map** (chỉ gỡ khỏi map) | **Giữ** | Xóa node | Xóa edge incident với node đó | **Giữ** link (vẫn trỏ `knowledgeId`) | **Giữ** |
| **Delete edge** | — | — | Chỉ edge đó | — | — |

*Remove from map* là tùy chọn UX nếu product có action “gỡ khỏi bản đồ”; **Delete Knowledge** là xóa tài liệu khỏi thư viện.

## `is_demo` — phân loại bắt buộc

**Không** mọi record đều mang `is_demo`. Chỉ các loại sau:

| Collection / record | `is_demo` | Ghi chú |
|---------------------|-----------|---------|
| Note | **Có** | Demo `true`, user `false` |
| Knowledge | **Có** | |
| MapNode | **Có** | Thường khớp Knowledge cùng `knowledgeId` |
| NoteKnowledgeLink | **Có** | |
| NodeGraphEdge | **Có** | |
| ActivityEvent | **Có** | Demo activity seed được phép `true` |
| Chat `messages[]` | **Luôn `false`** | Không seed message demo |
| CheckIn | **Luôn `false`** | Không seed check-in |
| `aiContextSelection` | **Không có field** | Preference user — Clear/Re-fill demo **không** reset |

**ID:**

| Loại | Quy tắc |
|------|---------|
| Demo | Deterministic, fixed (manifest demo trong ADR app) |
| User | Random (UUID v4 hoặc tương đương) |

### Va chạm ID (demo vs user)

Khi Re-fill hoặc tạo demo canonical mà **đã tồn tại** record cùng `id` với `is_demo: false`:

1. **Không** overwrite, **không** xóa user record.
2. **Skip** tạo demo cho ID đó.
3. Ghi nhận collision (dev log; UX: ADR — ví dụ thông báo “demo ID không khả dụng”).

Demo operation **không bao giờ** làm mất hoặc sửa bản ghi user.

## Entities (tóm tắt)

### Note (Ghi chú)

- `id`, `is_demo`, title, body, timestamps.

### Knowledge (Tài liệu)

- `id`, `is_demo`, title, body, timestamps.

### MapNode

- `id`, `is_demo`, `knowledgeId`, layout fields (ADR: position, …).

### NoteKnowledgeLink

- `id`, `is_demo`, `noteId`, `knowledgeId` — **không** dùng `nodeId` cho liên kết Note.

### NodeGraphEdge (Knowledge Map)

- `id`, `is_demo`, `sourceNodeId`, `targetNodeId`, optional `label`.
- User chọn source/target; **không** cạnh ngược tự động; **không** AI tạo/sửa.
- Cardinality: nhiều bản ghi edge (1-1, 1-N, N-1, N-N).

### Chat (singleton)

```json
"chat": {
  "conversationId": "singleton",
  "messages": [
    { "id", "role", "content", "createdAt", "is_demo": false, "sources?": [] }
  ]
}
```

- Đúng **một** conversation; không session management ẩn.

### CheckIn

- `id`, `date` (`YYYY-MM-DD` local), `createdAt` — **không** field `is_demo` (luôn user-real).

### ActivityEvent

- `id`, `is_demo`, `type`, `entityRef`, `timestamp`, …

### AI context selection

```json
"aiContextSelection": {
  "mode": "include-list",
  "includedIds": ["..."],
  "initialized": true
}
```

- ADR có thể dùng exclusion-list nếu tương đương semantically — spec yêu cầu: persisted; không reset khi Clear/Re-fill demo.

**Quy tắc selection (đồng bộ spec sản phẩm):**

- Lần đầu: all Notes + Knowledge → `includedIds` đầy đủ.
- User bỏ chọn hết: `includedIds` rỗng — **không** auto-fill all khi gửi AI.
- Tạo doc mới: **thêm** id mới vào `includedIds` **ngay cả khi** user trước đó đã bỏ chọn tất cả (không resurrect doc cũ).
- Xóa doc: loại id khỏi set.
- Re-fill tạo **Knowledge/Note demo mới** (id chưa có): id mới được **thêm** vào `includedIds` như doc mới; **không** chọn lại doc user đã bỏ chọn.

## localStorage schema

### Root document

```json
{
  "schemaVersion": 1,
  "notes": [],
  "knowledge": [],
  "mapNodes": [],
  "noteKnowledgeLinks": [],
  "nodeGraphEdges": [],
  "chat": { "conversationId": "singleton", "messages": [] },
  "checkIns": [],
  "activityEvents": [],
  "aiContextSelection": {}
}
```

- Storage key: ADR (ví dụ `noteai:v1`).
- **Không** dùng `demoSetVersion` để overwrite demo khi Re-fill.

### Validation, migration, quota, recovery, export/import

- Giữ như trước: validate on load; migration không đổi `is_demo` user/demo; quota error visible; corrupt JSON recovery; export/import có confirm (merge policy: ADR).

## Demo data management

### Re-fill Demo — **SKIP-EXISTING** (definitive)

**Mục đích:** Tạo **thiếu** bản ghi demo canonical; **không** sửa demo đã có.

1. Load canonical demo definitions (deterministic IDs).
2. Với từng entity demo định nghĩa:
   - **Không** tồn tại `id` → **tạo** (`is_demo: true`).
   - **Đã tồn tại** `id` + `is_demo: true` → **skip** — giữ nguyên record **chính xác** (không refresh/overwrite/update).
   - **Đã tồn tại** `id` + `is_demo: false` → **skip** + [va chạm ID](#va-chạm-id-demo-vs-user).
3. **Không** sửa/xóa bất kỳ `is_demo: false`.
4. **Không** duplicate ID.
5. **Không** tạo check-in.
6. **Không** reset `aiContextSelection`.

### Clear Demo

- Xóa mọi record có `is_demo: true` trong: Note, Knowledge, MapNode, NoteKnowledgeLink, NodeGraphEdge, ActivityEvent (demo).
- **Không** xóa `is_demo: false`.
- **Không** xóa check-in.
- **Không** xóa chat messages (luôn user).
- Dọn **orphan** links/edges tham chiếu id demo đã xóa; **giữ** quan hệ giữa các entity user còn sống.
- Confirm UI.

Sau Clear Demo, Re-fill **tạo lại** demo thiếu bằng **cùng** deterministic IDs (skip nếu còn sót demo `is_demo: true`).

### So sánh

| | Clear Demo | Re-fill Demo |
|---|------------|----------------|
| User records | Giữ | Giữ |
| Demo đã tồn tại | Xóa (nếu `is_demo`) | **Skip** — không overwrite |
| Demo thiếu | — | Tạo mới |
| Check-in | Không đụng | Không tạo |
| AI context preference | Không reset | Không reset |

### Confirm

Clear Demo và Re-fill Demo đều cần xác nhận.

## Activity vs check-in

- `checkIns`: collection riêng; một bản ghi / ngày local tối đa.
- `activityEvents`: có thể có demo seed `is_demo: true`; **không** seed check-in.