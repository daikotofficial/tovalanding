# Tova affiliate attribution contract

## Business rule

An affiliate link or referral code identifies the referring affiliate. A referred
customer becomes a referral when the product has successfully created the customer
account. The referral may appear in the affiliate dashboard immediately, but it
must not create earnings yet.

Only after the product has verified a successful paid subscription server-side does
Tova create the commission: 10% of the qualifying subscription amount in NGN minor
units. The product must never calculate or store the commission.

Refunds, chargebacks, cancellations, suspected self-referrals, and other billing
reversals must suspend or reverse the commission before payout. Payouts must only
use confirmed, unreversed commissions.

## Required product flow

1. A visitor opens `https://tova.com.ng/r/TOVAxxxxxx`.
2. Tova validates the active code, stores attribution, and redirects to the landing
   page. Product links receive `?ref=TOVAxxxxxx`.
3. The product signup form displays an optional `Referral code` field, prefilled
   from `ref`. The customer may enter it manually.
4. The product stores the normalized code with the customer record.
5. After the product creates the customer account, its server calls the signup
   endpoint with the product name and stable customer ID.
6. Tova records the referral, including the customer name when supplied. It is visible in the affiliate dashboard, with no
   earnings yet.
7. After payment is verified by the product server, its server calls the
   subscription endpoint with the same product and stable customer ID, the paid
   amount in minor units, `NGN`, the customer name, and the subscription expiry
   timestamp when available.
8. Tova idempotently creates the 10% commission. Retries must reuse the same IDs.

## Security requirements

- Product calls are server-to-server only; keys never enter browser code.
- Use a distinct integration secret per product via `INTEGRATION_KEYS_JSON`.
- Restrict `INTEGRATION_PRODUCTS` to the products actually connected.
- Product servers must retry only timeout/5xx failures and reuse the same stable ID.
- A signup event is sent only after account creation; a subscription event is sent
  only after payment verification.
- The product must not trust a browser-supplied amount or customer ID for the
  subscription call.

## Environment contract

On Tova: `INTEGRATION_KEYS_JSON`, `INTEGRATION_PRODUCTS`, `APP_URL`.

On each product server: `AFFILIATE_API_URL` and that product's integration key.
Never expose either secret in `NEXT_PUBLIC_*` or other browser-visible variables.
