# Prerequisites
1. Follow the [Development](development.md) wiki to configure your development stack.
2. You will need to be connected to the [VPN](https://github.com/firespring/engineering-devops/blob/master/documentation/vpn.md) while running seed.

# Seeding the Database
The database seeds includes `donations`, `messages` and `nonprofits`. Under-the-hood the seeders use the faker library.

1. Verify your `.env` file is pointed to the correct Givesource stack.
2. Seed the database:
	```
	npm run lambda:seed
	```
3. Follow the prompts from the command.

## AWS Profile
If your default AWS CLI profile is not the AWS account you want to release to, you will need to prepend the AWS_PROFILE environment varable to the commands
that interact with AWS, in this case:
```
AWS_PROFILE=givesource-dev npm run lambda:seed
```
