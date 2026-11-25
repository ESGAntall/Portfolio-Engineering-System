---
name: codebase-graph
description: Code graph cho impact analysis — Graphify ưu tiên trên app repos (ADR O-002); kiểm tra tồn tại/stale; fallback map/search; cập nhật manifest thực tế. Dùng khi refactor cross-module, đổi API, hoặc orchestrator cần impact map.
---

# Codebase Graph

## Mục đích

Impact analysis với **source code là source of truth**. Graph (ưu tiên **Graphify** trên application repos) là chỉ mục hỗ trợ — có thể absent, stale, hoặc thay bằng fallback.

**Không** dùng skill này để cài Graphify trong `portfolio-engineering-system` (meta repo không có app source).

## Khi nào kích hoạt

- Refactor/rename cross-module, đổi public API, xóa module.
- Task lớn (O-003) cần boundary/dependency map.
- Sau merge lớn — kiểm tra graph còn hợp lệ.

## Khi nào không kích hoạt

- Thay đổi module độc lập, requirement rõ (task nhỏ).
- Repo meta chỉ docs/skills/rules (portfolio-engineering-system).

## Input cần thiết

- Repo root, phạm vi (symbol, folder, feature).
- `docs/architecture/code-graph.md` và `.cursor/code-graph-manifest.json` nếu có.

## Quy trình từng bước

### 1. Xác định loại repo

| Repo | Graphify |
|------|----------|
| Application (có source) | **Ưu tiên** khi đã tích hợp hoặc user đồng ý bootstrap |
| portfolio-engineering-system | **Không** đề xuất cài; fallback only |

### 2. Kiểm tra graph có tồn tại

1. `.cursor/code-graph-manifest.json` (`generator`, paths, timestamps)
2. `docs/architecture/code-graph.md` (query/refresh đã documented)
3. Graphify index/MCP hoạt động trong workspace (nếu project đã setup)

Không có → **absent**; chuyển fallback (bước 5). Không claim độ phủ đầy đủ.

### 3. Kiểm tra graph còn mới

- So `generatedAt` / `commit` manifest với `HEAD` và files đã đổi.
- Spot-check symbol quan trọng vs source.
- Kết luận: `present | stale | unknown` — **không** giả định luôn mới.

### 4. Graphify bootstrap (app repo, chưa có graph)

Chỉ khi project **có source** và user/task cần graph:

1. Kiểm tra **Python**, **uv** hoặc **pipx** (command thật; báo nếu thiếu).
2. Đề xuất cài Graphify theo doc project — **không** cài trong portfolio meta repo trong task thường.
3. Document query + refresh trong `docs/architecture/code-graph.md`.
4. Cập nhật manifest sau lần refresh **thành công**.

### 5. Fallback (luôn sẵn sàng)

Khi absent/stale hoặc Graphify không dùng được:

- Project map (`docs/architecture/`)
- Symbol search + đọc file (citation file:line)
- Dependency analysis có kiểm chứng

Ghi manifest `generator`: `search-fallback` hoặc `manual` với note thực tế.

### 6. Truy vấn impact

- Entry points → downstream (Graphify nếu fresh; else fallback).
- Bảng: component | vai trò | rủi ro | test cần.

### 7. Cập nhật sau thay đổi

- Refresh graph theo doc; cập nhật manifest với kết quả **thực tế**.
- **Không** xóa graph/index cũ trước khi verify graph mới hợp lệ.
- Nếu methodology đổi → một dòng trong `code-graph.md` hoặc CHANGELOG app.

## Output bắt buộc

- Trạng thái: `present | absent | stale | unknown`
- Nguồn: Graphify | manifest | search-fallback
- Impact summary có citation khi có
- Refresh path nếu stale/absent (không bịa command đã chạy)

## Điều kiện hoàn thành

- Mức tin cậy: high (Graphify fresh + spot-check) | medium | search-only.
- ADR O-002 respected (source of truth, no blind delete).

## Phối hợp

- `requirement-orchestrator` — trước plan task lớn.
- `engineering-workflow` — sau slice ảnh hưởng graph.
- `quality-gate` — test theo impact list.

## Manifest (app)

```json
{
  "version": 1,
  "generator": "graphify|manual|search-fallback",
  "generatedAt": "ISO-8601",
  "commit": "optional-sha",
  "roots": ["src/"],
  "graphify": {
    "queryDoc": "docs/architecture/code-graph.md",
    "refreshVerifiedAt": "ISO-8601 or empty"
  },
  "notes": "Query/refresh steps; do not delete old index until new graph verified"
}
```