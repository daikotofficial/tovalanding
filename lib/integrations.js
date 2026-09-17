import { timingSafeEqual } from "node:crypto";
import db from "./db";

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
  return configured.length === 0 || configured.includes(product.trim());
}

export function recordSignup({
  product,
  externalId,
  email,
  referralCode,
  source = "link",
}) {
  const affiliate = db
    .prepare(
      "SELECT id FROM affiliates WHERE code=? AND verified=1 AND status='active'",
    )
    .get(referralCode);
  if (!affiliate) return { recorded: false };
  const now = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT INTO referrals(affiliate_id,product,external_id,referred_email,source,status,signed_up_at,created_at)
       VALUES(?,?,?,?,?,'registered',?,?)
       ON CONFLICT(product,external_id) DO UPDATE SET referred_email=COALESCE(excluded.referred_email,referrals.referred_email)
       RETURNING id, affiliate_id`,
    )
    .get(
      affiliate.id,
      product.trim(),
      externalId.trim(),
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

export function recordSubscription({
  product,
  externalId,
  amountMinor,
  currency = "NGN",
}) {
  const amount = Number(amountMinor);
  if (!Number.isSafeInteger(amount) || amount <= 0 || amount > 100_000_000_000)
    throw new Error("INVALID_AMOUNT");
  if (currency !== "NGN") throw new Error("INVALID_CURRENCY");
  return db.transaction(() => {
    const referral = db
      .prepare(
        "SELECT * FROM referrals WHERE product=? AND external_id=? AND status='registered'",
      )
      .get(product.trim(), externalId.trim());
    if (!referral) return { recorded: false };
    const commission = Math.floor(amount * 0.1);
    if (commission <= 0) throw new Error("INVALID_AMOUNT");
    const now = new Date().toISOString();
    db.prepare(
      "UPDATE referrals SET status='converted',converted_at=? WHERE id=?",
    ).run(now, referral.id);
    const inserted = db
      .prepare(
        "INSERT OR IGNORE INTO commissions(affiliate_id,referral_id,amount,rate,currency,status,created_at) VALUES(?,?,?,10,?,'pending',?)",
      )
      .run(referral.affiliate_id, referral.id, commission, currency, now);
    return {
      recorded: inserted.changes === 1,
      referralId: referral.id,
      commissionMinor: commission,
    };
  })();
}
