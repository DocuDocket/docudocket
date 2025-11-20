// app/checkout/success/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const [loading, setLoading] = useState(true);
  const [matterId, setMatterId] = useState(null);
  const [productKey, setProductKey] = useState(null);
  const [status, setStatus] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function loadSession() {
      try {
        const params = new URLSearchParams(window.location.search);
        const session_id = params.get("session_id");

        if (!session_id) {
          setErr("Missing session_id in URL.");
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/checkout/session?session_id=${session_id}`);
        const json = await res.json();

        if (!res.ok) {
          console.error(json);
          setErr(json.error || "Failed to verify payment.");
          setLoading(false);
          return;
        }

        const md = json.metadata || {};
        setMatterId(md.matterId || null);
        setProductKey(md.productKey || null);
        setStatus(json.payment_status || null);

        setLoading(false);
      } catch (e) {
        console.error(e);
        setErr("Unexpected error verifying payment.");
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  async function handleDownload() {
    setErr("");

    try {
      if (!matterId) {
        setErr("Missing matterId. Please contact support.");
        return;
      }

      const res = await fetch("/api/pdf/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matterId })
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr(j.error || "Failed to build your packet.");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      const safeName = (productKey || "packet").replace(/[^a-z0-9-_]+/gi, "_");
      a.href = url;
      a.download = `DocuDocket_${safeName}.pdf`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      setErr("Error downloading packet. Please try again.");
    }
  }

  return (
    <main style={{ padding: "3rem", maxWidth: 720, margin: "0 auto" }}>
      <div className="card">
        <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
          Payment Successful 🎉
        </h1>

        {loading && <p>Verifying your payment…</p>}

        {!loading && err && (
          <p className="danger" style={{ marginTop: "1rem" }}>
            {err}
          </p>
        )}

        {!loading && !err && (
          <>
            <p style={{ marginTop: "0.5rem" }}>
              Thanks! Your DocuDocket matter is confirmed.
            </p>

            {status !== "paid" && (
              <p className="danger" style={{ marginTop: "1rem" }}>
                Stripe still shows this session as not paid. If you just paid,
                refresh in a moment. If this persists, contact support.
              </p>
            )}

            <div
              style={{
                marginTop: "1.25rem",
                display: "flex",
                gap: 10,
                flexWrap: "wrap"
              }}
            >
              <button
                className="btn btn-dark"
                onClick={handleDownload}
                disabled={status !== "paid"}
              >
                Download your packet
              </button>

              <Link href="/" className="cta-secondary">
                Back to home
              </Link>
            </div>

            <p className="fine-print" style={{ marginTop: "1.25rem" }}>
              DocuDocket is a self-help document preparation platform and is not a law firm.
              We do not provide legal advice.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
