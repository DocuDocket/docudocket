// app/api/pdf/build/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "node:fs";
import path from "node:path";
import { PACKETS } from "@/lib/forms";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const readTemplateBytes = async (relPath) => {
  const abs = path.join(process.cwd(), relPath.replace(/^\/+/, ""));
  return fs.readFile(abs);
};

async function fillForm(baseBytes, fieldMap, data) {
  const pdf = await PDFDocument.load(baseBytes);
  const form = pdf.getForm?.();

  if (form) {
    for (const [fieldName, mapping] of Object.entries(fieldMap || {})) {
      const value = typeof mapping === "function" ? mapping(data) : data?.[mapping];

      // checkbox
      try {
        const cb = form.getCheckBox(fieldName);
        if (cb) { value ? cb.check() : cb.uncheck(); continue; }
      } catch {}

      // text
      try {
        const tf = form.getTextField(fieldName);
        if (tf) { if (value != null && value !== "") tf.setText(String(value)); continue; }
      } catch {}

      // radio
      try {
        const rg = form.getRadioGroup(fieldName);
        if (rg && value) { rg.select(String(value)); continue; }
      } catch {}
    }
    try { form.flatten(); } catch {}
  }

  return pdf.save();
}

async function addCoverPage(finalDoc, data, productTitle) {
  const cover = await PDFDocument.create();
  const page = cover.addPage([612, 792]);
  const font = await cover.embedFont(StandardFonts.HelveticaBold);
  const font2 = await cover.embedFont(StandardFonts.Helvetica);

  page.drawText("DocuDocket – Filing Packet", { x: 56, y: 730, size: 18, font });
  page.drawText(productTitle, { x: 56, y: 705, size: 14, font: font2 });

  const who =
    [data?.firstName, data?.middleName, data?.lastName].filter(Boolean).join(" ") ||
    [data?.spouseA, data?.spouseB].filter(Boolean).join(" ");
  if (who) page.drawText(`Filer: ${who}`, { x: 56, y: 675, size: 11, font: font2 });

  page.drawText("Checklist:", { x: 56, y: 640, size: 12, font });
  ["Bring government ID and required filing fees.",
   "If required, fingerprints/FDLE completed.",
   "Sign notarized pages in front of a notary.",
   "Leave Case No. blank until assigned by Clerk."]
   .forEach((b, i) => page.drawText(`• ${b}`, { x: 56, y: 620 - i * 16, size: 11, font: font2 }));

  const [coverPage] = await finalDoc.copyPages(cover, [0]);
  finalDoc.addPage(coverPage);
}

export async function POST(req) {
  try {
    const { productKey, data, matterId } = await req.json().catch(() => ({}));
    if (!productKey) {
      return NextResponse.json({ error: "Missing productKey" }, { status: 400 });
    }

    const cfg = PACKETS[productKey];
    if (!cfg) {
      return NextResponse.json({ error: `Unknown packet: ${productKey}` }, { status: 400 });
    }
    if (!Array.isArray(cfg.files) || cfg.files.length === 0) {
      return NextResponse.json({ error: "Packet has no files" }, { status: 400 });
    }

    // test bypass so you can build without payment during dev
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
      if (error) return NextResponse.json({ error: `Supabase error: ${error.message}` }, { status: 500 });
      if (!matters?.[0]?.paid) {
        return NextResponse.json({ error: "Payment required" }, { status: 403 });
      }
    }

    const finalDoc = await PDFDocument.create();

    // Add cover page (make non-fatal if it throws)
    try { await addCoverPage(finalDoc, data || {}, cfg.title || "DocuDocket Packet"); }
    catch (e) {
      console.error("COVER_ERROR:", e?.message);
      // continue anyway
    }

    for (const file of cfg.files) {
      let baseBytes;
      try {
        baseBytes = await readTemplateBytes(file.path);
      } catch (e) {
        console.error("TEMPLATE_READ_ERROR:", file.path, e?.message);
        return NextResponse.json(
          { error: `Template not found or unreadable: ${file.path}` },
          { status: 500 }
        );
      }

      let outBytes = baseBytes;
      const mapping = cfg.fields?.[file.id];
      if (mapping) {
        try {
          outBytes = await fillForm(baseBytes, mapping, data || {});
        } catch (e) {
          console.error("FILL_ERROR:", file.id, e?.message);
          return NextResponse.json(
            { error: `Failed filling fields for ${file.id}: ${e?.message || "unknown"}` },
            { status: 500 }
          );
        }
      }

      try {
        const src = await PDFDocument.load(outBytes);
        const pages = await finalDoc.copyPages(src, src.getPageIndices());
        pages.forEach((p) => finalDoc.addPage(p));
      } catch (e) {
        console.error("MERGE_ERROR:", file.id, e?.message);
        return NextResponse.json(
          { error: `Failed merging ${file.id}: ${e?.message || "unknown"}` },
          { status: 500 }
        );
      }
    }

    // page numbers
    try {
      const font = await finalDoc.embedFont(StandardFonts.Helvetica);
      const pages = finalDoc.getPages();
      pages.forEach((p, i) => {
        const { width } = p.getSize();
        p.drawText(`${i + 1} / ${pages.length}`, { x: width - 70, y: 18, size: 9, font });
      });
    } catch (e) {
      console.error("FOOTER_ERROR:", e?.message);
      // non-fatal
    }

    const bytes = await finalDoc.save();
    return new Response(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="DocuDocket_${productKey}.pdf"`
      }
    });
  } catch (e) {
    console.error("BUILD_FATAL:", e?.message, e?.stack);
    return NextResponse.json({ error: `Failed to build packet: ${e?.message || "unknown"}` }, { status: 500 });
  }
}