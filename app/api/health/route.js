import { NextResponse } from "next/server";
import db from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    db.prepare("SELECT 1").get();
    const production = process.env.NODE_ENV === "production";
    const checks = {
      database: true,
      appUrl:
        Boolean(process.env.APP_URL?.startsWith("https://")) || !production,
      integrationKey:
        Boolean(
          process.env.INTEGRATION_API_KEY || process.env.INTEGRATION_KEYS_JSON,
        ) || !production,
      payoutEncryption:
        Boolean(process.env.PAYOUT_ENCRYPTION_KEY) || !production,
      mail:
        process.env.MAIL_TRANSPORT === "local"
          ? !production
          : Boolean(
              process.env.MAILGUN_API_KEY &&
              process.env.MAILGUN_DOMAIN &&
              process.env.MAILGUN_FROM,
            ),
    };
    const ok = Object.values(checks).every(Boolean);
    return NextResponse.json(
      { ok, checks },
      { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { ok: false, checks: { database: false } },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
