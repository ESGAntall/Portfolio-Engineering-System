# NOTEAI — Scaffold plan (not executed)

Chỉ kế hoạch. **Chưa** `package.json`, dependencies, application source, hoặc deploy Managed AI Runtime trong repo app.

## Preconditions

- [x] Ràng buộc & product spec trong thư mục này (đặc biệt [architecture.md](architecture.md), [product-requirements.md](product-requirements.md))
- [x] Registry URL: https://github.com/ESGAntall/noteai
- [ ] User approve bắt đầu scaffold application (task có thể là **lớn** theo O-003)

## Planned steps (khi được phê duyệt)

1. Làm việc trong repo ứng dụng `noteai` (remote hoặc local clone — **không** coi chỉ `projects/noteai/` gitignored là đủ nếu chưa có source).
2. Copy `project-template/` vào root app repo (CLI `create` hoặc tương đương).
3. Copy rules/skills portfolio (O-001) + giữ `99-project-local.mdc` khi đã chọn stack.
4. Mirror vào `docs/architecture/`: client persistence, PPL overview, Managed AI Runtime boundary — từ [architecture.md](architecture.md); ADR cho contract runtime API.
5. Mirror vào `docs/product/`: requirements, acceptance — từ [product-requirements.md](product-requirements.md), [acceptance-criteria.md](acceptance-criteria.md).
6. Mirror data policies vào `docs/architecture/` hoặc `docs/product/`: [data-model.md](data-model.md).
7. Điền `docs/testing/` khi đã có lệnh verify — sau khi user chọn framework/tooling; map AC-* vào test plan.
8. Triển khai Managed AI Runtime (repo riêng hoặc package trong monorepo — ADR); **không** nhúng API key vào frontend build.
9. Không cài Graphify cho đến khi có source đáng kể (O-002).

## Out of scope for scaffold

- Application database / user accounts
- Lưu thư viện Note/Knowledge trên server
- Commit API keys trong frontend
- Seed check-in giả trong demo

## In scope (đã quyết định ở meta — phải reflect khi scaffold)

- `localStorage` schema v1+ ([data-model.md](data-model.md))
- Managed AI Runtime proxy Gemini (server-side key only)
- PPL client ([prompt-processing-layer.md](prompt-processing-layer.md))

## Verification (sau scaffold, tương lai)

- Docs app phản ánh localStorage + runtime boundary.
- Không file chứa Gemini API key trong bundle client.
- Test map tối thiểu AC-DEMO-1, AC-DEMO-2, AC-DEMO-6, AC-CHK-1, AC-CHK-4, AC-CTX-2, AC-CTX-4, AC-CTX-5, AC-KNOW-1, AC-PPL-2 (theo [acceptance-criteria.md](acceptance-criteria.md)).