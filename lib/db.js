import Database from "better-sqlite3";
import pg from "pg";
import { randomInt, createHash } from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import { AsyncLocalStorage } from "node:async_hooks";

const usePostgres = Boolean(process.env.DATABASE_URL);
const { Pool, types } = pg;
types.setTypeParser(20, (value) => Number(value));
const transactionStore = new AsyncLocalStorage();
let pool;
let postgresReady;
let sqlite;
const postgresPlaceholders = (sql) => { let i = 0; return sql.replace(/\?/g, () => `$${++i}`); };
const schema = `
CREATE TABLE IF NOT EXISTS affiliates (id BIGSERIAL PRIMARY KEY,name TEXT NOT NULL,email TEXT NOT NULL UNIQUE,phone TEXT,location TEXT,channel TEXT,code TEXT NOT NULL UNIQUE,verification_code TEXT NOT NULL DEFAULT '',verified INTEGER NOT NULL DEFAULT 0,status TEXT NOT NULL DEFAULT 'pending',created_at TIMESTAMPTZ NOT NULL,earnings BIGINT NOT NULL DEFAULT 0,password_hash TEXT,password_salt TEXT,failed_login_attempts INTEGER NOT NULL DEFAULT 0,locked_until BIGINT NOT NULL DEFAULT 0,password_updated_at TIMESTAMPTZ,payout_method TEXT NOT NULL DEFAULT 'bank_transfer',payout_account_name TEXT NOT NULL DEFAULT '',payout_account_number TEXT NOT NULL DEFAULT '',payout_bank_name TEXT NOT NULL DEFAULT '');
CREATE TABLE IF NOT EXISTS auth_challenges (email TEXT PRIMARY KEY,code_hash TEXT NOT NULL,expires BIGINT NOT NULL,attempts INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY,affiliate_id BIGINT NOT NULL REFERENCES affiliates(id),expires BIGINT NOT NULL);
CREATE TABLE IF NOT EXISTS superadmin_sessions (token_hash TEXT PRIMARY KEY,email TEXT NOT NULL DEFAULT '',role TEXT NOT NULL DEFAULT 'superadmin',expires BIGINT NOT NULL);
CREATE TABLE IF NOT EXISTS admin_users (id BIGSERIAL PRIMARY KEY,email TEXT NOT NULL UNIQUE,password_hash TEXT NOT NULL,password_salt TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'active',created_at TIMESTAMPTZ NOT NULL);
CREATE TABLE IF NOT EXISTS audit_logs (id BIGSERIAL PRIMARY KEY,actor_email TEXT NOT NULL,action TEXT NOT NULL,target_type TEXT NOT NULL,target_id TEXT NOT NULL,metadata JSONB NOT NULL DEFAULT '{}'::jsonb,created_at TIMESTAMPTZ NOT NULL);
CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires BIGINT NOT NULL);
CREATE TABLE IF NOT EXISTS referrals (id BIGSERIAL PRIMARY KEY,affiliate_id BIGINT NOT NULL REFERENCES affiliates(id),product TEXT NOT NULL,external_id TEXT NOT NULL,referred_email TEXT,source TEXT NOT NULL DEFAULT 'link',status TEXT NOT NULL DEFAULT 'registered',signed_up_at TIMESTAMPTZ,converted_at TIMESTAMPTZ,created_at TIMESTAMPTZ NOT NULL,UNIQUE(product,external_id));
CREATE TABLE IF NOT EXISTS commissions (id BIGSERIAL PRIMARY KEY,affiliate_id BIGINT NOT NULL REFERENCES affiliates(id),referral_id BIGINT NOT NULL REFERENCES referrals(id),amount BIGINT NOT NULL CHECK(amount > 0),rate INTEGER NOT NULL DEFAULT 10,currency TEXT NOT NULL DEFAULT 'NGN',status TEXT NOT NULL DEFAULT 'pending',created_at TIMESTAMPTZ NOT NULL,UNIQUE(referral_id));
CREATE TABLE IF NOT EXISTS payouts (id BIGSERIAL PRIMARY KEY,affiliate_id BIGINT NOT NULL REFERENCES affiliates(id),amount BIGINT NOT NULL CHECK(amount > 0),status TEXT NOT NULL DEFAULT 'requested',created_at TIMESTAMPTZ NOT NULL);
CREATE TABLE IF NOT EXISTS payout_commissions (payout_id BIGINT NOT NULL REFERENCES payouts(id),commission_id BIGINT NOT NULL REFERENCES commissions(id),PRIMARY KEY(payout_id,commission_id),UNIQUE(commission_id));`;
function getSqlite() { if (process.env.NODE_ENV === "production") throw new Error("DATABASE_URL is required in production."); if (!sqlite) { const filename = path.resolve(/* turbopackIgnore: true */ process.env.DATABASE_PATH || "data/tova.local.db"); fs.mkdirSync(path.dirname(filename), { recursive: true }); sqlite = new Database(filename); sqlite.pragma("journal_mode = WAL"); sqlite.pragma("foreign_keys = ON"); sqlite.pragma("busy_timeout = 5000"); sqlite.exec(schema.replaceAll("BIGSERIAL", "INTEGER").replaceAll("TIMESTAMPTZ", "TEXT").replaceAll("JSONB", "TEXT").replaceAll("::jsonb", "")); } return sqlite; }
async function getPool() { if (!pool) { pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 10, idleTimeoutMillis: 30000, connectionTimeoutMillis: 10000, statement_timeout: 15000, query_timeout: 20000, ssl: process.env.DATABASE_SSL === "disable" ? false : { rejectUnauthorized: true } }); pool.on("error", (error) => console.error("PostgreSQL pool error", error)); } if (!postgresReady) postgresReady = pool.query(schema); await postgresReady; return pool; }
async function execute(sql, args = []) { const context = transactionStore.getStore(); if (usePostgres) return (context?.client || await getPool()).query(postgresPlaceholders(sql), args); const statement = getSqlite().prepare(sql); if (/^\s*(SELECT|WITH|PRAGMA)/i.test(sql) || /\bRETURNING\b/i.test(sql)) return { rows: statement.all(...args), rowCount: 0 }; const result = statement.run(...args); return { rows: [], rowCount: result.changes, lastInsertRowid: result.lastInsertRowid }; }
function prepare(sql) { return { async get(...args) { return (await execute(sql, args)).rows[0] || undefined; }, async all(...args) { return (await execute(sql, args)).rows; }, async run(...args) { const result = await execute(sql, args); return { changes: result.rowCount || 0 }; } }; }
const db = { prepare, async transaction(callback) { if (usePostgres) { const client = await (await getPool()).connect(); try { await client.query("BEGIN"); const result = await transactionStore.run({ client }, callback); await client.query("COMMIT"); return result; } catch (error) { await client.query("ROLLBACK").catch(() => {}); throw error; } finally { client.release(); } } const local = getSqlite(); local.exec("BEGIN IMMEDIATE"); try { const result = await callback(); local.exec("COMMIT"); return result; } catch (error) { local.exec("ROLLBACK"); throw error; } }, isPostgres: usePostgres };
export const hash = (value) => createHash("sha256").update(value).digest("hex");
export const makeCode = () => { const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; return "TOVA" + Array.from({ length: 6 }, () => alphabet[randomInt(alphabet.length)]).join(""); };
export default db;
