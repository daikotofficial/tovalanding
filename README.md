# TovaERP

Next.js App Router application. Preview: http://localhost:4173.

## Local setup

Use Node.js 24 and run `npm ci`, then `npm run dev`.
The real local configuration is **.env.local** in this directory.
Dotfiles may be hidden by your file browser. Never commit this file.
Use .env.example when setting up another environment.

### Configuration

- APP_URL: canonical origin. Local development uses http://localhost:4173; production uses https://tova.com.ng.
- ALLOWED_ORIGINS: comma-separated browser origins allowed for secure form mutations. Set production to https://tova.com.ng,https://www.tova.com.ng.
- DATABASE_URL: production PostgreSQL connection string. When present, all application data uses PostgreSQL.
- DATABASE_PATH: local SQLite database file used only when DATABASE_URL is absent.
- DATABASE_SSL: optional; set to `disable` only for a trusted local PostgreSQL instance.
- MAIL_TRANSPORT: local for development, mailgun for real delivery.
- PAYOUT_MINIMUM_MINOR: minimum payout balance in minor currency units; the launch default is 5000000 (₦50,000).
- MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_FROM: your Mailgun account values.
- MAILGUN_API_URL: https://api.mailgun.net or https://api.eu.mailgun.net.
- SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD: deployment-only bootstrap credentials.
- PAYOUT_ENCRYPTION_KEY: 32-byte key used for payout details at rest.
- INTEGRATION_API_KEY: optional shared secret accepted by the product-event endpoints.
- INTEGRATION_KEYS_JSON: optional per-product secret map, preferred over one shared key.
- INTEGRATION_PRODUCTS: comma-separated product allowlist; required in production.

There are no default administrator credentials. Set SUPERADMIN_EMAIL and
SUPERADMIN_PASSWORD in the deployment environment, then sign in at /admin/login.
Superadmin checks run on the server for both the page and the approval API.

### Local email testing

With MAIL_TRANSPORT=local, outgoing messages are saved privately in
data/mailbox.ndjson. Open that file locally to read the current verification code.
It is excluded from Git and is not served by Next.js.
This transport is rejected in production. Mailgun delivery has not been tested
against a real account because credentials have not been provided.

### Authentication

Affiliate accounts use a strong password (12+ characters with upper/lowercase and
number requirements) stored with a per-account salt using Node scrypt. Email codes
are used to verify a new account, not as the normal login credential. Login attempts
are rate-limited and accounts temporarily lock after repeated failures. Database
sessions use random 256-bit tokens; only their hashes are stored.
Cookies are HTTP-only, SameSite=Lax, and Secure when APP_URL is HTTPS.
Logout revokes the session. Mutations require the configured request origin.
New referral codes use the shorter `TOVAxxxxxx` format with a readable alphabet that
omits ambiguous characters. The database UNIQUE constraint and collision retries
prevent duplicates; older issued code formats remain valid.

### Application structure

- app/: Next.js pages and API handlers.
- components/: React forms, actions, and shared theme.
- lib/: server database, authentication, and email services.
- public/fonts/: self-hosted Poppins with its open-font license.
- tests/: browser and authentication regression checks.

Legacy HTML and CSS source files have been removed. Existing .html bookmarks
redirect to the corresponding Next routes. React renders HTML and styling in the
browser; compiled framework output will still contain HTML/CSS assets.
The original legal content is preserved in /terms, /privacy, and /cookies.
These existing policies describe the fixed-assets product; affiliate-specific
commercial terms and privacy scope still need approval before launch.

## Verification

`npm run build` creates an isolated .next-build output so it does not corrupt the
running development preview. `npm run start` serves that production build.
`npm test` runs tests against the local development app on port 4173.

## Launch work still required

The application persists affiliate applications and supports verified login, admin
approval, referral links, signup attribution, subscription commissions, and payout
requests. Verification does not approve an affiliate. Referral access is issued only
after an administrator approves the application. The current program rate is 10% of a
qualifying paid subscription. Subscription events enter a pending state and must be
approved after billing checks. Amounts are sent and stored as integer minor units (for
NGN, kobo).

Payouts are on-demand, manually reviewed, and paid by bank transfer. The minimum
request is ₦50,000. The target processing time is seven business days after the
affiliate has supplied valid payout details. Refunds, chargebacks, cancelled
subscriptions, and suspected self-referrals must be reversed or withheld before
payment; these controls must be connected to the product billing events before the
affiliate program is opened publicly.

Product integrations should call these endpoints after a customer signup and after
a successful paid subscription:

- `POST /api/affiliate/track/signup` with `{ product, externalId, email, referralCode, source }`.
- `POST /api/affiliate/track/subscription` with `{ product, externalId, amountMinor, currency }`.

The currently connected product identifiers are `tovafixedasset`, `tovabooks`, and
`tovapos`. Product links from the landing page preserve the referral code for all
three products, including links in the pricing section.

Send `x-tova-integration-key` when `INTEGRATION_API_KEY` is configured. Subscription
events are idempotent per product/customer ID, so retries do not create duplicate
commissions. The referral code must be passed from the referral URL/cookie into the
product signup flow; the landing page cannot read an HTTP-only cookie from another
domain.

Live product links opened after a referral visit receive the code as `?ref=TV-...`.
Each product signup form should accept that value as an optional Referral code field,
allow the customer to enter the same code manually, and send the normalized value in
the signup event. The product must retain the code with its customer record and use
the same stable customer ID for the later subscription event. Do not calculate or
store commission in the product app; the affiliate service is the source of truth.

Each product should configure `AFFILIATE_API_URL` and `INTEGRATION_API_KEY` in its
server environment only. Never expose the integration key in browser code. In local
development, an unset key is allowed; production rejects integration requests when
the key is missing or incorrect. Product servers should retry timeout/5xx responses,
send the same `product` and stable `externalId`, and treat a successful response as
idempotent. The signup event must happen only after the product account is created;
the subscription event must happen only after payment is verified server-side.

PostgreSQL is the production database. Set DATABASE_URL from the Render PostgreSQL
instance and run `npm run db:migrate` once before starting the Web Service. SQLite
remains a local fallback only. Multi-instance rate limiting, email-delivery retries,
backup/restore, and infrastructure load tests remain necessary before a large public
rollout.

## Reference

Content and product destinations: https://www.tova.com.ng/
Typography verified from its public stylesheet: Poppins.
Authentication guidance: https://nextjs.org/docs/app/guides/authentication
Mailgun: https://documentation.mailgun.com/docs/mailgun/api-reference/send/mailgun/messages/post-v3--domain-name--messages
