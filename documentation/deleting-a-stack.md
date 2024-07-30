# Deleting a Stack
Givesource includes a delete stack command, but I recommend doing it manually from the AWS web console.  
1. Access the [AWS-Console](aws-account.md#aws-console).
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
1. Cognito User Pool
   1. These can be manged from the AWS Cognito web console.
   1. These **should** be cleaned up manually after the stack is deleted.  They do not appear to conflict with anything, but should still be cleaned up.
1. Shared database and users
   1. If you are cleaning up a production stack from a previous year, skip this step
   1. Connect to the Givesource VPN you added in [this](givesource-stacks.md) step
      1. There should be a "self-service" URL in the Outputs section of that cloudformation stack with instructions
      1. Firespring specific documentation can be found [here](https://github.com/firespring/engineering-devops/blob/master/documentation/vpn.md)
   1. Connect as the admin user to mysql
      1. Credentials can be found in the AdminUserSecret in the SecretsManager console in AWS
      1. An example mysql command should look something like `mysql -hgivesource.cluster-000000000000.us-east-1.rds.amazonaws.com -u admin -p --ssl-ca ./certificates/global-bundle.pem`
         1. Enter the password from SecretsManager when prompted
   1. Run ``drop database `<StackName>` ;``
   1. Run ``drop user `<StackName>-maintenance` ;``
   1. Run ``drop user `<StackName>-readwrite` ;``
1. SSM Parameters - These _should_ be cleaned up but will not stop a new stack with the same name from being created.
