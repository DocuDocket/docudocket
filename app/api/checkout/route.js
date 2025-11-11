import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRODUCTS = {
  "name-change-hillsborough": {
    name: "Adult Name Change Packet – Hillsborough County",
    amount: 7900 // $79.00 in cents
  },
  "simplified-dissolution-hillsborough": {
    name: "Simplified Dissolution Packet – Hillsborough County",
    amount: 9900 // $99.00 in cents
  }
};

export async function POST(request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return new Response(
        JSON.stringify({
          error:
            "Stripe is not configured. Set STRIPE_SECRET_KEY in your environment."
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const body = await request.json();
    const { productKey, successUrl, cancelUrl } = body;

    const product = PRODUCTS[productKey];

    if (!product) {
      return new Response(
        JSON.stringify({ error: "Invalid product key" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name
            },
            unit_amount: product.amount
          },
          quantity: 1
        }
      ],
      success_url:
        successUrl ||
        "https://docudocket.com/checkout/success?product=" + productKey,
      cancel_url:
        cancelUrl ||
        "https://docudocket.com/checkout/cancel"
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to create Stripe Checkout session" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
