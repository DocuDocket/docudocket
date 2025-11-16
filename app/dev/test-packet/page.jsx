"use client";

export default function TestPacket() {
  async function run(e) {
    e.preventDefault();

    // 1) Build the request body (matterId set to TEST-BYPASS)
    const body = {
      productKey: "name-change-hillsborough",
      matterId: "TEST-BYPASS",
      data: {
        firstName: "JANE", middleName: "A", lastName: "DOE",
        newFirstName: "JANE", newMiddleName: "", newLastName: "SMITH",
        dob: "1990-05-12",
        birthCity: "Miami", birthCounty: "Miami-Dade", birthState: "FL", birthCountry: "USA",
        county: "Hillsborough",
        address: "123 Main St", address1: "123 Main St", address2: "Apt 4B",
        city: "Tampa", state: "FL", zip: "33602",
        phone: "(813) 555-1212", email: "jane@example.com",
        priorAddresses: [{ line: "45 Oak Ave, Tampa FL 33603", from: "2018-01-01", to: "2020-06-01" }],
        children: ["DOE, JUNIOR J, 8, 123 Main St, Tampa, FL"],
        employment: [{ employer: "ABC Co., 456 Office Rd, Tampa FL", from: "2019-01-01", to: "2022-03-01" }],
        education: [{ school: "USF", degree: "B.A.", graduation: "2015-05-01" }],
        petitionDate: new Date().toISOString()
      }
    };

    // 2) POST to the endpoint
    const res = await fetch("/api/pdf/build", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(`Build failed: ${res.status} ${JSON.stringify(err)}`);
      return;
    }

    // 3) Download the PDF that comes back
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "DocuDocket_name-change-test.pdf";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Generate Test Packet</h1>
      <p>This calls <code>/api/pdf/build</code> with <code>matterId="TEST-BYPASS"</code>.</p>
      <button onClick={run}>Generate PDF</button>
    </main>
  );
}