export const runtime = "nodejs";
import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    allowTest: process.env.NEXT_PUBLIC_DOCUDOCKET_ALLOW_TEST || null
  });
}