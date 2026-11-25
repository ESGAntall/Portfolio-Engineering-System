# NOTEAI — Acceptance criteria

Tiêu chí có thể kiểm thử. Mirror vào repo app khi scaffold.

## Demo & user data safety

| ID | Given | When | Then |
|----|-------|------|------|
| AC-DEMO-1 | User + demo records | Re-fill confirm | Mọi record `is_demo:false` byte-identical |
| AC-DEMO-2 | Demo id đã tồn tại `is_demo:true` | Re-fill | Record demo **không đổi** (skip-existing) |
| AC-DEMO-3 | Sau Clear Demo | Re-fill | Demo thiếu được tạo; deterministic ids |
| AC-DEMO-4 | User + demo | Clear Demo | Không còn `is_demo:true` entity; user còn |
| AC-DEMO-5 | Any | Re-fill / demo seed | `checkIns` count không tăng |
| AC-DEMO-6 | Demo id trùng user record `is_demo:false` | Re-fill | User record còn; demo skip; collision logged |
| AC-DEMO-7 | User had deselected all | Re-fill adds new demo ids only | `aiContextSelection` không select-all; chỉ id demo mới trong set nếu policy doc mới |

## Check-in

| ID | Given | When | Then |
|----|-------|------|------|
| AC-CHK-1 | No check-in day D | App init | Exactly one row `date=D` |
| AC-CHK-2 | Check-in exists D | Reload same day | Count for D unchanged |
| AC-CHK-3 | Local date → D2 | Init / visible tab | ≤1 check-in D2 |
| AC-CHK-4 | Tab hidden overnight | Visible next local day | At most one new check-in for new day |

## Knowledge, Node, relationships

| ID | Given | When | Then |
|----|-------|------|------|
| AC-KNOW-1 | Knowledge K | Inspect store | One MapNode with `knowledgeId=K.id`; no duplicate body on Node |
| AC-REL-1 | Edge A→B | — | No auto B→A |
| AC-REL-2 | Edge exists | Delete edge | Knowledge, Notes, Nodes remain |
| AC-REL-3 | Knowledge K + links | Delete K | K, node, related edges/links gone; Notes remain |
| AC-REL-4 | Map node only | Remove from map (if UI) | Knowledge remains; incident edges removed |
| AC-REL-5 | — | AI chat | No graph/link mutation |

## Chat

| ID | Given | When | Then |
|----|-------|------|------|
| AC-CHAT-1 | Messages stored | Reload | Same messages |
| AC-CHAT-2 | UI inspection | — | No multi-conversation controls |

## AI context

| ID | Given | When | Then |
|----|-------|------|------|
| AC-CTX-1 | 3 docs, first use | Send AI | PPL includes 3 |
| AC-CTX-2 | User unselected all, saved | Send AI | Library context empty |
| AC-CTX-3 | User selected subset | Send AI | Only selected ids |
| AC-CTX-4 | User unselected all, creates new Note | Send AI | PPL includes **only** new Note id |
| AC-CTX-5 | Custom selection | Clear Demo | `aiContextSelection` unchanged |
| AC-CTX-6 | Custom selection | Re-fill Demo | `aiContextSelection` unchanged |

## PPL — cost, quality, safety

| ID | Criterion | Test approach |
|----|-----------|---------------|
| AC-PPL-1 | Median token library −30% vs raw concat | Fixture (ADR corpus) |
| AC-PPL-2 | Empty selection → 0 library in payload | Unit |
| AC-PPL-3 | Injection in Note stays in library block only | Snapshot |
| AC-PPL-4 | Each library segment has `sourceId` | Metadata |
| AC-PPL-5 | User message unchanged (post-NFC) | String compare |
| AC-PPL-6 | Compression excerpt ⊆ source | Diff |

## Local storage

| ID | Given | When | Then |
|----|-------|------|------|
| AC-LS-1 | Valid export | Import replace confirm | Round-trip per ADR policy |
| AC-LS-2 | Corrupt JSON | Load | Recovery UX |
| AC-LS-3 | QuotaExceeded | Save | Error visible; pre-save state intact |

## Runtime / security

| ID | Criterion |
|----|-----------|
| AC-RT-1 | Frontend bundle không chứa Gemini API key material |
| AC-RT-2 | 429 / quota errors không lộ server internals |

## Activity

| ID | Given | When | Then |
|----|-------|------|------|
| AC-ACT-1 | — | Open Note read-only | No activity |
| AC-ACT-2 | — | Edit Knowledge | Activity with `is_demo:false` |
| AC-ACT-3 | — | Create NoteKnowledgeLink | Activity create link |
| AC-ACT-4 | Demo activity seeded | — | Events có thể `is_demo:true` |

## ADR placeholders

- `B_lib`, max message length, runtime contract, collision UX copy.