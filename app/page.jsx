import Link from "next/link";

export default function Page() {
  return (
    <main>
      <h1>Court-ready Florida forms in under an hour</h1>
      <p>
        DocuDocket guides you step-by-step to create clerk-ready packets you can
        e-file or bring to the courthouse yourself.
      </p>

      <div style={{ margin: "16px 0" }}>
        <Link href="/eligibility" className="cta-primary">
          Start free eligibility check
        </Link>
        <Link href="#pricing" className="cta-secondary">
          View pricing
        </Link>
      </div>

      <div className="card">
        <h2>Matters we support (MVP)</h2>
        <ul>
          <li>Adult Name Change – Hillsborough County</li>
          <li>Simplified Dissolution of Marriage – Hillsborough County</li>
        </ul>
      </div>

      <div id="pricing" className="card">
        <h2>Simple pricing</h2>
        <div className="grid">
          <div>
            <h3>DIY Docs — $79</h3>
            <p>Adult Name Change</p>
          </div>
          <div>
            <h3>DIY Docs — $99</h3>
            <p>Simplified Divorce</p>
          </div>
          <div>
            <h3>DIY + Filing Assistant — $149</h3>
            <p>Guided steps + named PDFs + reminders.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>How it works</h2>
        <ol>
          <li>Answer a short eligibility check.</li>
          <li>Complete a guided interview in plain English.</li>
          <li>Pay securely.</li>
          <li>Download your packet and filing checklist.</li>
        </ol>
      </div>

      <div className="card">
        <h2>Important</h2>
        <p>
          DocuDocket is a self-help document service. We are not attorneys and do
          not provide legal advice.
        </p>
      </div>
    </main>
  );
}
