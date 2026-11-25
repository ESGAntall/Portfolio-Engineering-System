# Design Principles (Portfolio Layer)

Lớp **bắt buộc tối thiểu** cho mọi app. Art direction, màu thương hiệu và motion đặc thù nằm trong `docs/design-system/` của từng project.

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

- Nội dung đọc được trên viewport nhỏ nhất mà product hỗ trợ (ghi trong `docs/product/` của từng app).
- Không ẩn chức năng critical chỉ vì breakpoint nếu không có path thay thế.

## 6. Preserve capability

- Redesign tuân baseline portfolio (rules 00, 20 và file reference tương ứng trong app): **không bỏ** workflow đã ship trừ khi `docs/product/` ghi deprecation.

## Áp dụng trong Cursor

| Cơ chế | Vai trò |
|--------|---------|
| File này | Must-level portfolio |
| Rule `20-ui-ux-system.mdc` | Source UI (`**/*.tsx`, …) + `docs/design-system/`; framework khác → `99-project-local.mdc` |
| `project-template/docs/design-system/` | Khung product layer khi tạo app |
| Skill `frontend-design` | Quyết định screen-level |
| Skill `portfolio-design-system` | Sửa chuẩn chung portfolio |