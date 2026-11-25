# NOTEAI — Prompt Processing Layer (PPL)

Lớp xử lý **trên client** (ưu tiên code deterministic) **trước** khi gọi Managed AI Runtime → Gemini.

## Mục tiêu

- Giảm token/cost trong khi bảo toàn ý user và evidence.
- Ngăn prompt injection từ Notes/Knowledge.
- Đo lường được chất lượng và mức giảm token.

## Pipeline (thứ tự bắt buộc)

1. **Input validation & normalization**
   - Trim whitespace; giới hạn độ dài user message (min/max ký tự — ADR số cụ thể).
   - Từ chối empty sau normalize (UI validation trước).
   - Unicode NFC normalize (optional, recommended).

2. **Context selection (preference-aware)**
   - Đọc `aiContextSelection` từ store.
   - Chỉ include Note/Knowledge **được chọn** (`noteId` / `knowledgeId` — không map layout); nếu không còn ID nào → context thư viện **rỗng** (không fallback all).
   - Đồng bộ: đã xóa doc → loại khỏi set trước bước này.

3. **Duplicate-content reduction**
   - Phát hiện đoạn trùng lặp giữa các doc (hash đoạn / shingle đơn giản).
   - Gộp hoặc bỏ bản duplicate; **giữ** một bản và attribution tới nguồn gốc.

4. **Relevant-context filtering & token budgeting**
   - Ước lượng token (heuristic chars/4 hoặc tokenizer ADR chọn).
   - Budget tổng cho library content: `B_lib` (config; acceptance có ngưỡng test).
   - Ranking: doc user-selected > keyword overlap với user message > recency (tie-break).
   - Cắt đuôi ranking khi vượt `B_lib`.

5. **Safe context compression (when necessary)**
   - Chỉ khi vẫn vượt budget sau bước 4.
   - Cho phép: đầu+đuôi + ellipsis marker; heading-aware excerpt.
   - **Cấm**: thêm fact không có trong nguồn; đổi nghĩa câu.
   - Mọi excerpt giữ `sourceId` + offset/section id cho attribution.

6. **Prompt assembly**
   - Khối **system instructions** (fixed template runtime/client — không user-editable từ library).
   - Khối **library context** (untrusted, delimited, ví dụ `<library source="note:id">...</library>`).
   - Khối **user message** (nguyên văn sau normalize — không rewrite ý).
   - Thứ tự và delimiter **cố định** trong code (versioned `pplVersion`).

7. **Source attribution & evidence preservation**
   - Output metadata kèm request: danh sách `{ id, type: note|knowledge, excerptRef? }` đã đưa vào prompt.
   - UI hiển thị nguồn tham chiếu cho câu trả lời (FR product).

## Ràng buộc an toàn

| Ràng buộc | Mô tả |
|-----------|--------|
| Intent preservation | User message không bị paraphrase trước model |
| Untrusted library | Notes/Knowledge **không** được coi là system instruction |
| No override | Library không thể override system block (delimiter + policy runtime) |
| No invention | Compression không thêm thông tin |
| Deterministic first | Bước 1–6 không gọi thêm model chỉ để preprocess (trừ future ADR explicit) |

## Token / cost controls

- `B_lib` + cap message user + cap response (runtime) cộng hưởng.
- Log nội bộ client (dev): `tokensEstimatedBefore`, `tokensEstimatedAfter` mỗi request (không bắt buộc persist user).

## Acceptance criteria (PPL)

Xem chi tiết số liệu: [acceptance-criteria.md](acceptance-criteria.md). Tóm tắt:

- Với fixture corpus chuẩn (định nghĩa trong repo app test), **median** giảm token library ≥ **30%** sau bước 3–5 so với nối thô full selected docs (cùng selection).
- **100%** request với empty selection: payload library **length 0** (không silent all).
- **0** case test injection: chuỗi `Ignore previous instructions` trong Note **không** xuất hiện trong system block.
- Mọi chunk trong prompt library có ≥ 1 `sourceId` trong attribution metadata.
- User message byte-identical (sau NFC) giữa input UI và assembled prompt.

## Versioning

- `pplVersion` integer trong client; thay đổi assembly breaking → bump + migration không bắt buộc (runtime stateless).

## Open (ADR app)

- Giá trị `B_lib` mặc định và max user message length.
- Fixture corpus cho test regression PPL.