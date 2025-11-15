// app/api/pdf/inspect/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { promises as fs } from "node:fs";
import path from "node:path";

// GET /api/pdf/inspect?path=templates/hillsborough/name-change-adult/12-982a-petition.pdf
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    let rel = searchParams.get("path");
    if (!rel) {
      return NextResponse.json(
        { error: "Missing ?path=templates/.../file.pdf" },
        { status: 400 }
      );
    }

    // normalize & restrict to /templates
    rel = rel.replace(/^\/+/, "");
    const allowedRoot = path.join(process.cwd(), "templates");
    const abs = path.join(process.cwd(), rel);
    if (!abs.startsWith(allowedRoot)) {
      return NextResponse.json({ error: "Path not allowed" }, { status: 400 });
    }

    const buf = await fs.readFile(abs);
    const pdf = await PDFDocument.load(buf);
    const form = pdf.getForm?.();

    if (!form) {
      return NextResponse.json({
        path: rel,
        fields: [],
        note: "No AcroForm found (non-fillable). Use overlay mode."
      });
    }

    const fields = form.getFields().map((f) => ({
      name: f.getName(),
      type: f.constructor?.name || "Unknown"
    }));

    return NextResponse.json({ path: rel, fields });
  } catch (e) {
    return NextResponse.json({ error: "Inspect failed" }, { status: 500 });
  }
}