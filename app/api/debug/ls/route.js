export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    let dir = (searchParams.get("dir") || "templates").replace(/^\/+/, "");
    const allowedRoot = path.join(process.cwd(), "templates");
    const abs = path.join(process.cwd(), dir);
    if (!abs.startsWith(allowedRoot)) {
      return NextResponse.json({ error: "Path not allowed" }, { status: 400 });
    }
    const entries = await fs.readdir(abs, { withFileTypes: true });
    return NextResponse.json({
      dir,
      items: entries.map(e => ({ name: e.name, type: e.isDirectory() ? "dir" : "file" }))
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}