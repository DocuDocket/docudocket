import Link from "next/link";

export default function CheckoutSuccessPage({ searchParams }) {
  const matterId = searchParams?.matterId;
  const product = searchParams?.product;

  return (
    <main>
      <div className="card">
        <h1>Payment received (test mode)</h1>
        {product && (
          <p>
            Packet: <strong>{product}</strong>
          </p>
        )}
        {matterId && (
          <p>
            Reference ID for your submission:{" "}
            <code>{matterId}</code>
          </p>
        )}
        <p>
          In the full version of DocuDocket, this page will:
        </p>
        <ul>
          <li>Confirm your payment</li>
          <li>Attach your completed forms to this reference ID</li>
          <li>Email you secure links to download your packet</li>
        </ul>
        <p className="fine-print">
          This environment is for testing and demos only. Do not rely on these
          outputs for real court filings yet.
        </p>
        <Link href="/" className="cta-secondary">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
