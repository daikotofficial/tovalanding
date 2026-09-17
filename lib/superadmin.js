import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import db, { hash } from "./db";
import { passwordError } from "./auth";

function configured() {
  return Boolean(process.env.SUPERADMIN_EMAIL && process.env.SUPERADMIN_PASSWORD);
}

function sameSecret(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function validCredentials(email, password) {
  if (configured() &&
    String(email).trim().toLowerCase() === process.env.SUPERADMIN_EMAIL.trim().toLowerCase() &&
    sameSecret(password, process.env.SUPERADMIN_PASSWORD)) return { email: process.env.SUPERADMIN_EMAIL.trim().toLowerCase(), role: "superadmin" };
  const admin = await db.prepare("SELECT * FROM admin_users WHERE email=? AND status='active'").get(String(email).trim().toLowerCase());
  if (!admin) return null;
  try {
    const actual = scryptSync(String(password), Buffer.from(admin.password_salt, "hex"), 64, { N: 16384, r: 8, p: 1 });
    const expected = Buffer.from(admin.password_hash, "hex");
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  } catch {
    return null;
  }
  return { email: admin.email, role: "admin" };
}

export async function currentSuperadmin() {
  const token = (await cookies()).get("tova_superadmin")?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return false;
  return await db.prepare("SELECT s.email,s.role FROM superadmin_sessions s LEFT JOIN admin_users a ON a.email=s.email WHERE s.token_hash=? AND s.expires>? AND (s.role='superadmin' OR a.status='active')").get(hash(token), Date.now()) || null;
}

export async function createSuperadminSession(response, identity) {
  const token = randomBytes(32).toString("hex");
  await db.prepare("DELETE FROM superadmin_sessions WHERE expires < ?").run(Date.now());
  await db.prepare("INSERT INTO superadmin_sessions(token_hash,email,role,expires) VALUES(?,?,?,?)").run(hash(token), identity.email, identity.role, Date.now() + 8 * 3600000);
  response.cookies.set("tova_superadmin", token, { httpOnly: true, sameSite: "lax", secure: process.env.APP_URL?.startsWith("https:"), maxAge: 8 * 3600, path: "/" });
}

export async function createAdminUser(email, password) {
  const error = passwordError(password);
  if (error) throw new Error(error);
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return await db.prepare("INSERT INTO admin_users(email,password_hash,password_salt,created_at) VALUES(?,?,?,?) RETURNING id,email,status,created_at").get(email.trim().toLowerCase(), derived.toString("hex"), salt.toString("hex"), new Date().toISOString());
}

export async function revokeAdminSessions(email) {
  return await db.prepare("DELETE FROM superadmin_sessions WHERE email=? AND role='admin'").run(email.trim().toLowerCase());
}

export async function destroySuperadminSession(response) {
  const token = (await cookies()).get("tova_superadmin")?.value;
  if (token) await db.prepare("DELETE FROM superadmin_sessions WHERE token_hash=?").run(hash(token));
  response.cookies.delete("tova_superadmin");
}
