# Prerequisites
1. Follow the [AWS-Console](aws-console.md) wiki to access the proper AWS accounts.

# Setup Environment
## Preparing for Local Development and Deployment
* Docker install [instructions](https://docs.docker.com/desktop/)
* Git install [instructions](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
    * If you are upgrading `git`, you may need to close and re-open your terminal window for the upgrade to take effect
* Clone the givesource codebase into the current directory
```
git clone git@github.com:firespring/givesource.git
```
* Ruby install [instructions](https://rvm.io/rvm/install)
```
curl -sSL https://get.rvm.io | bash
rvm install 3.2.2
rvm --default use 3.2.2
```
* AWS Cli install [instructions](https://aws.amazon.com/cli/)






## Preparing AWS Release Buckets
1. Create the AWS S3 release buckets on the AWS account you'd like to develop/deploy on:
	- CloudFormation templates and Frontend assets bucket:
		- This bucket can be named however you wish
	- Lambda functions bucket(s), you will need a bucket in each region you plan on deploying the Givesource stack in:
		- These buckets must be named the same, suffixed by the region identifier:  
			`givesource-dev-us-east-1`, `givesource-dev-us-west-2`
2. Add the CORS configuration on all of the buckets created in step 1; S3 Bucket -> Permissions -> CORS Configuration:
	```
	<?xml version="1.0" encoding="UTF-8"?>
	<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
	<CORSRule>
	    <AllowedOrigin>*</AllowedOrigin>
	    <AllowedMethod>PUT</AllowedMethod>
	    <AllowedHeader>*</AllowedHeader>
	</CORSRule>
	</CORSConfiguration>
	```

## Setup Your Editor
These instructions were written for PhpStorm, other editors may vary.

1. Set the project Javascript version to: `ECMAScript 6`
2. Disable indexing for:
	- packages/cloudformation/build
	- packages/frontend/build
	- packages/lambda/build
3. Add Copyright Profile: Apache-2.0-Firespring
```
Copyright $today.year Firespring, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
