import { NextResponse } from "next/server";
import db from "../../../lib/db";
export async function GET(req, { params }) {
  const { code } = await params;
  const exists = await db
    .prepare(
      "SELECT id FROM affiliates WHERE code=? AND verified=1 AND status='active'",
    )
    .get(code);
  if (!exists)
    return new NextResponse("Referral code not found.", { status: 404 });
  const response = NextResponse.redirect(new URL("/#products", process.env.APP_URL));
  response.cookies.set("tova_referral", code, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.APP_URL?.startsWith("https:"),
    maxAge: 30 * 86400,
    path: "/",
  });
  return response;
}
