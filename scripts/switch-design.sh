#!/usr/bin/env bash

set -eu

target_branch="${1:-}"

if [ -z "$target_branch" ]; then
  echo "Kein Ziel-Branch angegeben."
  exit 1
fi

current_branch="$(git branch --show-current)"

if [ "$current_branch" != "$target_branch" ]; then
  if [ -n "$(git status --porcelain)" ]; then
    echo "Der Branch kann nicht gewechselt werden, weil ungespeicherte Änderungen vorhanden sind."
    echo "Bitte zuerst committen oder git stash verwenden."
    exit 1
  fi

  git switch "$target_branch"
else
  echo "Design $target_branch ist bereits ausgewählt."
fi

npm run build

echo ""
echo "Design $target_branch ist gebaut."
echo "Starte die Vorschau anschließend mit: npm run preview:serve"
