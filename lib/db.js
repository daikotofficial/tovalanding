import Database from "better-sqlite3";
import { randomInt, createHash } from "node:crypto";
import path from "node:path";
import fs from "node:fs";

const filename = path.resolve(
  /* turbopackIgnore: true */
  process.env.DATABASE_PATH || "data/tova.local.db",
);
fs.mkdirSync(path.dirname(filename), { recursive: true });
const db = new Database(filename);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.pragma("busy_timeout = 5000");
db.exec(`
CREATE TABLE IF NOT EXISTS affiliates (
 id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
 email TEXT NOT NULL UNIQUE, phone TEXT, location TEXT, channel TEXT,
 code TEXT NOT NULL UNIQUE, verification_code TEXT NOT NULL DEFAULT '',
 verified INTEGER DEFAULT 0, status TEXT DEFAULT 'pending',
 created_at TEXT NOT NULL, earnings INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS auth_challenges (
 email TEXT PRIMARY KEY, code_hash TEXT NOT NULL, expires INTEGER NOT NULL,
 attempts INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS sessions (
 token_hash TEXT PRIMARY KEY, affiliate_id INTEGER NOT NULL REFERENCES affiliates(id),
 expires INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS superadmin_sessions (
 token_hash TEXT PRIMARY KEY, email TEXT NOT NULL DEFAULT '', role TEXT NOT NULL DEFAULT 'superadmin', expires INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS admin_users (
 id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE,
 password_hash TEXT NOT NULL, password_salt TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS audit_logs (
 id INTEGER PRIMARY KEY AUTOINCREMENT, actor_email TEXT NOT NULL,
 action TEXT NOT NULL, target_type TEXT NOT NULL, target_id TEXT NOT NULL,
 metadata TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS rate_limits (
 key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS referrals (
 id INTEGER PRIMARY KEY AUTOINCREMENT, affiliate_id INTEGER NOT NULL REFERENCES affiliates(id),
 product TEXT NOT NULL, external_id TEXT NOT NULL, referred_email TEXT, source TEXT NOT NULL DEFAULT 'link',
 status TEXT NOT NULL DEFAULT 'registered', signed_up_at TEXT, converted_at TEXT,
 created_at TEXT NOT NULL, UNIQUE(product,external_id)
);
CREATE TABLE IF NOT EXISTS commissions (
 id INTEGER PRIMARY KEY AUTOINCREMENT, affiliate_id INTEGER NOT NULL REFERENCES affiliates(id),
 referral_id INTEGER NOT NULL REFERENCES referrals(id), amount INTEGER NOT NULL CHECK(amount > 0),
 rate INTEGER NOT NULL DEFAULT 10, currency TEXT NOT NULL DEFAULT 'NGN',
 status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL, UNIQUE(referral_id)
);
CREATE TABLE IF NOT EXISTS payouts (
 id INTEGER PRIMARY KEY AUTOINCREMENT, affiliate_id INTEGER NOT NULL REFERENCES affiliates(id),
 amount INTEGER NOT NULL CHECK(amount > 0), status TEXT NOT NULL DEFAULT 'requested',
 created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS payout_commissions (
 payout_id INTEGER NOT NULL REFERENCES payouts(id), commission_id INTEGER NOT NULL REFERENCES commissions(id),
 PRIMARY KEY(payout_id, commission_id), UNIQUE(commission_id)
);`);
// Keep local development databases created by earlier versions usable.
for (const statement of [
  "ALTER TABLE superadmin_sessions ADD COLUMN email TEXT NOT NULL DEFAULT ''",
  "ALTER TABLE superadmin_sessions ADD COLUMN role TEXT NOT NULL DEFAULT 'superadmin'",
  "ALTER TABLE affiliates ADD COLUMN password_hash TEXT",
  "ALTER TABLE affiliates ADD COLUMN password_salt TEXT",
  "ALTER TABLE affiliates ADD COLUMN failed_login_attempts INTEGER NOT NULL DEFAULT 0",
  "ALTER TABLE affiliates ADD COLUMN locked_until INTEGER NOT NULL DEFAULT 0",
  "ALTER TABLE affiliates ADD COLUMN password_updated_at TEXT",
  "ALTER TABLE affiliates ADD COLUMN location TEXT",
  "ALTER TABLE affiliates ADD COLUMN payout_method TEXT NOT NULL DEFAULT 'bank_transfer'",
  "ALTER TABLE affiliates ADD COLUMN payout_account_name TEXT NOT NULL DEFAULT ''",
  "ALTER TABLE affiliates ADD COLUMN payout_account_number TEXT NOT NULL DEFAULT ''",
  "ALTER TABLE affiliates ADD COLUMN payout_bank_name TEXT NOT NULL DEFAULT ''",
  "ALTER TABLE referrals ADD COLUMN referred_email TEXT",
  "ALTER TABLE referrals ADD COLUMN source TEXT NOT NULL DEFAULT 'link'",
  "ALTER TABLE referrals ADD COLUMN signed_up_at TEXT",
  "ALTER TABLE referrals ADD COLUMN converted_at TEXT",
  "ALTER TABLE commissions ADD COLUMN rate INTEGER NOT NULL DEFAULT 10",
  "ALTER TABLE commissions ADD COLUMN currency TEXT NOT NULL DEFAULT 'NGN'",
]) {
  try {
    db.exec(statement);
  } catch (error) {
    if (!String(error.message).includes("duplicate column name")) throw error;
  }
}
try {
  db.exec(
    "CREATE UNIQUE INDEX IF NOT EXISTS commissions_referral_unique ON commissions(referral_id)",
  );
} catch (error) {
  // Existing duplicate test data should not prevent the app from booting.
  if (!String(error.message).includes("UNIQUE constraint failed")) throw error;
}
export const hash = (value) => createHash("sha256").update(value).digest("hex");
export const makeCode = () => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return (
    "TOVA" +
    Array.from({ length: 6 }, () => alphabet[randomInt(alphabet.length)]).join(
      "",
    )
  );
};
export default db;
