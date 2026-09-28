#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
exec uv run --with requests --with pycryptodome --python python3 \
  python "$HERE/publish-draft.py" "$@"
