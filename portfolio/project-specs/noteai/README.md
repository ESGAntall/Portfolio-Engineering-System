# NOTEAI — Portfolio specifications

Tài liệu **sản phẩm và kiến trúc** do portfolio quản lý (track trong repo meta). **Không** phải application source.

## Tài liệu

| Tài liệu | Mục đích |
|----------|----------|
| [architecture.md](architecture.md) | Client `localStorage`, Managed AI Runtime → Gemini, ranh giới tin cậy |
| [product-constraints.md](product-constraints.md) | Phạm vi, thuật ngữ, ràng buộc không đổi |
| [product-requirements.md](product-requirements.md) | Yêu cầu chức năng & user flows |
| [data-model.md](data-model.md) | Entity, quan hệ, `is_demo`, localStorage & demo policies |
| [prompt-processing-layer.md](prompt-processing-layer.md) | PPL trước Gemini — safety, token, assembly |
| [acceptance-criteria.md](acceptance-criteria.md) | Tiêu chí kiểm thử có thể đo |
| [scaffold-plan.md](scaffold-plan.md) | Kế hoạch bootstrap repo app (chưa thực thi) |

**Đọc theo thứ tự gợi ý:** constraints → architecture → data-model → product-requirements → PPL → acceptance.

## Repositories (phân biệt)

| Loại | Vị trí |
|------|--------|
| **Remote (application)** | [https://github.com/ESGAntall/noteai](https://github.com/ESGAntall/noteai) |
| **Specifications (đây)** | `portfolio/project-specs/noteai/` trong portfolio meta repo |
| **Local clone (tùy chọn)** | `projects/noteai/` từ root portfolio — **gitignored**; có thể clone ở path khác |
| **Registry** | [portfolio-registry.md](../../portfolio-registry.md) |

## Trạng thái

| Khía cạnh | Trạng thái |
|-----------|------------|
| Product spec (portfolio) | **DOCUMENTED** — cross-doc thống nhất (Knowledge/Node, Re-fill skip-existing, `is_demo`) — sẵn sàng plan implementation |
| Application scaffold (source + runtime deploy) | **PLANNED** — chưa thực thi theo [scaffold-plan.md](scaffold-plan.md) |

Portfolio bootstrap cục bộ (`projects/noteai/`) **không** thay thế application scaffold — xem audit N-01.1.