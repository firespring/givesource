# Prerequisites
* Follow the [Setup Environment](setup-environment.md) wiki to setup your development environment.
* Follow the [Configuring a Stack](configuring-a-stack.md) wiki to configure your development stack settings.
* Follow the [Releasing](releasing.md) wiki to create a development release on the bucket's created in step 1.
* Log in using these [instructions](aws-account.md#aws-command-line)
* Connect to your local container using [rake app:sh](local-environment.md)

# Creating a New Stack
1. Verify your `.env` file is pointed to the correct Givesource stack. In this case it will be one that does not yet exist on AWS.
2. Verify the latest version is available in the release buckets: see [Releasing](releasing.md).
3. Create the stack:
  ```
  npm run cloudformation:create
  ```
4. This process will take some time (between 45 minutes to 1 hour). You can monitor the progress in the AWS CloudFormation web console.
5. At the end of the stack creation process, the email address configured for `ADMIN_EMAIL` will receive an email with link to complete the registration for the initial super-admin
user.
