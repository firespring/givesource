# Prerequisites
1. This only needs to be done once - if a `givesource-vpc` stack already exists, the following is not necessary
2. Log in to the Givesource account on the AWS console
3. Navigate to the Cloudformation dashboard in the region in which you will be running Givesource

# Create the VPC
1. Select `Create stack` -> `with new resources`
2. Choose `Upload a template file` and choose the `vpc.yml` in your `givesource/cloudformation/` directory
3. Name the stack `givesource-vpc`
4. Click through the following screens and create the stack.
