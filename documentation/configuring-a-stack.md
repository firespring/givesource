# Prerequisites
1. Follow the [Setup Environment](setup-environment.md) wiki to setup your development environment.

# Configuring a Stack
A configuration template can be found at `config/default.json`. This file contains all the details needed to release and deploy a Givesource stack.

1. Create a copy of `config/default.json` with the following naming convention:
	- Prefix: `default`, `development` or `production`. This prefix correlates to the NPM mode that should be used when deploying the stack. Setting
	this value to `default` will work as a catch-all mode.
	- Followed by: `-<Stack Name>`
	- It should look something like: `default-DEMO-STACK.json`, `production-NORFOLK2020.json`, `development-CJ-TEST-STACK.json`
	- The file should be saved in the `config/` directory in the root of the project.
2. Example configurations:
	- Development stack `default-CJ-TEST` (no domain):
	```
	{
    	"app": {
    		"ADMIN_EMAIL": "cj.ohara@firespring.com",
    		"ADMIN_PAGES_CNAMES": [],
    		"ADMIN_PAGES_SSL_CERTIFICATE_ARN": "",
    		"PUBLIC_PAGES_CNAMES": [],
    		"PUBLIC_PAGES_SSL_CERTIFICATE_ARN": ""
    	},
    	"stack": {
    		"AWS_REGION": "us-west-2",
    		"AWS_STACK_NAME": "CJ-TEST"
    	},
    	"release": {
    		"AWS_RELEASE_BUCKET": "givesource-cj",
    		"AWS_RELEASE_BUCKET_REGION": "us-west-2",
    		"AWS_LAMBDA_RELEASE_BUCKET_PREFIX": "givesource-cj",
    		"AWS_LAMBDA_RELEASE_BUCKET_AVAILABLE_REGIONS": ["us-east-1", "us-west-2"]
    	}
    }
	```
	- Production stack `production-G2CD2020.json` (with domain):
	```
	{
    	"app": {
    		"ADMIN_EMAIL": "cj.ohara@firespring.com",
    		"ADMIN_PAGES_CNAMES": ["manage.givetocityday.org", "www.manage.givetocityday.org"],
    		"ADMIN_PAGES_SSL_CERTIFICATE_ARN": "arn:aws:acm:us-east-1:016226103026:certificate/11111111-2222-3333-4444-555555555555",
    		"PUBLIC_PAGES_CNAMES": ["givetocityday.org", "www.givetocityday.org"],
    		"PUBLIC_PAGES_SSL_CERTIFICATE_ARN": "arn:aws:acm:us-east-1:016226103026:certificate/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
    	},
    	"stack": {
    		"AWS_REGION": "us-east-1",
    		"AWS_STACK_NAME": "G2CD2020"
    	},
    	"release": {
    		"AWS_RELEASE_BUCKET": "givesource-plus",
    		"AWS_RELEASE_BUCKET_REGION": "us-east-1",
    		"AWS_LAMBDA_RELEASE_BUCKET_PREFIX": "givesource-plus",
    		"AWS_LAMBDA_RELEASE_BUCKET_AVAILABLE_REGIONS": ["us-east-1", "us-west-2"]
    	}
    }
	```
3. Parameters:

	| Parameter | Required | Description |
	| --------- | -------- | ----------- |
	| ADMIN_EMAIL | required | The email address of the initial super-admin user. This person will be contacted when the stack is finished creating. |
	| ADMIN_PAGES_CNAMES | optional | An array of domains that should be used to access the admin application. |
	| ADMIN_PAGES_SSL_CERTIFICATE_ARN | optional | The ARN of the SSL certificate generated through AWS Certificate Manager. |
	| PUBLIC_PAGES_CNAMES | optional | An array of domains that should be used to access the event application. |
	| PUBLIC_PAGES_SSL_CERTIFICATE_ARN | optional | The ARN of the SSL certificate generated through AWS Certificate Manager. |
	| AWS_REGION | required | The region where the CloudFormation stack should be created/managed. |
	| AWS_STACK_NAME | required | The name of the CloudFormation stack. |
	| AWS_RELEASE_BUCKET | required | The name of the bucket containing the CloudFormation templates and frontend assets. |
	| AWS_RELEASE_BUCKET_REGION | required | The region where the `AWS_RELEASE_BUCKET` exists. |
	| AWS_LAMBDA_RELEASE_BUCKET_PREFIX | required | The naming prefix used for the Lambda function releases. |
	| AWS_LAMBDA_RELEASE_BUCKET_AVAILABLE_REGIONS | required | An array containing the available regions where Lambda functions can be deployed. |

4. See the [Setup-Environment](setup-environment.md) wiki for more information about the release buckets.

# Configure the Local Environment
To switch between the stacks you are managing, update the `.env` file:  

Example - manage the `production-NORFOLK2019.json` stack:
```
NODE_ENV=production
NODE_APP_INSTANCE=NORFOLK2019
```

Example - manage the `development-CJ-TEST.json` stack:
```
NODE_ENV=development
NODE_APP_INSTANCE=CJ-TEST
``
