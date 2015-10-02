# payment-novaramedia-com

Process one-off and recurring donations to Novara Media using Stripe.

---

###TODO

- One-off route. A form to make a one off payment. Stripe tokenize and make payment on server. Save only reference to payments in DB ✔
- Recurring route. As one-off but before creating subscription with Stripe token create user and save sub in DB ✔
- Add query variable loading of payment routes ✔
- User account route. Allows users to login and add/edit/delete existing subscriptions. Allows total user removal if user requests ✔
- Admin route. Allows the admin user to see recent donations/subs and overall totals ✔
- Thanks route after successful donations ✔
- Fix user routes ✔
- Full Novara styling ✔
- Social shares on thanks page ✔
- Add processing indication ✔
- Forgot submit tells you to check your email ✔
- Emails ✔
- Card/payment error handling ✔
- Fix try/catch failures ✔
- Routing once logged in ✔

####v1.1

- Failed subscription payment webhook handling. Notifies user of failure and deletes subscription from database.
- Export subscribers to Mailchimp