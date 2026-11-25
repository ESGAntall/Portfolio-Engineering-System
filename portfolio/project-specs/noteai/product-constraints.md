# NOTEAI — Product constraints

## Product

**NOTEAI** — Web app ghi chú, tài liệu, Knowledge Map và chat AI. Repo [ESGAntall/noteai](https://github.com/ESGAntall/noteai).

## Thuật ngữ

| Trong spec, code, API | UI (VI) | Không phải |
|------------------------|---------|------------|
| Note | Ghi chú | — |
| Node | Tài liệu (Knowledge) | Entity `Knowledge` riêng, entity `MapNode` |
| Link | Liên kết có hướng | `NodeGraphEdge`, `NoteKnowledgeLink` |
| Knowledge Map | Bản đồ kiến thức | Bản sao nội dung tài liệu |

Node giữ `title` và `body`. Bản đồ đọc các Node và các Link Node → Node. Chi tiết: [data-model.md](data-model.md).

## Phạm vi

Chi tiết hành vi: [product-requirements.md](product-requirements.md).

## Ràng buộc không đổi

- Không app DB, không user-account DB, không cloud sync mặc định.
- Không auth: không login, đăng ký, Google Login, demo login, logout.
- Không API key Gemini trên client.
- Không Remove from map.
- Re-fill: skip-existing. Không overwrite demo hoặc user. Không tạo ID trùng.
- Clear Demo: chỉ xóa `is_demo: true`, rồi dọn Link mồ côi. Không xóa check-in hoặc chat.
- Clear Demo gỡ ID demo đã xóa khỏi AI context selection và giữ lựa chọn còn lại.
- Không seed check-in. Activity demo được phép.
- AI không tạo, gợi ý, hoặc sửa Link.
- Không tự tạo Link ngược.
- Một chiều của một cặp chỉ có một Link (`sourceType + sourceId + targetType + targetId`).
- Runtime tạo trusted system instructions. Client không gửi system instruction có thẩm quyền.

## Chưa chọn (OPEN)

Không biến các mục này thành invariant trong implementation cho đến khi có quyết định riêng:

- Check-in có field `is_demo` hay không.
- Framework frontend và build tool.
- Host của Managed AI Runtime và phương án deploy.
- Giá trị `B_lib`.
- Giới hạn độ dài user message và response.
- HTTP request/response contract (schema cụ thể).
- Demo ID manifest.
- Import: replace-all hay merge-by-id.
- Thông báo và xử lý bổ sung khi ID demo đụng record đã có, ngoài việc không overwrite và không tạo trùng.
- Corpus fixture cho PPL.
- Metadata Link ngoài `id`, `is_demo`, `sourceType`, `sourceId`, `targetType`, `targetId` (nhãn, loại quan hệ, ý nghĩa).
- Self-link.
- Layout/tọa độ Node trên Knowledge Map.
- Storage key.
- Catalog chuỗi `ActivityEvent.type`.

## Portfolio

- Redesign sau này giữ parity với spec này (`frontend-design`).
- ADR trong repo app chỉ được chi tiết hóa mục OPEN hoặc contract triển khai. ADR đó không được đảo các ràng buộc đã chốt ở đây trừ khi user phê duyệt đổi spec.

## Acceptance

[acceptance-criteria.md](acceptance-criteria.md)
