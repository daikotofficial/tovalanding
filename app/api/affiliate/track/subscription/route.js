import { NextResponse } from "next/server";
import {
  integrationAllowed,
  integrationBody,
  recordSubscription,
  validProduct,
  validText,
} from "../../../../../lib/integrations";

export async function POST(req) {
  try {
    const data = await integrationBody(req);
    if (!validProduct(data.product) || !validText(data.externalId, 160))
      return NextResponse.json(
        { error: "product and externalId are required." },
        { status: 400 },
      );
    if (!integrationAllowed(req, data.product.trim()))
      return NextResponse.json(
        { error: "Integration not authorized." },
        { status: 401 },
      );
    return NextResponse.json(await recordSubscription(data));
  } catch (error) {
    return NextResponse.json(
      {
        error: ["INVALID_AMOUNT", "INVALID_CURRENCY"].includes(error.message)
          ? "amountMinor must be a positive NGN integer."
          : "Unable to record subscription.",
      },
      { status: 400 },
    );
  }
}
