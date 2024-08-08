# Database Migrations

1. All migrations that are present when a stack is created will automatically be run.
1. Migrations can also be run from AWS Lambda.
   1. Find the `[STACK-NAME]-MigrateDatabase` function and click on it
   1. Click the "Test" tab.
   1. Configure the "Event JSON" appropriately
      1. The "normal" usage of the lambda (on stack creation) posts a response to a URL (`ResponseURL`) when it is complete.
      1. The lambda **must** be provided a string for that URL or it will error, however an empty string will functionally work.
1. If a new migration is added you can set the "Event JSON" to `{ "ResponseURL": "" }` and it will run all pending migrations.
1. To rollback a migration you can specify the version to rollback **PAST**
   1. **⚠ WARNING ** It will execute the `down` on all migrations up to **AND INCLUDING** the version you specify
   1. `{ "ResponseURL": "", "down": "00_initial" }`
