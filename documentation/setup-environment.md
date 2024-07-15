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

## Setup Your Editor
These instructions were written for PhpStorm, other editors may vary.

1. Set the project Javascript version to: `ECMAScript 6`
2. Disable indexing for:
	- packages/cloudformation/build
	- packages/frontend/build
	- packages/lambda/build
3. Add Copyright Profile: Apache-2.0-Firespring
```

## Preparing AWS Release Buckets
* Log into the aws console in a browser
  * Navigate to the cloudformation console
  * Create a new stack using the `cloudformation/user-s3.yml` template
  * Set the `BucketIdentifier` to something meaningful to you
