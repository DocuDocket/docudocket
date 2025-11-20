// app/api/checkout/session/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id");

    if (!session_id) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    return NextResponse.json({
      id: session.id,
      payment_status: session.payment_status, // "paid" in live, "unpaid" if not complete
      metadata: session.metadata || {},
      customer_email: session.customer_details?.email || session.customer_email || null
    });
  } catch (err) {
    console.error("SESSION_LOOKUP_ERROR:", err);
    return NextResponse.json(
      { error: "Failed to retrieve Stripe session" },
      { status: 500 }
    );
  }
}
