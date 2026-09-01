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

3. Commit the ADR:
   ```bash
   git add harness/adrs && git commit -m "harness: add ADR $NUM <slug>"
   ```
