# Prerequisites
1. Follow the [Setup Environment](setup-environment.md) wiki to setup your development environment.
2. Follow the [Configuring a Stack](configuring-a-stack.md) wiki to configure your development stack settings.
2. Follow the [Releasing](releasing.md) wiki to create a development release on the bucket's created in step 1.
3. Follow the [Creating a New Stack](creating-a-new-stack.md) wiki to create a new development stack.

# Development
## Understanding Givesource Development
Before you make any code changes, let's talk about what maybe unique with developing a serverless AWS application vs traditional web applications.

1. Making changes to the frontend applications are all done locally, and should work like any other app.
2. Making changes to the API may require:
	- Updating lambda functions on AWS
	- Updating / Adding / Deleting API resources or methods (endpoints). Changes must be applied through CloudFormation.
	- Updating a backing service like a DynamoDb table. Changes must be applied through CloudFormation.

_Understanding how Givesource uses AWS resources is just as important, if not more important, than understanding the codebase._

## CloudFormation Development
**Code Directory**:  
`packages/cloudformation/templates`

**Build Directory**:  
`packages/cloudformation/build`

**Making Changes**:  
1. Verify your `.env` file is pointed to the correct Givesource stack.
2. Verify the dependencies are up to date:
	```
	npm run frontend:install
	```
3. Build the templates:
	```
	npm run cloudformation:build
	```
4. For the CloudFormation package, there is no "deploy", as in, you cannot just release the stack changes to a single stack.
The templates are either released (on the S3 bucket) or not.
5. Follow the [Releasing](releasing.md) wiki (see: CloudFormation Templates) to make your changes available in AWS.

## Frontend Development
Frontend development requires a stack on AWS, as there is no way to mock the API.

**Code Directory**:  
`packages/frontend/src`

**Build Directory**:  
`packages/frontend/build`

**Making Changes**:  
1. Verify your `.env` file is pointed to the correct Givesource stack.
2. Verify the dependencies are up to date:
	```
	npm run frontend:install
	```
3. Build the assets, watch the assets, and reload the browser when changes are detected:
	```
  npm run frontend:dev:admin
  npm run frontend:dev:public
	```
4. You can access the frontend applications from:
	- Management app: [http://localhost:3000](http://localhost:3000)
	- Event app: [http://localhost:3002](http://localhost:3000)
5. Deploy your changes to your development Givesource stack.
	```
	npm run frontend:deploy
	```

## Lambda (API) Development
**Code Directory**:  
`packages/lambda/src`

**Build Directory**:  
`packages/lambda/build`

**Making Changes**:  
1. Verify your `.env` file is pointed to the correct Givesource stack.
2. Verify the dependencies are up to date:
	```
	npm run lambda:install
	```
3. Deploy your changes to your development Givesource stack. This command will let you choose which lambda function to deploy, or you can choose "All".
	```
	npm run lambda:deploy
	```

## Troubleshooting changes that don't appear to be taking affect and some things to try

### Navigate to AWS API Gateway
1. Click on your application
1. Under the "Actions" dropdown at the top, choose "Deploy API".  It will ask for a "Deployment stage" - `prod` is likely the only option listed (even for a dev/test stack) and is what should be chosen.
1. Updates to `givesource-api-deploy.yml` commonly need to have the "Deploy API" button clicked before they take affect.

### Cloudfront Distributions
1. If http request to resources appear to be being cached and not updating with your changes you can try invalidating the Cloudfront cache.
1. Click the relevant distribution, choose "Invalidations" at the top and "Create Invalidation".  You likely want to use `/*` as the path so it invalidates all cache.

### Just wait
1. Sometimes resources are cached or have a delay updating and waiting 5-10m will magically solve the problem.

