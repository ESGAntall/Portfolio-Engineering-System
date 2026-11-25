# `.portfolio/manifest.json` schema (v0.1)

## Compatibility

| Field | Value |
|-------|--------|
| `schemaVersion` | `1` — breaking changes increment this |
| Consumers | Portfolio Local CLI `verify`, `doctor` v0.1+ |

Future CLI versions **must** read `schemaVersion` and reject unknown major versions with a clear error. Patch-level CLI releases must not change required manifest fields without bumping `schemaVersion`.

## Location

Application repository root: `.portfolio/manifest.json` (relative paths inside the manifest always use forward slashes, relative to project root).

## Shape

```json
{
  "schemaVersion": 1,
  "cliVersion": "0.1.0",
  "templateVersion": "1",
  "initializedAt": "2026-11-25T02:00:00.000Z",
  "projectName": "my-app",
  "distribution": {
    "mode": "copy",
    "autoSync": false
  },
  "rules": ["00-portfolio-baseline.mdc", "..."],
  "skills": ["requirement-orchestrator", "..."],
  "referenceDocuments": ["docs/reference/README.md", "..."],
  "files": [
    {
      "relativePath": ".cursor/rules/00-portfolio-baseline.mdc",
      "category": "rule",
      "required": true,
      "distributedSha256": "hex..."
    }
  ]
}
```

### `files[]`

| Property | Description |
|----------|-------------|
| `relativePath` | Project-relative, POSIX-style (`/`) |
| `category` | `template` \| `rule` \| `skill` \| `reference` \| `manifest-scaffold` |
| `required` | If true, `verify` exits non-zero when missing |
| `distributedSha256` | SHA-256 at distribution time (hex, lowercase) |

**v0.1:** `.portfolio/manifest.json` is **not** listed in `files[]` (no self-hash). `verify` validates manifest JSON via schema checks separately.

### Verify semantics

| State | Condition |
|-------|-----------|
| **missing** | File not on disk |
| **unchanged** | Present; hash equals `distributedSha256` |
| **locallyModified** | Present; hash differs — informational, not auto-failure |

Hash mismatch alone is **not** an error (local customization allowed per O-001). Missing required files **are** errors.

## Not stored

- Absolute machine paths
- Portfolio root path (optional future field omitted in v0.1)
- Secrets or environment data