# Prerequisites
1. Follow the [[Setup Environment]] wiki to prepare for releasing.
2. Follow the [[Configuring a Stack]] wiki to configure the AWS settings needed for release.

# Releasing
## Versions
All releases are versioned; A 1.4.0 Givesource stack version is made up of the 1.4.0 CloudFormation templates, 1.4.0 frontend assets, and 1.4.0 Lambda functions.
The release version is controlled via the `package.json` file found in the root of the Givesource project.

The release script for each package will attempt to write files to the S3 release bucket for that version. If the release for that version already exists,
the release script will throw an error. You can override an existing version with the `--force` flag. See below for more details.

## Create a Release
Before you can deploy a new Givesource stack (app instance), you must first release some packages containing:  
- CloudFormation templates
- Frontend assets
- Lambda function code

A release consists of two steps: `build` and `release`. Each of the packages listed above include scripts that will do just that. For example:

**CloudFormation Templates**
```
cd givesource
npm run cloudformation:install
npm run cloudformation:release
OR
npm run cloudformation:release:force // to override the current release
```

**Frontend Assets**
```
cd givesource
npm run frontend:install
npm run frontend:release
OR
npm run frontend:release:force // to override the current release
```

**Lambda Functions**
```
cd givesource
npm run lambd:install
npm run lambda:release
OR
npm run lambda:release:force // to override the current release
```

**All Packages**
```
cd givesourcxe
npm install
npm run release
OR
npm run release:force // to override the current release for all packages
```

## AWS Profile
If your default AWS CLI profile is not the AWS account you want to release to, you will need to prepend the AWS_PROFILE environment varable to the commands
that interact with AWS, in this case:
```
AWS_PROFILE=givesource-dev npm run cloudformation:release
AWS_PROFILE=givesource-dev npm run frontend:release
AWS_PROFILE=givesource-dev npm run lambda:release
AWS_PROFILE=givesource-dev npm run release
```
