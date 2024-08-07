# Prerequisites
* Follow the [Development](development.md) wiki to configure your development stack.
* You will need to be able to connect to the subnet which contains the Givesource database you wish to seed
  * The way Firespring accomplishes this it by connecting to the [VPN](https://github.com/firespring/engineering-devops/blob/master/documentation/vpn.md)
  * There are several additional ways to accomplish this based off how your AWS Account has been configured - discuss these with your AWS Solutions Architect if you require a different one

# Seeding the Database
The database seeds includes `donations`, `messages` and `nonprofits`. Under the hood the seeders use the faker library.

1. Verify your `.env` file is pointed to the correct Givesource stack.
2. Seed the database:
  ```
  npm run lambda:seed
  ```
3. Follow the prompts from the command.
