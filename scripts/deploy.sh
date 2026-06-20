#!/usr/bin/env bash
# Production deploy: build the Docker image from the current checkout and
# (re)start the container. Run on the server *after* the repo has been synced
# to origin/main (the CI workflow does the git sync before invoking this).
#
# Run manually on the server with:  ./scripts/deploy.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE="elijahwilt-com:latest"
CONTAINER="elijahwilt-web"
PORT="${PORT:-3314}"
ENV_FILE="$ROOT/.env.local"

cd "$ROOT"

# Runtime secrets (e.g. RESEND_API_KEY for the contact form) live in .env.local,
# which is gitignored and must already exist on the server. Fail loudly if not.
if [[ ! -f "$ENV_FILE" ]]; then
  echo "error: $ENV_FILE not found — refusing to deploy without runtime env" >&2
  exit 1
fi

echo "→ Building image $IMAGE ..."
docker build -t "$IMAGE" "$ROOT"

echo "→ Restarting container $CONTAINER on port $PORT ..."
docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
docker run -d \
  --name "$CONTAINER" \
  --env-file "$ENV_FILE" \
  -p "$PORT:$PORT" \
  --restart unless-stopped \
  "$IMAGE"

# Reclaim disk from the now-dangling previous image.
docker image prune -f >/dev/null 2>&1 || true

echo "✓ Deployed → container $CONTAINER running on port $PORT"
