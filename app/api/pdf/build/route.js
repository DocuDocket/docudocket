import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { PACKETS } from "@/lib/forms";
import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const readTemplateBytes = async (relPath) => {
  // relPath like "templates/hillsborough/.../file.pdf"
  const abs = path.join(process.cwd(), relPath.replace(/^\/+/, ""));
  return await fs.readFile(abs);
};

// ... keep your other code, but when loading files, call readTemplateBytes(file.path)
// e.g.
// const baseBytes = await readTemplateBytes(file.path);
