"use client";

import { useState } from "react";

const DEFAULT_TEST_DATA = {
  // Basic / eligibility
  is18OrOlder: "yes",
  isHillsboroughResident: "yes",
  lawfulPurpose: "yes",

  // Current name
  firstName: "Test",
  middleName: "",
  lastName: "User",
  suffix: "",

  // New name
  newFirstName: "Testy",
  newMiddleName: "",
  newLastName: "Userman",
  newSuffix: "",

  // Address / contact
  dob: "1990-01-01",
  address: "123 Main St",
  city: "Tampa",
  state: "FL",
  zip: "33602",
  email: "test@example.com",
  phone: "555-555-5555",

  // Background
  hasFelony: "no",
  hasBankruptcy: "no",
  hasJudgments: "no",
  isSexOffender: "no",
  pendingCases: "no",

  reason: "Consistency with other records"
};

export default function DevTestPacketPage() {
  const [jsonText, setJsonText] = useState(
    JSON.stringify(DEFAULT_TEST_DATA, null, 2)
  );
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const runTest = async () => {
    setMsg("");
    setBusy(true);

    let data;
    try {
      data = JSON.parse(jsonText);
    } catch (e) {
      setBusy(false);
      setMsg("❌ Your JSON is invalid. Fix it and try again.");
      return;
    }

    try {
      const res = await fetch("/api/pdf/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productKey: "name-change-hillsborough",
          matterId: "TEST-BYPASS",
          data
        })
      });

      if (!res.ok) {
        const errTxt = await res.text().catch(() => "");
        throw new Error(errTxt || "Build failed");
      }

      const blob = await res.blob();
      downloadBlob(blob, "DocuDocket_TEST_Name_Change_Hillsborough.pdf");
      setMsg("✅ Packet built and downloaded.");
    } catch (e) {
      console.error(e);
      setMsg(
        "❌ Build failed. Check your console and server logs. " +
          (e?.message || "")
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main style={{ padding: "24px", maxWidth: 900, margin: "0 auto" }}>
      <div className="card">
        <h1 style={{ marginBottom: 6 }}>Dev: Generate Test Packet</h1>
        <p style={{ marginTop: 0 }}>
          This page calls <code>/api/pdf/build</code> using{" "}
          <code>matterId="TEST-BYPASS"</code>.  
          It only works when{" "}
          <code>NEXT_PUBLIC_DOCUDOCKET_ALLOW_TEST=1</code>.
        </p>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Test Data (editable JSON)</h2>
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          rows={18}
          style={{
            width: "100%",
            padding: 12,
            fontFamily: "monospace",
            fontSize: 14,
            borderRadius: 8,
            border: "1px solid #ccc"
          }}
        />

        {msg && (
          <p style={{ marginTop: 12 }} className={msg.startsWith("✅") ? "" : "danger"}>
            {msg}
          </p>
        )}

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button
            className="btn btn-dark"
            onClick={runTest}
            disabled={busy}
            type="button"
          >
            {busy ? "Building..." : "Generate Test Packet"}
          </button>

          <button
            className="btn btn-light"
            type="button"
            onClick={() =>
              setJsonText(JSON.stringify(DEFAULT_TEST_DATA, null, 2))
            }
            disabled={busy}
          >
            Reset to Default
          </button>
        </div>
      </div>
    </main>
  );
}
