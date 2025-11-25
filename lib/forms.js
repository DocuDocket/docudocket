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

const boolYes = (v) =>
  v === true || v === "yes" || v === "true" || v === "Yes";

const circuitWord = (d) => {
  const raw = (d?.judicialCircuit || d?.circuit || "THIRTEENTH")
    .toString()
    .toUpperCase();
  return raw === "13TH" || raw === "13" ? "THIRTEENTH" : raw;
};

const countyWord = (d) =>
  (d?.county || "HILLSBOROUGH").toString().toUpperCase();

/* ---------- registry ---------- */
export const PACKETS = {
  "name-change-hillsborough": {
    title: "Adult Name Change – Hillsborough",
    files: [
      { id: "12-928-cover",     path: "templates/hillsborough/name-change-adult/12-928-cover.pdf" },
      { id: "12-982a-petition", path: "templates/hillsborough/name-change-adult/12-982a-petition.pdf" },
      { id: "12-982b-judgment", path: "templates/hillsborough/name-change-adult/12-982b_final-judgment.pdf" },
      { id: "12-900h-related",  path: "templates/hillsborough/name-change-adult/12-900h-related-cases.pdf" },
      { id: "12-915-address",   path: "templates/hillsborough/name-change-adult/12-915-address-email.pdf" },
      { id: "dh-427-report",    path: "templates/hillsborough/name-change-adult/dh-427-report.pdf" }
    ],

    fields: {
      /* --- 12.928 Cover Sheet --- */
      "12-928-cover": {
        "circuit number": (d) => circuitWord(d),

        // shrink county so it doesn't clip
        "indicate county": (d) => ({
          value: countyWord(d),
          fontSize: 8
        }),

        "case number": () => "",
        "judges name": () => "",
        "respondent name": () => "",

        // petitioner name (caption block above)
        "petitioner name": (d) => currentFull(d),

        // signature line must stay blank
        "attorney or party signature": () => "",
        "florida bar number": () => "",

        // (Type or print name) line you just added
        "indicate your name here": (d) => currentFull(d),

        // date you just added
        "date": (d) =>
          fmtDate(d.coverDate || d.petitionDate || d.filingDate || new Date().toISOString()),

        // Case type checkbox
        "name change": () => true,

        // everything else unchecked
        "action / petition": () => false,
        "reopen case": () => false,
        "modify petition": () => false,
        "civil contempt / enforcement motion": () => false,
        "other / reopening case scenario": () => false,
        "simplified disolution of marriage": () => false,
        "disolution of marriage": () => false,
        "domestic violence": () => false,
        "dating violence": () => false,
        "repeat violence": () => false,
        "sexual violence": () => false,
        "support IV - D": () => false,
        "support non IV - D": () => false,
        "UIFSA IV - D": () => false,
        "UIFSA non IV - D": () => false,
        "other family court": () => false,
        "adoption arising out of chapter 63": () => false,
        "paternity / disestablishement of paternity": () => false,
        "juvenile delinquency": () => false,
        "petition for dependency": () => false,
        "shelter petition": () => false,
        "termination of parental rights arising out of chapter 39": () => false,
        "adoption arising out of chapter 39": () => false,
        "CINS / FINS": () => false,

        "check no": () => false,
        "check yes": () => false,

        // Nonlawyer section blank
        "nonlawyer name": () => "",
        "nonlawyer street address": () => "",
        "nonlawyer city name": () => "",
        "nonlawyer state name abbreviation": () => "",
        "nonlawyer phone": () => "",
        "check if petitioner": () => false,
        "check if respondent": () => false
      },

      /* --- 12-982(a) Petition --- */
      "12-982a-petition": {
        // Caption
        "Judicial Circuit": (d) => circuitWord(d),

        // bump Hillsborough header size by 1
        "County Name": (d) => ({
          value: countyWord(d).toLowerCase().replace(/^\w/, c => c.toUpperCase()),
          fontSize: 11
        }),

        "Case Number": () => "",
        "Division": () => "Family",

        // Identity
        "Petitioner":            (d) => currentFull(d),
        "Full Legal Name":       (d) => currentFull(d),
        "Complete present name": (d) => currentFull(d),
        "Requested name":        (d) => requestedFull(d),

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

        // Prior addresses
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

        // --- CHECKBOXES per your list ---
        "Check Box37": (d) => (d.priorAddresses?.length || 0) > 4,

        "Check Box38": (d) => {
          const married = boolYes(d.isMarried) || d.maritalStatus === "married" || !!d.spouseFullName;
          return !married;
        },
        "Check Box39": (d) => {
          const married = boolYes(d.isMarried) || d.maritalStatus === "married" || !!d.spouseFullName;
          return married;
        },

        "Spouse's full legal name": (d) => d.spouseFullName || "",

        "Check Box40": (d) => !(d.children?.length > 0),
        "Check Box41": (d) => (d.children?.length || 0) > 0,
        "Check Box42": (d) => (d.children?.length || 0) > 5,

        "Name (last first middle initial), Age, Address, City, State":   (d) => d.children?.[0] || "",
        "Name (last first middle initial), Age, Address, City, State 2": (d) => d.children?.[1] || "",
        "Name (last first middle initial), Age, Address, City, State 3": (d) => d.children?.[2] || "",
        "Name (last first middle initial), Age, Address, City, State 4": (d) => d.children?.[3] || "",
        "Name (last first middle initial), Age, Address, City, State 5": (d) => d.children?.[4] || "",

        "Check Box43": (d) =>
          !(d.prevChange?.length > 0) && !boolYes(d.prevChangeCourt) && !boolYes(d.prevChangeMarriage),
        "Check Box44": (d) => (d.prevChange?.length || 0) > 0 || boolYes(d.prevChangeCourt),
        "Check Box45": (d) => boolYes(d.prevChangeMarriage),

        "Name previously changed from":     (d) => d.prevChange?.[0]?.from || "",
        "Name changed to":                  (d) => d.prevChange?.[0]?.to || "",
        "Date name changed by court order": (d) => d.prevChange?.[0]?.date ? fmtDate(d.prevChange[0].date) : "",
        "By court city and state":          (d) => d.prevChange?.[0]?.court || "",

        "Name previously changed from 2": (d) => d.prevChange?.[1]?.from || "",
        "Name changed to 2":              (d) => d.prevChange?.[1]?.to || "",
        "On date":                        (d) => d.prevChange?.[1]?.date ? fmtDate(d.prevChange[1].date) : "",
        "in city county and state":       (d) => d.prevChange?.[1]?.court || "",

        "Check Box46": (d) => !(d.otherNames?.length > 0),
        "Check Box47": (d) => (d.otherNames?.length || 0) > 0,

        "List names and explain where you were known or called by such name":
          (d) => d.otherNames?.[0] || d.otherNamesDetails || "",
        "List names and explain where you were known or called by such name 2":
          (d) => d.otherNames?.[1] || "",

        // Employment
        "Occupation": (d) => d.occupation || "",
        "Company and address of employment":   (d) => d.employment?.[0]?.employer || "",
        "Company and address of employment 2": (d) => d.employment?.[1]?.employer || "",

        "Date from 5": (d) => d.employment?.[0]?.from ? fmtDate(d.employment[0].from) : "",
        "Date to 5":   (d) => d.employment?.[0]?.to ? fmtDate(d.employment[0].to) : "",
        "Date from 6": (d) => d.employment?.[1]?.from ? fmtDate(d.employment[1].from) : "",
        "Date to 6":   (d) => d.employment?.[1]?.to ? fmtDate(d.employment[1].to) : "",

        "Check Box48": (d) => (d.employment?.length || 0) > 2,

        // Business ownership
        "Check Box49": (d) => !boolYes(d.ownsBusiness),
        "Check Box50": (d) => boolYes(d.ownsBusiness),
        "Street address of business": (d) => d.businessAddress || "",
        "Your position with the business": (d) => d.businessPosition || "",
        "Date you have been involved with the business since": (d) =>
          d.businessSince ? fmtDate(d.businessSince) : "",

        // Profession
        "Check Box51": (d) => !(d.professions?.length > 0) && !d.profession,
        "Check Box52": (d) => (d.professions?.length || 0) > 0 || !!d.profession,
        "Indicate profession": (d) => d.professions?.[0] || d.profession || "",
        "Check Box53": (d) => (d.professions?.length || 0) > 1,

        // Education
        "School": (d) => d.education?.[0]?.school || "",
        "Degree received": (d) => d.education?.[0]?.degree || "",
        "Date of graduation": (d) =>
          d.education?.[0]?.graduation ? fmtDate(d.education[0].graduation) : "",

        "School 2": (d) => d.education?.[1]?.school || "",
        "Degree received 2": (d) => d.education?.[1]?.degree || "",
        "Date of graduation 2": (d) =>
          d.education?.[1]?.graduation ? fmtDate(d.education[1].graduation) : "",

        "School 3": (d) => d.education?.[2]?.school || "",
        "Degree received 3": (d) => d.education?.[2]?.degree || "",
        "Date of graduation 3": (d) =>
          d.education?.[2]?.graduation ? fmtDate(d.education[2].graduation) : "",

        "Check Box54": (d) => (d.education?.length || 0) > 3,

        // Criminal history
        "Check Box55": (d) => !boolYes(d.hasFelony) && !boolYes(d.hasCriminalHistory),
        "Check Box56": (d) => boolYes(d.hasFelony) || boolYes(d.hasCriminalHistory),

        "Event (arrest, charge, plea, or adjudication)": (d) => d.criminalEvents?.[0]?.event || "",
        "Date": (d) => d.criminalEvents?.[0]?.date ? fmtDate(d.criminalEvents[0].date) : "",
        "City/State": (d) => d.criminalEvents?.[0]?.cityState || "",

        "Event (arrest, charge, plea, or adjudication) 2": (d) => d.criminalEvents?.[1]?.event || "",
        "Date 2": (d) => d.criminalEvents?.[1]?.date ? fmtDate(d.criminalEvents[1].date) : "",
        "City/State 2": (d) => d.criminalEvents?.[1]?.cityState || "",

        "Event (arrest, charge, plea, or adjudication) 3": (d) => d.criminalEvents?.[2]?.event || "",
        "Date 3": (d) => d.criminalEvents?.[2]?.date ? fmtDate(d.criminalEvents[2].date) : "",
        "City/State 3": (d) => d.criminalEvents?.[2]?.cityState || "",

        "Check Box57": (d) => (d.criminalEvents?.length || 0) > 3,

        // Sex offender/predator pairs
        "Check Box58": (d) => boolYes(d.isSexOffender),
        "Check Box59": (d) => !boolYes(d.isSexOffender),
        "Check Box60": (d) => boolYes(d.isSexOffender),
        "Check Box61": (d) => !boolYes(d.isSexOffender),

        // Bankruptcy
        "Check Box62": (d) => !boolYes(d.hasBankruptcy),
        "Check Box63": (d) => boolYes(d.hasBankruptcy),
        "Check Box64": () => false,

        "Date adjudicated bankrupt": (d) => d.bankruptcyDate ? fmtDate(d.bankruptcyDate) : "",
        "City adjudicated bankrupt": (d) => d.bankruptcyCity || "",
        "County adjudicated bankrupt": (d) => d.bankruptcyCounty || "",
        "State adjudicated bankrupt": (d) => d.bankruptcyState || "",

        // Judgments
        "Check Box65": (d) => !boolYes(d.hasJudgments),
        "Check Box66": (d) => boolYes(d.hasJudgments),
        "Check Box68": (d) => (d.judgments?.length || 0) > 4,

        "Amount":   (d) => d.judgments?.[0]?.amount || "",
        "Creditor": (d) => d.judgments?.[0]?.creditor || "",
        "Court entering judgment, case number, if paid, the date":
          (d) => d.judgments?.[0]?.details || "",

        "Amount 2":   (d) => d.judgments?.[1]?.amount || "",
        "Creditor 2": (d) => d.judgments?.[1]?.creditor || "",
        "Court entering judgment, case number, if paid, the date 2":
          (d) => d.judgments?.[1]?.details || "",

        // Contact block
        "Printed Name of Petitioner":     (d) => currentFull(d),
        "Address of Petitioner":          (d) => d.address1 || d.address || "",
        "City State Zip of Petitioner":   (d) => cityStateZip(d),
        "Telephone Number of Petitioner": (d) => d.phone || "",
        "Fax Number of Petitioner":       (d) => d.fax || "",
        "Email Addresses of Petitioner":  (d) => d.email || "",
        "Date of petition":               (d) => fmtDate(d.petitionDate || new Date().toISOString()),

        // Parents
        "Full legal name of parent 1": (d) => d.parent1 || "",
        "Full legal name of parent 2": (d) => d.parent2 || "",
        "Parent's maiden name 1":      (d) => d.parent1Maiden || "",
        "Parent's maiden name 2":      (d) => d.parent2Maiden || "",

        // Nonlawyer helper blank
        "This form was completed with the assistance of nonlawyer": () => "",
        "Name of business nonlawyer": () => "",
        "Address": () => "",
        "City": () => "",
        "State": () => "",
        "Zip Code": () => "",
        "Telephone number": () => ""
      },

      /* --- 12-982(b) Final Judgment --- */
      "12-982b-judgment": {
        "IN THE CIRCUIT COURT OF THE": (d) => circuitWord(d),
        "IN AND FOR": (d) => countyWord(d), // JUST HILLSBOROUGH
        "Case No": () => "",
        "Division": () => "Family",
        "undefined": () => "",

        "This cause came before the Court on date": (d) =>
          fmtDate(d.finalHearingDate || d.judgmentHearingDate || ""),

        "Petitioner is a bona fide resident of": (d) => countyWord(d), // JUST HILLSBOROUGH

        "ORDERED that Petitioners present name": (d) => currentFull(d),
        "is changed to": (d) => requestedFull(d),

        // Court fills this date
        "DONE and ORDERED ON": () => "",

        // City only, no "Florida"
        "in": (d) => d.city || "Tampa",

        "CIRCUIT JUDGE": () => "",

        "I certify that a copy of the name of documents": () => "",
        "was": () => false,
        "mailed": () => false,
        "faxed and mailed": () => false,
        "emailed": () => false,
        "below on date": () => "",
        "Other": () => false
      },

      /* --- optional / later --- */
      "12-900h-related": {},

      "12-915-address": {
        "Case No": () => "",
        "Division": () => "Family",
        "Circuit Number": (d) => circuitWord(d),
        "County": (d) => d.county || "Hillsborough",

        "Petitioner Name": (d) => currentFull(d),
        "Petitioner Name 1": (d) => currentFull(d),
        "Respondent Name": () => "",

        "Street or Post Office Box": (d) => d.address1 || d.address || "",
        "Apartment lot etc": (d) => d.address2 || "",
        "City": (d) => d.city || "",
        "State": (d) => d.state || "FL",
        "Zip": (d) => d.zip || "",

        "Telephone No": (d) => d.phone || "",
        "Fax No": (d) => d.fax || "",
        "Primary email address": (d) => d.email || "",
        "Secondary email address No1": (d) => d.secondaryEmail1 || "",
        "Secondary email address No 2": (d) => d.secondaryEmail2 || "",

        "email": () => false,
        "mail": () => false,
        "fax": () => false,
        "hand": () => false,

        "Petitioner Check": () => true,
        "Respondent Check": () => false,

        "date of service": () => "",
        "Other Party or Attorney Name": () => "",
        "Address other party": () => "",
        "City State Zip other party": () => "",
        "other party phone": () => "",
        "other party fax": () => "",
        "other party e-mail": () => "",
        "Designated E-mail Address": () => "",
        "Designated EMail Addresses": () => "",
        "Printed Name": () => "",
        "Address": () => "",
        "City and State and Zip": () => "",
        "Telephone": () => "",
        "Fax": () => "",
        "Name of Individual": () => "",
        "Name of Business": () => "",
        "Street": () => "",
        "City nonlawyer": () => "",
        "State nonlawyer": () => "",
        "Zip nonlawyer": () => "",
        "Phone nonlawyer": () => ""
      },

      "dh-427-report": {
        "Docket or File Number": () => "",
        "County of": (d) => d.county || "Hillsborough",
        "Date of Court Order": (d) =>
          fmtDate(d.judgmentDate || d.finalHearingDate),

        "Name of Petitioner": (d) => currentFull(d),
        "Petitioners Relationship to Person Whose Name Has Been Changed": () =>
          "Self",

        "Mailing Address of Petitioner": (d) =>
          d.address1 || d.address || "",

        "Name of Attorney if applicable": () => "",
        "Attorneys Mailing Address": () => "",

        "Date": (d) =>
          fmtDate(d.judgmentDate || new Date().toISOString()),

        "First_3": (d) => d.firstName || "",
        "First_4": (d) => d.middleName || "",
        "MarriedLegal Last Name": (d) => d.lastName || "",

        "First_5": (d) => d.newFirstName || "",
        "First_6": (d) => d.newMiddleName || "",
        "Name": (d) => requestedFull(d),

        "Date of Birth": (d) => fmtDate(d.dob),
        "City": (d) => d.birthCity || d.city || "",
        "County": (d) => d.birthCounty || d.county || "",
        "State": (d) => d.birthState || d.state || "FL",

        "Button1": () => false,
        "Button2": () => false
      }
    }
  }
};
