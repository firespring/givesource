# AWS Console
* Work with whoever manages your AWS account to get logged in to your Organization's Account
  * For Firespring users, these instructions can be found [here](https://github.com/firespring/givesource-ops/tree/master/documentation/aws-console.md)
* **NOTE:** If your organization does not use a separate AWS account for users, then simply log in to the account in which your Givesource instance will reside

# AWS Command Line
* Your local AWS credentials will be managed by the Firespring dev command library (by default)
  * Log in to the aws console in a web browser using the credentials you set up previously
  * Navigate to the IAM dashboard for your user and generate an AWS Access Key/Secret

### Configure your local AWS account settings
* Copy the `.env.example` file to `.env` if you don't already have one
* For Firespring Engineers, the file should look like this
```
...
ORG_ACCOUNT_NAME="Root Org"
ORG_ACCOUNT_ID="000000000000"
PRD_ACCOUNT_NAME="Givesource Prod"
PRD_ACCOUNT_ID="000000000000"
DEV_ACCOUNT_NAME="Givesource Dev"
DEV_ACCOUNT_ID="000000000000"
```
* Update the account ids to match your AWS Account setup

### Configure your local AWS account credentials
* Run `rake aws:configure:default:credentials` and enter the AWS Access Key/Secret from the IAM Dashboard step
  * Run `rake aws:login`
    * Answer any questions you are presented
    * Enter your 2FA code when prompted

* **NOTE:** If your organization does not use a separate AWS account for users, simply ensure that your AWS Access Key/Secret are exported as env variables and the rake scripts will read them from your environment
  * e.g.
```
export AWS_DEFAULT_REGION=us-east-1
export AWS_ACCESS_KEY_ID=000000000000
export AWS_SECRET_ACCESS_KEY=000000000000
```
