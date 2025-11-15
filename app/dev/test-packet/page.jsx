"use client";

export default function TestPacket() {
  const run = async () => {
    const res = await fetch("/api/pdf/build", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productKey: "name-change-hillsborough",
        matterId: "TEST-BYPASS", // see Option A step 2 below
        data: {
          // minimal sane test data (matches our mapping)
          firstName: "JANE", middleName: "A", lastName: "DOE",
          newFirstName: "JANE", newMiddleName: "", newLastName: "SMITH",
          dob: "1990-05-12",
          birthCity: "Miami", birthCounty: "Miami-Dade", birthState: "FL", birthCountry: "USA",
          county: "Hillsborough",
          address: "123 Main St", address1: "123 Main St", address2: "Apt 4B",
          city: "Tampa", state: "FL", zip: "33602",
          phone: "(813) 555-1212", email: "jane@example.com",
          priorAddresses: [
            { line: "45 Oak Ave, Tampa FL 33603", from: "2018-01-01", to: "2020-06-01" }
          ],
          children: ["DOE, JUNIOR J, 8, 123 Main St, Tampa, FL"],
          prevChange: [{ from: "", to: "", date: "", court: "" }],
          employment: [{ employer: "ABC Co., 456 Office Rd, Tampa FL", from: "2019-01-01", to: "2022-03-01" }],
          education: [{ school: "USF", degree: "B.A.", graduation: "2015-05-01" }],
          petitionDate: new Date().toISOString()
        }
      })
    });
    if (!res.ok) { alert("Build failed"); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "DocuDocket_name-change-test.pdf"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main style={{padding:24}}>
      <h1>Test Packet – Name Change</h1>
      <p>Click to generate a test PDF packet from server templates.</p>
      <button onClick={run} className="btn btn-dark">Generate Test Packet</button>
    </main>
  );
}