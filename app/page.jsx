import Link from "next/link";

export default function Page() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <h1>DocuDocket</h1>
          <p className="hero-subtitle">
            Clerk-ready Florida court forms in under an hour.
            Guided, accurate, and built for people without lawyers.
          </p>
          <div className="hero-actions">
            <Link href="/eligibility" className="btn btn-dark">
              Start free eligibility check
            </Link>
            <a href="#pricing" className="hero-link">
              View pricing &amp; packets
            </a>
          </div>
          <p className="hero-note">
            Launching with Hillsborough County • Adult Name Change &amp;
            Simplified Dissolution of Marriage
          </p>
        </div>
      </section>

      <section className="card">
        <h2>What DocuDocket does</h2>
        <p>
          We turn confusing court packets into a clear step-by-step interview.
          You answer in plain English, we generate organized PDFs that match
          Hillsborough County and Florida Supreme Court requirements.
        </p>
        <div className="pill-row">
          <span className="pill">No retainers</span>
          <span className="pill">No hourly fees</span>
          <span className="pill">Built for pro se filers</span>
        </div>
      </section>

      <section className="card">
        <h2>Packets we support (MVP)</h2>
        <div className="grid">
          <div className="packet">
            <h3>
              <Link href="/hillsborough/name-change/adult">
                Adult Name Change – Hillsborough County
              </Link>
            </h3>
            <p>Based on Florida Form 12.982(a)/(b).</p>
            <ul>
              <li>Guided eligibility and questions</li>
              <li>FDLE fingerprint checklist</li>
              <li>Clerk-ready packet summary</li>
            </ul>
          </div>
          <div className="packet">
            <h3>
              <Link href="/hillsborough/dissolution/simplified">
                Simplified Dissolution of Marriage – Hillsborough County
              </Link>
            </h3>
            <p>Based on Florida Simplified Dissolution procedure.</p>
            <ul>
              <li>Eligibility gating</li>
              <li>Joint petition details</li>
              <li>Final hearing checklist</li>
            </ul>
          </div>
          <div className="packet">
            <h3>More coming soon</h3>
            <p>No-kids divorce, minor name change, and response packets.</p>
            <ul>
              <li>Same guided experience</li>
              <li>Same clerk-first standards</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="pricing" className="card">
        <h2>Simple, upfront pricing</h2>
        <div className="grid">
          <div className="price-card">
            <h3>$79</h3>
            <p>Adult Name Change packet</p>
            <ul>
              <li>Guided interview</li>
              <li>Auto-filled structure</li>
              <li>Hillsborough checklist</li>
            </ul>
          </div>
          <div className="price-card">
            <h3>$99</h3>
            <p>Simplified Dissolution packet</p>
            <ul>
              <li>Eligibility check</li>
              <li>Core forms &amp; terms captured</li>
              <li>Filing steps overview</li>
            </ul>
          </div>
          <div className="price-card">
            <h3>$149</h3>
            <p>Docs + Filing Assistant</p>
            <ul>
              <li>Named &amp; ordered PDFs</li>
              <li>Reminder emails</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Important</h2>
        <p className="fine-print">
          DocuDocket is a self-help document preparation platform and is not a
          law firm. We do not provide legal advice or representation. You are
          responsible for reviewing your documents and deciding how to proceed.
        </p>
      </section>
    </main>
  );
}
