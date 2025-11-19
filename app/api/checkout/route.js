// app/api/checkout/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 🔴 TODO: put your real Stripe Price ID here for the DIY Adult Name Change
// You can find this in Stripe Dashboard → Products → click your product → Prices → "price_xxx"
const PRICE_NAME_CHANGE_DIY =
  process.env.STRIPE_PRICE_NAME_CHANGE_DIY || "price_xxxxxxxxxxxxx";

export async function POST(req) {
  try {
    const body = await req.json();
    const { productKey, matterId, pricingTier } = body || {};

    if (!matterId) {
      return NextResponse.json(
        { error: "Missing matterId" },
        { status: 400 }
      );
    }

    if (!productKey) {
      return NextResponse.json(
        { error: "Missing productKey" },
        { status: 400 }
      );
    }

    // Decide which Stripe price to use, based on product + tier
    let priceId;

    if (
      productKey === "name-change-hillsborough" &&
      (pricingTier === "diy" || !pricingTier)
    ) {
      priceId = PRICE_NAME_CHANGE_DIY;
    } else {
      return NextResponse.json(
        { error: "Unsupported product or pricing tier" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://docudocket.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/hillsborough/name-change/adult`,

      // 🔹 THIS is the important part: we carry matterId into Stripe metadata
      metadata: {
        matterId,
        productKey,
        pricingTier: pricingTier || "diy"
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("CHECKOUT_ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}