#!/bin/bash
# Daily rebuild for date-gated promo-code status posts.
#
# Posts in src/data/blog.ts go live when their publishedAt date (IST)
# arrives (see src/utils/publish.ts), but the site is a prerendered static
# build, so a rebuild is what actually publishes them. Cron runs this once
# a day; it is safe to run by hand too:
#
#   bash scripts/scheduled-publish.sh
#
# Safety: the previous dist/ is kept as dist.prev and restored if the new
# build fails, so a bad build can never leave the site without pages.
set -uo pipefail

cd "$(dirname "$0")/.."

# cron has a minimal PATH: add the usual Node locations (incl. aaPanel).
export PATH="$PATH:/usr/local/bin:/usr/bin:/www/server/nodejs/$(ls /www/server/nodejs 2>/dev/null | tail -1)/bin"

LOG="${LOG:-$HOME/uonovoucher-publish.log}"
exec >>"$LOG" 2>&1
echo "=== $(date -u '+%Y-%m-%d %H:%M:%S UTC') | IST date $(TZ=Asia/Kolkata date +%F) ==="

# One run at a time.
exec 9>/tmp/uonovoucher-publish.lock
flock -n 9 || { echo "Another run is in progress, exiting."; exit 0; }

rm -rf dist.prev
[ -d dist ] && mv dist dist.prev

if npm run build; then
  echo "OK: rebuilt. Nginx serves dist/ directly, no restart needed." && rm -rf dist.prev
else
  echo "BUILD FAILED: restoring previous dist/."
  rm -rf dist
  [ -d dist.prev ] && mv dist.prev dist
  exit 1
fi
