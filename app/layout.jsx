// app/layout.jsx
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "DocuDocket – Guided Florida Legal Document Prep",
  description:
    "DocuDocket helps self-represented people generate guided, clerk-ready Florida court packets for Hillsborough County.",
  // Social previews
  openGraph: {
    title: "DocuDocket – Guided Florida Legal Document Prep",
    description:
      "Answer friendly questions → get organized, clerk-ready packets for Florida filings.",
    url: "https://docudocket.com",
    siteName: "DocuDocket",
    images: ["/opengraph-image.png"], // add this file in /app
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "DocuDocket – Guided Florida Legal Document Prep",
    description:
      "Answer friendly questions → get organized, clerk-ready packets for Florida filings.",
    images: ["/twitter-image.png"] // add this file in /app
  },
  icons: {
    icon: "/icon.png" // add this file in /app
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <Link href="/" className="logo">
              <Image
                src="/brand/docudocket-badge.png"
                alt="DocuDocket shield logo"
                width={28}
                height={28}
                className="logo-img"
                priority
              />
              <div className="logo-text">
                <div className="logo-title">DocuDocket</div>
                <div className="logo-subtitle">Guided legal document prep</div>
              </div>
            </Link>
            <nav className="nav-links">
              <Link href="/#pricing">Pricing</Link>
              <Link href="/eligibility">Start eligibility</Link>
              <Link href="/hillsborough/name-change/adult">Name Change</Link>
              <Link href="/hillsborough/dissolution/simplified">Simplified Divorce</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
