import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // ensure Node.js runtime for Stripe SDK

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

export async function POST(request) {
  if (!stripe || !webhookSecret) {
    console.error("Stripe or webhook secret not configured");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const sig = request.headers.get("stripe-signature");

  let event;

  try {
    // Stripe needs the raw body, not parsed JSON
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle successful Checkout completion
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const matterId =
      session.metadata?.matterId ||
      null;

    if (!supabase) {
      console.error("Supabase not configured for webhook");
      return NextResponse.json({ received: true });
    }

    if (matterId) {
      const { error } = await supabase
        .from("matters")
        .update({
          paid: true,
          stripe_session_id: session.id
        })
        .eq("id", matterId);

      if (error) {
        console.error("Failed to update matter as paid:", error);
      } else {
        console.log(`Matter ${matterId} marked as paid.`);
      }
    } else {
      console.warn(
        "checkout.session.completed without matterId metadata; nothing to update."
      );
    }
  }

  // You can handle other event types here if needed

  return NextResponse.json({ received: true }, { status: 200 });
}
