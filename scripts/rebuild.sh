#!/usr/bin/env bash
# Rebuild the production Docker image from this checkout and restart the
# container, so local source changes become visible at http://localhost:3314.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE="elijahwilt-com:web-interface-guidelines"
CONTAINER="elijahwilt-web-interface-guidelines"
PORT=3314

# .env.local is gitignored, so a worktree checkout may not have one — fall
# back to the main checkout's copy (worktrees share the same git common dir).
ENV_FILE="$ROOT/.env.local"
if [[ ! -f "$ENV_FILE" ]]; then
  MAIN_ROOT="$(dirname "$(git -C "$ROOT" rev-parse --path-format=absolute --git-common-dir)")"
  ENV_FILE="$MAIN_ROOT/.env.local"
fi

ENV_ARGS=()
if [[ -f "$ENV_FILE" ]]; then
  ENV_ARGS=(--env-file "$ENV_FILE")
else
  echo "warning: no .env.local found — contact form sends will fail" >&2
fi

docker build -t "$IMAGE" "$ROOT"
docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
docker run -d --name "$CONTAINER" "${ENV_ARGS[@]}" -p "$PORT:$PORT" "$IMAGE"

echo "✓ rebuilt and running → http://localhost:$PORT"
