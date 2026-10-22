#!/usr/bin/env bash
# Posts (or updates) one comment on a pull request with a preview link.
#
#   preview-comment.sh <app> <url>
#
# Needs GH_TOKEN, REPO (owner/name) and PR_NUMBER. One comment per app, found by a hidden
# marker, so pushing again edits it instead of adding another.
set -euo pipefail

app="${1:?app}"; url="${2:?url}"
: "${GH_TOKEN:?}" "${REPO:?}" "${PR_NUMBER:?}"

marker="<!-- preview:${app} -->"
body="${marker}
**Preview: ${app}** → ${url}

Built from this branch, pointing at the staging API (\`api-stg.wuzz.care\`). Staging data, shared with everyone."

existing="$(gh api "repos/${REPO}/issues/${PR_NUMBER}/comments" --paginate \
  --jq ".[] | select(.body | startswith(\"${marker}\")) | .id" | head -1)"

if [ -n "$existing" ]; then
  gh api -X PATCH "repos/${REPO}/issues/comments/${existing}" -f body="$body" >/dev/null
  echo "updated comment ${existing}"
else
  gh api -X POST "repos/${REPO}/issues/${PR_NUMBER}/comments" -f body="$body" >/dev/null
  echo "created comment"
fi
