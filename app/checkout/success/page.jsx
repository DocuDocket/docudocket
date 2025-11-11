import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main>
      <div className="card">
        <h1>Payment received</h1>
        <p>
          Thank you for using DocuDocket. Your payment was successful.
        </p>
        <p>
          In the full version, this page will:
        </p>
        <ul>
          <li>Confirm your matter details</li>
          <li>Provide direct links to your generated packet PDFs</li>
          <li>Email you copies of your documents and filing steps</li>
        </ul>
        <p className="fine-print">
          For now, this is a test environment. Do not rely on this demo for
          actual court filings.
        </p>
        <Link href="/" className="cta-secondary">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
