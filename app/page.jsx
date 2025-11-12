"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="section-label">Hillsborough County · Florida</div>
            <h1>Guided legal documents without the law firm price.</h1>
            <p className="hero-subtitle">
              DocuDocket walks you through court-approved packets for Adult
              Name Change and Simplified Dissolution of Marriage in
              Hillsborough County—step by step, in plain English.
            </p>

            <div className="hero-actions">
              <Link href="/eligibility" className="btn btn-dark">
                Start eligibility in 2 minutes
              </Link>
              <Link
                href="/hillsborough/name-change/adult"
                className="btn btn-light"
              >
                Explore name change packets
              </Link>
            </div>

            <p className="hero-note">
              Secure checkout with Stripe. You only pay when you&apos;re ready to
              generate your packet.
            </p>

            <div className="trust-row">
              <div className="trust-pill">✓ Not a law firm · No legal advice</div>
              <div className="trust-pill">✓ Uses official Florida form sets</div>
              <div className="trust-pill">✓ Built for self-represented filers</div>
            </div>
          </div>

          <div className="hero-media">
            {/* Hero image — add file in /public/hero-docudocket.jpg */}
            <div className="hero-img-wrap">
              <img
                src="/hero-docudocket.jpg"
                alt="Person completing legal documents online with guidance"
                className="hero-img"
              />
              <div className="hero-overlay-card">
                <div className="hero-overlay-label">Live preview</div>
                <div className="hero-overlay-text">
                  Guided questions →
                  <br />
                  Clean, court-ready packet.
                </div>
              </div>
            </div>
            <div className="hero-mini">
              <img
                src="/advisor-docudocket.jpg"
                alt="Friendly professional ready to help"
                className="hero-mini-img"
              />
              <div className="hero-mini-text">
                <div className="hero-mini-title">
                  Real humans behind the workflow.
                </div>
                <div className="hero-mini-sub">
                  Clear instructions &amp; support-focused experience.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="card">
        <div className="section-label">How DocuDocket works</div>
        <div className="how-steps">
          <div className="step-item">
            <div className="step-number">1</div>
            <h3>Answer friendly questions</h3>
            <p>
              No legalese. We translate Hillsborough County packet requirements
              into plain language you can answer in minutes.
            </p>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <h3>We structure your packet</h3>
            <p>
              Your answers are organized to align with Florida Supreme Court
              forms and local filing expectations.
            </p>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <h3>Download and file with confidence</h3>
            <p>
              You receive a polished packet summary to guide completion of
              the official forms and filing with the clerk.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED PACKETS */}
      <section className="card">
        <div className="section-label">Start in Hillsborough County</div>
        <div className="grid">
          <div className="packet">
            <h3>
              <Link href="/hillsborough/name-change/adult">
                Adult Name Change Packet
              </Link>
            </h3>
            <p>
              Ideal for adults seeking a lawful name change in Hillsborough
              County, Florida.
            </p>
            <ul className="packet-list">
              <li>Guided eligibility screening</li>
              <li>Organized info for Forms 12.982(a)/(b)</li>
              <li>Downloadable summary PDF</li>
            </ul>
            <div className="packet-footer">
              <span className="price-tag">Starting at $79</span>
              <Link href="/hillsborough/name-change/adult" className="btn btn-light">
                Start packet
              </Link>
            </div>
          </div>

          <div className="packet">
            <h3>
              <Link href="/hillsborough/dissolution/simplified">
                Simplified Dissolution of Marriage
              </Link>
            </h3>
            <p>
              For couples who qualify for Florida&apos;s simplified divorce
              procedure and are filing in Hillsborough.
            </p>
            <ul className="packet-list">
              <li>Step-by-step intake for both spouses</li>
              <li>Property &amp; debt summary builder</li>
              <li>Downloadable summary PDF</li>
            </ul>
            <div className="packet-footer">
              <span className="price-tag">Starting at $99</span>
              <Link
                href="/hillsborough/dissolution/simplified"
                className="btn btn-light"
              >
                Start packet
              </Link>
            </div>
          </div>

          <div className="packet">
            <h3>More packets coming soon</h3>
            <p>
              Evictions, small claims, and additional family law workflows
              tailored to Florida counties.
            </p>
            <ul className="packet-list">
              <li>County-specific requirements</li>
              <li>Smart, guided questionnaires</li>
              <li>Transparent flat pricing</li>
            </ul>
            <div className="packet-footer">
              <span className="badge">Early access</span>
              <a href="mailto:support@docudocket.com" className="btn btn-light">
                Join interest list
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO / SOCIAL PROOF */}
      <section className="card">
        <div className="section-label">See it in action</div>
        <div className="video-layout">
          <div className="video-placeholder">
            {/* Replace this block with an actual embed (Loom, YouTube, etc.) later */}
            <div className="video-label">Walkthrough demo</div>
            <p>
              Watch a DocuDocket guide walk through an Adult Name Change packet
              from first question to download.
            </p>
            <div className="video-box">Video coming soon</div>
          </div>
          <div className="video-copy">
            <h3>Built to feel like a paralegal is sitting next to you.</h3>
            <p>
              Our flows are designed from real-world filing checklists so users
              know what to expect at each step: fees, fingerprints, hearings,
              and required IDs.
            </p>
            <p className="fine-print">
              DocuDocket is not a law firm and does not provide legal advice.
              We help you get organized so your filing goes smoother.
            </p>
          </div>
        </div>
      </section>

      {/* SIMPLE FOOTER */}
      <section className="footer-lite">
        <div>© {new Date().getFullYear()} DocuDocket LLC. All rights reserved.</div>
        <div className="footer-links">
          <span>Not a law firm. No attorney-client relationship.</span>
          <a href="mailto:support@docudocket.com">Contact support</a>
        </div>
      </section>
    </>
  );
}