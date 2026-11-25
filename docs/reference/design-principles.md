# Design principles (portfolio layer — project reference)

**Project-facing snapshot** của lớp thiết kế chung. Art direction riêng: `docs/design-system/` trong repo này.

## 1. Clarity

- Một màn hình có **một primary action** rõ ràng.
- Nhãn và message lỗi nói thẳng nguyên nhân hoặc bước khắc phục; tránh mã nội bộ với end user.

## 2. Accessible by default

- Keyboard: mọi control tương tác được focus và kích hoạt được.
- Focus visible; không dùng màu là tín hiệu duy nhất.
- Target size hợp lý trên touch (theo guideline platform).

## 3. Feedback

- Mọi thao tác bất đồng bộ có loading state; thành công/thất bại có feedback rõ.
- Destructive action có confirm hoặc undo khi khả thi.

## 4. Consistency (semantic, not visual)

- Cùng **ý nghĩa** → cùng pattern (ví dụ: error form, empty list).
- Visual (font, radius, illustration) **được phép khác** giữa app.

## 5. Density & responsive

- Nội dung đọc được trên viewport nhỏ nhất mà product hỗ trợ (ghi trong `docs/product/`).
- Không ẩn chức năng critical chỉ vì breakpoint nếu không có path thay thế.

## 6. Preserve capability

- Redesign: **không bỏ** workflow đã ship trừ khi `docs/product/` ghi deprecation.