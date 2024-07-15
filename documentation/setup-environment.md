# Prerequisites
* Follow the [AWS-Console](aws-account.md#console) wiki to access the proper AWS accounts.

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
  * After the below install is completed, you may need to log out and log back in to your terminal in order to have the ruby changes take effect
```
curl -sSL https://get.rvm.io | bash
rvm install 3.2.2
rvm --default use 3.2.2
```
* Dev command library install
  * After the git project has been cloned and ruby has been installed, install the ruby development requirements
```
cd givesource/
bundle install
```
* AWS Cli install [instructions](https://aws.amazon.com/cli/)

## Setup Your Editor
These instructions were written for PhpStorm, other editors may vary.

* Set the project Javascript version to: `ECMAScript 6`
* Disable indexing for:
	* packages/cloudformation/build
	* packages/frontend/build
	* packages/lambda/build
* Add Copyright Profile: Apache-2.0-Firespring
```

## Preparing AWS Release Buckets
* Log into the aws console in a browser
  * Navigate to the cloudformation console
  * Create a new stack using the `cloudformation/user-s3.yml` template
  * Set the `BucketIdentifier` to something meaningful to you
