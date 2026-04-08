#!/usr/bin/env bash
set -euo pipefail

FRAGMENTS=$(find changelog.d/ -type f ! -name '.gitkeep' | wc -l | tr -d ' ')

if [ "$FRAGMENTS" -eq 0 ]; then
  echo "::error::No changelog fragment found in changelog.d/."
  echo "Add a fragment: echo 'Your change description' > changelog.d/<name>.<type>.md"
  echo "Valid types: added, changed, fixed, removed, breaking"
  exit 1
fi

echo "Found $FRAGMENTS changelog fragment(s)."
