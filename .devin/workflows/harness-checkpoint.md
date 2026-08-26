---
description: Record a time-stamped progress checkpoint for a plan
---

1. Create a UTC time-stamped file under `harness/checkpoints/`:
   ```bash
   TS=$(date -u +"%Y%m%d-%H%M"); echo "# Checkpoint $TS: <topic>\n\n- Plan: <link>\n- Changes:\n- Risks:\n- Next:\n" > harness/checkpoints/$TS-<topic>.md
   ```

2. Commit the checkpoint:
   ```bash
   git add harness/checkpoints && git commit -m "harness: checkpoint $TS <topic>"
   ```
