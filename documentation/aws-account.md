**NOTE: The following instructions are specific to the Firespring implementation of givesource - your organization's implementation may vary**

# AWS Console
* There are two main AWS child accounts used to manage and develop Givesource resources. Both child stacks currently reside under the `Root Org` AWS account
  * To access these accounts, first login to the [Root Org](https://020401666882.signin.aws.amazon.com/console) AWS account
  * Once authenticated, click on the invite links below to add the child account links to your user's dropdown menu in the AWS web console
    * **[Givesource Development AWS Account](https://signin.aws.amazon.com/switchrole?account=948629139753&roleName=AdminAccessRole&displayName=Givesource+Dev)**  
    * **[Givesource Production AWS Account](https://signin.aws.amazon.com/switchrole?account=016226103026&roleName=AdminAccessRole&displayName=Givesource+Prod)**
* If your organization does not use a separate AWS account for users, then simply log in to the account in which your Givesource instance will reside

# AWS Command Line
* Your local AWS credentials are by default managed by the Firespring dev command library
  * Log in to the aws console in a web browser using the credentials you set up previously
  * Navigate to the IAM dashboard for your user and generate an AWS Access Key/Secret


### Configure your local AWS account settings
* Copy the `.env.example` file to `.env` if you don't already haveone
* For Firespring Engineers, the file should look like this
```
...
ORG_ACCOUNT_NAME="Root Org"
ORG_ACCOUNT_ID="111111111111"
PRD_ACCOUNT_NAME="Givesource Prod"
PRD_ACCOUNT_ID="222222222222"
DEV_ACCOUNT_NAME="Givesource Dev"
DEV_ACCOUNT_ID="333333333333"
```

* Update the account ids to match your AWS Account setup
* Run `rake aws:configure:default:credentials` and enter the AWS Access Key/Secret from the IAM Dashboard step
  * Run `rake aws:login`
    * Answer any questions you are presented
    * Enter your 2FA code when prompted
* **NOTE:** If your organization does not use a separate AWS account for users, simply ensure that your AWS Access Key/Secret are exported as env variables and the rake scripts will read them from your environment
  * e.g.
```
export AWS_DEFAULT_REGION=us-east-1
export AWS_ACCESS_KEY_ID=abc123
export AWS_SECRET_ACCESS_KEY=def456
```
