# Prerequisites
* Follow the [Setup Environment](setup-environment.md) wiki to prepare for releasing.
* Follow the [Configuring a Stack](configuring-a-stack.md) wiki to configure the AWS settings needed for release.
* Log in using these [instructions](aws-account.md#aws-command-line)

## Rake
* `rake` is a combination of `ruby` and `make`
* Firespring had built a library of common development environment commands to be re-used for many of our projects
  * This also provides an easy framework for extending those commands
* To see what commands are available, use `rake -T`

## Docker
* Docker is a linux based framework for segmenting processes safely and securely
  * In most instances, these docker containers can be thought of as VMs - although this description is not _entirely_ accurate
* Givesource uses docker to provide a standardized environment for making and verifying changes to it's code

## Local Dev Environment
* Build the local containers
  * `rake build`
* Start the local containers
  * `rake up`
* Show running local containers
  * `rake ps`
* Connect to a local container
  * `rake app:sh`
  * When you connect to the container, your local aws credentials will be shared into your terminal context
* Stop the running containers
  * `rake down`
* Clean up any unused containers/volumes/resources
  * `rake clean`
