import { test, expect } from "@playwright/test";
import fs from "node:fs";
import Database from "better-sqlite3";

test("public pages, exact font, mobile layout, and legal redirects", async ({
  page,
  request,
}) => {
  for (const route of [
    "/",
    "/affiliate",
    "/affiliate/login",
    "/terms",
    "/privacy",
    "/cookies",
  ]) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("body")).toHaveCSS("font-family", /Poppins/);
    expect(
      await page.evaluate(() => document.fonts.check("400 16px Poppins")),
    ).toBe(true);
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  const response = await request.get("/privacy.html", { maxRedirects: 0 });
  expect(response.status()).toBe(307);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator(".product p").first()).toHaveCSS("font-size","14px");
  await expect(page.locator(".product-badge").first()).toHaveCSS("font-size","12px");
  await expect(page.locator(".pricing-card")).toHaveCount(3);
  await expect(page.locator(".pricing-card").nth(0).locator(".pricing-amount strong")).toHaveText("₦2,500");
  await page.getByRole("button",{name:"Yearly Save 5%"}).click();
  await expect(page.locator(".pricing-card").nth(0).locator(".pricing-amount strong")).toHaveText("₦28,500");
  await expect(page.locator(".pricing-card").nth(1).locator(".pricing-amount strong")).toHaveText("₦57,000");
  await page.getByRole("button",{name:"Monthly",exact:true}).click();
  await page.locator(".pricing-section").screenshot({path:"test-results/pricing-desktop.png"});
  await page.locator(".referral-banner").screenshot({path:"test-results/referral-desktop.png"});
  await expect(page.locator(".referral-banner h2")).toHaveText("Introduce Tova.Earn from referrals.");
  await expect(page.locator("h1")).toHaveCSS("font-size", "48px");
  await expect(page.locator(".header .logo")).toHaveText("Tova Solutions");
  await expect(page.locator(".header .logo span")).toHaveCount(0);
  await page.evaluate(()=>window.scrollTo(0,900));
  expect(await page.locator(".header").evaluate(node=>Math.round(node.getBoundingClientRect().top))).toBe(0);
  await page.evaluate(()=>window.scrollTo(0,0));
  await expect(page.locator('a.product').nth(0)).toHaveAttribute('href','https://tovafixedasset.com.ng');
  await expect(page.locator('a.product').nth(1)).toHaveAttribute('href','https://tovabooks.com.ng');
  await expect(page.locator('a.product').nth(2)).toHaveAttribute('href','https://tovapos.com.ng');
  await expect(page.locator(".hero-actions .dark")).toHaveCSS("background-color","rgb(7, 23, 47)");
  await expect(page.locator(".hero-actions .dark")).toHaveCSS("color","rgb(255, 255, 255)");
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
  await page.goto("/affiliate");
  const channel=page.getByRole("combobox",{name:"How will you refer businesses?"});
  await channel.click();
  await page.getByRole("option",{name:"Consulting or agency"}).hover();
  await expect(page.getByRole("option",{name:"Consulting or agency"})).toHaveCSS("background-color","rgb(229, 245, 237)");
  await page.getByRole("option",{name:"Consulting or agency"}).click();
  await expect(channel).toHaveText("Consulting or agency");
  await channel.focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  await expect(channel).toHaveText("Other");
  await channel.click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("listbox")).toHaveCount(0);
  await page.screenshot({
    path: "test-results/affiliate-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:"test-results/affiliate-mobile.png",fullPage:true});
  await page.goto('/');
  await page.screenshot({path:"test-results/home-mobile.png",fullPage:true});
});

test("signup, one-time codes, session isolation, admin protection, and logout", async ({
  page,
  request,
}) => {
  const email = "qa-" + Date.now() + "@example.test";
  const db = new Database("data/tova.local.db");
  const headers = { Origin: "http://localhost:4173" };
  try {
    expect((await request.get("/api/affiliate/admin")).status()).toBe(403);
    expect(
      (
        await request.get("/api/affiliate/me", {
          headers: { Cookie: "tova_affiliate=1; tova_session=1" },
        })
      ).status(),
    ).toBe(401);
    expect(
      (
        await request.post("/api/affiliate/register", {
          headers: { Origin: "https://wrong.example" },
          data: {},
        })
      ).status(),
    ).toBe(403);
    await page.goto("/affiliate");
    await page.getByLabel("Full name").fill("QA Affiliate");
    await page.getByLabel("Email address").fill(email);
    await page.locator('input[type="password"]').nth(0).fill("SecurePassword123");
    await page.locator('input[type="password"]').nth(1).fill("SecurePassword123");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: /Create secure account/ }).click();
    await expect(page.getByText("Enter your email code")).toBeVisible();
    const messages = fs
      .readFileSync("data/mailbox.ndjson", "utf8")
      .trim()
      .split("\n")
      .map(JSON.parse);
    const message = messages.filter((x) => x.to === email).at(-1);
    const code = message.text.match(/\b\d{6}\b/)[0];
    const challenge = db
      .prepare("SELECT * FROM auth_challenges WHERE email=?")
      .get(email);
    expect(challenge.code_hash).not.toBe(code);
    await page.getByLabel("Six-digit code").fill(code);
    await page.getByRole("button", { name: /Verify email and continue/ }).click();
    await expect(page).toHaveURL("/affiliate/dashboard");
    await expect(page.getByText("Your application is under review.")).toBeVisible();
    const cookies = await page.context().cookies();
    const session = cookies.find((x) => x.name === "tova_session");
    expect(session.httpOnly).toBe(true);
    expect(session.value).toMatch(/^[a-f0-9]{64}$/);
    expect(
      (
        await request.post("/api/affiliate/login", {
          headers,
          data: { email, verification: code },
        })
      ).status(),
    ).toBe(401);
    expect((await page.request.get("/api/affiliate/admin")).status()).toBe(403);
    await page.goto("/admin");
    await expect(page).toHaveURL("/admin/login");
    const affiliate = db
      .prepare("SELECT * FROM affiliates WHERE email=?")
      .get(email);
    const referral = await request.get("/r/" + affiliate.code, {
      maxRedirects: 0,
    });
    expect(referral.status()).toBe(404);
    await page.goto("/affiliate/dashboard");
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL("/affiliate/login");
    expect((await page.request.get("/api/affiliate/me")).status()).toBe(401);
    expect(
      (
        await request.get("/api/affiliate/me", {
          headers: { Cookie: "tova_session=" + session.value },
        })
      ).status(),
    ).toBe(401);
    // Expired codes cannot create a session.
    await request.post("/api/affiliate/request-code", {
      headers,
      data: { email },
    });
    db.prepare("UPDATE auth_challenges SET expires=0 WHERE email=?").run(email);
    const fresh = fs
      .readFileSync("data/mailbox.ndjson", "utf8")
      .trim()
      .split("\n")
      .map(JSON.parse)
      .filter((x) => x.to === email)
      .at(-1)
      .text.match(/\b\d{6}\b/)[0];
    expect(
      (
        await request.post("/api/affiliate/login", {
          headers,
          data: { email, verification: fresh },
        })
      ).status(),
    ).toBe(401);
  } finally {
    const row = db
      .prepare("SELECT id FROM affiliates WHERE email=?")
      .get(email);
    if (row) {
      db.prepare("DELETE FROM sessions WHERE affiliate_id=?").run(row.id);
      db.prepare("DELETE FROM affiliates WHERE id=?").run(row.id);
    }
    db.prepare("DELETE FROM auth_challenges WHERE email=?").run(email);
    db.prepare("DELETE FROM rate_limits WHERE key IN (?,?)").run(
      "email:" + email,
      "verify:" + email,
    );
    db.close();
  }
});

test("password recovery does not approve a pending affiliate", async ({ request }) => {
  const email = "qa-reset-" + Date.now() + "@example.test";
  const db = new Database("data/tova.local.db");
  const headers = { Origin: "http://localhost:4173" };
  try {
    const registration = await request.post("/api/affiliate/register", {
      headers,
      data: {
        name: "Pending Reset Test",
        email,
        password: "SecurePassword123",
        passwordConfirmation: "SecurePassword123",
        consent: true,
      },
    });
    expect(registration.status()).toBe(200);
    const row = db.prepare("SELECT id,status FROM affiliates WHERE email=?").get(email);
    expect(row.status).toBe("pending");

    await request.post("/api/affiliate/password/reset-request", {
      headers,
      data: { email },
    });
    const messages = fs
      .readFileSync("data/mailbox.ndjson", "utf8")
      .trim()
      .split("\n")
      .map(JSON.parse)
      .filter((message) => message.to === email);
    const code = messages.at(-1).text.match(/\b\d{6}\b/)[0];
    const reset = await request.post("/api/affiliate/password/reset", {
      headers,
      data: {
        email,
        verification: code,
        newPassword: "NewSecurePassword123",
        confirmPassword: "NewSecurePassword123",
      },
    });
    expect(reset.status()).toBe(200);
    expect(db.prepare("SELECT status FROM affiliates WHERE email=?").get(email).status).toBe("pending");
  } finally {
    const row = db.prepare("SELECT id FROM affiliates WHERE email=?").get(email);
    if (row) {
      db.prepare("DELETE FROM sessions WHERE affiliate_id=?").run(row.id);
      db.prepare("DELETE FROM affiliates WHERE id=?").run(row.id);
    }
    db.prepare("DELETE FROM auth_challenges WHERE email=?").run(email);
    db.prepare("DELETE FROM rate_limits WHERE key IN (?,?)").run(
      "email:" + email,
      "password-reset:" + email,
    );
    db.close();
  }
});
