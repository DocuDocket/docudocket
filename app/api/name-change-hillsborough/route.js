import { PDFDocument, StandardFonts } from "pdf-lib";

export async function POST(request) {
  try {
    const data = await request.json();

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const page = pdfDoc.addPage([612, 792]); // US Letter size
    const { width, height } = page.getSize();

    const drawText = (text, x, y, size = 11) => {
      page.drawText(String(text ?? ""), {
        x,
        y,
        size,
        font,
      });
    };

    let y = height - 50;

    drawText("DocuDocket - Adult Name Change Packet (Hillsborough County, FL)", 40, y, 13);
    y -= 24;
    drawText("This summary is auto-generated from your answers.", 40, y);
    y -= 20;
    drawText("Review carefully. You are responsible for accuracy. This is not legal advice.", 40, y);
    y -= 30;

    const line = (label, value) => {
      const txt = `${label}: ${value || ""}`;
      drawText(txt.slice(0, 100), 40, y);
      y -= 16;
      if (y < 80) {
        // add new page if needed
      }
    };

    line("Current Name", `${data.firstName} ${data.middleName} ${data.lastName} ${data.suffix}`.trim());
    line("Requested New Name", `${data.newFirstName} ${data.newMiddleName} ${data.newLastName} ${data.newSuffix}`.trim());
    line("Date of Birth", data.dob);
    line("Address", data.address);
    line("City/State/ZIP", `${data.city}, ${data.state} ${data.zip}`);
    line("Email", data.email);
    line("Phone", data.phone);
    line("Is 18 or older", data.is18OrOlder);
    line("Hillsborough resident", data.isHillsboroughResident);
    line("Lawful purpose", data.lawfulPurpose);
    line("Felony history", data.hasFelony);
    line("Bankruptcy", data.hasBankruptcy);
    line("Money judgments", data.hasJudgments);
    line("Sex offender/predator", data.isSexOffender);
    line("Pending cases", data.pendingCases);

    y -= 10;
    drawText("Reason for name change:", 40, y);
    y -= 16;

    const reason = (data.reason || "").toString();
    const wrapped = reason.match(/.{1,80}/g) || [""];
    wrapped.forEach((lineText) => {
      drawText(lineText, 40, y);
      y -= 14;
    });

    y -= 20;
    drawText(
      "Next steps (summary, not legal advice):",
      40,
      y,
      11
    );
    y -= 16;
    drawText(
      "- Complete official Florida Supreme Court forms 12.982(a) and 12.982(b) using this information.",
      40,
      y,
      9
    );
    y -= 12;
    drawText(
      "- Arrange FDLE LiveScan fingerprints as required and file in Hillsborough County.",
      40,
      y,
      9
    );
    y -= 12;
    drawText(
      "- Bring ID and proposed final judgment to your hearing.",
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
          'attachment; filename="DocuDocket_Adult_Name_Change_Hillsborough.pdf"',
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to generate PDF" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
