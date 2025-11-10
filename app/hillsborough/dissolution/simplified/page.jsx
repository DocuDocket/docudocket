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
  nameRestoration: "",
};

export default function HillsboroughSimplifiedDissolution() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initial);
  const [submitted, setSubmitted] = useState(false);

  const update = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Later: send to backend, Stripe, PDF generator
  };

  return (
    <main>
      <div className="card">
        <Link href="/eligibility" className="cta-secondary">
          ← Back to eligibility
        </Link>
        <h1>Simplified Dissolution of Marriage – Hillsborough County</h1>
        <p>
          This flow is for couples who qualify for Florida&apos;s Simplified
          Dissolution procedure and are filing in Hillsborough County.
        </p>
        <p className="fine-print">
          Requirements include: at least one spouse has lived in Florida for 6
          months, no minor/dependent children together and not pregnant, full
          agreement on property/debts, no alimony, and both spouses appear at
          the final hearing.
        </p>
        <p className="fine-print">
          DocuDocket is not a law firm and does not provide legal advice.
        </p>
      </div>

      {!submitted && (
        <form onSubmit={onSubmit}>
          {step === 1 && (
            <div className="card">
              <h2>Step 1 of 4 – Check the basics</h2>

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
                No minor or dependent children in common and no pregnancy?
              </label>
              <select
                value={form.noKidsNoPregnancy}
                onChange={(e) =>
                  update("noKidsNoPregnancy", e.target.value)
                }
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
                onChange={(e) =>
                  update("agreePropertyDebts", e.target.value)
                }
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

              <label>Spouse A email (for notices)</label>
              <input
                type="email"
                value={form.emailA}
                onChange={(e) => update("emailA", e.target.value)}
                required
              />

              <label>Spouse B email (for notices)</label>
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
              <h2>Step 3 of 4 – Marriage details & agreement</h2>

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
                placeholder="Briefly describe who keeps what (home, cars, accounts, etc.)."
                value={form.propertySummary}
                onChange={(e) =>
                  update("propertySummary", e.target.value)
                }
                required
              />

              <label>Debts agreement summary</label>
              <textarea
                rows={3}
                placeholder="Briefly describe who is responsible for which debts."
                value={form.debtsSummary}
                onChange={(e) => update("debtsSummary", e.target.value)}
                required
              />

              <label>
                Name restoration (optional) – list spouse + former name to restore
              </label>
              <input
                placeholder="Example: Spouse A to restore to Jane Smith"
                value={form.nameRestoration}
                onChange={(e) =>
                  update("nameRestoration", e.target.value)
                }
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
              <h2>Step 4 of 4 – Review</h2>
              <p>
                Based on your answers, DocuDocket can prepare a Simplified
                Dissolution packet for filing in Hillsborough County.
              </p>

              <pre
                style={{
                  background: "#f9fafb",
                  padding: "12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  whiteSpace: "pre-wrap",
                }}
              >
{JSON.stringify(form, null, 2)}
              </pre>

              <p className="fine-print">
                In production, this step will send your details to our secure
                backend, collect payment, and generate all required forms
                (including the Joint Petition and cover sheet).
              </p>

              <div style={{ marginTop: 12 }}>
                <button className="btn btn-light" type="button" onClick={back}>
                  Back
                </button>
                <button className="btn btn-dark" type="submit">
                  Finish (demo)
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {submitted && (
        <div className="card">
          <h2>Demo complete</h2>
          <p>
            You&apos;ve walked through the core questions for a Simplified
            Dissolution of Marriage in Hillsborough County.
          </p>
          <p>
            Next implementation steps: save this as a &quot;matter&quot;, run
            Stripe Checkout, and generate your filing packet.
          </p>
          <Link href="/" className="cta-secondary">
            ← Back to home
          </Link>
        </div>
      )}
    </main>
  );
}
