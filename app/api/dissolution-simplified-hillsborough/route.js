import { PDFDocument, StandardFonts } from "pdf-lib";

export async function POST(request) {
  try {
    const data = await request.json();

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const page = pdfDoc.addPage([612, 792]); // US Letter
    const { width, height } = page.getSize();

    const drawText = (text, x, y, size = 11) => {
      page.drawText(String(text ?? ""), {
        x,
        y,
        size,
        font
      });
    };

    let y = height - 50;

    drawText(
      "DocuDocket - Simplified Dissolution of Marriage (Hillsborough County, FL)",
      40,
      y,
      13
    );
    y -= 24;
    drawText(
      "Summary auto-generated from your answers. Review carefully. This is not legal advice.",
      40,
      y
    );
    y -= 30;

    const line = (label, value) => {
      const txt = `${label}: ${value || ""}`;
      drawText(txt.slice(0, 100), 40, y);
      y -= 16;
    };

    line("Spouse A", data.spouseA);
    line("Spouse B", data.spouseB);
    line("Spouse A address", data.addressA);
    line("Spouse B address", data.addressB);
    line("Spouse A email", data.emailA);
    line("Spouse B email", data.emailB);
    line("Date of marriage", data.marriageDate);
    line("Place of marriage", data.marriagePlace);

    line("FL residency (6+ months)", data.residency6mo);
    line("No minor/dependent kids & not pregnant", data.noKidsNoPregnancy);
    line("Agree marriage is irretrievably broken", data.agreeBroken);
    line("Agree on property & debts", data.agreePropertyDebts);
    line("No alimony requested", data.noAlimony);
    line("Both will sign & appear", data.bothAppear);

    y -= 10;
    drawText("Property agreement summary:", 40, y);
    y -= 16;
    const prop = (data.propertySummary || "").toString();
    (prop.match(/.{1,80}/g) || [""]).forEach((t) => {
      drawText(t, 40, y, 9);
      y -= 12;
    });

    y -= 8;
    drawText("Debts agreement summary:", 40, y);
    y -= 16;
    const debts = (data.debtsSummary || "").toString();
    (debts.match(/.{1,80}/g) || [""]).forEach((t) => {
      drawText(t, 40, y, 9);
      y -= 12;
    });

    if (data.nameRestoration) {
      y -= 8;
      drawText("Name restoration request:", 40, y);
      y -= 16;
      const nr = data.nameRestoration.toString();
      (nr.match(/.{1,80}/g) || [""]).forEach((t) => {
        drawText(t, 40, y, 9);
        y -= 12;
      });
    }

    y -= 16;
    drawText(
      "Next steps (summary, not legal advice):",
      40,
      y,
      11
    );
    y -= 16;
    drawText(
      "- Use this information to complete the Florida Simplified Dissolution forms correctly.",
      40,
      y,
      9
    );
    y -= 12;
    drawText(
      "- File in Hillsborough County per current clerk instructions and attend the final hearing together.",
      40,
      y,
      9
    );

    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="DocuDocket_Simplified_Dissolution_Hillsborough.pdf"'
      }
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to generate PDF" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
