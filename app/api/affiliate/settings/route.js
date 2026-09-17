import { NextResponse } from "next/server";
import { currentUser, failure, input } from "../../../../lib/auth";
import db from "../../../../lib/db";
import { decryptPayoutValue, encryptPayoutValue } from "../../../../lib/secure-data";

export async function GET() {
  const user = await currentUser();
  if (!user) return failure("Not signed in.", 401);
  const settings = db.prepare("SELECT name,email,phone,payout_method,payout_account_name,payout_account_number,payout_bank_name FROM affiliates WHERE id=?").get(user.id);
  const payout = {
    accountName: decryptPayoutValue(settings.payout_account_name),
    accountNumber: decryptPayoutValue(settings.payout_account_number),
    bankName: decryptPayoutValue(settings.payout_bank_name),
  };
  if (settings.payout_account_name && !String(settings.payout_account_name).startsWith("enc:v1:")) {
    db.prepare("UPDATE affiliates SET payout_account_name=?,payout_account_number=?,payout_bank_name=? WHERE id=?").run(encryptPayoutValue(payout.accountName), encryptPayoutValue(payout.accountNumber), encryptPayoutValue(payout.bankName), user.id);
  }
  return NextResponse.json({ settings: { ...settings, payout_account_name: payout.accountName, payout_account_number: payout.accountNumber, payout_bank_name: payout.bankName } }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req) {
  const user = await currentUser();
  if (!user) return failure("Not signed in.", 401);
  try {
    const data = await input(req);
    const accountName = String(data.accountName || "").trim();
    const accountNumber = String(data.accountNumber || "").replace(/\s/g, "");
    const bankName = String(data.bankName || "").trim();
    if (accountName.length < 2 || accountName.length > 120 || !/^\d{10}$/.test(accountNumber) || bankName.length < 2 || bankName.length > 120)
      return failure("Enter a valid account name, 10-digit account number, and bank name.");
    db.prepare("UPDATE affiliates SET payout_method='bank_transfer',payout_account_name=?,payout_account_number=?,payout_bank_name=? WHERE id=?").run(encryptPayoutValue(accountName), encryptPayoutValue(accountNumber), encryptPayoutValue(bankName), user.id);
    return NextResponse.json({ ok: true });
  } catch {
    return failure("Unable to save payout settings.");
  }
}
