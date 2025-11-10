"use client";

import { useState } from "react";
import Link from "next/link";

const initialForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  newFirstName: "",
  newMiddleName: "",
  newLastName: "",
  newSuffix: "",
  dob: "",
  address: "",
  city: "",
  state: "FL",
  zip: "",
  email: "",
  phone: "",
  reason: "",
  isHillsboroughResident: "",
  is18OrOlder: "",
  lawfulPurpose: "",
  hasFelony: "",
  hasBankruptcy: "",
  hasJudgments: "",
  isSexOffender: "",
  pendingCases: "",
};

export default function HillsboroughAdultNameChange() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Later: send to API route that saves data and triggers Stripe checkout + PDF build
  };

  return (
    <main>
      <div className="card">
        <Link href="/eligibility" className="cta-secondary">
          ← Back to eligibility
        </Link>
        <h1>Adult Name Change – Hillsborough County</h1>
        <p>
          This guided form collects everything needed to prepare your Florida
          Adult Name Change packet for Hillsborough County (including
          Florida Supreme Court Forms 12.982(a) &amp; 12.982(b)).
        </p>
        <p className="fine-print">
          DocuDocket is not a law firm and does not provide legal advice. You are
          responsible for reviewing your documents.
        </p>
      </div>

      {!submitted && (
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="card">
              <h2>Step 1 of 4 – Basic eligibility</h2>

              <label>Are you 18 or older?</label>
              <select
                value={form.is18OrOlder}
                onChange={(e) => update("is18OrOlder", e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>

              <label>Do you currently live in Hillsborough County, Florida?</label>
              <select
                value={form.isHillsboroughResident}
                onChange={(e) =>
                  update("isHillsboroughResident", e.target.value)
                }
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>

              <label>
                Is your request for a lawful purpose (not to avoid creditors,
                law enforcement, or court orders)?
              </label>
              <select
                value={form.lawfulPurpose}
                onChange={(e) => update("lawfulPurpose", e.target.value)}
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
              <h2>Step 2 of 4 – Current & new name</h2>

              <label>Current legal name</label>
              <div style={{ display: "grid", gap: 6, gridTemplateColumns: "1fr 1fr" }}>
                <input
                  placeholder="First"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  required
                />
                <input
                  placeholder="Middle"
                  value={form.middleName}
                  onChange={(e) => update("middleName", e.target.value)}
                />
                <input
                  placeholder="Last"
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  required
                />
                <input
                  placeholder="Suffix (optional)"
                  value={form.suffix}
                  onChange={(e) => update("suffix", e.target.value)}
                />
              </div>

              <label>Desired new name</label>
              <div style={{ display: "grid", gap: 6, gridTemplateColumns: "1fr 1fr" }}>
                <input
                  placeholder="First"
                  value={form.newFirstName}
                  onChange={(e) => update("newFirstName", e.target.value)}
                  required
                />
                <input
                  placeholder="Middle"
                  value={form.newMiddleName}
                  onChange={(e) => update("newMiddleName", e.target.value)}
                />
                <input
                  placeholder="Last"
                  value={form.newLastName}
                  onChange={(e) => update("newLastName", e.target.value)}
                  required
                />
                <input
                  placeholder="Suffix (optional)"
                  value={form.newSuffix}
                  onChange={(e) => update("newSuffix", e.target.value)}
                />
              </div>

              <label>Date of birth</label>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => update("dob", e.target.value)}
                required
              />

              <div className="step">Residential address (Hillsborough County)</div>
              <input
                placeholder="Street address"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                required
              />
              <input
                placeholder="City"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                required
              />
              <input
                placeholder="State"
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                required
              />
              <input
                placeholder="ZIP"
                value={form.zip}
                onChange={(e) => update("zip", e.target.value)}
                required
              />

              <label>Email (for court notices / e-service)</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />

              <label>Phone</label>
              <input
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
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
              <h2>Step 3 of 4 – Background questions</h2>

              <label>Have you ever been convicted of a felony?</label>
              <select
                value={form.hasFelony}
                onChange={(e) => update("hasFelony", e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>

              <label>Are you currently in bankruptcy?</label>
              <select
                value={form.hasBankruptcy}
                onChange={(e) => update("hasBankruptcy", e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>

              <label>Do you have any money judgments against you?</label>
              <select
                value={form.hasJudgments}
                onChange={(e) => update("hasJudgments", e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>

              <label>
                Are you required to register as a sexual offender or predator?
              </label>
              <select
                value={form.isSexOffender}
                onChange={(e) => update("isSexOffender", e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>

              <label>Any pending criminal or civil cases?</label>
              <select
                value={form.pendingCases}
                onChange={(e) => update("pendingCases", e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>

              <label>Reason for name change</label>
              <textarea
                rows={3}
                placeholder="Explain briefly (e.g. restore family name, consistency with identity, etc.)"
                value={form.reason}
                onChange={(e) => update("reason", e.target.value)}
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

          {step === 4 && (
            <div className="card">
              <h2>Step 4 of 4 – Review & next steps</h2>
              <p>
                This summary shows the key details that will appear in your
                Hillsborough Adult Name Change packet.
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
                In the full version, this step will route you to secure payment
                and generate a court-ready PDF packet you can download
                immediately.
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
            You just walked through the DocuDocket Adult Name Change flow for
            Hillsborough County.
          </p>
          <p>
            Next implementation steps: save this data, charge the user, and
            generate the official forms from it.
          </p>
          <Link href="/" className="cta-secondary">
            ← Back to home
          </Link>
        </div>
      )}
    </main>
  );
}
