// lib/forms.js
// Registry of packets, their template PDFs, and (soon) field maps.
// NOTE: paths are RELATIVE for server-side fs reads (no leading slash).

export const PACKETS = {
  "name-change-hillsborough": {
    title: "Adult Name Change – Hillsborough",
    files: [
      { id: "12-928-cover",        path: "templates/hillsborough/name-change-adult/12-928-cover.pdf" },
      { id: "12-982a-petition",    path: "templates/hillsborough/name-change-adult/12-982a-petition.pdf" },
      { id: "12-982b-judgment",    path: "templates/hillsborough/name-change-adult/12-982b-final-judgment.pdf" },
      { id: "12-900h-related",     path: "templates/hillsborough/name-change-adult/12-900h-related-cases.pdf" },
      { id: "12-915-address",      path: "templates/hillsborough/name-change-adult/12-915-address-email.pdf" },
      { id: "dh-427-report",       path: "templates/hillsborough/name-change-adult/dh-427-report.pdf" }
    ],
    // We'll paste your real field mappings here after we run the inspector.
    fields: {
      // Example shape:
      // "12-982a-petition": {
      //   PetitionerFirst: "firstName",
      //   ...
      // }
    }
  }
};
