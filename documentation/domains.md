# Domains

1. If the domain is being used already on another stack, remove the domain settings from that stack:
  - Visit AWS web console -> CloudFormation
  - Select the stack and choose "Update"
  - When prompted, select "Same Template"
  - You will be taken through a wizard to update CloudFormation stack, when prompted to modify parameters, remove all the settings for CNAME and Domains.
2. If the domain already exists in Route53:
  - Visit AWS web console -> CloudFront
  - Find the distribution id for the admin and public pages.
  - Visit AWS web console -> Route53
  - Select Hosted Zones and update the A and CNAME records to match the appropriate distribution id from above
3. Update the stack configuration, see: [Configuring-a-Stack](configuring-a-stack.md)
4. Update the stack, see: [Updating-a-Stack](updating-a-stack.md)
5. Update the url settings in the app:
  - Run `npm run lambda:setting`
  - Select `EVENT_URL` and enter (for example): `https://givetolincoln.com`
  - Run `npm run lambda:setting`
  - Select `ADMIN_URL` and enter (for example): `https://manage.givetolincoln.com`
6. Repeat step 5 for the old stack, and set the urls back to the CloudFront distribution urls found in CloudFront.

*Note*  
The CloudFront distribution url can be used to access a stack regardless of the domain settings.  

**If there is no entry for Route53, see Craig to help set one up.**
