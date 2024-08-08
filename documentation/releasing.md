# Prerequisites
* Follow the [Setup Environment](setup-environment.md) wiki to prepare for releasing.
* Follow the [Configuring a Stack](configuring-a-stack.md) wiki to configure the AWS settings needed for release.
* Log in using these [instructions](aws-account.md#aws-command-line)
* Connect to your local container using [rake app:sh](local-environment.md)

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
npm run cloudformation:install
npm run cloudformation:release
OR
npm run cloudformation:release:force // to override the current release
```

**Frontend Assets**
```
npm run frontend:install
npm run frontend:release
OR
npm run frontend:release:force // to override the current release
```

**Lambda Functions**
```
npm run lambd:install
npm run lambda:release
OR
npm run lambda:release:force // to override the current release
```

**All Packages**
```
npm install
npm run release
OR
npm run release:force // to override the current release for all packages
```
