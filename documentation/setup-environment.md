# Prerequisites
1. Follow the [AWS-Console](aws-console.md) wiki to access the proper AWS accounts.

# Setup Environment
## Required Software
* Docker install [instructions](https://docs.docker.com/desktop/)
* Git install [instructions](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
    * If you are upgrading `git`, you may need to close and re-open your terminal window for the upgrade to take effect
* Clone the givesource codebase into the givesource/ directory
```
git clone git@github.com:firespring/givesource.git givesource/
```
* Ruby install [instructions](https://rvm.io/rvm/install)
```
curl -sSL https://get.rvm.io | bash
rvm install 3.2.2
rvm --default use 3.2.2
```
* AWS Cli install [instructions](https://aws.amazon.com/cli/)

## Preparing AWS Release Buckets
* Log into the aws console in a browser
  * Navigate to the cloudformation console
  * Create a new stack using the `cloudformation/user-s3.yml` template
  * Set the `BucketIdentifier` to something meaningful to you

## Configuration
* Create the app `.env` file
  * Copy the `.env.example` file into place and then update the file for your local settings
  * Update the NODE_APP_INSTANCE to whatever name will be used for your config file (this is up to you)
  * For Firespring Engineers, the file should look like this
```
NODE_ENV=development
NODE_APP_INSTANCE="<YOUR_CONFIG_NAME>"
ORG_ACCOUNT_NAME="FDP Root"
ORG_ACCOUNT_ID="020401666882"
PRD_ACCOUNT_NAME="Givesource Prod"
PRD_ACCOUNT_ID="016226103026"
DEV_ACCOUNT_NAME="Givesource Dev"
DEV_ACCOUNT_ID="948629139753"
```

* Create the app `default-<YOUR_CONFIG_NAME>.json` file
  * Copy the `config/default.json` into place and then update the file for your local settings
    * Set ADMIN_EMAIL, AWS_STACK_NAME, AWS_RELEASE_BUCKET, and AWS_LAMBDA_RELEASE_BUCKET_PREFIX
      * The bucket should be set `givesource-` followed by whatever you used as your `BucketIdentifier` when you prepared your release bucket
      * The region(s) should be set to `us-east-1`


## Setup Your Editor
These instructions were written for PhpStorm, other editors may vary.

1. Set the project Javascript version to: `ECMAScript 6`
2. Disable indexing for:
	- packages/cloudformation/build
	- packages/frontend/build
	- packages/lambda/build
3. Add Copyright Profile: Apache-2.0-Firespring
```
