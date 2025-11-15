// app/api/pdf/build/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "node:fs";
import path from "node:path";
import { PACKETS } from "@/lib/forms";

/* ---------- Supabase ---------- */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/* ---------- helpers ---------- */
const readTemplateBytes = async (relPath) => {
  // relPath like "templates/hillsborough/.../file.pdf"
  const abs = path.join(process.cwd(), relPath.replace(/^\/+/, ""));
  return await fs.readFile(abs);
};

async function fillForm(baseBytes, fieldMap, data) {
  const pdf = await PDFDocument.load(baseBytes);
  const form = pdf.getForm?.();

  if (form) {
    for (const [fieldName, mapping] of Object.entries(fieldMap || {})) {
      const value = typeof mapping === "function" ? mapping(data) : data?.[mapping];

      // Try checkbox
      try {
        const cb = form.getCheckBox(fieldName);
        if (cb) {
          if (value) cb.check();
          else cb.uncheck();
          continue;
        }
      } catch {}

      // Try text field
      try {
        const tf = form.getTextField(fieldName);
        if (tf) {
          if (value != null && value !== "") tf.setText(String(value));
          continue;
        }
      } catch {}

      // Try radio group
      try {
        const rg = form.getRadioGroup(fieldName);
        if (rg && value) {
          rg.select(String(value));
          continue;
        }
      } catch {}
    }

    try { form.flatten(); } catch {}
  }

  return await pdf.save();
}

async function addCoverPage(finalDoc, data, productTitle) {
  const cover = await PDFDocument.create();
  const page = cover.addPage([612, 792]); // Letter
  const font = await cover.embedFont(StandardFonts.HelveticaBold);
  const font2 = await cover.embedFont(StandardFonts.Helvetica);

  page.drawText("DocuDocket – Filing Packet", { x: 56, y: 730, size: 18, font });
  page.drawText(productTitle, { x: 56, y: 705, size: 14, font: font2 });

  const who =
    [data?.firstName, data?.middleName, data?.lastName].filter(Boolean).join(" ") ||
    [data?.spouseA, data?.spouseB].filter(Boolean).join(" ");
  if (who) page.drawText(`Filer: ${who}`, { x: 56, y: 675, size: 11, font: font2 });

  page.drawText("Checklist:", { x: 56, y: 640, size: 12, font });
  const bullets = [
    "Bring government ID and required filing fees.",
    "If required, fingerprints/FDLE completed.",
    "Sign notarized pages in front of a notary.",
    "Leave Case No. blank until assigned by Clerk."
  ];
  bullets.forEach((b, i) => {
    page.drawText(`• ${b}`, { x: 56, y: 620 - i * 16, size: 11, font: font2 });
  });

  const [coverPage] = await finalDoc.copyPages(cover, [0]);
  finalDoc.addPage(coverPage);
}

/* ---------- POST handler ---------- */
export async function POST(req) {
  try {
    const { productKey, data, matterId } = await req.json();
    const cfg = PACKETS[productKey];
    if (!cfg) {
      return NextResponse.json({ error: "Unknown packet" }, { status: 400 });
    }

    // --- test bypass so you can generate without payment during dev ---
    // Set NEXT_PUBLIC_DOCUDOCKET_ALLOW_TEST=1 in Vercel env,
    // then call with matterId "TEST" or "TEST-BYPASS".
    const BYPASS =
      process.env.NEXT_PUBLIC_DOCUDOCKET_ALLOW_TEST === "1" &&
      (matterId === "TEST" || matterId === "TEST-BYPASS");

    if (!BYPASS) {
      if (!matterId) {
        return NextResponse.json({ error: "Missing matterId" }, { status: 400 });
      }
      const { data: matters, error } = await supabase
        .from("matters")
        .select("paid")
        .eq("id", matterId)
        .limit(1);
      if (error) throw error;
      if (!matters?.[0]?.paid) {
        return NextResponse.json({ error: "Payment required" }, { status: 403 });
      }
    }

    // Build final merged PDF
    const finalDoc = await PDFDocument.create();

    // 1) Add a simple cover
    await addCoverPage(finalDoc, data, cfg.title);

    // 2) Fill + merge each file in order
    for (const file of cfg.files) {
      const baseBytes = await readTemplateBytes(file.path);
      const mapping = cfg.fields?.[file.id];
      const outBytes = mapping
        ? await fillForm(baseBytes, mapping, data)
        : baseBytes;

      const src = await PDFDocument.load(outBytes);
      const pages = await finalDoc.copyPages(src, src.getPageIndices());
      pages.forEach((p) => finalDoc.addPage(p));
    }

    // 3) Footer page numbers
    const pages = finalDoc.getPages();
    const font = await finalDoc.embedFont(StandardFonts.Helvetica);
    pages.forEach((p, i) => {
      const { width } = p.getSize();
      p.drawText(`${i + 1} / ${pages.length}`, { x: width - 70, y: 18, size: 9, font });
    });

    const bytes = await finalDoc.save();
    return new Response(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="DocuDocket_${productKey}.pdf"`
      }
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to build packet" }, { status: 500 });
  }
}