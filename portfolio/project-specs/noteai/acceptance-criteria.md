# NOTEAI — Acceptance criteria

Tiêu chí kiểm thử cho spec hiện tại. Mirror vào repo app khi scaffold. Ngưỡng số và fixture đang **OPEN** thì test đó chưa chạy được cho đến khi có quyết định; tiêu chí vẫn là yêu cầu.

## Demo và dữ liệu user

| ID | Given | When | Then |
|----|-------|------|------|
| AC-DEMO-1 | Có record user và demo | Re-fill đã confirm | Mọi record `is_demo: false` giữ nguyên từng field |
| AC-DEMO-2 | Demo ID đã tồn tại với `is_demo: true` | Re-fill | Record đó không đổi |
| AC-DEMO-3 | Sau Clear Demo, manifest demo còn định nghĩa các ID đã mất | Re-fill | Các record thiếu được tạo lại, `is_demo: true`, đúng ID deterministic |
| AC-DEMO-4 | Có user và demo | Clear Demo đã confirm | Không còn Note, Node, Link, ActivityEvent `is_demo: true`. Record user còn. |
| AC-DEMO-5 | Bất kỳ | Re-fill hoặc seed demo | Số check-in không tăng |
| AC-DEMO-6 | ID demo trùng record đang có | Re-fill | Record cũ còn. Không có record thứ hai cùng ID. |
| AC-DEMO-7 | Link user nối vào Node demo, và Link demo giữa hai Node user | Clear Demo | Link demo biến mất. Link user trỏ vào Node đã xóa biến mất. Link giữa các record user còn lại thì còn. |

Thông báo va chạm ID: **OPEN**, không có AC về câu chữ.

## Check-in

| ID | Given | When | Then |
|----|-------|------|------|
| AC-CHK-1 | Store hợp lệ, chưa có check-in ngày D | App init | Đúng một check-in `date=D` |
| AC-CHK-2 | Đã có check-in ngày D | Reload cùng ngày | Số check-in ngày D không đổi |
| AC-CHK-3 | Ngày local sang D2 | Init hoặc tab visible | Tối đa một check-in ngày D2 |
| AC-CHK-4 | Tab ẩn qua đêm | Visible ở ngày local mới | Tối đa một check-in mới cho ngày mới |
| AC-CHK-5 | JSON hỏng hoặc migration/validate thất bại | App init | Có recovery. Không tạo check-in trên lần load đó. |
| AC-CHK-6 | Store hợp lệ | Init | Load, validate, và migrate xong trước khi ghi check-in |

Có field `is_demo` trên check-in hay không: **OPEN**. Không có AC khẳng định field đó tồn tại hoặc không tồn tại.

## Node

| ID | Given | When | Then |
|----|-------|------|------|
| AC-NODE-1 | Một tài liệu với title và body | Đọc store và bản đồ | Nội dung chỉ nằm trên một `Node`. Store không có `knowledge`, `mapNodes`, `nodeGraphEdges`, `noteKnowledgeLinks`. Bản đồ không có body thứ hai. |
| AC-NODE-2 | Node N và Note khác | Xóa N | N mất. Note còn. Mọi Link có N ở một đầu đều mất. |
| AC-NODE-3 | Mọi Node hiện có | Mở Knowledge Map | Mọi Node đều có mặt. Không có lệnh Remove from map. |

## Link

| ID | Given | When | Then |
|----|-------|------|------|
| AC-LINK-1 | Note và Node đủ để làm đầu mút | Tạo lần lượt bốn chiều | Store có Node→Node, Node→Note, Note→Node, Note→Note |
| AC-LINK-2 | Đã có Link A→B cùng type | Tạo lại đúng `sourceType`, `sourceId`, `targetType`, `targetId` | Vẫn một Link. Không có bản trùng chiều. |
| AC-LINK-3 | Đã có A→B | User tạo B→A | Có hai Link. Hướng của từng record giữ nguyên. |
| AC-LINK-4 | Chưa có chiều ngược | Tạo một chiều | Không xuất hiện record chiều ngược |
| AC-LINK-5 | Có Link | Xóa Link đó | Chỉ Link đó mất. Note và Node còn. |
| AC-LINK-6 | Có thư viện và chat | Hoàn tất một lượt AI | Số Note, Node, và Link không đổi vì lượt AI đó |

## Chat

| ID | Given | When | Then |
|----|-------|------|------|
| AC-CHAT-1 | Đã có messages | Reload | Cùng messages, mọi `is_demo` là false |
| AC-CHAT-2 | Mở UI chat | — | Không có điều khiển nhiều conversation |

## AI context

| ID | Given | When | Then |
|----|-------|------|------|
| AC-CTX-1 | 2 Note và 1 Node, chưa khởi tạo selection | Gửi AI | PPL gồm đúng 3 ID đó |
| AC-CTX-2 | User bỏ hết và đã lưu | Gửi AI | Phần library trong payload dài 0 |
| AC-CTX-3 | User giữ một tập con | Gửi AI | Chỉ các ID còn trong `includedIds` |
| AC-CTX-4 | User bỏ hết, rồi tạo một Note mới | Gửi AI | Library chỉ có Note mới |
| AC-CTX-5 | Selection có Node user U và Node demo D. User đã bỏ Node X. | Clear Demo | U còn trong selection. D không còn. X không bị chọn lại. Không thành select-all. |
| AC-CTX-6 | User đã bỏ Node Y. Re-fill sẽ tạo Node demo mới Z và skip demo đã có. | Re-fill | Y vẫn ngoài selection. Z được thêm. ID bị skip không được bật lại nếu user đã bỏ nó. |

AC-CTX-5 áp dụng cùng quy tắc cho Note demo và Note user.

## PPL

| ID | Criterion | Cách kiểm |
|----|-----------|-----------|
| AC-PPL-1 | Median token library giảm ≥ 30% so với nối thô cùng tập đã chọn | Fixture. Corpus **OPEN** nên test này chưa đủ dữ liệu để chạy. |
| AC-PPL-2 | Selection rỗng → library length 0, kể cả khi store còn tài liệu | Unit |
| AC-PPL-3 | Note chứa `Ignore previous instructions` | Chuỗi đó không nằm trong trusted system instructions. Client request không chứa system instruction có thẩm quyền. |
| AC-PPL-4 | Chunk đơn và chunk sau dedup | Mỗi chunk truy về đúng body đã chọn. Chunk gộp còn attribution của mọi nguồn bị gộp. |
| AC-PPL-5 | Input có khoảng trắng đầu/cuối và ký tự cần NFC | Request mang NFC của nguyên văn. Không phải chuỗi đã trim. |
| AC-PPL-6 | Tài liệu dài vượt budget | Excerpt sau compression là đoạn của nguồn. Không có fact mới. |
| AC-PPL-7 | Budget còn trống và một tài liệu không được chọn | Tài liệu đó vắng trong payload |
| AC-PPL-8 | Library vẫn vượt budget sau compression | Re-estimate, rồi bỏ chunk hạng thấp cho đến khi vào budget hoặc hết chunk. Compression xảy ra trước lần cắt này. |
| AC-PPL-9 | Response gắn nguồn ngoài request | UI không hiển thị nguồn đó như evidence |

## Local storage

| ID | Given | When | Then |
|----|-------|------|------|
| AC-LS-1 | Store hợp lệ | Export | JSON có `schemaVersion`, `notes`, `nodes`, `links`, và không có collection đã rút |
| AC-LS-2 | File export và user confirm | Import | Hành vi khớp policy import sau khi policy được chốt. Replace-all và merge-by-id đều chưa được AC này chọn. |
| AC-LS-3 | JSON hỏng | Load | Recovery. Dữ liệu tốt trước đó không bị ghi đè bởi parse rỗng. Check-in không được tạo trên lần thất bại. |
| AC-LS-4 | `QuotaExceeded` lúc save | Save | User thấy lỗi. Trạng thái trước save còn. |

## Runtime

| ID | Criterion |
|----|-----------|
| AC-RT-1 | Bundle frontend không chứa Gemini API key |
| AC-RT-2 | Lỗi 429, timeout, payload, và quota không lộ secret hoặc stack server |
| AC-RT-3 | Request từ client không chứa trusted system instructions. Runtime tự gắn system instructions trước khi gọi Gemini. |
| AC-RT-4 | Sau nhiều lượt chat, runtime không có store Note, Node, Link, chat, check-in, hay selection |
| AC-RT-5 | Attribution trên response được kiểm tra trước khi UI gắn nguồn |
| AC-RT-6 | Request vượt timeout hoặc payload limit bị từ chối với lỗi an toàn trên client |

Ngưỡng timeout, payload, và quota: **OPEN**.

## Activity

| ID | Given | When | Then |
|----|-------|------|------|
| AC-ACT-1 | Có Note | Mở Note chỉ để đọc | Không thêm ActivityEvent |
| AC-ACT-2 | Có Node | Sửa Node | Đúng một event user, `is_demo: false` |
| AC-ACT-3 | Hai record | Tạo một Link | Đúng một event tạo Link |
| AC-ACT-4 | Seed demo | Sau seed | Activity demo được phép `is_demo: true`. Check-in không tăng. |
| AC-ACT-5 | Store đang chạy | Tạo Note, xóa Note, tạo Node, xóa Node, xóa Link, gửi câu hỏi AI | Mỗi thao tác có đúng một event của chính nó |
| AC-ACT-6 | Node có nhiều Link | Xóa Node | Một event xóa Node. Không có event xóa cho từng Link bị dọn. |
| AC-ACT-7 | Có demo và user | Clear Demo | Không thêm event xóa cho từng record demo hoặc từng Link mồ côi |

## Chưa thành AC hành vi

Các mục **OPEN** trong [product-constraints.md](product-constraints.md) không được một AC ở trên chọn hộ: field `is_demo` của check-in, framework, host, `B_lib`, độ dài message, HTTP schema, demo ID manifest, import replace hay merge, câu chữ va chạm ID, corpus PPL, metadata Link, self-link, layout bản đồ, storage key, catalog `ActivityEvent.type`.
