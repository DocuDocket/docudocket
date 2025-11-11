"use client";

import { useState } from "react";
import Link from "next/link";

const initial = {
  spouseA: "",
  spouseB: "",
  addressA: "",
  addressB: "",
  emailA: "",
  emailB: "",
  marriageDate: "",
  marriagePlace: "",
  residency6mo: "",
  noKidsNoPregnancy: "",
  agreeBroken: "",
  agreePropertyDebts: "",
  noAlimony: "",
  bothAppear: "",
  propertySummary: "",
  debtsSummary: "",
  nameRestoration: ""
};

export default function HillsboroughSimplifiedDissolution() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const update = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // Save this matter (fire-and-forget; if it fails we still proceed)
      fetch("/api/matters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "simplified-dissolution-hillsborough",
          email: form.emailA || form.emailB,
          data: form
        })
      }).catch((err) => {
        console.error("Failed to save matter", err);
      });

      // Generate PDF summary
      const res = await fetch("/api/dissolution-simplified-hillsborough", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "DocuDocket_Simplified_Dissolution_Hillsborough.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("There was a problem generating your packet. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <div className="card">
        <Link href="/eligibility" className="cta-secondary">
          ← Back to eligibility
        </Link>
        <h1>Simplified Dissolution of Marriage – Hillsborough County</h1>
        <p>
          Use this guided flow if you both qualify for Florida&apos;s Simplified
          Dissolution procedure and are filing in Hillsborough County.
        </p>
        <p className="fine-print">
          Requirements (summary): at least one spouse has lived in Florida 6+ months,
          no minor/dependent children in common and not pregnant, full agreement
          on property and debts, no alimony, and both spouses will sign and appear.
        </p>
        <p className="fine-print">
          DocuDocket is a self-help document preparation platform and is not a law firm.
          We do not provide legal advice.
        </p>
      </div>

      {!submitted && (
        <form onSubmit={onSubmit}>
          {step === 1 && (
            <div className="card">
              <h2>Step 1 of 4 – Confirm eligibility</h2>

              <label>
                Has either spouse lived in Florida for at least 6 months?
              </label>
              <select
                value={form.residency6mo}
                onChange={(e) => update("residency6mo", e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>

              <label>
                No minor/dependent children in common and not pregnant?
              </label>
              <select
                value={form.noKidsNoPregnancy}
                onChange={(e) => update("noKidsNoPregnancy", e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>

              <label>Do you both agree the marriage is irretrievably broken?</label>
              <select
                value={form.agreeBroken}
                onChange={(e) => update("agreeBroken", e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>

              <label>
                Do you both fully agree on how to divide all property and debts?
              </label>
              <select
                value={form.agreePropertyDebts}
                onChange={(e) => update("agreePropertyDebts", e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>

              <label>No alimony will be requested by either spouse?</label>
              <select
                value={form.noAlimony}
                onChange={(e) => update("noAlimony", e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>

              <label>
                Will both of you sign the petition and attend the final hearing?
              </label>
              <select
                value={form.bothAppear}
                onChange={(e) => update("bothAppear", e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>

              <div style={{ marginTop: 12 }}>
                <button className="btn btn-dark" type="button" onClick={next}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="card">
              <h2>Step 2 of 4 – Names & contact</h2>

              <label>Spouse A full name</label>
              <input
                value={form.spouseA}
                onChange={(e) => update("spouseA", e.target.value)}
                required
              />

              <label>Spouse B full name</label>
              <input
                value={form.spouseB}
                onChange={(e) => update("spouseB", e.target.value)}
                required
              />

              <label>Spouse A mailing address</label>
              <input
                value={form.addressA}
                onChange={(e) => update("addressA", e.target.value)}
                required
              />

              <label>Spouse B mailing address</label>
              <input
                value={form.addressB}
                onChange={(e) => update("addressB", e.target.value)}
                required
              />

              <label>Spouse A email</label>
              <input
                type="email"
                value={form.emailA}
                onChange={(e) => update("emailA", e.target.value)}
                required
              />

              <label>Spouse B email</label>
              <input
                type="email"
                value={form.emailB}
                onChange={(e) => update("emailB", e.target.value)}
                required
              />

              <div style={{ marginTop: 12 }}>
                <button className="btn btn-light" type="button" onClick={back}>
                  Back
                </button>
                <button className="btn btn-dark" type="button" onClick={next}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card">
              <h2>Step 3 of 4 – Marriage & agreement details</h2>

              <label>Date of marriage</label>
              <input
                type="date"
                value={form.marriageDate}
                onChange={(e) => update("marriageDate", e.target.value)}
                required
              />

              <label>Place of marriage (City, State)</label>
              <input
                value={form.marriagePlace}
                onChange={(e) => update("marriagePlace", e.target.value)}
                required
              />

              <label>Property agreement summary</label>
              <textarea
                rows={3}
                placeholder="Who keeps what (home, vehicles, accounts, etc.)?"
                value={form.propertySummary}
                onChange={(e) => update("propertySummary", e.target.value)}
                required
              />

              <label>Debts agreement summary</label>
              <textarea
                rows={3}
                placeholder="Who is responsible for which debts?"
                value={form.debtsSummary}
                onChange={(e) => update("debtsSummary", e.target.value)}
                required
              />

              <label>
                Name restoration (optional) – list spouse & former name to restore
              </label>
              <input
                placeholder="Example: Spouse A to restore to Jane Smith"
                value={form.nameRestoration}
                onChange={(e) => update("nameRestoration", e.target.value)}
              />

              <div style={{ marginTop: 12 }}>
                <button className="btn btn-light" type="button" onClick={back}>
                  Back
                </button>
                <button className="btn btn-dark" type="button" onClick={next}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="card">
              <h2>Step 4 of 4 – Generate your packet summary</h2>
              <p>
                When you finish, DocuDocket will generate a PDF summary with
                the key information for your Simplified Dissolution filing in
                Hillsborough County.
              </p>

              {error && <p className="danger">{error}</p>}

              <div style={{ marginTop: 12 }}>
                <button className="btn btn-light" type="button" onClick={back}>
                  Back
                </button>
                <button className="btn btn-dark" type="submit" disabled={submitting}>
                  {submitting ? "Generating..." : "Finish & download PDF"}
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {submitted && (
        <div className="card">
          <h2>Packet summary downloaded</h2>
          <p>
            A PDF summary has been generated based on your answers. In the full
            product, this would be expanded into complete, clerk-ready forms and
            saved to your DocuDocket matter.
          </p>
          <Link href="/" className="cta-secondary">
            ← Back to home
          </Link>
        </div>
      )}
    </main>
  );
}
