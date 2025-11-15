import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

// GET /api/pdf/inspect?path=/templates/hillsborough/name-change-adult/12-982a-petition.pdf
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");
    if (!path) {
      return NextResponse.json(
        { error: "Missing ?path=/templates/.../file.pdf" },
        { status: 400 }
      );
    }

    const res = await fetch(path);
    if (!res.ok) throw new Error(`Could not load ${path}`);
    const ab = await res.arrayBuffer();

    const pdf = await PDFDocument.load(ab);
    const form = pdf.getForm?.();
    if (!form) {
      return NextResponse.json({
        path,
        fields: [],
        note: "No AcroForm found (non-fillable). Use overlay mode."
      });
    }

    // Collect names & types
    const fields = form.getFields().map((f) => {
      const type = f.constructor?.name || "Unknown";
      return { name: f.getName(), type };
    });

    return NextResponse.json({ path, fields });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Inspect failed" }, { status: 500 });
  }
}
