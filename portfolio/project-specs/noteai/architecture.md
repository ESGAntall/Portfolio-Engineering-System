# NOTEAI — Architecture constraints (confirmed)

**Phạm vi:** Chỉ áp dụng cho project **NOTEAI**. Không phải quy tắc portfolio; project khác có thể có backend/database theo ADR riêng.

Các quyết định dưới đây đã được user xác nhận. Scaffold và implementation **phải** tuân thủ trong repo NOTEAI; không suy diễn thêm backend cho NOTEAI.

## Application shape

| Khía cạnh | Quyết định |
|-----------|------------|
| Application type | **Client-side** web application |
| Persistence | **Browser `localStorage`** — primary persistence layer |
| Backend application | **NONE** |
| Server-side database | **NONE** |
| Backend API | **NONE** |
| Deployment model (logic) | **Frontend-only** — mọi state/ persistence trong client trừ khi ADR app sau này thay đổi có approval |

## Explicitly out of scope (scaffold & default stack)

**Không** đề xuất hoặc triển khai trong scaffold:

- Express, NestJS, hoặc Node.js **backend application**
- PostgreSQL, MySQL, MongoDB
- Prisma hoặc ORM phía server
- Backend API server

**Lưu ý:** Node.js (hoặc tool tương đương) chỉ được dùng cho **frontend build/tooling** nếu user chọn sau — **không** nhầm với backend application.

## AI integration

- Kiến trúc tích hợp AI: **NOT YET DECIDED**.
- Mọi phương án AI phải đánh giá dưới ràng buộc **frontend-only**.
- Nếu phương án **yêu cầu backend** (proxy bắt buộc, secret trên server, v.v.) → báo rõ **không tương thích** với ràng buộc hiện tại; **không** tự thêm backend.
- **Không** ghi API key hoặc secret trực tiếp trong frontend source code.

## Documentation khi scaffold repo `noteai`

Mirror nội dung này vào `docs/architecture/` của repo ứng dụng (sau khi copy `project-template/`). ADR riêng chỉ khi có quyết định mới (vd. AI integration) — không contradict các ràng buộc trên trừ user approval.

## Open (chưa quyết định)

- Frontend framework / build tool
- AI integration pattern compatible with frontend-only