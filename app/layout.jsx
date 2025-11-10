import "./styles/globals.css";

export const metadata = {
  title: "DocuDocket – Clerk-Ready Legal Packets",
  description: "Court-ready Florida forms in under an hour.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}
