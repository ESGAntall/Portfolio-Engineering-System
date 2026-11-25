# Project Template (Application Repository)

Skeleton cho **một Git repository ứng dụng độc lập** trong portfolio (tách biệt repo meta). Đổi tên repo và điền docs — không nhúng nội dung product cụ thể vào template.

- **Không** bắt buộc backend, database, hay framework — ghi trong `docs/architecture/` khi phân tích project.
- Ràng buộc của app khác (vd. NOTEAI) **không** áp dụng mặc định cho repo mới.

**Bootstrap khuyến nghị:** Portfolio Local CLI từ portfolio meta repo (O-001 COPY):

```bash
node cli/bin/portfolio.js create <project-name>
node cli/bin/portfolio.js create <name> --path "<custom-dir>"
```

CLI copy template + rules 00–30 + skills + canonical `docs/reference/` (policy). Scaffold `docs/reference/project-context.md` đi kèm template.

## Bootstrap checklist

1. Chạy `create` (hoặc copy thủ công chỉ khi không dùng CLI — xem [cli/README.md](../cli/README.md)).
2. **`.gitignore` (bắt buộc):** [docs/engineering/gitignore.md](docs/engineering/gitignore.md) **trước** cài dependency / build.
3. `git init` (**thủ công**).
4. Điền [docs/reference/project-context.md](docs/reference/project-context.md); kiểm tra `.portfolio/manifest.json`.
5. Giữ/chỉnh `99-project-local.mdc` — **không** bị sync tương lai ghi đè.
6. Đổi `README.md` app — tên, mô tả, lệnh dev khi đã có stack.
7. Đăng ký app (thao tác trong **portfolio meta repo** khi có quyền truy cập).
8. Điền `docs/product/`, `docs/architecture/`, `docs/design-system/`, `docs/testing/`, `docs/decisions/`.
9. **Code graph** (khi có source): [docs/reference/O-002-codebase-graph.md](docs/reference/O-002-codebase-graph.md); điền `code-graph.md` + manifest.

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

Bootstrapped via Portfolio Local CLI (O-001 COPY). Ghi `cliVersion` / thời điểm trong `.portfolio/manifest.json` — không cần mở meta repo để làm việc hàng ngày.
```

## Không làm khi chỉ copy template

- Không commit secret.
- Không cài package/graph chỉ vì copy template; Graphify chỉ khi app có source và user đồng ý (O-002).