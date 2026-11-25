# NOTEAI — Product constraints

## Product

**NOTEAI** — Web app ghi chú, thư viện tài liệu, Knowledge Map, chat AI. Repo [ESGAntall/noteai](https://github.com/ESGAntall/noteai).

## Thuật ngữ

| Spec | UI (VI) |
|------|---------|
| Note | Ghi chú |
| Knowledge | Tài liệu (nội dung thật) |
| Node (MapNode) | Biểu diễn Tài liệu trên Bản đồ kiến thức |
| Knowledge Map | Bản đồ kiến thức |

**Knowledge** giữ nội dung; **Node** chỉ tham chiếu `knowledgeId` — [data-model.md](data-model.md).

## Phạm vi

Chi tiết: [product-requirements.md](product-requirements.md).

## Ràng buộc không đổi

- Không app DB / user account DB / cloud sync mặc định.
- Không auth flows.
- Không API key Gemini trên client.
- Re-fill: **skip-existing** — không overwrite demo hay user.
- Clear Demo: chỉ `is_demo: true`; không check-in.
- Không seed check-in; demo activity được phép.
- AI không đụng graph/links.
- Không cạnh ngược tự động.

## Chưa chọn (ADR)

- Framework, build, hosting runtime.
- Manifest deterministic demo IDs cụ thể.
- Remove-from-map UI có/không.

## Portfolio

- Redesign: bảo parity spec (`frontend-design`).
- ADR app cho runtime API, PPL numeric limits.

## Acceptance

[acceptance-criteria.md](acceptance-criteria.md)