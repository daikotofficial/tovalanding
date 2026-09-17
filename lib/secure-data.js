import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

function key() {
  const configured = String(process.env.PAYOUT_ENCRYPTION_KEY || "");
  if (configured) {
    const value = Buffer.from(configured, /^[a-f0-9]{64}$/i.test(configured) ? "hex" : "base64");
    if (value.length === 32) return value;
  }
  if (process.env.NODE_ENV === "production") throw new Error("PAYOUT_ENCRYPTION_KEY is required in production.");
  return createHash("sha256").update("local-development-payout-key").digest();
}

export function encryptPayoutValue(value) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(String(value), "utf8"), cipher.final()]);
  return `enc:v1:${iv.toString("base64url")}:${cipher.getAuthTag().toString("base64url")}:${encrypted.toString("base64url")}`;
}

export function decryptPayoutValue(value) {
  if (!value) return "";
  if (!String(value).startsWith("enc:v1:")) return String(value);
  const [, , ivText, tagText, dataText] = String(value).split(":");
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(ivText, "base64url"));
  decipher.setAuthTag(Buffer.from(tagText, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(dataText, "base64url")), decipher.final()]).toString("utf8");
}
