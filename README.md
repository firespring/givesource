![Logo](https://github.com/firespring/givesource/wiki/images/givesource-logo-colors-on-dark.png)


Givesource® is a platform designed to help foundations manage Giving Day events by allowing participating nonprofits to easily create a page and take donations.
Leveraging Amazon Web Services, Givesource® was built using a serverless architecture to support high site traffic and donor activity.
This means you have unlimited capacity to help nonprofits fundraise and grow your community without managing expensive servers.

## Features

* Ability to accept donations online and off.
* Scalability—the platform can accommodate expanding needs and donor traffic.
* Ease of use by the participating organizations.
* Opportunity to support matching funds.

## Installation

1. Click on the Launch Stack button.

	[![Launch Stack](https://cdn.rawgit.com/buildkite/cloudformation-launch-stack-button-svg/master/launch-stack.svg)](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/new?stackName=Givesource&templateURL=https://s3.amazonaws.com/givesource/cf-templates/1.4.0/givesource.yml)

2. AWS CloudFormation should open in a new window, with the "Specify an Amazon S3 template URL" option checked, click next.

	![Givesource® Stack Setup Step 1](https://github.com/firespring/givesource/wiki/images/givesource-stack-step-1.png)
	
3. Enter your desired stack name and admin email address, and click Next.

	![Givesource® Stack Setup Step 2](https://github.com/firespring/givesource/wiki/images/givesource-stack-step-2.png)
	
4. Click Next.

	![Givesource® Stack Setup Step 3](https://github.com/firespring/givesource/wiki/images/givesource-stack-step-3.png)
	
5. Verify your information, check the acknowledgement box, and click Create.

	![Givesource® Stack Setup Step 4](https://github.com/firespring/givesource/wiki/images/givesource-stack-step-4.png)
	
6. When the stack is created, an email will be sent to the admin email address entered in on step 2. This will take up to 25 minutes. Click the link in the email to setup a password and login.

## License

Copyright 2019 Firespring, Inc.

Licensed under the Apache License, Version 2.0: [https://www.apache.org/licenses/LICENSE-2.0](https://www.apache.org/licenses/LICENSE-2.0)
