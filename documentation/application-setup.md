# Application Setup
This is a brief overview of the settings that Firespring typically manages.

## Event Settings
We typically gather and fill in all of the information on this page when we create the stack.

1. Event Name
2. Event Date (set start and end to the same day for single-day events)
3. Timezone
4. When do you accept nonprofit registrations
5. When do you accept donations (optional donation period leading up to the giving day)

## Contact Settings
1. Contact Email (The address that the contact form sends messages to)
2. Sender Email (The address that the app sends emails from)
3. Contact Phone # (The number that displays in the footer of the event pages)

**Notes**  
For clients that do not have a **Sender Email** prepared, use: `givingday@firespring.com`.  

When Firespring is supporting the event (typically the day of the event), set the **Contact Email** to `givingday@firespring.com` and **Contact Phone #** to the support phone queue
number (Ask support for this as it may change). **Remember to change this back after the support time** 

By setting the **Sender Email** to the same email as the contact email in Salesforce for the client, and setting the **Contact Email** to `givingday@firespring.com`, Salesforce
will automatically create cases in the correct queues.  

## Site Appearance Settings
If applicable, copy the previous year's images and colors.

## Email Settings
This is the typical format for emails:

### Donation Notifications
**Text Before Donation Details**  
Be sure to change the event name.  
```
Congratulations! Your organization has received a donation during the Scranton Give event! 
```
**Text After Donation Details**  
```
Firespring Foundation will send the donor an official receipt. Be sure to thank your donor promptly and sincerely and add them to your donor database for ongoing stewardship. You 
can also view their donation information on the Donations tab of your admin page.
```

### Donation Receipt
**Text Before Donations List**  
Be sure to change the event name.  
```
Thank you for supporting local charities during the Scranton Give.
```
**Text After Donations List**  
Be sure to change the fee amounts and urls.  
```
Your contribution is to the Firespring Foundation donor-advised fund (Tax ID 30-0358636), intended for the benefit of the charity you indicated. The Foundation makes every 
reasonable effort to respect the wishes of its donors. However, to comply with federal tax laws and Internal Revenue Service regulations, the Foundation must retain the exclusive 
authority, discretion, and legal control over all donated funds. In the rare event that the charity you have advised does not satisfy our criteria or otherwise enable us to pay 
them (reasons for this include issues like: they don’t or cannot accept donations, are not recognized by the IRS as a public charity, or are not in good standing with federal or 
state regulators, etc.), we may select an alternate charity to receive your donation funds.

Firespring Foundation’s standard practice is to regrant 97.1% less $0.30 of a donor-advised contribution to a qualifying tax-exempt entity and/or cause advised by the donor, and 
to retain 3.9% plus $0.30 for credit card processing and platform expenses. If you chose to cover the fee, which is indicated on your receipt, you can make it possible for 
charities to receive 100% of the intended amount.

Firespring Foundation's distributions to or for the benefit of your advised charity and/or purpose must not be used for the personal benefit of you, any other donor advisor, or any
 other purpose conferring impermissible private benefit. For the full story, please see our terms of use: `<WEBSITE_NAME>`/terms
```

## Payment Gateway Settings
1. Be sure to enter the **Firespring Foundation** PaymentSpring keys before the donation period. Also be sure to set the **Are you ready to accept real credit cards** to `yes`.
2. Donation fees are typically set to 3.9% and $0.30 (Firespring retains 1% of the fees).
3. Offline donation fees are optional and typically set to 2.9% for Give to Lincoln Day only.
4. Display test payment information is generally only used in develop.

## Google Analytics Settings
See the Firespring's google analytics account for Tracking ID. There is one specifically for each giving day. See Andrew with questions.

## Manage Admins Settings
For setup, add the support representatives email address and other Engineering team's addresses as needed. The support representative will add the clients' emails.  

**Note**  
To change the user's permissions: go to the AWS web console -> Cognito -> Mange User Pools. Choose the stack and find the user in the Users and Groups page. From here you can pick a new user group for that user. SuperAdmin, Admin, and Nonprofit are currently the options for groups.  If you are adding the "SuperAdmin" group to an admin user you can remove the "Admin" group at that time.

## Pages - Donation Checkout
**Checkout Text**  
Be sure to change the event name, fee amounts and urls.  
```
Thank you for supporting local charities for the Scranton Give. All donations on this site are made to Firespring Foundation. The nonprofit(s) you supported today will 
receive information about your gift in real time, unless you chose to be Anonymous.

Your contribution is to the Firespring Foundation donor-advised fund (Tax ID 30-0358636), intended for the benefit of the charity you indicated. The Foundation makes every 
reasonable effort to respect the wishes of its donors. However, to comply with federal tax laws and Internal Revenue Service regulations, the Foundation must retain the exclusive 
authority, discretion, and legal control over all donated funds. In the rare event that the charity you have advised does not satisfy our criteria or otherwise enable us to pay 
them (reasons for this include issues like: they don't or cannot accept donations, are not recognized by the IRS as a public charity, or are not in good standing with federal or 
state regulators, etc.), we may select an alternate charity to receive your donation funds.

Firespring Foundation's standard practice is to regrant 97.1% less $0.30 of a donor-advised contribution to a qualifying tax-exempt entity and/or cause advised by the donor, and 
to retain 3.9% plus $0.30 for credit card processing and platform expenses. If you chose to cover the fee, which is indicated on your receipt, you can make it possible for 
charities to receive 100% of the intended amount.

Firespring Foundation's distributions to or for the benefit of your advised charity and/or purpose must not be used for the personal benefit of you, any other donor advisor, or 
any other purpose conferring impermissible private benefit. For the full story, please see our terms of use: `<WEBSITE_NAME>`/terms
```

## Pages - Terms
Be sure to add the legal terms to this page. See an existing stack for the terms.
