// lib/forms.js
// Registry of packets, their template PDFs, and field maps.
// NOTE: All template paths are RELATIVE (no leading slash) for fs reads on Vercel.

/* ---------- helpers ---------- */
const fmtDate = (s) => {
  if (!s) return "";
  if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(s)) return s; // already MM/DD/YYYY
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return String(s);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};
const fullName = (d, keys) =>
  keys.map((k) => (d?.[k] || "").trim()).filter(Boolean).join(" ");
const currentFull = (d) => fullName(d, ["firstName", "middleName", "lastName"]);
const requestedFull = (d) =>
  fullName(d, ["newFirstName", "newMiddleName", "newLastName"]);
const cityStateZip = (d) =>
  [d?.city, d?.state, d?.zip].filter(Boolean).join(", ");

/* ---------- registry ---------- */
export const PACKETS = {
  "name-change-hillsborough": {
    title: "Adult Name Change – Hillsborough",
    files: [
      { id: "12-928-cover",        path: "templates/hillsborough/name-change-adult/12-928-cover.pdf" },
      { id: "12-982a-petition",    path: "templates/hillsborough/name-change-adult/12-982a-petition.pdf" },
      // NOTE underscore here matches what's on the server
      { id: "12-982b-judgment",    path: "templates/hillsborough/name-change-adult/12-982b_final-judgment.pdf" },
{
  id: "12-900h-related",
  path: "templates/hillsborough/name-change-adult/12-900h-related-cases.pdf",
  include: () => false // exclude for MVP launch
},
      { id: "12-915-address",      path: "templates/hillsborough/name-change-adult/12-915-address-email.pdf" },
      { id: "dh-427-report",       path: "templates/hillsborough/name-change-adult/dh-427-report.pdf" }
    ],
    fields: {
      /* --- 12-982(a) Petition: field mapping --- */
      "12-982a-petition": {
        // Caption
        "Judicial Circuit": (d) => d.judicialCircuit || "13th",
        "County Name":      (d) => d.county || "Hillsborough",
        "Case Number":      () => "", // Clerk fills
        "Division":         () => "Family",

        // Identity
        "Petitioner":               (d) => currentFull(d),
        "Full Legal Name":          (d) => currentFull(d),
        "Complete present name":    (d) => currentFull(d),
        "Requested name":           (d) => requestedFull(d),

        // Residency / address
        "County in Florida":        (d) => d.county || "Hillsborough",
        "Street address":           (d) => d.address1 || d.address || "",
        "Street address continued": (d) => d.address2 || "",

        // Birth info
        "Date of birth":    (d) => fmtDate(d.dob),
        "City of birth":    (d) => d.birthCity || "",
        "County of birth":  (d) => d.birthCounty || "",
        "State of birth":   (d) => d.birthState || "FL",
        "Country of birth": (d) => d.birthCountry || "USA",

        // Prior addresses (optional arrays) — priorAddresses: [{line, from, to}, ...]
        "Following address": (d) => d.priorAddresses?.[0]?.line || "",
        "Date from":         (d) => d.priorAddresses?.[0]?.from ? fmtDate(d.priorAddresses[0].from) : "",
        "Date to":           (d) => d.priorAddresses?.[0]?.to ? fmtDate(d.priorAddresses[0].to) : "",

        "Following address 2": (d) => d.priorAddresses?.[1]?.line || "",
        "Date from 2":         (d) => d.priorAddresses?.[1]?.from ? fmtDate(d.priorAddresses[1].from) : "",
        "Date to 2":           (d) => d.priorAddresses?.[1]?.to ? fmtDate(d.priorAddresses[1].to) : "",

        "Following address 3": (d) => d.priorAddresses?.[2]?.line || "",
        "Date from 3":         (d) => d.priorAddresses?.[2]?.from ? fmtDate(d.priorAddresses[2].from) : "",
        "Date to 3":           (d) => d.priorAddresses?.[2]?.to ? fmtDate(d.priorAddresses[2].to) : "",

        "Following address 4": (d) => d.priorAddresses?.[3]?.line || "",
        "Date from 4":         (d) => d.priorAddresses?.[3]?.from ? fmtDate(d.priorAddresses[3].from) : "",
        "Date to 4":           (d) => d.priorAddresses?.[3]?.to ? fmtDate(d.priorAddresses[3].to) : "",

        // Spouse & children
        "Spouse's full legal name": (d) => d.spouseFullName || "",
        // children: ["LAST, FIRST MI, Age, Address, City, State", ...]
        "Name (last first middle initial), Age, Address, City, State":   (d) => d.children?.[0] || "",
        "Name (last first middle initial), Age, Address, City, State 2": (d) => d.children?.[1] || "",
        "Name (last first middle initial), Age, Address, City, State 3": (d) => d.children?.[2] || "",
        "Name (last first middle initial), Age, Address, City, State 4": (d) => d.children?.[3] || "",
        "Name (last first middle initial), Age, Address, City, State 5": (d) => d.children?.[4] || "",

        // Prior court-ordered name changes — prevChange: [{from, to, date, court}, ...]
        "Name previously changed from":        (d) => d.prevChange?.[0]?.from || "",
        "Name changed to":                     (d) => d.prevChange?.[0]?.to || "",
        "Date name changed by court order":    (d) => d.prevChange?.[0]?.date ? fmtDate(d.prevChange[0].date) : "",
        "By court city and state":             (d) => d.prevChange?.[0]?.court || "",

        "Name previously changed from 2":      (d) => d.prevChange?.[1]?.from || "",
        "Name changed to 2":                   (d) => d.prevChange?.[1]?.to || "",
        "On date":                             (d) => d.prevChange?.[1]?.date ? fmtDate(d.prevChange[1].date) : "",
        "in city county and state":            (d) => d.prevChange?.[1]?.court || "",

        // Employment — employment: [{employer, from, to}, ...]
        "Occupation":                          (d) => d.occupation || "",
        "Company and address of employment":   (d) => d.employment?.[0]?.employer || "",
        "Date from 5":                         (d) => d.employment?.[0]?.from ? fmtDate(d.employment[0].from) : "",
        "Date to 5":                           (d) => d.employment?.[0]?.to ? fmtDate(d.employment[0].to) : "",
        "Company and address of employment 2": (d) => d.employment?.[1]?.employer || "",
        "Date from 6":                         (d) => d.employment?.[1]?.from ? fmtDate(d.employment[1].from) : "",
        "Date to 6":                           (d) => d.employment?.[1]?.to ? fmtDate(d.employment[1].to) : "",

        // Education — education: [{school, degree, graduation}, ...]
        "School":               (d) => d.education?.[0]?.school || "",
        "Degree received":      (d) => d.education?.[0]?.degree || "",
        "Date of graduation":   (d) => d.education?.[0]?.graduation ? fmtDate(d.education[0].graduation) : "",
        "School 2":             (d) => d.education?.[1]?.school || "",
        "Degree received 2":    (d) => d.education?.[1]?.degree || "",
        "Date of graduation 2": (d) => d.education?.[1]?.graduation ? fmtDate(d.education[1].graduation) : "",

        // Judgment debts (first line as MVP) — judgments: [{amount, creditor, details}, ...]
        "Amount":  (d) => d.judgments?.[0]?.amount || "",
        "Creditor": (d) => d.judgments?.[0]?.creditor || "",
        "Court entering judgment, case number, if paid, the date":
          (d) => d.judgments?.[0]?.details || "",

        // Contact block
        "Printed Name of Petitioner":     (d) => currentFull(d),
        "Address of Petitioner":          (d) => d.address1 || d.address || "",
        "City State Zip of Petitioner":   (d) => cityStateZip(d),
        "Telephone Number of Petitioner": (d) => d.phone || "",
        "Fax Number of Petitioner":       (d) => d.fax || "",
        "Email Addresses of Petitioner":  (d) => d.email || "",
        "Date of petition":               (d) => fmtDate(d.petitionDate || new Date().toISOString()),

        // Parents (optional)
        "Full legal name of parent 1": (d) => d.parent1 || "",
        "Full legal name of parent 2": (d) => d.parent2 || "",
        "Parent's maiden name 1":      (d) => d.parent1Maiden || "",
        "Parent's maiden name 2":      (d) => d.parent2Maiden || "",

        // Nonlawyer helper (usually blank)
        "This form was completed with the assistance of nonlawyer": (d) => d.nonlawyerName || "",
        "Name of business nonlawyer": (d) => d.nonlawyerBusiness || "",
        "Address":                    (d) => d.nonlawyerAddress || "",
        "City":                       (d) => d.nonlawyerCity || "",
        "State":                      (d) => d.nonlawyerState || "",
        "Zip Code":                   (d) => d.nonlawyerZip || "",
        "Telephone number":           (d) => d.nonlawyerPhone || ""
      },

      /* stubs for other PDFs (we can fill these next) */
            "12-928-cover": {
        // Top caption
        "circuit number": (d) => d.judicialCircuit || "13th",
        "indicate county": (d) => d.county || "Hillsborough",
        "case number": () => "",     // clerk assigns
        "judges name": () => "",     // clerk assigns

        // Parties
        "petitioner name": (d) => currentFull(d),
        "respondent name": () => "", // name change has no respondent

        // Signature area (printed name for now)
        "attorney or party signature": (d) => currentFull(d),
        "florida bar number": () => "",

        // Nonlawyer helper section (usually blank)
        "nonlawyer name": (d) => d.nonlawyerName || "",
        "nonlawyer street address": (d) => d.nonlawyerAddress || "",
        "nonlawyer city name": (d) => d.nonlawyerCity || "",
        "nonlawyer state name abbreviation": (d) => d.nonlawyerState || "",
        "nonlawyer phone": (d) => d.nonlawyerPhone || "",

        // “Indicate your name here” line
        "indicate your name here": (d) => currentFull(d),

        // Checkboxes we’re confident about for THIS packet.
        // Using "X" is safe: it checks a box if it’s a checkbox,
        // and if it’s a text field it still looks like a marked choice.
        "name change": () => "X",
        "action / petition": () => "X",
        "check if petitioner": () => "X"
      },
           "12-982b-judgment": {
        // Caption
        "IN THE CIRCUIT COURT OF THE": (d) => d.judicialCircuit || "13th",
        "IN AND FOR": (d) => d.county || "Hillsborough",
        "Case No": () => "", // clerk assigns
        "Division": () => "Family",

        // Some templates include a stray field name like this.
        // We’ll fill it with petitioner name for now; if it lands wrong,
        // we’ll blank it later.
        "undefined": (d) => currentFull(d),

        // Main body
        "This cause came before the Court on date": (d) =>
          fmtDate(d.hearingDate || d.petitionDate || new Date().toISOString()),

        "Petitioner is a bona fide resident of": (d) =>
          d.county || "Hillsborough",

        "ORDERED that Petitioners present name": (d) => currentFull(d),
        "is changed to": (d) => requestedFull(d),

        // Order / signature dates
        "DONE and ORDERED ON": (d) =>
          fmtDate(d.orderDate || new Date().toISOString()),

        // Location line (usually city)
        "in": (d) => d.orderCity || d.city || "Tampa",

        // Judge line (leave blank)
        "CIRCUIT JUDGE": () => "",

        // Certificate of service area — leave blank for MVP
        "I certify that a copy of the name of documents": () => "",
        "was": () => "",
        "mailed": () => "",
        "faxed and mailed": () => "",
        "emailed": () => "",
        "below on date": () => "",
        "Other": () => ""
      },
      "12-900h-related":  {},
      "12-915-address": {
        // Caption / header
        "Circuit Number": (d) => d.judicialCircuit || "13th",
        "County": (d) => d.county || "Hillsborough",
        "Case No": () => "",          // clerk assigns
        "Division": () => "Family",

        "Petitioner Name": (d) => currentFull(d),
        "Petitioner Name 1": (d) => currentFull(d), // duplicate field in this PDF
        "Respondent Name": () => "",                // no respondent for name change

        // Petitioner mailing address
        "Street or Post Office Box": (d) => d.address1 || d.address || "",
        "Apartment lot etc": (d) => d.address2 || "",
        "City": (d) => d.city || "",
        "State": (d) => d.state || "FL",
        "Zip": (d) => d.zip || "",

        // Contact
        "Telephone No": (d) => d.phone || "",
        "Fax No": (d) => d.fax || "",

        // Email section
        "Primary email address": (d) => d.email || "",
        "Secondary email address No1": (d) => d.secondaryEmail1 || "",
        "Secondary email address No 2": (d) => d.secondaryEmail2 || "",

        // Designated email(s) (some versions repeat this field)
        "Designated E-mail Address": (d) => d.email || "",
        "Designated EMail Addresses": (d) => d.email || "",

        // Service / certificate section (leave blank for MVP unless you add questions)
        "email": () => "",
        "mail": () => "",
        "fax": () => "",
        "hand": () => "",
        "date of service": () => "",
        "Other Party or Attorney Name": () => "",
        "Address other party": () => "",
        "City State Zip other party": () => "",
        "other party phone": () => "",
        "other party fax": () => "",
        "other party e-mail": () => "",

        // Signature block
        "Printed Name": (d) => currentFull(d),
        "Address": (d) => d.address1 || d.address || "",
        "City and State and Zip": (d) => cityStateZip(d),
        "Telephone": (d) => d.phone || "",
        "Fax": (d) => d.fax || "",

        // Party checkbox
        "Petitioner Check": () => "X",
        "Respondent Check": () => "",

        // Nonlawyer helper (blank unless they used one)
        "Name of Individual": (d) => d.nonlawyerName || "",
        "Name of Business": (d) => d.nonlawyerBusiness || "",
        "Street": (d) => d.nonlawyerAddress || "",
        "City nonlawyer": (d) => d.nonlawyerCity || "",
        "State nonlawyer": (d) => d.nonlawyerState || "",
        "Zip nonlawyer": (d) => d.nonlawyerZip || "",
        "Phone nonlawyer": (d) => d.nonlawyerPhone || ""
      },
      "dh-427-report": {
        // Case / caption-ish
        "Docket or File Number": () => "", // clerk assigns case #
        "County of": (d) => d.county || "Hillsborough",
        "Date of Court Order": (d) =>
          fmtDate(d.orderDate || d.hearingDate || d.petitionDate || new Date().toISOString()),

        // Petitioner info
        "Name of Petitioner": (d) => currentFull(d),
        "Petitioners Relationship to Person Whose Name Has Been Changed": () => "Self",
        "Mailing Address of Petitioner": (d) =>
          [d.address1 || d.address || "", d.address2 || "", cityStateZip(d)]
            .filter(Boolean)
            .join(" "),

        // Attorney section (blank for pro se)
        "Name of Attorney if applicable": () => "",
        "Attorneys Mailing Address": () => "",

        // Signature date on this report
        "Date": (d) => fmtDate(d.reportDate || new Date().toISOString()),

        // Birth / location
        "Date of Birth": (d) => fmtDate(d.dob),
        "City": (d) => d.birthCity || d.city || "",
        "County": (d) => d.birthCounty || d.county || "Hillsborough",
        "State": (d) => d.birthState || d.state || "FL",

        // This field appears in some DH-427 versions for last name at marriage;
        // for adult name change, safest is current last name.
        "MarriedLegal Last Name": (d) => d.lastName || "",

        /* ---- low-confidence fields (leave blank until we see placement) ----
           These are generic names from the PDF creator. We don’t want to guess wrong.
           After you generate a test packet, tell me what each one represents,
           and I’ll lock them in.
        */
        "First_3": () => "",
        "First_4": () => "",
        "First_5": () => "",
        "First_6": () => "",
        "Name": () => "",
        "Button1": () => "",
        "Button2": () => ""
      },
    }
  }
};
