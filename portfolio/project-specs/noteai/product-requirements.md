# NOTEAI — Product requirements

Hành vi sản phẩm. Ràng buộc: [architecture.md](architecture.md). Dữ liệu: [data-model.md](data-model.md). PPL: [prompt-processing-layer.md](prompt-processing-layer.md).

## 1. Mở ứng dụng

- Web app standalone. State trên `localStorage`.
- Không login, đăng ký, Google Login, demo login, logout.
- Không đồng bộ cloud mặc định.
- Khi khởi tạo, và mỗi lần cần đọc store để quyết định check-in: load, validate, rồi migrate nếu có migration đã định nghĩa. Store chưa hợp lệ thì dừng, hiện recovery, không tạo check-in.
- Store hợp lệ rồi mới xét check-in của ngày local hiện tại.

## 2. Check-in

### FR-CHECKIN-1 — Sau khi store sẵn sàng

- Tính ngày local `YYYY-MM-DD`.
- Chưa có check-in của ngày đó thì tạo một bản ghi.
- Tab visible lại: nếu ngày local có thể đã đổi so với lần xét gần nhất, chạy lại logic của ngày hiện tại.
- Reload cùng ngày không tạo bản ghi thứ hai.
- Đổi ngày local cho phép một check-in của ngày mới.
- Tối đa một check-in mỗi ngày local.

### FR-CHECKIN-2 — Không seed

- Demo, Re-fill, và Activity demo không tạo check-in.

### FR-CHECKIN-3 — Không phải Activity

- Check-in nằm ở `checkIns`, không ghi thay bằng ActivityEvent.

Field `is_demo` trên check-in: **OPEN**.

## 3. Notes (Ghi chú)

- Tạo, sửa, xóa. Demo: `is_demo: true` và ID deterministic. User: `is_demo: false` và ID ngẫu nhiên.
- Xóa Note xóa các Link có Note đó ở một trong hai đầu. Các Node giữ nguyên.

## 4. Node và Knowledge Map

### FR-NODE-1 — Một entity tài liệu

- CRUD nội dung trên `Node` (`title`, `body`, metadata trong [data-model.md](data-model.md)).
- UI gọi Node là Tài liệu hoặc Knowledge.
- Không có màn hình hoặc store nào sửa một bản Knowledge/MapNode riêng.

### FR-NODE-2 — Knowledge Map

- Bản đồ hiển thị mọi Node.
- Bản đồ hiển thị Link có cả `sourceType` và `targetType` là `node`, đúng hướng đã lưu.
- Không vẽ body thứ hai.
- Không có lệnh Remove from map.
- Layout/tọa độ: **OPEN**.

### FR-NODE-3 — Xóa Node

- Xóa Node đó.
- Xóa mọi Link có Node đó ở `sourceId` hoặc `targetId`.
- Giữ Note.
- Giữ các Node khác.

## 5. Link

### FR-LINK-1 — Bốn chiều

User tạo được đúng các chiều:

- Node → Node
- Node → Note
- Note → Node
- Note → Note

### FR-LINK-2 — Hướng và số lượng

- Một Note hoặc Node có thể nối tới nhiều Note/Node khác.
- Cùng chiều, cùng cặp: tối đa một Link.
- User tạo chiều ngược bằng một thao tác riêng thì chiều đó được lưu.
- Hệ thống không tự tạo chiều ngược.
- Hướng đã lưu không bị đảo.
- Không gán nhãn, loại quan hệ, hoặc ý nghĩa. Metadata đó: **OPEN**.
- Self-link: **OPEN**.

### FR-LINK-3 — Sửa và xóa

- Không có lệnh sửa Link, vì Link không có field nội dung.
- Xóa Link chỉ xóa record đó. Note và Node ở hai đầu vẫn còn.

### FR-LINK-4 — AI

- AI không tạo, không gợi ý, không sửa, không xóa Link.

## 6. Chat

### FR-CHAT-1 — Một hội thoại

- Một conversation trong `localStorage`.
- Không có UI tạo, đổi, hoặc xóa nhiều conversation.
- Không có session ẩn.

### FR-CHAT-2 — Messages

- Reload giữ nguyên messages.
- Mọi message `is_demo: false`.
- Không seed chat demo.

## 7. AI context selection

### FR-CTX-1 — Lần đầu

- Chọn mọi Note và mọi Node hiện có.
- Sau lần đó, preference đã khởi tạo. Không lặp select-all chỉ vì user mở lại app.

### FR-CTX-2 — User chọn

- User bỏ từng tài liệu hoặc bỏ hết.
- Lần sau giữ đúng tập đó.

### FR-CTX-3 — Đổi thư viện

| Sự kiện | Hành vi |
|---------|---------|
| Tạo Note hoặc Node | Thêm ID mới, kể cả khi selection đang rỗng. Không thêm ID user đã bỏ. |
| Xóa Note hoặc Node | Gỡ ID đó |
| User bỏ hết | Request sau đó có thư viện rỗng. Không tự chọn lại tất cả. |
| Clear Demo | Gỡ ID Note/Node demo đã xóa. Giữ ID Note và Node còn tồn tại, gồm lựa chọn user còn sống. |
| Re-fill tạo Note/Node demo mới | Thêm các ID vừa tạo. Không chọn lại ID đã bỏ. Record skip vì đã tồn tại không được bật lại. |

### FR-CTX-4 — PPL chỉ thấy tập đã chọn

- Context thư viện chỉ gồm Note và Node có ID trong selection.
- Không đưa layout bản đồ vào context.
- Không thêm tài liệu ngoài selection để lấp budget.

### FR-CTX-5 — Token

- Budget, ranking, compression: [prompt-processing-layer.md](prompt-processing-layer.md).

## 8. Gọi AI

- Client không giữ API key.
- Client gửi structured request. Runtime tạo trusted system instructions.
- Quota shared. Không cam kết quota riêng từng user khi không có auth.
- Runtime có rate limit, timeout, giới hạn payload, và token/cost guard. Ngưỡng số: **OPEN**.
- Lỗi hiển thị an toàn, không lộ secret.
- Câu trả lời chỉ gắn nguồn sau khi runtime validate attribution.

## 9. Activity

Mỗi thao tác user sau đây tạo một ActivityEvent `is_demo: false`:

- Tạo, sửa, hoặc xóa Note.
- Tạo, sửa, hoặc xóa Node.
- Tạo hoặc xóa Link.
- Gửi câu hỏi AI.

Không ghi:

- Mở, xem, hoặc điều hướng chỉ đọc.
- Từng Link bị xóa kèm theo vì xóa Note hoặc xóa Node.
- Từng record bị xóa hoặc bị dọn vì Clear Demo.

Demo được phép seed Activity `is_demo: true`. Seed đó không tạo check-in.

Catalog chuỗi `type`: **OPEN**.

## 10. Dữ liệu local

| Khả năng | Yêu cầu |
|----------|---------|
| Schema | [data-model.md](data-model.md) |
| Clear Demo | Xóa `is_demo: true`, dọn Link mồ côi, sửa selection như FR-CTX-3, không đụng check-in và chat, có xác nhận, không sinh activity cascade |
| Re-fill Demo | Skip-existing. Chỉ tạo record thiếu. Không overwrite. Thêm ID demo mới vào selection. Có xác nhận. |
| Export | JSON root document |
| Import | Có xác nhận. Replace-all hay merge-by-id: **OPEN**. |

## 11. Demo data

- ID demo deterministic. Manifest cụ thể: **OPEN**.
- ID đụng record đã có: không overwrite, không tạo trùng. Nội dung thông báo: **OPEN**.

## User flows

1. Mở app → load, validate, migrate store → nếu store hợp lệ, check-in ngày hiện tại khi chưa có.
2. CRUD Note, Node, và Link. Activity chỉ cho thao tác user, không cho cascade.
3. Chọn context AI và giữ preference.
4. Chat → PPL trên tập đã chọn → runtime → kiểm tra attribution → hiển thị.
5. Export hoặc import (confirm). Clear Demo hoặc Re-fill Demo (confirm).

**Critical paths:** check-in không chạy trên store hỏng và không trùng trong cùng ngày local; Re-fill không đụng record đã có; selection rỗng không thành select-all; xóa Node không xóa Note; xóa Note hoặc Node không ghi activity giả cho từng Link bị dọn.
