// app/api/matters/create/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();

    const productKey = body.productKey;
    const data = body.data || {};

    if (!productKey) {
      return NextResponse.json(
        { error: "Missing productKey" },
        { status: 400 }
      );
    }

    const matterId = randomUUID();

    const { error } = await supabase
      .from("matters")
      .insert({
        id: matterId,
        product_key: productKey,
        paid: false,
        data
      });

    if (error) {
      return NextResponse.json(
        { error: `Supabase insert error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ matterId }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
