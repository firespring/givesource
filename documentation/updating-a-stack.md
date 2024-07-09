# Prerequisites
1. Follow the [Configuring a Stack](configuring-a-stack.md) wiki to configure your development stack settings.

# Updating a Stack
1. Verify your `.env` file is pointed to the correct Givesource stack.
2. Verify the latest version is available in the release buckets: see [Releasing](releasing.md).
3. Create the stack:
	```
	npm run cloudformation:update
	```
4. This process may take anywhere from 1 minute to 1 hour depending on what updated. You can monitor the progress in the AWS CloudFormation web console.
5. **NOTE**: Lambda functions will not be updated in most cases, you will want to deploy those separately, see: [Lambda API Development](development.md#lambda-api-development).

## AWS Profile
If your default AWS CLI profile is not the AWS account you want to release to, you will need to prepend the AWS_PROFILE environment varable to the commands
that interact with AWS, in this case:
```
AWS_PROFILE=givesource-dev npm run cloudformation:update
```
