# NOTEAI — Scaffold plan (not executed)

Chỉ kế hoạch. Chưa có `package.json`, dependency, application source, hoặc deploy Managed AI Runtime trong repo app.

Phê duyệt task đồng bộ spec **không** phải phê duyệt scaffold và **không** đánh dấu scaffold đã xong.

## Preconditions

- [x] Ràng buộc và product spec trong thư mục này, gồm [architecture.md](architecture.md), [data-model.md](data-model.md), [product-requirements.md](product-requirements.md), [prompt-processing-layer.md](prompt-processing-layer.md), [acceptance-criteria.md](acceptance-criteria.md)
- [x] Registry URL: https://github.com/ESGAntall/noteai
- [x] User approve bắt đầu scaffold application (task có thể là lớn theo O-003)

Các mục **OPEN** trong [product-constraints.md](product-constraints.md) không bị coi là đã chốt nhờ plan này. Schema HTTP, framework, và host runtime cần quyết định trước khi implementation phụ thuộc vào chúng. Chúng không tự bật ô approve scaffold.

## Planned steps (khi được phê duyệt)

1. Làm việc trong repo ứng dụng `noteai` (remote hoặc clone thật). Thư mục gitignored `projects/noteai/` trong meta repo, nếu đang là skeleton CLI, không thay thế repo đó.
2. Copy `project-template/` vào root app repo (CLI `create` hoặc tương đương) khi đích chưa có file. CLI từ chối ghi đè đích đã có file.
3. Copy rules/skills portfolio (O-001) và giữ `99-project-local.mdc` khi đã chọn stack.
4. Mirror vào `docs/architecture/`: Node là tài liệu duy nhất, Link có hướng, `localStorage`, PPL, ranh giới Managed AI Runtime. ADR app cho các mục OPEN, gồm HTTP contract khi user đã chốt schema.
5. Mirror vào `docs/product/`: [product-requirements.md](product-requirements.md) và [acceptance-criteria.md](acceptance-criteria.md).
6. Mirror [data-model.md](data-model.md) vào `docs/architecture/` hoặc `docs/product/`.
7. Điền `docs/testing/` khi đã có lệnh verify. Map AC-* vào test plan. AC đang chờ fixture hoặc policy OPEN giữ trạng thái chưa chạy được.
8. Triển khai Managed AI Runtime theo ADR đã duyệt. Không nhúng API key vào frontend build. Runtime tự tạo trusted system instructions.
9. Không cài Graphify cho đến khi có source đáng kể (O-002).

## Out of scope for scaffold

- Application database và user account
- Lưu Note/Node trên server
- Commit API key trong frontend
- Seed check-in
- Entity `MapNode`, collection `knowledge`, `NodeGraphEdge`, `NoteKnowledgeLink`
- Remove from map

## In scope (đã chốt ở meta — phải phản ánh khi scaffold)

- `localStorage` schema v1 trong [data-model.md](data-model.md)
- Managed AI Runtime, key chỉ ở server
- PPL client trong [prompt-processing-layer.md](prompt-processing-layer.md)
- Ô approve ở trên vẫn là điều kiện để bắt đầu các bước này

## Verification (sau scaffold, tương lai)

- Docs app nói đúng Node, Link, localStorage, và ranh giới runtime.
- Không file nào trong bundle client chứa Gemini API key.
- Test map tối thiểu: AC-DEMO-1, AC-DEMO-2, AC-DEMO-6, AC-DEMO-7, AC-CHK-5, AC-CHK-6, AC-NODE-1, AC-NODE-2, AC-LINK-1, AC-LINK-2, AC-LINK-4, AC-CTX-2, AC-CTX-4, AC-CTX-5, AC-PPL-2, AC-PPL-3, AC-PPL-5, AC-ACT-6.
