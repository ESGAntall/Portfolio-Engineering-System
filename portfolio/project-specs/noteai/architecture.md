# NOTEAI — Architecture (confirmed)

**Phạm vi:** Chỉ project **NOTEAI**. Không áp dụng mặc định cho project khác trong portfolio.

## Tóm tắt

| Thành phần | Quyết định |
|------------|------------|
| Ứng dụng | Web app **client-side** trong portfolio; repo app độc lập |
| Dữ liệu ứng dụng | **Chỉ** `localStorage` trên browser — không DB ứng dụng phía server |
| Tài khoản / auth | **Không** — không login, đăng ký, Google Login, demo login, logout; không DB user-account |
| Gọi Gemini | **Managed AI Runtime** (proxy server-side) — API key **chỉ** trên server |
| Frontend | **Không** chứa API key; **không** gọi Gemini trực tiếp từ client với secret |

Chi tiết sản phẩm: [product-requirements.md](product-requirements.md). Mô hình dữ liệu: [data-model.md](data-model.md). Lớp xử lý prompt: [prompt-processing-layer.md](prompt-processing-layer.md).

## Ranh giới tin cậy

```text
[Browser: NOTEAI SPA]
  │  read/write application state → localStorage
  │  HTTP(S): chat completion requests (no API key in payload from client secrets)
  ▼
[Managed AI Runtime / proxy]
  │  holds Gemini API key (env/secret store)
  │  rate limit, quota, token/cost guards, request validation
  ▼
[Google Gemini API]
```

**Managed AI Runtime** không lưu trữ Note, Knowledge, Chat, check-in hay quan hệ của user — không thay thế `localStorage`. Runtime chỉ phục vụ **đường AI** (và các policy server-side liên quan quota).

## Client application

| Khía cạnh | Quyết định |
|-----------|------------|
| Persistence chính | `localStorage` (schema có version — xem [data-model.md](data-model.md)) |
| Export/import | JSON do client điều khiển |
| Đa thiết bị / sync cloud | **Out of scope** mặc định (không user account) |

## Explicitly out of scope (application data plane)

Không triển khai cho **dữ liệu ứng dụng**:

- PostgreSQL, MySQL, MongoDB hoặc DB ứng dụng khác
- ORM/server persistence cho Note, Knowledge, quan hệ, chat, check-in
- Login, registration, Google Login, demo login, logout
- Hệ thống đăng nhập / user-account database
- Lưu lịch sử chat hoặc thư viện trên server

## Managed AI Runtime (allowed server component)

| Khía cạnh | Quyết định |
|-----------|------------|
| Mục đích | Proxy an toàn tới Gemini; không expose API key ra frontend |
| API key | Chỉ trong môi trường server/secret — **không** commit vào repo app |
| Xác thực end-user | **Không** giả định — không per-user quota strict như multi-tenant auth |
| Quota | **Shared** (deployment-wide hoặc theo policy runtime) — ghi rõ trong vận hành |
| Rate limiting | Runtime **phải** có — HTTP 429 / thông báo client khi vượt; **có thể** IP-based để giảm lạm dụng (không thay thế identity user) |
| Lỗi | Phân loại: network, quota, invalid request, upstream Gemini — client hiển thị an toàn, không lộ secret |
| Token / cost | Budget trên runtime và/hoặc trong [Prompt Processing Layer](prompt-processing-layer.md) phía client trước khi gửi |

Runtime **không** được yêu cầu client gửi API key. Client có thể gửi assembled prompt/context (sau PPL) theo contract API công khai của runtime (định nghĩa chi tiết tại ADR/repo app khi implement).

## Prompt Processing Layer (client)

Trước khi gọi runtime, client chạy **Prompt Processing Layer** (xem [prompt-processing-layer.md](prompt-processing-layer.md)) — ưu tiên xử lý deterministic, giảm token, bảo toàn ý người dùng và attribution.

## Deployment ghi chú (chưa chọn cụ thể)

- Frontend: static hosting hoặc bất kỳ host phù hợp SPA.
- Managed AI Runtime: service riêng (serverless/function/container) — **framework/hosting runtime TBD** tại ADR app.
- Node.js (hoặc tương đương) cho **build tooling** frontend vẫn tách biệt với runtime AI.

## Mirror sang repo ứng dụng

Khi scaffold: copy/summary vào `docs/architecture/` của repo [noteai](https://github.com/ESGAntall/noteai). ADR bổ sung cho contract runtime API và hosting — không mâu thuẫn tài liệu này trừ khi user approve thay đổi ràng buộc.

## Open (chưa quyết định tại meta)

- Frontend framework / build tool
- Hình thức cụ thể của Managed AI Runtime (host, contract chi tiết)
- Giá trị số cụ thể shared quota / token budget mặc định (policy vận hành + acceptance trong [acceptance-criteria.md](acceptance-criteria.md))