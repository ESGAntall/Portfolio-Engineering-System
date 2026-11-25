# NOTEAI — Scaffold plan (not executed)

Chỉ kế hoạch. **Chưa** clone, push, pull, `package.json`, dependencies, hoặc source.

## Preconditions

- [x] Ràng buộc ghi trong [architecture.md](architecture.md)
- [x] Registry URL: https://github.com/ESGAntall/noteai
- [ ] User approve bắt đầu scaffold (task có thể là **lớn** theo O-003)

## Planned steps (khi được phê duyệt)

1. Làm việc trong repo ứng dụng `noteai` (remote hoặc local clone — vd. `projects/noteai/`).
2. Copy `project-template/` vào root app repo.
3. Copy rules/skills portfolio (O-001) + giữ `99-project-local.mdc` cho globs/stack khi đã chọn.
4. Viết `docs/architecture/` từ [architecture.md](architecture.md); không thêm backend sections.
5. Viết `docs/product/` từ feature inventory đã xác nhận (không đổi scope).
6. Điền `docs/testing/` khi đã có lệnh verify — **sau** khi user chọn framework/tooling.
7. Không cài Graphify cho đến khi có source đáng kể (O-002).

## Out of scope for scaffold

- Backend, DB, API server
- Default Express/Nest/Prisma/Postgres/Mongo
- Commit API keys trong frontend
- Quyết định AI integration (chờ ADR riêng)

## Verification (sau scaffold, tương lai)

- Docs phản ánh frontend-only + localStorage.
- Không file server entry / API routes trừ khi user đổi ràng buộc bằng ADR.