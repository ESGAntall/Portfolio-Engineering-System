# Portfolio Registry

Danh sách ứng dụng độc lập thuộc portfolio. **Cập nhật thủ công** khi thêm/xóa repo.

## Repository ownership

- Mỗi hàng = **một Git repository độc lập** (remote URL riêng).
- Portfolio meta repo **không** chứa source của app; không bắt buộc cùng thư mục cha trên máy dev.
- **Specifications (portfolio):** `portfolio/project-specs/<id>/` — track trong meta repo; link registry dùng path repo-relative này.
- **Local clone (tùy chọn):** `projects/<id>/` — gitignored; có thể clone ở vị trí khác. Registry **không** giả định vị trí clone.
- Cột **Stack** = quyết định **riêng project** (specs + ADR/docs trong app repo). **Không** đọc Stack NOTEAI làm chuẩn portfolio.

| ID | Tên | Loại | Repository | Stack (project-specific) | Trạng thái | Mô tả ngắn |
|----|-----|------|------------|--------------------------|------------|------------|
| noteai | NOTEAI | Productivity / AI-powered note-taking (web) | [github.com/ESGAntall/noteai](https://github.com/ESGAntall/noteai) | Frontend-only; `localStorage` (framework TBD) — **chỉ NOTEAI** | **PLANNED** | Web client-side note-taking; prototype gốc Google AI Studio. Scaffold chưa thực hiện. |

## NOTEAI — specifications (**chỉ NOTEAI**)

- Specs: [project-specs/noteai/README.md](project-specs/noteai/README.md) — architecture, product constraints, scaffold plan.
- Remote app: [github.com/ESGAntall/noteai](https://github.com/ESGAntall/noteai) (độc lập với portfolio Git).
- Ràng buộc frontend-only / `localStorage` / không backend: **không** áp dụng cho project khác trừ khi có ADR riêng.
- AI integration: **chưa quyết định** (NOTEAI).

## Quy ước

- Bootstrap app: `project-template/` + copy rules/skills (O-001) vào **repo app riêng**.
- Không dependency runtime chéo giữa repos.
- `portfolio-engineering-system` **không** là app; là meta repo.

## Liên kết

- Design: [design-principles.md](design-principles.md)
- Engineering: [engineering-standards.md](engineering-standards.md)
- ADR: [../docs/decisions/README.md](../docs/decisions/README.md)
- Template: [../project-template/README.md](../project-template/README.md)