# NOTEAI — Prompt Processing Layer (PPL)

PPL chạy **trên client**, bằng code deterministic, **trước** request sang Managed AI Runtime. Runtime gọi Gemini.

## Mục tiêu

- Giảm token và chi phí trong khi giữ ý user và evidence.
- Giảm rủi ro prompt injection từ Note, Node, và user message.
- Không biến bước preprocess thành nơi phát hành system instruction.
- Đo được mức giảm token trên một corpus cố định khi corpus đó đã được chốt.

PPL không bảo đảm loại hết prompt injection.

## Pipeline

Thứ tự bắt buộc:

1. **Validate và normalize input**
   - User message đưa vào request là bản NFC của nội dung người dùng nhập.
   - Không trim nội dung được gửi. Không paraphrase, không viết lại.
   - UI được phép coi message là rỗng khi trim chỉ để chặn gửi. Kết quả trim không thay thế nội dung gốc.
   - Giới hạn độ dài tối đa: **OPEN**. Khi đã có giới hạn, vượt giới hạn thì từ chối gửi, không cắt lén nội dung.

2. **Context selection**
   - Đọc `aiContextSelection`.
   - Chỉ Note và Node có ID trong `includedIds` được vào các bước sau.
   - Selection rỗng → thư viện rỗng. Không fallback select-all.
   - ID đã xóa phải đã được gỡ khỏi selection trước bước này.
   - Không thêm tài liệu chưa chọn để lấp chỗ trống trong budget.

3. **Deduplicate**
   - Phát hiện đoạn trùng giữa các tài liệu đã chọn (hash đoạn hoặc shingle).
   - Được giữ một bản nội dung trùng.
   - Attribution của **mọi** nguồn bị gộp phải còn trên chunk đó. Dedup không được bỏ nguồn.

4. **Chunk và truy xuất nguồn**
   - Chia phần thư viện còn lại thành chunk.
   - Mỗi chunk trỏ được về Note hoặc Node nguồn và về vị trí excerpt trong body nguồn.
   - Tên field locator cụ thể thuộc HTTP contract: **OPEN**. Khả năng truy ngược là bắt buộc.

5. **Ranking trong tập đã chọn**
   - Chỉ rank các chunk từ bước 2–4.
   - Trong tập đó: keyword overlap với user message, rồi recency của tài liệu nguồn để phá hòa.
   - Tài liệu user không chọn không có hạng và không được kéo vào.

6. **Compression khi vượt budget**
   - Ước lượng token bằng heuristic hoặc tokenizer. Cách ước lượng cụ thể: **OPEN**, cùng `B_lib`.
   - Nếu tổng library vượt `B_lib`, nén deterministic, ưu tiên extractive.
   - Được phép: excerpt nguyên văn, đầu và đuôi kèm dấu lược bỏ, excerpt theo heading nếu heading có trong nguồn.
   - Cấm: thêm fact, đổi nghĩa, tóm tắt suy diễn.
   - Chunk sau nén vẫn trỏ đủ mọi nguồn đã gắn ở bước 3 và 4.

7. **Re-estimate**
   - Ước lượng lại token library sau compression.

8. **Cắt chunk ưu tiên thấp**
   - Nếu vẫn vượt `B_lib`, bỏ chunk hạng thấp cho đến khi nằm trong budget hoặc thư viện hết chunk.
   - Không thay chunk đã bỏ bằng tài liệu ngoài selection.

9. **Assemble structured request**
   - Payload gồm: `pplVersion`, user message đã NFC, các chunk còn lại, attribution của từng chunk.
   - Không có system instruction có thẩm quyền.
   - Không có khối “system” do client soạn để runtime phải tuân theo.
   - Delimiter, nếu có trong biểu diễn text của một chunk, chỉ ngăn cách dữ liệu.

10. **Runtime**
    - Validate request.
    - Tự tạo trusted system instructions.
    - Gọi Gemini.
    - Note, Node, và user message vẫn là untrusted input ở phía runtime.

11. **Attribution của response**
    - Runtime kiểm tra nguồn mà response gắn vào.
    - Client chỉ hiển thị nguồn đã qua kiểm tra.
    - Nguồn không nằm trong request, hoặc không truy được về chunk đã gửi, không được trình bày như evidence.

Bước 1–9 không gọi model khác để preprocess.

## Ràng buộc

| Ràng buộc | Quy tắc |
|-----------|---------|
| Intent | User message trong request bằng NFC của input. Không trim, không viết lại. |
| Selection | Tập đã chọn là chặn cứng. |
| Untrusted | Note, Node, user message không phải system instruction. |
| System prompt | Chỉ runtime tạo bản có thẩm quyền. |
| Delimiter | Cấu trúc dữ liệu, không phải security boundary. |
| Dedup | Giữ attribution của tất cả nguồn bị gộp. |
| Compression | Extractive. Không bịa và không đổi nghĩa. |
| Injection | Preprocess trên client chỉ giảm rủi ro. |
| Version | `pplVersion` đi cùng request. Đổi assembly breaking thì tăng version. Runtime stateless nên không bắt buộc migration phía server. |

## Token

- `B_lib` cộng với trần user message và trần response phía runtime.
- Giá trị số: **OPEN**.
- Log dev được phép có `tokensEstimatedBefore` và `tokensEstimatedAfter`. Không bắt buộc lưu log đó vào store của user.

## Acceptance

Chi tiết: [acceptance-criteria.md](acceptance-criteria.md).

- Median token library giảm tối thiểu 30% so với nối thô đúng các tài liệu đã chọn, trên fixture corpus cố định. Corpus: **OPEN**.
- Selection rỗng → độ dài phần library trong payload bằng 0.
- Mọi chunk còn lại truy được về nguồn đã chọn. Chunk gộp truy được về mọi nguồn bị gộp.
- User message trong request là NFC của input, không phải bản đã trim.

## Open

- `B_lib`, estimator, trần độ dài user message, trần response
- HTTP schema, gồm tên field locator
- Fixture corpus và bộ đo median
