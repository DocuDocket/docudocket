"use client";

import { useState } from "react";
import Link from "next/link";

const blankAddress = { line: "", from: "", to: "" };
const blankEmployment = { employer: "", from: "", to: "" };
const blankEducation = { school: "", degree: "", graduation: "" };
const blankJudgment = { amount: "", creditor: "", details: "" };
const blankPrevChange = { from: "", to: "", date: "", court: "", type: "" };
const blankCrime = { event: "", date: "", cityState: "" };

const initialForm = {
  // current name
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",

  // requested name
  newFirstName: "",
  newMiddleName: "",
  newLastName: "",
  newSuffix: "",

  // filing + birth
  petitionDate: "",
  dob: "",
  birthCity: "",
  birthCounty: "",
  birthState: "FL",
  birthCountry: "USA",

  // residence + contact
  address: "",
  address2: "",
  city: "",
  state: "FL",
  zip: "",
  email: "",
  phone: "",
  priorAddresses: [{ ...blankAddress }], // up to 4

  // marital / kids
  isMarried: "", // yes/no
  spouseFullName: "",
  hasChildren: "", // yes/no
  children: [""], // up to 5 strings

  // other names / prior changes
  otherNamesKnown: "", // yes/no
  otherName1: "",
  otherName2: "",
  priorNameChange: "", // yes/no
  prevChange: [{ ...blankPrevChange }], // up to 2

  // work / business / profession / education
  occupation: "",
  employment: [{ ...blankEmployment }], // up to 2
  ownsBusiness: "", // yes/no
  businessAddress: "",
  businessPosition: "",
  businessSince: "",
  inProfession: "", // yes/no
  professions: [""], // up to 5
  education: [{ ...blankEducation }], // up to 3

  // legal background
  hasFelony: "", // yes/no (criminal history)
  criminalEvents: [{ ...blankCrime }], // up to 3
  isSexOffender: "", // yes/no (already had this)
  sexPred77521: "", // yes/no
  sexPred9430435: "", // yes/no
  hasBankruptcy: "", // yes/no (currently in bankruptcy)
  adjudicatedBankrupt: "", // yes/no (ever adjudicated)
  bankruptcyDate: "",
  bankruptcyCity: "",
  bankruptcyCounty: "",
  bankruptcyState: "FL",
  hasJudgments: "", // yes/no
  judgments: [{ ...blankJudgment }], // up to 4
  pendingCases: "", // yes/no

  // purpose / eligibility
  reason: "",
  isHillsboroughResident: "",
  is18OrOlder: "",
  lawfulPurpose: ""
};

export default function HillsboroughAdultNameChange() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateArrayItem = (field, idx, key, value) =>
    setForm((prev) => {
      const copy = [...prev[field]];
      copy[idx] = { ...copy[idx], [key]: value };
      return { ...prev, [field]: copy };
    });

  const updateStringArrayItem = (field, idx, value) =>
    setForm((prev) => {
      const copy = [...prev[field]];
      copy[idx] = value;
      return { ...prev, [field]: copy };
    });

  const addArrayItem = (field, blank, max) =>
    setForm((prev) => {
      if (prev[field].length >= max) return prev;
      return { ...prev, [field]: [...prev[field], { ...blank }] };
    });

  const addStringArrayItem = (field, max) =>
    setForm((prev) => {
      if (prev[field].length >= max) return prev;
      return { ...prev, [field]: [...prev[field], ""] };
    });

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  // DEMO PDF flow
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      fetch("/api/matters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "name-change-hillsborough",
          email: form.email,
          data: form
        })
      }).catch(() => {});

      const res = await fetch("/api/name-change-hillsborough", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Failed to generate PDF");

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

  // LIVE CHECKOUT FLOW
  const startCheckout = async () => {
    setError("");
    setSubmitting(true);

    try {
      const matterRes = await fetch("/api/matters/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productKey: "name-change-hillsborough",
          data: form
        })
      });

      const matterJson = await matterRes.json();
      if (!matterRes.ok || !matterJson.matterId) {
        setError("Sorry, we couldn’t save your information. Please try again.");
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productKey: "name-change-hillsborough",
          pricingTier: "diy",
          matterId: matterJson.matterId
        })
      });

      const data = await res.json();
      if (res.ok && data.url) window.location.href = data.url;
      else setError("Checkout is not available right now. Please try again.");
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
          Change packet. This flow is based on Florida Supreme Court Forms
          12.982(a)/(b).
        </p>
        <p className="fine-print">
          DocuDocket is a self-help document preparation platform and is not a
          law firm. We do not provide legal advice.
        </p>
      </div>

      {!submitted && (
        <form onSubmit={handleSubmit}>
          {/* STEP 1 — Eligibility */}
          {step === 1 && (
            <div className="card">
              <h2>Step 1 of 7 – Basic eligibility</h2>

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

          {/* STEP 2 — Names + birth */}
          {step === 2 && (
            <div className="card">
              <h2>Step 2 of 7 – Current & new name</h2>

              <label>Current legal name</label>
              <div style={{ display: "grid", gap: 6, gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
                <input placeholder="First" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required />
                <input placeholder="Middle" value={form.middleName} onChange={(e) => update("middleName", e.target.value)} />
                <input placeholder="Last" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required />
                <input placeholder="Suffix" value={form.suffix} onChange={(e) => update("suffix", e.target.value)} />
              </div>

              <label>Desired new name</label>
              <div style={{ display: "grid", gap: 6, gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
                <input placeholder="First" value={form.newFirstName} onChange={(e) => update("newFirstName", e.target.value)} required />
                <input placeholder="Middle" value={form.newMiddleName} onChange={(e) => update("newMiddleName", e.target.value)} />
                <input placeholder="Last" value={form.newLastName} onChange={(e) => update("newLastName", e.target.value)} required />
                <input placeholder="Suffix" value={form.newSuffix} onChange={(e) => update("newSuffix", e.target.value)} />
              </div>

              <label>Date of birth</label>
              <input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} required />

              <label>City of birth</label>
              <input value={form.birthCity} onChange={(e) => update("birthCity", e.target.value)} />

              <label>County of birth (if known)</label>
              <input value={form.birthCounty} onChange={(e) => update("birthCounty", e.target.value)} />

              <label>State of birth</label>
              <input value={form.birthState} onChange={(e) => update("birthState", e.target.value)} />

              <label>Country of birth</label>
              <input value={form.birthCountry} onChange={(e) => update("birthCountry", e.target.value)} />

              <div style={{ marginTop: 12 }}>
                <button className="btn btn-light" type="button" onClick={back}>Back</button>
                <button className="btn btn-dark" type="button" onClick={next}>Continue</button>
              </div>
            </div>
          )}

          {/* STEP 3 — Address + prior addresses */}
          {step === 3 && (
            <div className="card">
              <h2>Step 3 of 7 – Address & contact</h2>

              <label>Street address</label>
              <input value={form.address} onChange={(e) => update("address", e.target.value)} required />

              <label>Apartment / Unit (optional)</label>
              <input value={form.address2} onChange={(e) => update("address2", e.target.value)} />

              <label>City</label>
              <input value={form.city} onChange={(e) => update("city", e.target.value)} required />

              <label>State</label>
              <input value={form.state} onChange={(e) => update("state", e.target.value)} required />

              <label>ZIP</label>
              <input value={form.zip} onChange={(e) => update("zip", e.target.value)} required />

              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />

              <label>Phone</label>
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} />

              <label>What date do you anticipate filing this packet?</label>
              <input type="date" value={form.petitionDate} onChange={(e) => update("petitionDate", e.target.value)} />

              <hr style={{ margin: "14px 0" }} />
              <h3>Addresses you’ve lived at since birth (if any)</h3>
              <p className="fine-print">
                Add up to 4 prior addresses if you’ve lived elsewhere.
              </p>

              {form.priorAddresses.map((a, i) => (
                <div key={i} style={{ border: "1px solid #eee", padding: 10, borderRadius: 8, marginBottom: 8 }}>
                  <label>Prior address #{i + 1}</label>
                  <input
                    placeholder="Street, City, State, ZIP"
                    value={a.line}
                    onChange={(e) => updateArrayItem("priorAddresses", i, "line", e.target.value)}
                  />
                  <div style={{ display: "grid", gap: 6, gridTemplateColumns: "1fr 1fr" }}>
                    <div>
                      <label>From</label>
                      <input type="date" value={a.from} onChange={(e) => updateArrayItem("priorAddresses", i, "from", e.target.value)} />
                    </div>
                    <div>
                      <label>To</label>
                      <input type="date" value={a.to} onChange={(e) => updateArrayItem("priorAddresses", i, "to", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-light"
                onClick={() => addArrayItem("priorAddresses", blankAddress, 4)}
              >
                + Add another prior address
              </button>

              <div style={{ marginTop: 12 }}>
                <button className="btn btn-light" type="button" onClick={back}>Back</button>
                <button className="btn btn-dark" type="button" onClick={next}>Continue</button>
              </div>
            </div>
          )}

          {/* STEP 4 — Marriage / Children */}
          {step === 4 && (
            <div className="card">
              <h2>Step 4 of 7 – Marital status & children</h2>

              <label>Are you currently married?</label>
              <select value={form.isMarried} onChange={(e) => update("isMarried", e.target.value)} required>
                <option value="">Select</option>
                <option value="no">No (Check Box38)</option>
                <option value="yes">Yes (Check Box39)</option>
              </select>

              {form.isMarried === "yes" && (
                <>
                  <label>Spouse’s full legal name</label>
                  <input
                    value={form.spouseFullName}
                    onChange={(e) => update("spouseFullName", e.target.value)}
                    required
                  />
                </>
              )}

              <label>Do you have any children?</label>
              <select value={form.hasChildren} onChange={(e) => update("hasChildren", e.target.value)} required>
                <option value="">Select</option>
                <option value="no">No (Check Box40)</option>
                <option value="yes">Yes (Check Box41)</option>
              </select>

              {form.hasChildren === "yes" && (
                <>
                  <p className="fine-print">
                    List each child’s name, age, and address. (Up to 5)
                  </p>
                  {form.children.map((c, i) => (
                    <input
                      key={i}
                      placeholder={`Child #${i + 1} (LAST, FIRST MI, age, address)`}
                      value={c}
                      onChange={(e) => updateStringArrayItem("children", i, e.target.value)}
                    />
                  ))}
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => addStringArrayItem("children", 5)}
                  >
                    + Add another child
                  </button>
                </>
              )}

              <div style={{ marginTop: 12 }}>
                <button className="btn btn-light" type="button" onClick={back}>Back</button>
                <button className="btn btn-dark" type="button" onClick={next}>Continue</button>
              </div>
            </div>
          )}

          {/* STEP 5 — Prior names / changes */}
          {step === 5 && (
            <div className="card">
              <h2>Step 5 of 7 – Prior names & name changes</h2>

              <label>Have you ever been known/called by another name?</label>
              <select value={form.otherNamesKnown} onChange={(e) => update("otherNamesKnown", e.target.value)} required>
                <option value="">Select</option>
                <option value="no">No (Check Box46)</option>
                <option value="yes">Yes (Check Box47)</option>
              </select>

              {form.otherNamesKnown === "yes" && (
                <>
                  <label>Other name(s) and where/when you used them</label>
                  <input value={form.otherName1} onChange={(e) => update("otherName1", e.target.value)} />
                  <input value={form.otherName2} onChange={(e) => update("otherName2", e.target.value)} />
                </>
              )}

              <label>Has your name ever been changed before (court or marriage)?</label>
              <select value={form.priorNameChange} onChange={(e) => update("priorNameChange", e.target.value)} required>
                <option value="">Select</option>
                <option value="no">No (Check Box43)</option>
                <option value="yes">Yes (Check Box44/45)</option>
              </select>

              {form.priorNameChange === "yes" && (
                <>
                  {form.prevChange.map((pc, i) => (
                    <div key={i} style={{ border: "1px solid #eee", padding: 10, borderRadius: 8, marginBottom: 8 }}>
                      <label>Previous change #{i + 1}</label>

                      <label>Changed by?</label>
                      <select
                        value={pc.type}
                        onChange={(e) => updateArrayItem("prevChange", i, "type", e.target.value)}
                        required
                      >
                        <option value="">Select</option>
                        <option value="court">Court order (Check Box44)</option>
                        <option value="marriage">Marriage (Check Box45)</option>
                      </select>

                      <input
                        placeholder="Name changed from"
                        value={pc.from}
                        onChange={(e) => updateArrayItem("prevChange", i, "from", e.target.value)}
                        required
                      />
                      <input
                        placeholder="Name changed to"
                        value={pc.to}
                        onChange={(e) => updateArrayItem("prevChange", i, "to", e.target.value)}
                        required
                      />
                      <label>Date of change</label>
                      <input
                        type="date"
                        value={pc.date}
                        onChange={(e) => updateArrayItem("prevChange", i, "date", e.target.value)}
                      />
                      <input
                        placeholder="Court city/county/state (if court order)"
                        value={pc.court}
                        onChange={(e) => updateArrayItem("prevChange", i, "court", e.target.value)}
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => addArrayItem("prevChange", blankPrevChange, 2)}
                  >
                    + Add another prior change
                  </button>
                </>
              )}

              <div style={{ marginTop: 12 }}>
                <button className="btn btn-light" type="button" onClick={back}>Back</button>
                <button className="btn btn-dark" type="button" onClick={next}>Continue</button>
              </div>
            </div>
          )}

          {/* STEP 6 — Work / business / profession / education */}
          {step === 6 && (
            <div className="card">
              <h2>Step 6 of 7 – Work, business & education</h2>

              <label>Occupation</label>
              <input value={form.occupation} onChange={(e) => update("occupation", e.target.value)} />

              <hr style={{ margin: "14px 0" }} />
              <h3>Employment history (if any)</h3>
              {form.employment.map((emp, i) => (
                <div key={i} style={{ border: "1px solid #eee", padding: 10, borderRadius: 8, marginBottom: 8 }}>
                  <label>Employer #{i + 1} (name + address)</label>
                  <input
                    value={emp.employer}
                    onChange={(e) => updateArrayItem("employment", i, "employer", e.target.value)}
                  />
                  <div style={{ display: "grid", gap: 6, gridTemplateColumns: "1fr 1fr" }}>
                    <div>
                      <label>From</label>
                      <input type="date" value={emp.from} onChange={(e) => updateArrayItem("employment", i, "from", e.target.value)} />
                    </div>
                    <div>
                      <label>To</label>
                      <input type="date" value={emp.to} onChange={(e) => updateArrayItem("employment", i, "to", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-light" onClick={() => addArrayItem("employment", blankEmployment, 2)}>
                + Add another employer
              </button>

              <hr style={{ margin: "14px 0" }} />
              <label>Do you own and operate a business?</label>
              <select value={form.ownsBusiness} onChange={(e) => update("ownsBusiness", e.target.value)} required>
                <option value="">Select</option>
                <option value="no">No (Check Box49)</option>
                <option value="yes">Yes (Check Box50)</option>
              </select>

              {form.ownsBusiness === "yes" && (
                <>
                  <label>Business street address</label>
                  <input value={form.businessAddress} onChange={(e) => update("businessAddress", e.target.value)} />
                  <label>Your position with the business</label>
                  <input value={form.businessPosition} onChange={(e) => update("businessPosition", e.target.value)} />
                  <label>Date you’ve been involved with the business since</label>
                  <input type="date" value={form.businessSince} onChange={(e) => update("businessSince", e.target.value)} />
                </>
              )}

              <hr style={{ margin: "14px 0" }} />
              <label>Are you in a profession that requires licensing?</label>
              <select value={form.inProfession} onChange={(e) => update("inProfession", e.target.value)} required>
                <option value="">Select</option>
                <option value="no">No (Check Box51)</option>
                <option value="yes">Yes (Check Box52)</option>
              </select>

              {form.inProfession === "yes" && (
                <>
                  <p className="fine-print">List professions practiced (up to 5)</p>
                  {form.professions.map((p, i) => (
                    <input
                      key={i}
                      placeholder={`Profession #${i + 1}`}
                      value={p}
                      onChange={(e) => updateStringArrayItem("professions", i, e.target.value)}
                    />
                  ))}
                  <button type="button" className="btn btn-light" onClick={() => addStringArrayItem("professions", 5)}>
                    + Add another profession
                  </button>
                </>
              )}

              <hr style={{ margin: "14px 0" }} />
              <h3>Education / degrees (if any)</h3>
              {form.education.map((ed, i) => (
                <div key={i} style={{ border: "1px solid #eee", padding: 10, borderRadius: 8, marginBottom: 8 }}>
                  <label>School #{i + 1}</label>
                  <input value={ed.school} onChange={(e) => updateArrayItem("education", i, "school", e.target.value)} />
                  <label>Degree received</label>
                  <input value={ed.degree} onChange={(e) => updateArrayItem("education", i, "degree", e.target.value)} />
                  <label>Date of graduation</label>
                  <input type="date" value={ed.graduation} onChange={(e) => updateArrayItem("education", i, "graduation", e.target.value)} />
                </div>
              ))}
              <button type="button" className="btn btn-light" onClick={() => addArrayItem("education", blankEducation, 3)}>
                + Add another degree/school
              </button>

              <div style={{ marginTop: 12 }}>
                <button className="btn btn-light" type="button" onClick={back}>Back</button>
                <button className="btn btn-dark" type="button" onClick={next}>Continue</button>
              </div>
            </div>
          )}

          {/* STEP 7 — Legal background */}
          {step === 7 && (
            <div className="card">
              <h2>Step 7 of 7 – Legal background</h2>

              <label>Have you ever been convicted of a felony or have criminal history?</label>
              <select value={form.hasFelony} onChange={(e) => update("hasFelony", e.target.value)} required>
                <option value="">Select</option>
                <option value="no">No (Check Box55)</option>
                <option value="yes">Yes (Check Box56)</option>
              </select>

              {form.hasFelony === "yes" && (
                <>
                  <p className="fine-print">List up to 3 events: arrest/charge/plea/adjudication</p>
                  {form.criminalEvents.map((ce, i) => (
                    <div key={i} style={{ border: "1px solid #eee", padding: 10, borderRadius: 8, marginBottom: 8 }}>
                      <input
                        placeholder="Event details"
                        value={ce.event}
                        onChange={(e) => updateArrayItem("criminalEvents", i, "event", e.target.value)}
                      />
                      <label>Date</label>
                      <input
                        type="date"
                        value={ce.date}
                        onChange={(e) => updateArrayItem("criminalEvents", i, "date", e.target.value)}
                      />
                      <input
                        placeholder="City/State"
                        value={ce.cityState}
                        onChange={(e) => updateArrayItem("criminalEvents", i, "cityState", e.target.value)}
                      />
                    </div>
                  ))}
                  <button type="button" className="btn btn-light" onClick={() => addArrayItem("criminalEvents", blankCrime, 3)}>
                    + Add another event
                  </button>
                </>
              )}

              <label>Are you required to register as a sexual offender/predator?</label>
              <select value={form.isSexOffender} onChange={(e) => update("isSexOffender", e.target.value)} required>
                <option value="">Select</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>

              <label>Have you ever had to register under 775.21 (sexual predator)?</label>
              <select value={form.sexPred77521} onChange={(e) => update("sexPred77521", e.target.value)} required>
                <option value="">Select</option>
                <option value="no">No (Check Box59)</option>
                <option value="yes">Yes (Check Box58)</option>
              </select>

              <label>Have you ever had to register under 943.0435 (sexual offender)?</label>
              <select value={form.sexPred9430435} onChange={(e) => update("sexPred9430435", e.target.value)} required>
                <option value="">Select</option>
                <option value="no">No (Check Box61)</option>
                <option value="yes">Yes (Check Box60)</option>
              </select>

              <label>Are you currently in bankruptcy?</label>
              <select value={form.hasBankruptcy} onChange={(e) => update("hasBankruptcy", e.target.value)} required>
                <option value="">Select</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>

              <label>Have you ever been adjudicated bankrupt?</label>
              <select value={form.adjudicatedBankrupt} onChange={(e) => update("adjudicatedBankrupt", e.target.value)} required>
                <option value="">Select</option>
                <option value="no">No (Check Box62)</option>
                <option value="yes">Yes (Check Box63)</option>
              </select>

              {form.adjudicatedBankrupt === "yes" && (
                <>
                  <label>Date adjudicated bankrupt</label>
                  <input type="date" value={form.bankruptcyDate} onChange={(e) => update("bankruptcyDate", e.target.value)} />
                  <label>City</label>
                  <input value={form.bankruptcyCity} onChange={(e) => update("bankruptcyCity", e.target.value)} />
                  <label>County</label>
                  <input value={form.bankruptcyCounty} onChange={(e) => update("bankruptcyCounty", e.target.value)} />
                  <label>State</label>
                  <input value={form.bankruptcyState} onChange={(e) => update("bankruptcyState", e.target.value)} />
                </>
              )}

              <label>Do you have any money judgments against you?</label>
              <select value={form.hasJudgments} onChange={(e) => update("hasJudgments", e.target.value)} required>
                <option value="">Select</option>
                <option value="no">No (Check Box65)</option>
                <option value="yes">Yes (Check Box66)</option>
              </select>

              {form.hasJudgments === "yes" && (
                <>
                  <p className="fine-print">List up to 4 judgments</p>
                  {form.judgments.map((j, i) => (
                    <div key={i} style={{ border: "1px solid #eee", padding: 10, borderRadius: 8, marginBottom: 8 }}>
                      <label>Judgment #{i + 1}</label>
                      <input
                        placeholder="Amount"
                        value={j.amount}
                        onChange={(e) => updateArrayItem("judgments", i, "amount", e.target.value)}
                      />
                      <input
                        placeholder="Creditor"
                        value={j.creditor}
                        onChange={(e) => updateArrayItem("judgments", i, "creditor", e.target.value)}
                      />
                      <input
                        placeholder="Court/case #/status/date paid"
                        value={j.details}
                        onChange={(e) => updateArrayItem("judgments", i, "details", e.target.value)}
                      />
                    </div>
                  ))}
                  <button type="button" className="btn btn-light" onClick={() => addArrayItem("judgments", blankJudgment, 4)}>
                    + Add another judgment
                  </button>
                </>
              )}

              <label>Any pending criminal or civil cases?</label>
              <select value={form.pendingCases} onChange={(e) => update("pendingCases", e.target.value)} required>
                <option value="">Select</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>

              <label>Reason for name change</label>
              <textarea
                rows={3}
                value={form.reason}
                onChange={(e) => update("reason", e.target.value)}
                required
              />

              <div style={{ marginTop: 12 }}>
                <button className="btn btn-light" type="button" onClick={back}>Back</button>
                <button className="btn btn-dark" type="button" onClick={next}>Continue</button>
              </div>
            </div>
          )}

          {/* FINAL — Generate / Checkout */}
          {step === 8 && (
            <div className="card">
              <h2>Final Step – Generate your packet</h2>
              <p>
                Option 1: download a PDF summary of your answers (demo mode).<br />
                Option 2: continue to secure checkout.
              </p>

              {error && <p className="danger">{error}</p>}

              <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="btn btn-light" type="button" onClick={back}>
                  Back
                </button>
                <button className="btn btn-dark" type="submit" disabled={submitting}>
                  {submitting ? "Generating..." : "Finish & download PDF (demo)"}
                </button>
                <button className="btn btn-light" type="button" onClick={startCheckout} disabled={submitting}>
                  {submitting ? "Redirecting..." : "Continue to secure checkout"}
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
            Your PDF summary has been generated. In the live product, this
            expands into full clerk-ready forms.
          </p>
          <Link href="/" className="cta-secondary">
            ← Back to home
          </Link>
        </div>
      )}
    </main>
  );
}
