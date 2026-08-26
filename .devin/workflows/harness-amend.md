---
description: Append an amendment to adjust scope, milestones, or approach
---

1. Create an amendment with a UTC timestamp referencing the plan slug:
   ```bash
   TS=$(date -u +"%Y%m%d-%H%M"); echo "# Amendment $TS: <plan-slug>\n\n- Reason:\n- Impact:\n- New scope/timeline:\n- Links: plan:<file> adrs:<files> prs:<#>\n" > harness/amendments/$TS-<plan-slug>-amendment.md
   ```

2. Commit the amendment:
   ```bash
   git add harness/amendments && git commit -m "harness: amendment $TS <plan-slug>"
   ```
