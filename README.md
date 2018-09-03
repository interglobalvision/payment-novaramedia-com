# payment-novaramedia-com

Process one-off and recurring donations to Novara Media using Stripe.

---

### Settings

`settings.json` is required to run. It needs Stripe API tokens. It also needs copy for post subscription views and emails. It also can take data for running time limited fundraisers (both of pure subscriptions to goal and one off donations to goal). When running it exposes a simple json endpoint. The date format for the settings is anything that moment.js will read but recommended and tested with ISO 8601 timestamps.

---

### Dev

Has optional gulpfile in project root than can lint (needs rewriting itself)

Requires settings.json to run. Copy the example to the app folder, rename `settings.json` and run meteor with `meteor --settings settings.json`

In production using the last version of [mupx](https://www.npmjs.com/package/mupx) for deployment. But this should be migrated to [mup](https://github.com/zodern/meteor-up) in the future

---

### TODO

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

#### v0.8

- Export subscribers data for Mailchimp ✔
- Basic admin user functions: List, check Stripe status, delete orphaned subscription records and delete accounts (with serious warnings) ✔

#### v0.9

- Registered user card handling for new subscriptions and expired cards

#### v1.0

- Failed subscription payment webhook handling. Notifies user of failure and deletes subscription from database.
- Basic analytics dashboard: total subscribers, average subscription value, % falloff

#### v1.1

- Sync subscribers to Mailchimp via API
- HTML formatted emails

#### v1.2

- Expansion of analytics gathering
- Extended analytics dashboard

#### v2.0?

- Rewrite views in React
