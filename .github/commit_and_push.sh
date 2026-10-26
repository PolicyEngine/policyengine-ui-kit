#!/usr/bin/env bash
# Stage release artifacts and push if anything changed.
set -euo pipefail

git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"

git add package.json CHANGELOG.md changelog.d/

if git diff --staged --quiet; then
  echo "No changes to commit."
  exit 0
fi

git commit -m "Release @policyengine/ui-kit"
# If main moved during the release, put the release commit on top of it, so
# the version npm now has also lands on main. (A conflict, or a merge between
# this pull and the push, stops the script: the version is then on npm
# without its release commit, and needs one written by hand.)
git pull --rebase origin main
git push origin HEAD:main
