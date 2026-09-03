---
description: Append an amendment to adjust scope, milestones, or approach
---

1. Create an amendment with a UTC timestamp referencing the plan slug:
   ```bash
   TS=$(date -u +"%Y%m%d-%H%M")
   FILE="harness/amendments/${TS}-<plan-slug>-amendment.md"
   printf '%s\n\n%s\n%s\n%s\n%s\n' \
     "# Amendment ${TS}: <plan-slug>" \
     "- Reason:" \
     "- Impact:" \
     "- New scope/timeline:" \
     "- Links: plan:<file> adrs:<files> prs:<#>" \
     > "$FILE"
   printf 'Created %s\n' "$FILE"
   ```

2. Commit the amendment:
   ```bash
   # Substitute the actual story key and current feature branch for this session.
   skill_dir="$(devin skills show firespring:fs-story 2>/dev/null | sed -n 's/^Base directory: //p' | head -n 1)"
   plugin_root="$(cd "${skill_dir}/../.." && pwd)"
   bash "${plugin_root}/scripts/check-branch-safety.sh" \
     commit \
     "develop" \
     "feature/<STORY_KEY>" \
     "$PWD"

   git add -- "$FILE"
   git diff --cached --check
   git diff --cached -- "$FILE"
   git commit -m "harness: amendment $TS <plan-slug>"
   ```
