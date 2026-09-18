import { timingSafeEqual } from "node:crypto";
import db from "./db";
import { sendMail } from "./mail";
import { affiliatePaymentEmail } from "./email-templates";

const VAT_RATE_BPS = 750;
const COMMISSION_RATE = 20;

export async function integrationBody(req, max = 8192) {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) throw new Error("INPUT");
  const text = await req.text();
  if (text.length > max) throw new Error("INPUT");
  return JSON.parse(text);
}

function sameSecret(left, right) {
  const a = Buffer.from(String(left || ""));
  const b = Buffer.from(String(right || ""));
  return a.length === b.length && a.length > 0 && timingSafeEqual(a, b);
}

export function integrationAllowed(req, product = "") {
  const supplied = req.headers.get("x-tova-integration-key");
  let expected = process.env.INTEGRATION_API_KEY || "";
  try {
    const perProduct = JSON.parse(process.env.INTEGRATION_KEYS_JSON || "{}");
    if (product && typeof perProduct[product] === "string")
      expected = perProduct[product];
  } catch {
    return false;
  }
  if (!expected) return process.env.NODE_ENV !== "production";
  return sameSecret(supplied, expected);
}

export function validText(value, max = 120) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= max
  );
}

export function validProduct(product) {
  if (!validText(product, 80)) return false;
  const configured = (process.env.INTEGRATION_PRODUCTS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return configured.length > 0 && configured.includes(product.trim());
}

export async function recordSignup({
  product,
  externalId,
  email,
  referralCode,
  referredName,
  referredCompany,
  source = "link",
}) {
  const affiliate = await db
    .prepare(
      "SELECT id FROM affiliates WHERE code=? AND verified=1 AND status='active'",
    )
    .get(referralCode);
  if (!affiliate) return { recorded: false };
  const now = new Date().toISOString();
  const result = await db
    .prepare(
      `INSERT INTO referrals(affiliate_id,product,external_id,referred_name,referred_company,referred_email,source,status,signed_up_at,created_at)
       VALUES(?,?,?,?,?,?,?,'registered',?,?)
       ON CONFLICT(product,external_id) DO UPDATE SET referred_name=COALESCE(excluded.referred_name,referrals.referred_name),referred_company=COALESCE(excluded.referred_company,referrals.referred_company),referred_email=COALESCE(excluded.referred_email,referrals.referred_email)
       RETURNING id, affiliate_id`,
    )
    .get(
      affiliate.id,
      product.trim(),
      externalId.trim(),
      referredName?.trim() || null,
      referredCompany?.trim() || null,
      email?.trim().toLowerCase() || null,
      source.trim(),
      now,
      now,
    );
  return {
    recorded: true,
    referralId: result.id,
    affiliateId: result.affiliate_id,
  };
}

export async function recordSubscription({
  product,
  externalId,
  amountMinor,
  currency = "NGN",
  customerName,
  companyName,
  subscriptionExpiresAt,
}) {
  const amount = Number(amountMinor);
  if (!Number.isSafeInteger(amount) || amount <= 0 || amount > 100_000_000_000)
    throw new Error("INVALID_AMOUNT");
  if (currency !== "NGN") throw new Error("INVALID_CURRENCY");
  const outcome = await db.transaction(async () => {
    const referral = await db
      .prepare(
        "SELECT * FROM referrals WHERE product=? AND external_id=? AND status='registered'",
      )
      .get(product.trim(), externalId.trim());
    if (!referral) return { result: { recorded: false }, notification: null };
    const netAmount = Math.floor((amount * 10000) / (10000 + VAT_RATE_BPS));
    const commission = Math.floor((netAmount * COMMISSION_RATE) / 100);
    if (commission <= 0) throw new Error("INVALID_AMOUNT");
    const now = new Date().toISOString();
    const expiry = subscriptionExpiresAt
      ? new Date(subscriptionExpiresAt)
      : null;
    if (subscriptionExpiresAt && Number.isNaN(expiry.getTime()))
      throw new Error("INVALID_EXPIRY");
    await db
      .prepare(
        "UPDATE referrals SET status='converted',converted_at=?,referred_name=COALESCE(?,referred_name),referred_company=COALESCE(?,referred_company),subscription_expires_at=COALESCE(?,subscription_expires_at) WHERE id=?",
      )
      .run(
        now,
        customerName?.trim() || null,
        companyName?.trim() || null,
        expiry?.toISOString() || null,
        referral.id,
      );
    const inserted = await db
      .prepare(
        "INSERT INTO commissions(affiliate_id,referral_id,amount,rate,currency,status,created_at) VALUES(?,?,?,20,?,'pending',?) ON CONFLICT(referral_id) DO NOTHING RETURNING id",
      )
      .get(referral.affiliate_id, referral.id, commission, currency, now);
    const result = {
      recorded: Boolean(inserted),
      referralId: referral.id,
      commissionMinor: commission,
    };
    return {
      result,
      notification: inserted
        ? {
            affiliateId: referral.affiliate_id,
            customerName: customerName || referral.referred_name,
            expiry: expiry?.toISOString(),
            commission,
          }
        : null,
    };
  });
  if (outcome.notification) {
    const affiliate = await db
      .prepare("SELECT name,email FROM affiliates WHERE id=?")
      .get(outcome.notification.affiliateId);
    try {
      if (affiliate?.email)
        await sendMail({
          to: affiliate.email,
          subject: `A referral just paid for ${product.trim()}`,
          html: affiliatePaymentEmail({
            affiliateName: affiliate.name,
            customerName: outcome.notification.customerName,
            product: product.trim(),
            amount: (outcome.notification.commission / 100).toLocaleString(
              "en-NG",
              { minimumFractionDigits: 2 },
            ),
            expiresAt: outcome.notification.expiry,
          }),
        });
    } catch (error) {
      console.error("Affiliate payment notification failed", {
        affiliateId: outcome.notification.affiliateId,
        error: error?.message,
      });
    }
  }
  return outcome.result;
}
