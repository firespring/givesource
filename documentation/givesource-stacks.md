# Prerequisites
* These stacks only need to be created once and will then be shared by all givesource stacks
* Log in to the Givesource account on the [AWS console](aws-account.md#aws-console)
* Navigate to the Cloudformation dashboard in the region in which you will be running Givesource

## Create the VPC
* Select `Create stack` -> `with new resources`
* Choose `Upload a template file` and choose the `vpc.yml` in your `givesource/cloudformation/` directory
* Name the stack `givesource-vpc`
* Click through the following screens and create the stack.

## Create the ECR
* Select `Create stack` -> `with new resources`
* Choose `Upload a template file` and choose the `ecr.yml` in your `givesource/cloudformation/` directory
* Name the stack `givesource-ecr`
* Click through the following screens and create the stack.

## Create the Database
* Select `Create stack` -> `with new resources`
* Choose `Upload a template file` and choose the `database.yml` in your `givesource/cloudformation/` directory
* Name the stack `givesource-database`
* Click through the following screens and create the stack.

## Create the Waf
* Select `Create stack` -> `with new resources`
* Choose `Upload a template file` and choose the `waf.yml` in your `givesource/cloudformation/` directory
* Name the stack `givesource-waf`
* Click through the following screens and create the stack.

## (Optional) create s3-logging, default-access-roles, givesource-vpn, givesource-vpn-access-rules, and cicd-resources stacks
