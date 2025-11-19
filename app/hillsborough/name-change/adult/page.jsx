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
  pendingCases: ""
};

export default function HillsboroughAdultNameChange() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  // DEMO PDF flow (existing behavior)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // Save this matter (fire-and-forget; demo-only)
      fetch("/api/matters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "name-change-hillsborough",
          email: form.email,
          data: form
        })
      }).catch((err) => {
        console.error("Failed to save matter", err);
      });

      // Generate PDF summary (demo)
      const res = await fetch("/api/name-change-hillsborough", {
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
      a.download = "DocuDocket_Adult_Name_Change_Hillsborough.pdf";
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

  // LIVE CHECKOUT FLOW – wired to Supabase matters + Stripe
  const startCheckout = async () => {
    setError("");
    setSubmitting(true);

    try {
      // 1) Create a matter in the new `matters` table
      const matterRes = await fetch("/api/matters/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productKey: "name-change-hillsborough",
          data: form
        })
      });

      const matterJson = await matterRes.json();

      if (!matterRes.ok) {
        console.error("Matter creation error:", matterJson);
        setError("Sorry, we couldn’t save your information. Please try again.");
        return;
      }

      const { matterId } = matterJson;

      if (!matterId) {
        console.error("No matterId returned:", matterJson);
        setError("Something went wrong saving your matter. Please try again.");
        return;
      }

      // 2) Start Stripe Checkout tied to this matter
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productKey: "name-change-hillsborough",
          pricingTier: "diy", // identify this as the DIY Docs tier
          matterId
        })
      });

      const data = await res.json();

      if (res.ok && data.url) {
        // 3) Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data);
        setError("Checkout is not available right now. Please try again.");
      }
    } catch (e) {
      console.error(e);
      setError("Error starting checkout. Please try again.");
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
        <h1>Adult Name Change – Hillsborough County</h1>
        <p>
          Answer these questions to generate a Hillsborough-focused Adult Name
          Change packet summary. This flow is based on Florida Supreme Court
          Forms 12.982(a)/(b).
        </p>
        <p className="fine-print">
          DocuDocket is a self-help document preparation platform and is not a
          law firm. We do not provide legal advice. You are responsible for
          reviewing your documents and confirming they meet current court
          requirements.
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
                <button
                  className="btn btn-dark"
                  type="button"
                  onClick={next}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="card">
              <h2>Step 2 of 4 – Current & new name</h2>

              <label>Current legal name</label>
              <div
                style={{
                  display: "grid",
                  gap: 6,
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))"
                }}
              >
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
                  placeholder="Suffix"
                  value={form.suffix}
                  onChange={(e) => update("suffix", e.target.value)}
                />
              </div>

              <label>Desired new name</label>
              <div
                style={{
                  display: "grid",
                  gap: 6,
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))"
                }}
              >
                <input
                  placeholder="First"
                  value={form.newFirstName}
                  onChange={(e) =>
                    update("newFirstName", e.target.value)
                  }
                  required
                />
                <input
                  placeholder="Middle"
                  value={form.newMiddleName}
                  onChange={(e) =>
                    update("newMiddleName", e.target.value)
                  }
                />
                <input
                  placeholder="Last"
                  value={form.newLastName}
                  onChange={(e) =>
                    update("newLastName", e.target.value)
                  }
                  required
                />
                <input
                  placeholder="Suffix"
                  value={form.newSuffix}
                  onChange={(e) =>
                    update("newSuffix", e.target.value)
                  }
                />
              </div>

              <label>Date of birth</label>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => update("dob", e.target.value)}
                required
              />

              <div className="step">
                Residential address (should be in Hillsborough County)
              </div>
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

              <label>Email (for notices / contact)</label>
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
                <button
                  className="btn btn-light"
                  type="button"
                  onClick={back}
                >
                  Back
                </button>
                <button
                  className="btn btn-dark"
                  type="button"
                  onClick={next}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card">
              <h2>Step 3 of 4 – Background</h2>

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
                onChange={(e) =>
                  update("hasBankruptcy", e.target.value)
                }
                required
              >
                <option value="">Select</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>

              <label>Do you have any money judgments against you?</label>
              <select
                value={form.hasJudgments}
                onChange={(e) =>
                  update("hasJudgments", e.target.value)
                }
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
                onChange={(e) =>
                  update("isSexOffender", e.target.value)
                }
                required
              >
                <option value="">Select</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>

              <label>Any pending criminal or civil cases?</label>
              <select
                value={form.pendingCases}
                onChange={(e) =>
                  update("pendingCases", e.target.value)
                }
                required
              >
                <option value="">Select</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>

              <label>Reason for name change</label>
              <textarea
                rows={3}
                placeholder="Brief, honest explanation (e.g. restore prior name, consistency, personal reasons)."
                value={form.reason}
                onChange={(e) => update("reason", e.target.value)}
                required
              />

              <div style={{ marginTop: 12 }}>
                <button
                  className="btn btn-light"
                  type="button"
                  onClick={back}
                >
                  Back
                </button>
                <button
                  className="btn btn-dark"
                  type="button"
                  onClick={next}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="card">
              <h2>Step 4 of 4 – Generate your packet summary</h2>
              <p>
                Option 1: download a PDF summary of your answers (demo mode).
                Option 2: continue to secure checkout in test mode.
              </p>

              {error && <p className="danger">{error}</p>}

              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap"
                }}
              >
                <button
                  className="btn btn-light"
                  type="button"
                  onClick={back}
                >
                  Back
                </button>
                <button
                  className="btn btn-dark"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting
                    ? "Generating..."
                    : "Finish & download PDF (demo)"}
                </button>
                <button
                  className="btn btn-light"
                  type="button"
                  onClick={startCheckout}
                  disabled={submitting}
                >
                  {submitting
                    ? "Redirecting..."
                    : "Continue to secure checkout"}
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
            product, this would be expanded into full, clerk-ready forms and
            stored with your DocuDocket matter.
          </p>
          <Link href="/" className="cta-secondary">
            ← Back to home
          </Link>
        </div>
      )}
    </main>
  );
}