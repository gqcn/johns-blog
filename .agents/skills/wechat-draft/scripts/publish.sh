#!/usr/bin/env bash
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$ROOT" ]]; then
  ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
fi
PREVIEW="$ROOT/localdocs/wechat-preview"
exec uv run --with requests --with pycryptodome --python python3 \
  python "$PREVIEW/publish-draft.py" "$@"
