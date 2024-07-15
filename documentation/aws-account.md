**NOTE: The following instructions are specific to the Firespring implementation of givesource - your organization's implementation may vary**

# AWS Console
* There are two main AWS child accounts used to manage and develop Givesource resources. Both child stacks currently reside under the `Root Org` AWS account
  * To access these accounts, first login to the [Root Org](https://020401666882.signin.aws.amazon.com/console) AWS account
  * Once authenticated, click on the invite links below to add the child account links to your user's dropdown menu in the AWS web console
    * **[Givesource Development AWS Account](https://signin.aws.amazon.com/switchrole?account=948629139753&roleName=AdminAccessRole&displayName=Givesource+Dev)**  
    * **[Givesource Production AWS Account](https://signin.aws.amazon.com/switchrole?account=016226103026&roleName=AdminAccessRole&displayName=Givesource+Prod)**
* If your organization does not use a separate AWS account for users, then simply log in to the account in which your Givesource instance will reside

# AWS Command Line
* Your local AWS credentials are by default managed by the Firespring dev command library
* In a terminal

* If your organization does not use a separate AWS account for users, then simply log in to the account in which your Givesource instance will reside
