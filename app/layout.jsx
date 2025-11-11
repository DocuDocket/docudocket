// app/layout.jsx
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "DocuDocket – Guided Florida Legal Document Prep",
  description:
    "DocuDocket helps self-represented people generate clerk-ready Florida court packets with clear, guided questions."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <Link href="/" className="logo">
              <div className="logo-mark">D</div>
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
        {children}
      </body>
    </html>
  );
}
