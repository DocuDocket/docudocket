// app/layout.jsx
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "DocuDocket – Guided Florida Legal Document Prep",
  description:
    "DocuDocket helps self-represented people generate guided, clerk-ready Florida court packets for matters like adult name changes and simplified dissolution of marriage."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <Link href="/" className="logo">
              <div className="logo-mark">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="dd-grad"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#14B8A6" />
                      <stop offset="100%" stopColor="#38BDF8" />
                    </linearGradient>
                  </defs>
                  {/* Rounded square background */}
                  <rect
                    x="1"
                    y="1"
                    width="20"
                    height="20"
                    rx="7"
                    fill="url(#dd-grad)"
                  />
                  {/* Document shape */}
                  <path
                    d="M7 6.5h5.2c0.5 0 0.8 0.1 1.1 0.4l1.7 1.7c0.3 0.3 0.5 0.6 0.5 1.1V15
                       c0 0.8-0.6 1.4-1.4 1.4H7c-0.8 0-1.4-0.6-1.4-1.4V7.9C5.6 7.1 6.2 6.5 7 6.5Z"
                    fill="#0F172A"
                    fillOpacity="0.96"
                  />
                  {/* Document fold hint */}
                  <path
                    d="M12.2 6.5v1.6c0 0.6 0.4 1 1 1h1.7"
                    stroke="#14B8A6"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />
                  {/* Checkmark */}
                  <path
                    d="M8.1 12.1l1.6 1.7 3-3.4"
                    stroke="#F9FAFB"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="logo-text">
                <div className="logo-title">DocuDocket</div>
                <div className="logo-subtitle">
                  Guided legal document prep
                </div>
              </div>
            </Link>
            <nav className="nav-links">
              <Link href="/#pricing">Pricing</Link>
              <Link href="/eligibility">Start eligibility</Link>
              <Link href="/hillsborough/name-change/adult">
                Name Change
              </Link>
              <Link href="/hillsborough/dissolution/simplified">
                Simplified Divorce
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
