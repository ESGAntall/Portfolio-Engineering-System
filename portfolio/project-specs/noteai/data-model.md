# NOTEAI — Data model & local persistence

Áp dụng cho implementation client. **Không** có persistence server cho các entity dưới đây.

Schema này là `schemaVersion: 1`. Chưa có client đã ship, nên không có migration từ tên cũ.

## Tên đã rút khỏi schema

Các tên sau **không** còn là entity, collection, hoặc field:

| Tên cũ | Trạng thái trong schema v1 |
|--------|----------------------------|
| `Knowledge` (entity / collection) | Không dùng. Nội dung tài liệu nằm trên `Node`. |
| `MapNode` | Không dùng. Không có bản sao nội dung cho bản đồ. |
| `NodeGraphEdge` | Không dùng. Quan hệ nằm trên `Link`. |
| `NoteKnowledgeLink` | Không dùng. Quan hệ nằm trên `Link`. |

Không có thao tác “Remove from map”.

## Node và Knowledge Map

| Khái niệm | Trong spec | Ý nghĩa |
|-----------|------------|---------|
| **Node** | Entity `nodes[]` | Tên chuẩn trong data model, code và API. Chính là tài liệu: nội dung và metadata. |
| **Knowledge / Tài liệu** | Nhãn UI | Cách người dùng thấy một Node. Không phải entity thứ hai. |
| **Knowledge Map** | Giao diện | Vẽ mọi Node và mọi `Link` có hai đầu đều là Node. |

- Node, MapNode và Knowledge không phải ba entity.
- Knowledge Map không lưu body riêng.
- Mọi Node đều xuất hiện trên Knowledge Map. Không có trạng thái “gỡ khỏi bản đồ”.
- Vị trí/layout trên bản đồ: **OPEN**. Không thêm field tọa độ cho đến khi có quyết định.

## `is_demo`

Chỉ các record sau mang field này. Phạm vi không mở rộng thêm loại record khác.

| Collection / record | `is_demo` | Ghi chú |
|---------------------|-----------|---------|
| Note | Có | Demo `true`, user `false` |
| Node | Có | Demo `true`, user `false` |
| Link | Có | Demo `true`, user `false` |
| ActivityEvent | Có | Seed demo được phép `true`; thao tác user là `false` |
| Chat `messages[]` | Luôn `false` | Có field. Không seed message demo. |
| CheckIn | **OPEN** | Chưa chốt có field hay không. Không seed check-in. |
| `aiContextSelection` | Không có field | Preference của user |

`Node.is_demo` là cờ của chính tài liệu đó. Không còn entity MapNode để phải khớp cờ.

**ID:**

| Loại | Quy tắc |
|------|---------|
| Demo | Deterministic. Danh sách ID cụ thể: **OPEN** (demo ID manifest). |
| User | UUID v4 hoặc tương đương |

Trong một store, `notes[].id` và `nodes[].id` dùng chung một không gian ID. Một ID không được vừa là Note vừa là Node, vì `aiContextSelection.includedIds` là danh sách ID phẳng.

### Va chạm ID khi tạo demo

Re-fill và mọi lần tạo demo canonical **không** overwrite record đã có và **không** tạo ID trùng.

Khi ID demo đụng record đang tồn tại (`is_demo: true` hoặc `is_demo: false`):

- Record đang có được giữ nguyên.
- Không tạo thêm record cùng ID.

Cách báo cho người dùng và mọi xử lý va chạm ngoài hai quy tắc trên: **OPEN**.

## Entities

Field liệt kê dưới đây là dữ liệu **persistent** trong `localStorage`.

### Note (Ghi chú)

- `id`, `is_demo`, `title`, `body`, `createdAt`, `updatedAt`.

### Node (Tài liệu)

- `id`, `is_demo`, `title`, `body`, `createdAt`, `updatedAt`.
- `title` và `body` là nội dung tài liệu duy nhất. Knowledge Map đọc chính các field này.

Ví dụ:

```json
{
  "id": "node-user-1",
  "is_demo": false,
  "title": "Tài liệu",
  "body": "Nội dung tài liệu",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

### Link

Một entity cho mọi quan hệ có hướng. Không có `label`, loại quan hệ, hay metadata khác. Những thuộc tính đó là **OPEN**.

- `id`
- `is_demo`
- `sourceType`: `"note"` hoặc `"node"`
- `sourceId`
- `targetType`: `"note"` hoặc `"node"`
- `targetId`

Bốn kiểu hợp lệ:

| Chiều | `sourceType` | `targetType` |
|-------|--------------|--------------|
| Node → Node | `node` | `node` |
| Node → Note | `node` | `note` |
| Note → Node | `note` | `node` |
| Note → Note | `note` | `note` |

Quy tắc:

- Một Note hoặc Node có thể là đầu của nhiều Link.
- Hướng được giữ: đổi source và target là một Link khác.
- Cùng một chiều, một cặp chỉ có tối đa một Link.
- Unique constraint: `sourceType + sourceId + targetType + targetId`.
- Constraint này phân biệt chiều. Không dùng constraint bỏ qua hướng.
- Link ngược chỉ tồn tại khi user tạo record thứ hai.
- Tạo một chiều không tự tạo chiều kia.
- Link không có thao tác sửa nội dung, vì không có field nội dung để sửa.
- Self-link (`sourceId` cùng `targetId` và cùng type): **OPEN**.

Ví dụ bốn chiều:

```json
[
  {
    "id": "link-node-node",
    "is_demo": false,
    "sourceType": "node",
    "sourceId": "node-a",
    "targetType": "node",
    "targetId": "node-b"
  },
  {
    "id": "link-node-note",
    "is_demo": false,
    "sourceType": "node",
    "sourceId": "node-a",
    "targetType": "note",
    "targetId": "note-a"
  },
  {
    "id": "link-note-node",
    "is_demo": false,
    "sourceType": "note",
    "sourceId": "note-a",
    "targetType": "node",
    "targetId": "node-a"
  },
  {
    "id": "link-note-note",
    "is_demo": false,
    "sourceType": "note",
    "sourceId": "note-a",
    "targetType": "note",
    "targetId": "note-b"
  }
]
```

### Chat (singleton)

```json
{
  "conversationId": "singleton",
  "messages": [
    {
      "id": "msg-1",
      "role": "user",
      "content": "Nội dung",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "is_demo": false
    }
  ]
}
```

- Đúng một conversation. Không có session ẩn.
- Mọi message có `is_demo: false`.
- Schema từng phần tử `sources` trên message trợ lý, nếu implementation lưu attribution đã validate: **OPEN** cùng HTTP contract. Phần tử đó chỉ được trỏ Note hoặc Node đã nằm trong request và đã qua kiểm tra attribution.

### CheckIn

- `id`, `date` (`YYYY-MM-DD` theo ngày local), `createdAt`.
- Có thêm `is_demo` hay không: **OPEN**.
- Không seed check-in trong demo, Re-fill, hoặc Activity demo.
- Tối đa một check-in cho mỗi `date`.

### ActivityEvent

- `id`, `is_demo`, `type`, `entityRef`, `timestamp`.
- Catalog giá trị `type`: **OPEN**.
- Một thao tác user tạo đúng một event cho thao tác đó.
- Dọn Link do xóa Note/Node, hoặc do Clear Demo, không tạo thêm event xóa cho từng Link bị dọn.

### AI context selection

```json
{
  "mode": "include-list",
  "includedIds": ["note-a", "node-a"],
  "initialized": true
}
```

- Persistent. Không có `is_demo`.
- `includedIds` chỉ chứa ID của Note và Node.
- `initialized: false` nghĩa là chưa áp dụng lần chọn đầu.
- Lần đầu (`initialized` chuyển sang `true`): gán `includedIds` bằng mọi Note và Node đang có. Thư viện rỗng thì danh sách rỗng, và lần đó vẫn tính là đã khởi tạo.
- User bỏ từng ID hoặc bỏ hết. Danh sách rỗng là lựa chọn hợp lệ.
- Tạo Note hoặc Node mới: thêm ID mới, kể cả khi danh sách đang rỗng. Không thêm lại ID user đã bỏ.
- Xóa Note hoặc Node: gỡ ID đó.
- Re-fill tạo Note/Node demo mới: thêm các ID vừa tạo. Record demo đã tồn tại bị skip thì không thêm lại ID user đã bỏ.
- Clear Demo: gỡ ID của Note/Node demo đã bị xóa. Giữ ID còn lại, gồm Note và Node của user còn tồn tại. Không chọn lại toàn bộ thư viện.
- Clear Demo và Re-fill không đặt lại preference về select-all.

## Xóa và dọn Link

| Thao tác | Note | Node | Link | Activity |
|----------|------|------|------|----------|
| Xóa Note | Xóa note đó | Giữ | Xóa mọi Link có note đó ở `sourceId` hoặc `targetId` | Một event cho việc xóa Note. Không có event xóa riêng cho từng Link bị dọn. |
| Xóa Node | Giữ | Xóa node đó | Xóa mọi Link có node đó ở `sourceId` hoặc `targetId` | Một event cho việc xóa Node. Không có event xóa riêng cho từng Link bị dọn. |
| Xóa Link | Giữ | Giữ | Chỉ Link đó | Một event cho việc xóa Link |

## localStorage schema

### Root document

```json
{
  "schemaVersion": 1,
  "notes": [],
  "nodes": [],
  "links": [],
  "chat": {
    "conversationId": "singleton",
    "messages": []
  },
  "checkIns": [],
  "activityEvents": [],
  "aiContextSelection": {
    "mode": "include-list",
    "includedIds": [],
    "initialized": false
  }
}
```

- Storage key: **OPEN**.
- Không dùng `demoSetVersion` để overwrite demo khi Re-fill.
- Không có `knowledge`, `mapNodes`, `noteKnowledgeLinks`, `nodeGraphEdges`.

### Load, validation, migration, quota, recovery

Thứ tự khi mở app hoặc khi store được đọc lại:

1. Đọc `localStorage`.
2. Validate JSON và `schemaVersion`.
3. Migrate nếu policy migration của version đó đã có. Chưa có bản đã ship nên chưa có bảng migrate từ schema khác.
4. Chỉ sau khi store hợp lệ mới chạy logic check-in.

- Migration không đổi `is_demo` của Note, Node, Link, ActivityEvent đang có.
- `QuotaExceeded`: hiện lỗi, giữ trạng thái trước lần save thất bại.
- JSON hỏng: recovery cho user. Không tạo check-in trên lần load thất bại.
- Export là JSON của root document.
- Import cần xác nhận.
- Import là replace-all hay merge-by-id: **OPEN**.

## Demo data management

### Re-fill Demo — SKIP-EXISTING

Mục đích: tạo record demo canonical còn thiếu. Không sửa record đã có.

1. Đọc định nghĩa demo (ID deterministic). Manifest cụ thể: **OPEN**.
2. Với từng record demo định nghĩa, theo `id`:
   - Chưa có ID → tạo với `is_demo: true`.
   - Đã có ID → skip, giữ nguyên record, không refresh và không overwrite.
3. Không sửa hoặc xóa record `is_demo: false`.
4. Không tạo ID trùng.
5. Không tạo check-in.
6. Không đưa selection về select-all.
7. Mỗi Note hoặc Node demo vừa được tạo ở bước 2 được thêm vào `includedIds`. ID đã tồn tại và bị skip không được thêm chỉ vì Re-fill chạy lại.

### Clear Demo

- Xóa record `is_demo: true` trong Note, Node, Link, ActivityEvent.
- Giữ record `is_demo: false`.
- Không xóa check-in.
- Không xóa chat.
- Sau khi xóa, dọn Link còn lại mà `sourceId` hoặc `targetId` không còn Note/Node tương ứng. Việc dọn này gồm Link user trỏ vào record demo đã xóa.
- Giữ Link mà cả hai đầu vẫn còn.
- Gỡ khỏi `includedIds` mọi ID Note/Node đã biến mất. Giữ ID còn lại.
- Không tạo Activity cho từng record bị xóa bởi Clear Demo hoặc bởi bước dọn Link.
- Cần xác nhận trước khi chạy.

Sau Clear Demo, Re-fill tạo lại demo thiếu bằng cùng quy tắc ID deterministic.

### So sánh

| | Clear Demo | Re-fill Demo |
|---|----------------|--------------|
| User records | Giữ | Giữ |
| Demo đã tồn tại | Xóa nếu `is_demo: true` | Skip, không overwrite |
| Demo thiếu | Không tạo | Tạo mới |
| Link mồ côi | Dọn | Không phát sinh từ skip |
| Check-in | Không đụng | Không tạo |
| AI context | Gỡ ID đã mất; giữ phần còn lại | Thêm ID Note/Node demo vừa tạo; không chọn lại ID đã bỏ |

Clear Demo và Re-fill Demo đều cần xác nhận.

## Activity và check-in

- `checkIns` là collection riêng, tối đa một bản ghi mỗi ngày local.
- Check-in không phải ActivityEvent.
- `activityEvents` có thể có seed `is_demo: true`.
- Seed đó không tạo check-in.
