import { affiliateProducts } from "./products";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const appUrl = () => String(process.env.APP_URL || "https://tova.com.ng").replace(/\/$/, "");

function shell({ preheader, eyebrow, title, children }) {
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHtml(title)}</title></head><body style="margin:0;background:#f3f7f5;color:#10201c;font-family:Arial,Helvetica,sans-serif"><div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f7f5;padding:32px 12px"><tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border:1px solid #dce9e3;border-radius:18px;overflow:hidden"><tr><td style="background:#071412;padding:24px 32px"><div style="font-size:20px;font-weight:800;letter-spacing:-.5px;color:#fff">Tova<span style="color:#19b8a6">ERP</span></div><div style="margin-top:6px;color:#a9beb7;font-size:12px">Business software, connected.</div></td></tr><tr><td style="padding:34px 32px 30px"><div style="font-size:11px;font-weight:800;letter-spacing:1.4px;color:#128174">${escapeHtml(eyebrow)}</div><h1 style="margin:10px 0 14px;font-size:28px;line-height:1.15;color:#071412">${escapeHtml(title)}</h1>${children}</td></tr><tr><td style="padding:18px 32px;background:#f7faf8;color:#6a7b75;font-size:12px;line-height:1.6">This message was sent by TovaERP. If you did not request it, you can safely ignore it.<br><a href="${appUrl()}" style="color:#128174">${escapeHtml(appUrl())}</a></td></tr></table><div style="max-width:600px;padding:18px 12px;color:#80918b;font-size:11px;text-align:center">© ${new Date().getFullYear()} TovaERP</div></td></tr></table></body></html>`;
}

export function verificationEmail(code, purpose = "verification") {
  const reset = purpose === "password-reset";
  return shell({
    preheader: `${reset ? "Password reset" : "Email verification"} code: ${code}`,
    eyebrow: reset ? "PASSWORD RESET" : "EMAIL VERIFICATION",
    title: reset ? "Reset your affiliate password" : "Verify your affiliate account",
    children: `<p style="margin:0;color:#52645d;font-size:15px;line-height:1.7">${reset ? "Use the secure code below to create a new password for your Tova affiliate account." : "Use the secure code below to verify your email address and continue with your Tova affiliate account."}</p><div style="margin:26px 0;padding:20px;text-align:center;background:#eaf7f2;border:1px solid #c9eadc;border-radius:12px"><div style="font-size:11px;font-weight:800;letter-spacing:1.5px;color:#128174">YOUR ONE-TIME CODE</div><div style="margin-top:8px;font-size:36px;line-height:1;font-weight:800;letter-spacing:8px;color:#071412">${escapeHtml(code)}</div><div style="margin-top:12px;font-size:12px;color:#59736a">Expires in 10 minutes · usable once</div></div><p style="margin:0;color:#52645d;font-size:13px;line-height:1.7">Never share this code with anyone. Tova support will never ask for it.</p>`,
  });
}

export function welcomeAffiliateEmail(name) {
  return shell({
    preheader: "Your Tova affiliate email is verified.",
    eyebrow: "ACCOUNT VERIFIED",
    title: "Your affiliate account is verified",
    children: `<p style="margin:0;color:#52645d;font-size:15px;line-height:1.7">Hello ${escapeHtml(name)}, your email is verified. Your affiliate application is now under review.</p><div style="margin:24px 0;padding:18px 20px;background:#f3f8f5;border-left:4px solid #19b8a6;border-radius:8px;color:#52645d;font-size:14px;line-height:1.7">Referral access, links, and dashboard tools will be available after your application is approved.</div><a href="${appUrl()}/affiliate/login" style="display:inline-block;padding:13px 20px;border-radius:8px;background:#079f78;color:#fff;text-decoration:none;font-weight:700">Open affiliate login</a>`,
  });
}

export function approvalAffiliateEmail({ name, code }) {
  const productLinks = affiliateProducts
    .map(
      (product) =>
        `<a href="${appUrl()}/r/${encodeURIComponent(code)}?product=${product.key}" style="display:block;margin:8px 0;color:#087b5c;word-break:break-all">${escapeHtml(product.name)} signup link</a>`,
    )
    .join("");
  return shell({
    preheader: "Your Tova affiliate application has been approved.",
    eyebrow: "APPLICATION APPROVED",
    title: "Welcome to the Tova affiliate program",
    children: `<p style="margin:0;color:#52645d;font-size:15px;line-height:1.7">Hello ${escapeHtml(name)}, your affiliate application has been approved.</p><div style="margin:24px 0;padding:20px;background:#eaf7f2;border:1px solid #c9eadc;border-radius:12px"><div style="font-size:11px;font-weight:800;letter-spacing:1.4px;color:#128174">YOUR PRODUCT SIGNUP LINKS</div><div style="margin-top:8px;font-size:13px;color:#52645d;word-break:break-all">${productLinks}</div><div style="margin-top:14px;font-size:13px;color:#52645d">Referral code: <strong>${escapeHtml(code)}</strong></div></div><a href="${appUrl()}/affiliate/login" style="display:inline-block;padding:13px 20px;border-radius:8px;background:#079f78;color:#fff;text-decoration:none;font-weight:700">Open affiliate dashboard</a>`,
  });
}
