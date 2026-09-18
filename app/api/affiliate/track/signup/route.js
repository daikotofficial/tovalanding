import { NextResponse } from "next/server";
import { emailAddress } from "../../../../../lib/auth";
import {
  integrationAllowed,
  integrationBody,
  recordSignup,
  validProduct,
  validText,
} from "../../../../../lib/integrations";

export async function POST(req) {
  try {
    const data = await integrationBody(req);
    if (
      !validProduct(data.product) ||
      !validText(data.externalId, 160) ||
      !validText(data.referralCode, 40) ||
      (data.source != null && !validText(data.source, 40)) ||
      (data.referredName != null && !validText(data.referredName, 120))
    )
      return NextResponse.json(
        { error: "product, externalId and referralCode are required." },
        { status: 400 },
      );
    if (data.email != null) emailAddress(data.email);
    if (!integrationAllowed(req, data.product.trim()))
      return NextResponse.json(
        { error: "Integration not authorized." },
        { status: 401 },
      );
    return NextResponse.json(
      await recordSignup({ ...data, source: data.source ?? "link" }),
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to record signup." },
      { status: 400 },
    );
  }
}
