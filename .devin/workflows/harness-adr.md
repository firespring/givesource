---
description: Create a new Architecture Decision Record (ADR)
---
1. Choose the next ADR number and title, then create the file under `harness/adrs/`:
   ```bash
   MAX=$(find harness/adrs -maxdepth 1 -type f -name "adr-[0-9][0-9][0-9][0-9]-*.md" -printf "%f\n" 2>/dev/null | sed -E 's/^adr-([0-9]{4})-.*/\1/' | sort -n | tail -1); \
   [ -z "$MAX" ] && MAX=0000; \
   NUM=$(printf "%04d" $((10#$MAX + 1))); \
   F=harness/adrs/adr-$NUM-<slug>.md; \
   cp harness/adrs/adr-0000-template.md "$F"; \
   sed -i "s/ADR-0000/ADR-$NUM/g" "$F"; \
   sed -i "s/Title/<Title>/g" "$F"
   ```

2. Fill in Context, Decision, Consequences, and Alternatives. Set Status.

3. Commit the ADR:
   ```bash
   git add harness/adrs && git commit -m "harness: add ADR $NUM <slug>"
   ```
