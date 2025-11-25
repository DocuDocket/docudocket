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

// helper: read template bytes from disk
const readTemplateBytes = async (relPath) => {
  const abs = path.join(process.cwd(), relPath.replace(/^\/+/, ""));
  return fs.readFile(abs);
};

// normalize mapping output -> { value, fontSize? }
const normalizeValue = (raw, data) => {
  const v = typeof raw === "function" ? raw(data) : data?.[raw];

  // allow { value, fontSize }
  if (v && typeof v === "object" && "value" in v) {
    return {
      value: v.value,
      fontSize: v.fontSize
    };
  }

  return { value: v, fontSize: undefined };
};

// helper: fill a form’s fields using pdf-lib and our mapping
async function fillForm(baseBytes, fieldMap, data) {
  const pdf = await PDFDocument.load(baseBytes);
  const form = pdf.getForm?.();

  if (form) {
    for (const [fieldName, mapping] of Object.entries(fieldMap || {})) {
      const { value, fontSize } = normalizeValue(mapping, data);

      // 1) checkbox
      try {
        const cb = form.getCheckBox(fieldName);
        if (cb) {
          value ? cb.check() : cb.uncheck();
          continue;
        }
      } catch {}

      // 2) radio group
      try {
        const rg = form.getRadioGroup(fieldName);
        if (rg) {
          if (value) rg.select(String(value));
          continue;
        }
      } catch {}

      // 3) text field
      try {
        const tf = form.getTextField(fieldName);
        if (tf) {
          // IMPORTANT: never write booleans into text fields (prevents "false")
          if (typeof value === "boolean") continue;

          if (value != null && value !== "") {
            tf.setText(String(value));
            if (fontSize) {
              try {
                tf.setFontSize(fontSize);
              } catch {}
            }
          }
          continue;
        }
      } catch {}
    }

    try {
      form.flatten();
    } catch {}
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
  if (who) {
    page.drawText(`Filer: ${who}`, { x: 56, y: 675, size: 11, font: font2 });
  }

  page.drawText("Checklist:", { x: 56, y: 640, size: 12, font });
  [
    "Bring government ID and required filing fees.",
    "If required, fingerprints/FDLE completed.",
    "Sign notarized pages in front of a notary.",
    "Leave Case No. blank until assigned by Clerk."
  ].forEach((b, i) =>
    page.drawText(`• ${b}`, { x: 56, y: 620 - i * 16, size: 11, font: font2 })
  );

  const [coverPage] = await finalDoc.copyPages(cover, [0]);
  finalDoc.addPage(coverPage);
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    let { productKey, data, matterId } = body;

    const BYPASS =
      process.env.NEXT_PUBLIC_DOCUDOCKET_ALLOW_TEST === "1" &&
      (matterId === "TEST" || matterId === "TEST-BYPASS");

    let packetData = data || {};
    let packetKey = productKey;

    if (!BYPASS) {
      if (!matterId) {
        return NextResponse.json({ error: "Missing matterId" }, { status: 400 });
      }

      const { data: rows, error } = await supabase
        .from("matters")
        .select("product_key, data, paid")
        .eq("id", matterId)
        .limit(1);

      if (error) {
        return NextResponse.json(
          { error: `Supabase error: ${error.message}` },
          { status: 500 }
        );
      }

      const row = rows?.[0];

      if (!row) {
        return NextResponse.json({ error: "Matter not found" }, { status: 404 });
      }

      if (!row.paid) {
        return NextResponse.json({ error: "Payment required" }, { status: 403 });
      }

      packetKey = row.product_key;
      packetData = row.data || {};
    }

    if (!packetKey) {
      return NextResponse.json({ error: "Missing productKey" }, { status: 400 });
    }

    const cfg = PACKETS[packetKey];
    if (!cfg) {
      return NextResponse.json(
        { error: `Unknown packet: ${packetKey}` },
        { status: 400 }
      );
    }

    const files = (cfg.files || []).filter(
      (f) => !f.include || f.include(packetData)
    );

    if (files.length === 0) {
      return NextResponse.json({ error: "Packet has no files" }, { status: 400 });
    }

    const finalDoc = await PDFDocument.create();

    try {
      await addCoverPage(finalDoc, packetData, cfg.title || "DocuDocket Packet");
    } catch (e) {
      console.error("COVER_ERROR:", e?.message);
    }

    for (const file of files) {
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
          outBytes = await fillForm(baseBytes, mapping, packetData);
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

    // page numbers (non-fatal)
    try {
      const font = await finalDoc.embedFont(StandardFonts.Helvetica);
      const pages = finalDoc.getPages();
      pages.forEach((p, i) => {
        const { width } = p.getSize();
        p.drawText(`${i + 1} / ${pages.length}`, {
          x: width - 70,
          y: 18,
          size: 9,
          font
        });
      });
    } catch (e) {
      console.error("FOOTER_ERROR:", e?.message);
    }

    const bytes = await finalDoc.save();
    return new Response(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="DocuDocket_${packetKey}.pdf"`
      }
    });
  } catch (e) {
    console.error("BUILD_FATAL:", e?.message, e?.stack);
    return NextResponse.json(
      { error: `Failed to build packet: ${e?.message || "unknown"}` },
      { status: 500 }
    );
  }
}
