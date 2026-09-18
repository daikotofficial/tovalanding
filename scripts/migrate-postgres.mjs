import fs from "node:fs/promises";
import pg from "pg";

const { Pool } = pg;
const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required.");

const pool = new Pool({
  connectionString: url,
  max: Number(process.env.DATABASE_POOL_MAX || 10),
  ssl:
    process.env.DATABASE_SSL === "disable"
      ? false
      : { rejectUnauthorized: true },
});

try {
  const schema = await fs.readFile(
    new URL("../db/schema.sql", import.meta.url),
    "utf8",
  );
  await pool.query("BEGIN");
  await pool.query(schema);
  await pool.query(
    "ALTER TABLE referrals ADD COLUMN IF NOT EXISTS referred_name TEXT",
  );
  await pool.query(
    "ALTER TABLE referrals ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ",
  );
  await pool.query(
    "ALTER TABLE commissions DROP CONSTRAINT IF EXISTS commissions_referral_id_key",
  );
  await pool.query(
    "ALTER TABLE commissions ADD COLUMN IF NOT EXISTS payment_reference TEXT NOT NULL DEFAULT ''",
  );
  await pool.query(
    "CREATE UNIQUE INDEX IF NOT EXISTS commissions_referral_payment_unique ON commissions(referral_id,payment_reference)",
  );
  await pool.query(
    "UPDATE commissions c SET amount=ROUND(c.amount * 200.0 / 107.5), rate=20 WHERE c.rate=10 AND NOT EXISTS (SELECT 1 FROM payout_commissions pc WHERE pc.commission_id=c.id)",
  );
  await pool.query("COMMIT");
  console.log("PostgreSQL schema is ready.");
} catch (error) {
  await pool.query("ROLLBACK").catch(() => {});
  console.error("PostgreSQL migration failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
