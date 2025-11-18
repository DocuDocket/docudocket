// app/dev/test-matter/page.jsx
"use client";

import { useState } from "react";

export default function TestMatterPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/matters/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productKey: "name-change-hillsborough",
          data: {
            firstName: "Testy",
            middleName: "Q",
            lastName: "McTester",
            dob: "1985-01-01",
            address1: "123 Main St",
            city: "Tampa",
            state: "FL",
            zip: "33601",
            email: "test@example.com",
            phone: "813-555-1234"
          }
        })
      });

      const json = await res.json();
      setResult({ status: res.status, body: json });
    } catch (e) {
      setResult({ status: "error", body: { error: e.message } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "3rem", maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>
        Test: Create Matter
      </h1>
      <p style={{ marginBottom: "1rem" }}>
        Click the button to call <code>/api/matters/create</code> and insert a
        dummy row into the <code>matters</code> table.
      </p>
      <button
        onClick={handleCreate}
        disabled={loading}
        style={{
          padding: "0.6rem 1.2rem",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          fontWeight: 600
        }}
      >
        {loading ? "Creating..." : "Create test matter"}
      </button>

      {result && (
        <pre
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "#111827",
            color: "#e5e7eb",
            borderRadius: "8px",
            fontSize: "0.85rem",
            overflowX: "auto"
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}
