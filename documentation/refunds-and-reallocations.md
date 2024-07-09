# Pre-requisites
* Create a snapshot of the givesource database in case any mistakes are made during the refund or reallocation process

# Refunds
### Refund in Givesource (remove from the givesource app)
* Connect to the VPN
* Connect to the mysql database
* Find the donation in the Donations table
* Find the corresponding entry in the PaymentTransactions table
  * `where Donations.paymentTransactionId = PaymentTransactions.id`
  * Note the `transactionId` - this will map to the transaction in NPS
* Update the payment transaction isDeleted and deletedAt values
* Update the donation isDeleted and deletedAt values
* The refund is now complete in the Givesource app now

### Refund in NPS (give the money back to the donor)
* Log on to the NPS dashboard
  * There is a 1password entry
  * Should be named something like `Firespring Foundation (Givesource) PaymentSpring info`
* Go to the Payments tab and enter the transactionId in the search box
* Click on the payment to see the payment details
  * Click on the Refund tab
  * Enter the full amount of the payment in the refund amount box
  * Click `Refund`
* The refund is now complete in NPS

# Reallocations
### Reallocate in Givesource (change the nonprofitId in the givesource app)
* Search the Nonprofits table for the starting nonprofit
  * Take note of the id
* Search the Nonprofits table for the desired nonprofit
  * Take note of the id
* Search the Donors table for the email address referenced in the reallocation sheet
* Find the corresponding entries for the donor in the Donations table
  * `where Donations.donorId = Donor.id`
  * Find the id of the donation which the donor gave to the starting nonprofit id
* Update the donation and change the nonprofit id to the desired nonprofit
* (Optional) Re-send the receipt email to the donor email address
