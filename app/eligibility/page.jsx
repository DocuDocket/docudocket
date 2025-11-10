"use client";

import { useState } from "react";

export default function EligibilityPage() {
  const [matter, setMatter] = useState("name-change");
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const update = (key, value) =>
    setAnswers((a) => ({ ...a, [key]: value }));

  const check = async () => {
    const res = await fetch("/api/eligibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matter, answers }),
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <main>
      <h1>Quick eligibility check</h1>
      <p>This tool helps you see if our guided packets may be a fit.</p>

      <div className="card">
        <label>What do you need help with?</label>
        <select
          value={matter}
          onChange={(e) => {
            setMatter(e.target.value);
            setAnswers({});
            setResult(null);
          }}
        >
          <option value="name-change">Adult Name Change (Hillsborough)</option>
          <option value="simplified-divorce">
            Simplified Dissolution of Marriage (Hillsborough)
          </option>
        </select>
      </div>

      {matter === "name-change" && (
        <div className="card">
          <label>Are you 18 or older?</label>
          <select onChange={(e) => update("age18", e.target.value)}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>

          <label>Do you currently live in Hillsborough County, Florida?</label>
          <select onChange={(e) => update("county_resident", e.target.value)}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>

          <label>
            Is your reason lawful and not to avoid creditors or law enforcement?
          </label>
          <select onChange={(e) => update("lawful_reason", e.target.value)}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      )}

      {matter === "simplified-divorce" && (
        <div className="card">
          <label>
            Has either spouse lived in Florida for at least 6 months?
          </label>
          <select onChange={(e) => update("residency", e.target.value)}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>

          <label>No minor/dependent children together and not pregnant?</label>
          <select onChange={(e) => update("no_children", e.target.value)}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>

          <label>
            You both agree on everything and do not want alimony?
          </label>
          <select
            onChange={(e) => update("agree_no_alimony", e.target.value)}
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>

          <label>
            You both will sign the petition and attend the final hearing?
          </label>
          <select onChange={(e) => update("both_attend", e.target.value)}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      )}

      <button className="btn btn-dark" onClick={check}>
        Check eligibility
      </button>

      {result && (
        <div className="card" style={{ marginTop: 16 }}>
          <h2>{result.ok ? "Looks promising ✅" : "Heads up ⚠️"}</h2>
          <p>{result.message}</p>
          {result.ok && (
            <p className="pill">
              Next step (coming soon): start the full DocuDocket guided packet.
            </p>
          )}
        </div>
      )}
    </main>
  );
}
