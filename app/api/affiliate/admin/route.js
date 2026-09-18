import { NextResponse } from "next/server";
import { failure, input, passwordError } from "../../../../lib/auth";
import db, { makeCode } from "../../../../lib/db";
import { sendMail } from "../../../../lib/mail";
import { approvalAffiliateEmail } from "../../../../lib/email-templates";
import {
  currentSuperadmin,
  createAdminUser,
  revokeAdminSessions,
} from "../../../../lib/superadmin";
import { decryptPayoutValue } from "../../../../lib/secure-data";
import { affiliateProducts } from "../../../../lib/products";
export async function GET(req) {
  if (!(await currentSuperadmin()))
    return failure("Administrator access required.", 403);
  const affiliateId = new URL(req.url).searchParams.get("affiliateId");
  if (affiliateId) {
      const affiliate = await db
      .prepare(
        "SELECT id,name,email,phone,location,channel,code,status,verified,created_at,payout_account_name,payout_account_number,payout_bank_name FROM affiliates WHERE id=?",
      )
      .get(Number(affiliateId));
    if (!affiliate) return failure("Affiliate application not found.", 404);
    const referrals = await db
      .prepare(
        "SELECT product,external_id,referred_email,source,status,signed_up_at,converted_at,created_at FROM referrals WHERE affiliate_id=? ORDER BY id DESC",
      )
      .all(affiliate.id);
    const payouts = await db
      .prepare(
        "SELECT id,amount,status,created_at FROM payouts WHERE affiliate_id=? ORDER BY id DESC",
      )
      .all(affiliate.id);
    return NextResponse.json(
      {
        affiliate: {
          ...affiliate,
          code: affiliate.status === "active" ? affiliate.code : null,
          payout_account_name: decryptPayoutValue(
            affiliate.payout_account_name,
          ),
          payout_account_number: decryptPayoutValue(
            affiliate.payout_account_number,
          ),
          payout_bank_name: decryptPayoutValue(affiliate.payout_bank_name),
        },
        referrals,
        payouts,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
  const affiliates = await db
    .prepare(
      "SELECT id,name,email,location,code,status,created_at, (SELECT COALESCE(SUM(amount),0) FROM commissions c WHERE c.affiliate_id=a.id AND c.status=?) AS earnings FROM affiliates a ORDER BY id DESC LIMIT 100",
    )
    .all("approved");
  return NextResponse.json(
    {
      affiliates: affiliates.map((affiliate) => ({
        ...affiliate,
        code: affiliate.status === "active" ? affiliate.code : null,
      })),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(req) {
  let data;
  try { data = await input(req); }
  catch (error) { return failure(error.message === "ORIGIN" ? "Request origin not allowed." : "Invalid request.", error.message === "ORIGIN" ? 403 : 400); }
  const actor = await currentSuperadmin();
  if (!actor) return failure("Administrator access required.", 403);
  try {
    const note =
      typeof data.note === "string" ? data.note.trim().slice(0, 500) : "";
    if (["payout_paid", "payout_rejected"].includes(data.action)) {
      const payoutId = Number(data.payoutId);
      if (!Number.isInteger(payoutId)) return failure("Invalid payout.");
      const payout = await db
        .prepare("SELECT id FROM payouts WHERE id=?")
        .get(payoutId);
      if (!payout) return failure("Payout not found.", 404);
      const current = await db
        .prepare("SELECT status,affiliate_id,amount FROM payouts WHERE id=?")
        .get(payoutId);
      if (current.status !== "requested" && current.status !== "approved")
        return failure("That payout has already been finalized.");
      if (data.action === "payout_paid") {
        const details = await db
          .prepare(
            "SELECT payout_account_name,payout_account_number,payout_bank_name FROM affiliates WHERE id=?",
          )
          .get(current.affiliate_id);
        if (
          !details?.payout_account_name ||
          !details.payout_account_number ||
          !details.payout_bank_name
        )
          return failure("The affiliate must provide payout details first.");
      }
      const status = data.action === "payout_paid" ? "paid" : "rejected";
      const finalized = await db.transaction(async () => {
        const updated = await db
          .prepare(
            "UPDATE payouts SET status=? WHERE id=? AND status IN ('requested','approved') RETURNING id,status,affiliate_id,amount",
          )
          .get(status, payoutId);
        if (!updated) return null;
        if (status === "rejected")
          await db.prepare("DELETE FROM payout_commissions WHERE payout_id=?").run(
            payoutId,
          );
        await db.prepare(
          "INSERT INTO audit_logs(actor_email,action,target_type,target_id,metadata,created_at) VALUES(?,?,?,?,?,?)",
        ).run(
          actor.email,
          data.action,
          "payout",
          String(payoutId),
          "{}",
          new Date().toISOString(),
        );
      });
      return NextResponse.json({ ok: true, status });
    }
    if (["approve_commission", "reject_commission"].includes(data.action)) {
      const commissionId = Number(data.commissionId);
      if (!Number.isInteger(commissionId))
        return failure("Invalid commission.");
      const commission = await db
        .prepare("SELECT id,status FROM commissions WHERE id=?")
        .get(commissionId);
      if (!commission) return failure("Commission not found.", 404);
      if (commission.status !== "pending")
        return failure("That commission has already been finalized.");
      const status =
        data.action === "approve_commission" ? "approved" : "rejected";
      await db.transaction(async () => {
        await db.prepare(
          "UPDATE commissions SET status=? WHERE id=? AND status='pending'",
        ).run(status, commissionId);
        await db.prepare(
          "INSERT INTO audit_logs(actor_email,action,target_type,target_id,metadata,created_at) VALUES(?,?,?,?,?,?)",
        ).run(
          actor.email,
          data.action,
          "commission",
          String(commissionId),
          JSON.stringify({ note }),
          new Date().toISOString(),
        );
        return updated;
      });
      if (!finalized)
        return failure("That payout has already been finalized.");
      const affiliate = await db
        .prepare("SELECT name,email FROM affiliates WHERE id=?")
        .get(finalized.affiliate_id);
      if (affiliate?.email) {
        const outcome = status === "paid" ? "has been marked as paid" : "was rejected";
        await sendMail({
          to: affiliate.email,
          subject: `Affiliate payout ${status}`,
          text: `Hello ${affiliate.name}, your payout request of ₦${(finalized.amount / 100).toLocaleString()} ${outcome}. Please sign in to view the latest status.`,
        }).catch((error) =>
          console.error("Affiliate payout notification failed", {
            payoutId,
            error: error?.message,
          }),
        );
      }
      return NextResponse.json({ ok: true, status: finalized.status });
    }
    if (data.action === "create_admin") {
      if (actor.role !== "superadmin")
        return failure("Only the superadmin can add administrators.", 403);
      const email = String(data.email || "")
        .trim()
        .toLowerCase();
      const password = String(data.password || "");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || passwordError(password))
        return failure(
          "Use a valid email and a password of at least 12 characters.",
        );
      try {
        const admin = await db.transaction(async () => {
          const created = await createAdminUser(email, password);
          await db.prepare(
          "INSERT INTO audit_logs(actor_email,action,target_type,target_id,metadata,created_at) VALUES(?,?,?,?,?,?)",
          ).run(actor.email, "create_admin", "admin", String(created.id), JSON.stringify({ email: created.email }), new Date().toISOString());
          return created;
        });
        return NextResponse.json({ ok: true, admin });
      } catch (error) {
        if (String(error.message).includes("UNIQUE"))
          return failure("That administrator already exists.");
        throw error;
      }
    }
    if (
      [
        "deactivate_admin",
        "reactivate_admin",
        "revoke_admin_sessions",
      ].includes(data.action)
    ) {
      if (actor.role !== "superadmin")
        return failure("Only the superadmin can manage administrators.", 403);
      const adminId = Number(data.adminId);
      if (!Number.isInteger(adminId)) return failure("Invalid administrator.");
      const admin = await db
        .prepare("SELECT id,email,status FROM admin_users WHERE id=?")
        .get(adminId);
      if (!admin) return failure("Administrator not found.", 404);
      await db.transaction(async () => {
        if (data.action === "revoke_admin_sessions") {
          await revokeAdminSessions(admin.email);
        } else {
          const status =
            data.action === "deactivate_admin" ? "disabled" : "active";
          await db.prepare("UPDATE admin_users SET status=? WHERE id=?").run(
            status,
            admin.id,
          );
          if (status === "disabled") await revokeAdminSessions(admin.email);
        }
        await db.prepare(
          "INSERT INTO audit_logs(actor_email,action,target_type,target_id,metadata,created_at) VALUES(?,?,?,?,?,?)",
        ).run(
          actor.email,
          data.action,
          "admin",
          String(admin.id),
          JSON.stringify({ email: admin.email, note }),
          new Date().toISOString(),
        );
      });
      return NextResponse.json({
        ok: true,
        status:
          data.action === "revoke_admin_sessions"
            ? admin.status
            : data.action === "deactivate_admin"
              ? "disabled"
              : "active",
      });
    }
    const id = Number(data.id);
    const action = String(data.action || "");
    if (
      !Number.isInteger(id) ||
      !["approve", "reject", "deactivate", "reactivate"].includes(action)
    )
      return failure("Invalid affiliate review action.");
    const affiliate = await db.prepare("SELECT * FROM affiliates WHERE id=?").get(id);
    if (!affiliate) return failure("Affiliate application not found.", 404);
    if (action === "approve" && !affiliate.verified)
      return failure("The affiliate must verify their email before approval.");
    if (
      action === "reject" ||
      action === "deactivate" ||
      action === "reactivate"
    ) {
      const status =
        action === "reject"
          ? "rejected"
          : action === "deactivate"
            ? "suspended"
            : "active";
      if (action === "reactivate" && !affiliate.verified)
        return failure(
          "The affiliate must verify their email before reactivation.",
        );
      await db.transaction(async () => {
        await db.prepare("UPDATE affiliates SET status=? WHERE id=?").run(status, id);
        await db.prepare(
        "INSERT INTO audit_logs(actor_email,action,target_type,target_id,metadata,created_at) VALUES(?,?,?,?,?,?)",
        ).run(actor.email, action, "affiliate", String(id), JSON.stringify({ note }), new Date().toISOString());
      });
      return NextResponse.json({ ok: true, status });
    }
    let code;
    for (let attempt = 0; attempt < 5; attempt++) {
      code = makeCode();
      try {
        await db.transaction(async () => {
          await db.prepare(
          "UPDATE affiliates SET status='active',code=? WHERE id=?",
          ).run(code, id);
          await db.prepare(
          "INSERT INTO audit_logs(actor_email,action,target_type,target_id,metadata,created_at) VALUES(?,?,?,?,?,?)",
          ).run(actor.email, "approve", "affiliate", String(id), JSON.stringify({ code }), new Date().toISOString());
        });
        break;
      } catch (error) {
        if (attempt === 4 || !String(error.message).includes("UNIQUE"))
          throw error;
      }
    }
    const productTextLinks = affiliateProducts
      .map(
        (product) =>
          `${product.name}: ${process.env.APP_URL}/r/${encodeURIComponent(code)}?product=${product.key}`,
      )
      .join("\n");
    try {
      await sendMail({
        to: affiliate.email,
        subject: "Your Tova affiliate application was approved",
        html: approvalAffiliateEmail({ name: affiliate.name, code }),
        text:
          "Hello, " +
          affiliate.name +
          ". Your Tova affiliate application has been approved. Your referral code is " +
          code +
          ". Your product signup links are:\n" +
          productTextLinks +
          ". Sign in at " +
          process.env.APP_URL +
          "/affiliate/login to access your dashboard.",
      });
    } catch {
      console.error(
        "Affiliate approval email delivery failed; details remain available in the dashboard.",
      );
    }
    return NextResponse.json({ ok: true, status: "active", code });
  } catch {
    return failure("Unable to update the affiliate application.");
  }
}
