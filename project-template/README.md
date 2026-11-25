# Project Template (Application Repository)

Skeleton cho **một Git repository ứng dụng độc lập** trong portfolio (tách biệt repo meta). Đổi tên repo và điền docs — không nhúng nội dung product cụ thể vào template.

- **Không** bắt buộc backend, database, hay framework — ghi trong `docs/architecture/` khi phân tích project.
- Ràng buộc của app khác (vd. NOTEAI) **không** áp dụng mặc định cho repo mới.

Phân phối rules/skills: **ADR O-001** (`portfolio-engineering-system/docs/decisions/O-001-...`) — **copy** từ portfolio; sync script versioned **sau này** (chưa có).

## Bootstrap checklist

1. Tạo repository mới; copy toàn bộ `project-template/` vào root (gồm `.gitignore` generic).
2. **`.gitignore` (bắt buộc):** làm theo [docs/engineering/gitignore.md](docs/engineering/gitignore.md) **trước** cài dependency / build — adapt stack; báo rule generic vs stack-specific.
3. **Copy** `.cursor/rules/` (00–30) và `.cursor/skills/` từ `portfolio-engineering-system` vào app repo (source of truth = portfolio).
4. Giữ/chỉnh `99-project-local.mdc` — **không** bị sync tương lai ghi đè.
5. Đổi `README.md` app — tên, mô tả, lệnh dev khi đã có stack.
6. Đăng ký trong `portfolio/portfolio-registry.md` (trong portfolio meta repo).
7. Điền `docs/product/`, `docs/architecture/`, `docs/design-system/`, `docs/testing/`, `docs/decisions/`.
8. **Code graph** (khi đã có source): **ADR O-002** — Graphify ưu tiên; kiểm tra Python/uv/pipx trước khi đề xuất cài; điền `code-graph.md` + manifest. **Không** cài Graphify chỉ từ bước copy template.

## Skills

- **Repository-only** — skills nằm trong `.cursor/skills/` của app; **không** mirror vào `~/.cursor/skills/`.
- Chi tiết: [.cursor/skills/README.md](.cursor/skills/README.md).

## Placeholder README (thay khi tạo app)

```markdown
# <App Name>

<Mô tả một đoạn>

## Development

<lệnh install/run/test — điền khi có stack>

## Documentation

- Product: docs/product/
- Architecture: docs/architecture/
- Design: docs/design-system/
- ADR: docs/decisions/
- Testing: docs/testing/

## Portfolio

Rules/skills copied from portfolio-engineering-system (ghi commit/tag portfolio đã copy).
```

## Không làm khi chỉ copy template

- Không commit secret.
- Không cài package/graph chỉ vì copy template; Graphify chỉ khi app có source và user đồng ý (O-002).