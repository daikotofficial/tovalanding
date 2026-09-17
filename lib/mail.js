import fs from "node:fs/promises";
import path from "node:path";

export async function sendMail(message) {
  const transport = process.env.MAIL_TRANSPORT || "mailgun";
  if (transport === "local") {
    if (process.env.NODE_ENV === "production")
      throw new Error("Local mail is disabled in production.");
    const file = path.resolve("data/mailbox.ndjson");
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.appendFile(
      file,
      JSON.stringify({ ...message, createdAt: new Date().toISOString() }) +
        "\n",
      { mode: 0o600 },
    );
    return;
  }
  const {
    MAILGUN_API_KEY: key,
    MAILGUN_DOMAIN: domain,
    MAILGUN_FROM: from,
  } = process.env;
  if (!key || !domain || !from) throw new Error("Mailgun is not configured.");
  const base = process.env.MAILGUN_API_URL || "https://api.mailgun.net";
  if (!["https://api.mailgun.net", "https://api.eu.mailgun.net"].includes(base))
    throw new Error("Invalid Mailgun region.");
  const response = await fetch(
    base + "/v3/" + encodeURIComponent(domain) + "/messages",
    {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from("api:" + key).toString("base64"),
      },
      body: new URLSearchParams({ from, ...message }),
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!response.ok) throw new Error("Mail delivery failed.");
}
