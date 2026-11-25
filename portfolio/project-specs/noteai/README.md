# NOTEAI — Portfolio specifications

Tài liệu sản phẩm và kiến trúc do portfolio quản lý, track trong repo meta. Không phải application source.

## Tài liệu

| Tài liệu | Mục đích |
|----------|----------|
| [architecture.md](architecture.md) | Client `localStorage`, Managed AI Runtime, ranh giới tin cậy |
| [product-constraints.md](product-constraints.md) | Phạm vi, thuật ngữ, ràng buộc đã chốt, danh sách OPEN |
| [product-requirements.md](product-requirements.md) | Yêu cầu chức năng và user flows |
| [data-model.md](data-model.md) | Node, Note, Link, `is_demo`, localStorage, demo |
| [prompt-processing-layer.md](prompt-processing-layer.md) | PPL trên client và phần runtime liền sau request |
| [acceptance-criteria.md](acceptance-criteria.md) | Tiêu chí kiểm thử |
| [scaffold-plan.md](scaffold-plan.md) | Kế hoạch bootstrap repo app. Chưa được approve và chưa thực thi. |

Thứ tự đọc: constraints → architecture → data-model → product-requirements → PPL → acceptance → scaffold plan.

## Quyết định đã thống nhất trong bộ này

- Node là entity tài liệu duy nhất. UI gọi là Tài liệu / Knowledge. Không có entity Knowledge hay MapNode riêng.
- Knowledge Map là view của mọi Node và mọi Link Node → Node. Không copy body. Không có Remove from map.
- Link là quan hệ có hướng duy nhất, đủ bốn chiều Note/Node. Unique theo chiều.
- Demo skip-existing, Clear Demo, và AI context selection theo [data-model.md](data-model.md).
- PPL deterministic trên client. Trusted system instructions chỉ do runtime tạo.

Các mục OPEN được liệt kê cùng một danh sách trong [product-constraints.md](product-constraints.md) và được các file kia dẫn lại. Chúng chưa được chọn trong bộ spec này. Vì còn OPEN, bộ tài liệu chưa đủ để bắt đầu implementation của những phần phụ thuộc vào chúng.

Không có xung đột đã biết giữa các quy tắc đã chốt trong tám file này. Câu đó không có nghĩa là scaffold đã được duyệt.

## Repositories

| Loại | Vị trí |
|------|--------|
| Remote (application) | [https://github.com/ESGAntall/noteai](https://github.com/ESGAntall/noteai) |
| Specifications | `portfolio/project-specs/noteai/` trong portfolio meta repo |
| Local clone (tùy chọn) | `projects/noteai/` từ root portfolio. Gitignored. Có thể clone ở path khác. |
| Registry | [portfolio-registry.md](../../portfolio-registry.md) |

## Trạng thái

| Khía cạnh | Trạng thái |
|-----------|------------|
| Quy tắc đã chốt trong tám file spec | Khớp nhau tại lần đồng bộ này |
| Phần phụ thuộc mục OPEN | Chưa chốt. Chưa đủ để implement các phần đó. |
| Application scaffold | **PLANNED**. Ô user approve trong [scaffold-plan.md](scaffold-plan.md) vẫn trống. |

Nếu máy dev có `projects/noteai/`, thư mục đó chỉ là chỗ clone hoặc skeleton local bị gitignore. Nó không phải bản scaffold ứng dụng và không phải nguồn spec. Meta repo không giữ audit riêng cho thư mục đó.
