window.DEMO_LEGAL = {
  title: "On-site matter assistant",
  threads: [
    {
      id: "clause",
      label: "Liability clause",
      messages: [
        { role: "user", text: "What limitation of liability did we use in the Northwind supply agreement?" },
        {
          role: "assistant",
          text: "The Northwind draft caps direct damages at the fees paid under that agreement and says consequential damages are waived. The brief bank note from March points at the same section.",
          sources: ["Northwind supply draft, liability section", "Brief bank, supply agreements", "Northwind engagement letter"]
        }
      ]
    },
    {
      id: "harbor",
      label: "Harbor argument",
      messages: [
        { role: "user", text: "What argument did we make for Harbor on the late-delivery claim?" },
        {
          role: "assistant",
          text: "The Harbor brief says the delivery window was an estimate, not a warranty, and that the bill of lading controls. The 12 March memo is the work product behind that argument.",
          sources: ["Harbor brief, late delivery", "Memo, 12 March", "Harbor bill of lading"]
        }
      ]
    },
    {
      id: "depo",
      label: "Deposition vs memo",
      messages: [
        { role: "user", text: "The deposition says the rate was firm. The memo says it was an estimate. Which do I use?" },
        {
          role: "assistant",
          text: "The deposition is the sworn record of what was said. The memo is work product that sets out the estimate theory. Use the transcript for the fact. Use the memo for the argument.",
          sources: ["Deposition transcript, p. 46", "Memo, 12 March", "Harbor chronology"]
        }
      ]
    },
    {
      id: "wall",
      label: "Meridian wall",
      blocked: true,
      messages: [
        { role: "user", text: "Show me the Meridian settlement figures." },
        {
          role: "assistant",
          blocked: true,
          text: "Your account is not on the Meridian matter. The ethical wall stopped retrieval, so no Meridian document was returned."
        }
      ]
    }
  ]
};
