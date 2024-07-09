# Deleting a Stack
Givesource includes a delete stack command, but I recommend doing it manually from the AWS web console.  
1. Access the [AWS-Console](aws-console.md).
1. Snapshot the Database in RDS
1. Navigate to AWS S3
   1. All files in S3 buckets for the stack we are deleting **must** be deleted manually for stack deletion to succeed.
   1. Find all buckets that are used by your stack, the bucket names will be prefixed with the stack name.
   1. Click on the bucket and click the `Empty` button.
1. Navigate to AWS CloudFormation.
1. Select the parent "Givesource" stack.
1. Choose the option to Delete the stack.
   1. If stack deletion fails
      1. It may be due to files being missed on the S3 cleanup - just empty the s3 buckets
      1. It may be because the lambda at edge needs more time to be disassociated before cleanup - just wait longer (around 30 min)
      1. After resources are cleaned up, you can try to delete the stack again.  You should not need to choose to "retain" any of the resources that failed to delete on the previous try.

**Important**: There are a few things that will not automatically delete, they include:  
1. Cognito User Pool - These can be manged from the AWS Cognito web console.
   1. These **should** be cleaned up manually after the stack is deleted.  They do not appear to conflict with anything, but should still be cleaned up.
1. Shared database and users - you will need to connect as the admin user to mysql
   1. Run ``drop database `<StackName>` ;``
   1. Run ``drop user `<StackName>-maintenance` ;``
   1. Run ``drop user `<StackName>-readwrite` ;``
1. SSM Parameters - These _should_ be cleaned up but will not stop a new stack with the same name from being created.
