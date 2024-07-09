# Addons Stack
The addons stack is used to add an RSS feed, public metrics API and iframe embed code.

# Setup
1. Code is found in the givesource-ops repo
2. Setup is exactly like Givesource, see: [Setup-Environment](setup-environment.md)
3. Create a new config, example:
	```
	{
    	"app": {
    		"ADDONS_CNAMES": [],
    		"ADDONS_SSL_CERTIFICATE_ARN": "",
    		"TARGET_STACK_NAME": "G2LD2019",
    		"TARGET_STACK_REGION": "us-east-1"
    	},
    	"stack": {
    		"AWS_REGION": "us-east-1",
    		"AWS_STACK_NAME": "G2LD2019-ADDONS"
    	},
    	"release": {
    		"AWS_RELEASE_BUCKET": "givesource-plus-addons",
    		"AWS_RELEASE_BUCKET_REGION": "us-east-1",
    		"AWS_LAMBDA_RELEASE_BUCKET_PREFIX": "givesource-plus-addons",
    		"AWS_LAMBDA_RELEASE_BUCKET_AVAILABLE_REGIONS": ["us-east-1", "us-west-2"]
    	}
    }

	```
4. Install dependencies: `npm install`
5. Create a release bucket, similar to [Setup-Environment](setup-environment.md#preparing-aws-release-buckets)
6. Release the code: `npm run release`
7. Create the stack: `npm run cloudformation:create`

# Usage

1. RSS feed is updated every 5 minutes, URL in stack output.
2. After the stack is created, update the API and Image urls in `frontend/embed.html`.
3. Upload changes to the S3 bucket found in AWS web console.
4. Embed:
```html
<iframe src="https://g2ld2020-addons-s3stack-1uwc8n8j1l-addonss3bucket-1s1a0fdvkm3co.s3.amazonaws.com/embed.html" frameborder="0" height="250" width="300"></iframe>
```

## AWS Profile
If your default AWS CLI profile is not the AWS account you want to release to, you will need to prepend the AWS_PROFILE environment varable to the commands
that interact with AWS, in this case:
```
AWS_PROFILE=givesource-dev npm run release
AWS_PROFILE=givesource-dev npm run cloudformation:create
```
