# NOTEAI — Architecture (confirmed)

**Phạm vi:** Chỉ project **NOTEAI**. Không áp dụng mặc định cho project khác trong portfolio.

## Tóm tắt

| Thành phần | Quyết định |
|------------|------------|
| Ứng dụng | Web app client-side. Repo app độc lập với portfolio meta repo. |
| Dữ liệu ứng dụng | Chỉ `localStorage`. Không DB ứng dụng phía server. |
| Tài liệu | Entity `Node`. UI gọi là Tài liệu / Knowledge. Không có entity Knowledge hay MapNode riêng. |
| Quan hệ | Entity `Link` có hướng. Không có `NodeGraphEdge` hay `NoteKnowledgeLink`. |
| Tài khoản / auth | Không login, đăng ký, Google Login, demo login, logout. Không DB user-account. |
| Gọi Gemini | Managed AI Runtime. API key chỉ trên server. |
| Frontend | Không chứa API key. Không gọi Gemini bằng secret. |

Chi tiết sản phẩm: [product-requirements.md](product-requirements.md). Dữ liệu: [data-model.md](data-model.md). PPL: [prompt-processing-layer.md](prompt-processing-layer.md).

## Ranh giới tin cậy

```text
[Browser: NOTEAI SPA]
  │  read/write application state → localStorage
  │  PPL deterministic trên client
  │  HTTP(S): structured request (không API key, không trusted system instruction)
  ▼
[Managed AI Runtime]
  │  giữ Gemini API key
  │  validate request
  │  tự tạo trusted system instructions
  │  rate limit, quota, timeout, payload limit, token/cost guards
  ▼
[Google Gemini API]
  │
  ▼
[Runtime]
  │  validate attribution của response
  ▼
[Browser]
  │  chỉ hiển thị attribution đã qua kiểm tra
```

Note, Node và user message là untrusted input. Delimiter trong text chỉ là cấu trúc dữ liệu, không phải ranh giới tin cậy.

Runtime không lưu Note, Node, Link, Chat, check-in, Activity, hay AI context selection. Runtime không thay `localStorage`.

## Client application

| Khía cạnh | Quyết định |
|-----------|------------|
| Persistence | `localStorage`, `schemaVersion` 1 — [data-model.md](data-model.md) |
| Knowledge Map | View trên mọi Node và mọi Link Node → Node. Không copy body. Không Remove from map. |
| Export / import | JSON do client giữ. Policy replace hay merge: **OPEN**. |
| Đa thiết bị / cloud sync | Ngoài phạm vi mặc định |

Init app: load, validate, và migrate store trước check-in. Load thất bại thì không tạo check-in.

## Ngoài phạm vi (data plane của ứng dụng)

- PostgreSQL, MySQL, MongoDB hoặc DB ứng dụng khác
- ORM hoặc persistence server cho Note, Node, Link, chat, check-in
- Login, registration, Google Login, demo login, logout
- Lưu thư viện hoặc lịch sử chat trên server
- Remove from map, `MapNode`, collection `knowledge`

## Managed AI Runtime

| Khía cạnh | Quyết định |
|-----------|------------|
| Mục đích | Proxy tới Gemini. Không đưa API key ra frontend. |
| API key | Chỉ trong môi trường server. Không commit vào repo app. |
| End-user auth | Không giả định. Không có per-user quota strict. |
| Quota | Shared trên deployment. Con số: **OPEN**. |
| Rate limit | Bắt buộc. Vượt ngưỡng thì HTTP 429 và thông báo an toàn trên client. Có thể giới hạn theo IP. IP limit không phải danh tính user. |
| Timeout và payload limit | Bắt buộc có guard. Ngưỡng số: **OPEN**. |
| Lỗi | Phân loại network, quota, invalid request, timeout, upstream Gemini. Client không hiện secret hoặc internals. |
| System instructions | Chỉ runtime tạo và gắn. Client không gửi bản có thẩm quyền. |
| Attribution | Runtime kiểm tra nguồn trong response trước khi client coi đó là evidence. |

Client gửi structured request sau PPL. Request gồm dữ liệu untrusted (user message sau NFC, các chunk thư viện đã chọn, attribution, `pplVersion`). Schema HTTP cụ thể: **OPEN**.

## Prompt Processing Layer

Chạy trên client, deterministic, trước request. Chi tiết và thứ tự bước: [prompt-processing-layer.md](prompt-processing-layer.md).

PPL giảm rủi ro prompt injection. PPL không bảo đảm đã loại hết injection.

## Deployment

- Frontend: static hosting hoặc host SPA khác. Lựa chọn cụ thể: **OPEN**.
- Managed AI Runtime: service riêng. Host và hình thức deploy: **OPEN**.
- Công cụ build frontend tách khỏi process giữ API key.
- Framework và build tool: **OPEN**.

## Mirror sang repo ứng dụng

Khi scaffold được phê duyệt: đưa tóm tắt constraint này vào `docs/architecture/` của repo [noteai](https://github.com/ESGAntall/noteai). ADR app được phép ghi schema cho các mục **OPEN**. ADR đó không được đổi các quyết định đã chốt trong file này trừ khi user phê duyệt sửa spec.

## Open

- Framework / build tool
- Host runtime, deploy, và HTTP contract
- Giá trị quota, `B_lib`, giới hạn độ dài message và response, timeout, payload limit
- Layout Node trên Knowledge Map
