---
description: Create a new Architecture Decision Record (ADR)
---
1. Choose the next ADR number and title, then create the file under `harness/adrs/`:
   ```bash
   # Portable (GNU/BSD) discovery of the highest existing ADR number
   MAX=$(ls -1 harness/adrs 2>/dev/null | grep -E '^adr-[0-9]{4}-' | sed -E 's/^adr-([0-9]{4})-.*/\1/' | sort -n | tail -1)
   [ -z "$MAX" ] && MAX=0000
   NUM=$(printf "%04d" $((10#$MAX + 1)))
   F="harness/adrs/adr-$NUM-<slug>.md"
   cp harness/adrs/adr-0000-template.md "$F"
   # Portable replacements without relying on sed -i differences
   sed "s/ADR-0000/ADR-$NUM/g; s/Title/<Title>/g" "$F" > "$F.tmp" && mv "$F.tmp" "$F"
   ```

2. Fill in Context, Decision, Consequences, and Alternatives. Set Status.

3. Commit the ADR (apply branch safety and stage only the created file):
   ```bash
   # Substitute the actual story key and current feature branch for this session.
   skill_dir="$(devin skills show firespring:fs-story 2>/dev/null | sed -n 's/^Base directory: //p' | head -n 1)"
   plugin_root="$(cd "${skill_dir}/../.." && pwd)"
   bash "${plugin_root}/scripts/check-branch-safety.sh" \
     commit \
     "develop" \
     "feature/<STORY_KEY>" \
     "$PWD"

   # Substitute the actual ADR number and slug from the file created above.
   FILE="harness/adrs/adr-<NUM>-<slug>.md"
   git add -- "$FILE"
   git diff --cached --check
   git diff --cached -- "$FILE"
   git commit -m "harness: add ADR <NUM> <slug>"
   ```
