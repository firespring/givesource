# Update the Parameter Store Secrety key
1. Login to AWS via cli
2. run
```
    aws ssm put-parameter \
    --overwrite \
    --name /recaptcha/secure/recaptcha-key \
    --type SecureString \
    --value '<enter_value>'
```

3. Confirm changes in `Systems Manager` -> `Parameter Store`

# Add site key to database (stack specific)
1. Sign into AWS via cli
2. Run `npm run lambda:setting` -> Select `RECAPTCHA_KEY`
   1. The site key can be found in the 1password [vault](https://start.1password.com/open/i?a=3ZJEJLPCBJCHJPQKWRDOFZ5NKE&v=iw7qvfzuvoyz75zv5y4qw2ff3u&i=wzjamfyuz7rodgnkjvhwtp7ah4&h=firespring.1password.com)
3. Enter key and submit
