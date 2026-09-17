import { randomBytes, randomInt, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import db, { hash } from "./db";
import { sendMail } from "./mail";

export function passwordError(password) {
  if (typeof password !== "string" || password.length < 12 || password.length > 128)
    return "Use a password between 12 and 128 characters.";
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password))
    return "Use at least one uppercase letter, one lowercase letter, and one number.";
  return "";
}
export function createPassword(password) {
  const salt = randomBytes(16);
  const derived = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return { salt: salt.toString("hex"), hash: derived.toString("hex") };
}
export function verifyPassword(password, storedHash, storedSalt) {
  if (!storedHash || !storedSalt || typeof password !== "string") return false;
  const expected = Buffer.from(storedHash, "hex");
  const actual = scryptSync(password, Buffer.from(storedSalt, "hex"), 64, { N: 16384, r: 8, p: 1 });
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function failure(message, status = 400) {
  return NextResponse.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
export function checkOrigin(req) {
  const origin = req.headers.get("origin");
  const expected = new URL(process.env.APP_URL || "http://localhost:4173")
    .origin;
  if (!origin || origin !== expected) throw new Error("ORIGIN");
}
export async function input(req) {
  checkOrigin(req);
  if (!req.headers.get("content-type")?.includes("application/json"))
    throw new Error("INPUT");
  const text = await req.text();
  if (text.length > 8192) throw new Error("INPUT");
  return JSON.parse(text);
}
export function emailAddress(value) {
  if (typeof value !== "string") throw new Error("INPUT");
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("INPUT");
  return email;
}
export function limit(key, maximum = 5, duration = 600000) {
  const now = Date.now();
  return db.transaction(() => {
    db.prepare("DELETE FROM rate_limits WHERE expires < ?").run(now);
    const row = db.prepare("SELECT * FROM rate_limits WHERE key=?").get(key);
    if (row && row.count >= maximum) return false;
    db.prepare(
      "INSERT INTO rate_limits(key,count,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1",
    ).run(key, now + duration);
    return true;
  })();
}
export async function challenge(email) {
  const code = String(randomInt(100000, 1000000));
  const digest = hash(email + ":" + code);
  db.prepare(
    "INSERT INTO auth_challenges(email,code_hash,expires,attempts) VALUES(?,?,?,0) ON CONFLICT(email) DO UPDATE SET code_hash=excluded.code_hash,expires=excluded.expires,attempts=0",
  ).run(email, digest, Date.now() + 600000);
  try {
    await sendMail({
      to: email,
      subject: "Your TovaERP verification code",
      text:
        "Your code is " +
        code +
        ". It expires in 10 minutes and can be used once. If you did not request it, ignore this email.",
    });
  } catch (error) {
    db.prepare("DELETE FROM auth_challenges WHERE email=? AND code_hash=?").run(
      email,
      digest,
    );
    throw error;
  }
}
export function consume(email, code) {
  if (!/^\d{6}$/.test(code)) return false;
  return db.transaction(() => {
    const row = db
      .prepare("SELECT * FROM auth_challenges WHERE email=?")
      .get(email);
    if (!row || row.expires < Date.now() || row.attempts >= 5) return false;
    db.prepare(
      "UPDATE auth_challenges SET attempts=attempts+1 WHERE email=?",
    ).run(email);
    if (
      !timingSafeEqual(
        Buffer.from(row.code_hash),
        Buffer.from(hash(email + ":" + code)),
      )
    )
      return false;
    db.prepare("DELETE FROM auth_challenges WHERE email=?").run(email);
    return true;
  })();
}
export async function currentUser() {
  const token = (await cookies()).get("tova_session")?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  return (
    db
      .prepare(
        "SELECT a.id,a.name,a.email,a.code,a.status,a.created_at FROM sessions s JOIN affiliates a ON a.id=s.affiliate_id WHERE s.token_hash=? AND s.expires>? AND a.verified=1 AND a.status IN ('pending','active')",
      )
      .get(hash(token), Date.now()) || null
  );
}
export function isAdmin(user) {
  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
  return !!user && allowed.includes(user.email);
}
export function createSession(response, id) {
  const token = randomBytes(32).toString("hex");
  db.prepare("DELETE FROM sessions WHERE expires < ?").run(Date.now());
  db.prepare("INSERT INTO sessions VALUES(?,?,?)").run(
    hash(token),
    id,
    Date.now() + 7 * 86400000,
  );
  response.cookies.set("tova_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure:
      new URL(process.env.APP_URL || "http://localhost:4173").protocol ===
      "https:",
    maxAge: 7 * 86400,
    path: "/",
  });
  response.cookies.delete("tova_affiliate");
}
