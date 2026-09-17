import { NextResponse } from "next/server";
import db from "../../../lib/db";

export const dynamic = "force-dynamic";

function validEncryptionKey(value) {
  const text = String(value || "");
  if (/^[a-f0-9]{64}$/i.test(text)) return true;
  try { return Buffer.from(text, "base64").length === 32; } catch { return false; }
}

function configuredProducts() {
  return (process.env.INTEGRATION_PRODUCTS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function validIntegrationConfig() {
  const products = configuredProducts();
  if (products.length === 0) return false;
  const shared = String(process.env.INTEGRATION_API_KEY || "");
  if (shared.length >= 32) return true;
  try {
    const keys = JSON.parse(process.env.INTEGRATION_KEYS_JSON || "{}");
    return keys && typeof keys === "object" && !Array.isArray(keys) &&
      products.every((product) => typeof keys[product] === "string" && keys[product].length >= 32);
  } catch { return false; }
}

function databaseDiagnostic(error) {
  const code = error?.code || error?.cause?.code || "UNKNOWN";
  const message = String(error?.message || error || "Unknown database error")
    .replace(/postgres(?:ql)?:\/\/[^\s]+/gi, "postgres://[redacted]")
    .slice(0, 300);
  return { code, message };
}

export async function GET() {
  try {
    await db.prepare("SELECT 1").get();
    const production = process.env.NODE_ENV === "production";
    const checks = {
      database: db.isPostgres || !production,
      appUrl:
        Boolean(process.env.APP_URL?.startsWith("https://")) || !production,
      integrationKey:
        validIntegrationConfig() || !production,
      adminCredentials:
        Boolean(process.env.SUPERADMIN_EMAIL && process.env.SUPERADMIN_PASSWORD) || !production,
      payoutEncryption:
        validEncryptionKey(process.env.PAYOUT_ENCRYPTION_KEY) || !production,
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
  } catch (error) {
    console.error("Production database health check failed", databaseDiagnostic(error));
    return NextResponse.json(
      { ok: false, checks: { database: false } },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
