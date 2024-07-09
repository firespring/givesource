# Prerequisites
1. Follow the [[Setup Environment]] wiki to setup your development environment.
2. Follow the [[Configuring a Stack]] wiki to configure your development stack settings.
2. Follow the [[Releasing]] wiki to create a development release on the bucket's created in step 1.

# Creating a New Stack
1. Verify your `.env` file is pointed to the correct Givesource stack. In this case it will be one that does not yet exist on AWS.
2. Verify the latest version is available in the release buckets: see [[Releasing]].
3. Create the stack:
	```
	npm run cloudformation:create
	```
4. This process will take some time (between 45 minutes to 1 hour). You can monitor the progress in the AWS CloudFormation web console.
5. At the end of the stack creation process, the email address configured for `ADMIN_EMAIL` will receive an email with link to complete the registration for the initial super-admin
user.

## AWS Profile
If your default AWS CLI profile is not the AWS account you want to release to, you will need to prepend the AWS_PROFILE environment varable to the commands
that interact with AWS, in this case:
```
AWS_PROFILE=givesource-dev npm run cloudformation:create
```
