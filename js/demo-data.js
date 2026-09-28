/**
 * Scripted demo threads only. No live model. Fictional names.
 * DEMO_PLANTS = OEM sales automation (not plant-floor ops).
 * Fictional OEM: Harborline Packaging - bottle filling and capping equipment.
 * Not pneumatic conveying, not bulk solids, not cement.
 */
window.DEMO_PLANTS = {
  id: "plants",
  label: "OEM Sales",
  header: "On-site sales assistant - Harborline Packaging",
  placeholder: "Ask about a proposal, duty, rep question, or account promise...",
  sessions: [
    {
      id: "proposal-from-wins",
      pill: "Build proposal from past wins",
      messages: [
        {
          role: "user",
          text: "App eng queue: new RFQ for a sauce line, 120 bottles per minute, 16 oz glass, two SKUs. Which closed proposals should I clone, and what sections does Sales Ops require?",
        },
        {
          role: "assistant",
          blocked: false,
          text: "Clone from closed wins in the proposal archive:\n\n* P-25006 (Lakeshore Foods, 2025) - 140 bpm, 16 oz glass, dual SKU - best skeleton\n* P-24118 (Cedar Pantry, 2024) - 90 bpm, 12 oz glass, single SKU - slower reference only\n\nBoth used the HL-440 rotary filler with the HC-12 capper. Lakeshore's Option B (spare filler valve set) closed - include it as optional.\n\nSales Ops playbook Rev C required set: cover, duty sheet, HL-440 cut sheet, changeover schedule, layout note, commercial terms.\n\nApply AG-12 section 4.2 viscosity note before you lock the filler speed paragraph. This sauce is thicker than Lakeshore's.\n\nThis is package structure from prior wins - not a priced quote.",
          sources: [
            {
              title: "P-25006 - Lakeshore Foods (closed)",
              system: "Proposal archive",
              date: "2025-03-02",
              excerpt: "140 bpm, 16 oz glass, dual SKU. HL-440 filler, HC-12 capper, Option B spare valve set accepted.",
            },
            {
              title: "P-24118 - Cedar Pantry (closed)",
              system: "Proposal archive",
              date: "2024-09-18",
              excerpt: "90 bpm, 12 oz glass, single SKU. Same filler family; use only as a slower-line reference.",
            },
            {
              title: "Sales Ops playbook Rev C",
              system: "Sales ops",
              date: "2025-01-10",
              excerpt: "Required proposal sections for engineered packaging lines.",
            },
            {
              title: "AG-12 section 4.2 - viscous products",
              system: "Application guide",
              date: "2023",
              excerpt: "Apply the viscosity derate before locking filler speed on sauces and dressings.",
            },
          ],
        },
      ],
    },
    {
      id: "app-sizing",
      pill: "Rep asks: will HL-320 work?",
      messages: [
        {
          role: "user",
          text: "Midwest rep (Ohio) needs a same-day factory answer: HL-320 filler on a chunky salsa, 80 bpm, 12 oz jars, two cap sizes. Yes/no?",
        },
        {
          role: "assistant",
          blocked: false,
          text: "Do not give the rep an unconditional yes.\n\nAG-12 Table 3 puts chunky salsa near the top of the HL-320 band at 80 bpm. Two cap sizes add changeover time (section 3.4) and push the duty into the review band, not the automatic-select band.\n\nPrior app-eng outcomes:\n* A-884 Red Barn Salsa (2023): HL-320 + large-particle valve kit + quarterly inspection language - held up\n* A-901 (2024): HL-320 without the valve kit - returned for an HL-440 in six months\n\nFactory position for the rep: quote HL-320 with the large-particle kit and inspection note, or step to HL-440 if the account will pay for uptime. Flag \"conditional\" in the CRM reply template.",
          sources: [
            {
              title: "AG-12 Table 3 - HL-320 capacity",
              system: "Application guide",
              date: "2023",
              excerpt: "Chunky products near the upper bpm limit of the HL-320 before changeovers.",
            },
            {
              title: "AG-12 section 3.4 - changeover",
              system: "Application guide",
              date: "2023",
              excerpt: "Each extra cap size adds changeover time before you lock rated speed.",
            },
            {
              title: "App log A-884 - Red Barn Salsa",
              system: "App eng log",
              date: "2023-06-11",
              excerpt: "HL-320 + large-particle valve kit; inspection language in the proposal.",
            },
            {
              title: "App log A-901",
              system: "App eng log",
              date: "2024-01-22",
              excerpt: "No particle kit; upsold to HL-440 within six months.",
            },
          ],
        },
      ],
    },
    {
      id: "account-notes",
      pill: "What did Sales already promise?",
      messages: [
        {
          role: "user",
          text: "Direct salesperson is back in with Maple Grove Kitchens. Pull lead-time and spare-parts promises already made so we do not contradict ourselves.",
        },
        {
          role: "assistant",
          blocked: false,
          text: "Promise trail on the company network (CRM + email):\n\n* 2025-11-03 - J. Ortiz call note: \"14-16 weeks after approved layouts,\" not stock\n* 2025-11-18 - email: spare filler valve kit no-charge on the first machine only (not standing policy)\n* 2026-02-02 - handoff: freight \"review on orders over $80k\" - no written commitment\n\nFactory note (2026-08): HL-440 fillers remain build-to-order. Do not tell the account we have a machine on the floor.\n\nBefore the next visit, get commercial sign-off if you expand the freight language.",
          sources: [
            {
              title: "CRM - Maple Grove Kitchens call note",
              system: "CRM",
              date: "2025-11-03",
              excerpt: "Lead time: 14-16 weeks after approved layouts.",
            },
            {
              title: "Email - valve kit closer",
              system: "Company email",
              date: "2025-11-18",
              excerpt: "Spare filler valve kit no-charge on the first machine only.",
            },
            {
              title: "CRM handoff - freight",
              system: "CRM",
              date: "2026-02-02",
              excerpt: "Freight review discussed above $80k; not committed in writing.",
            },
            {
              title: "Sales ops - HL-440 build policy",
              system: "Sales ops",
              date: "2026-08",
              excerpt: "Build-to-order; finished fillers are not stocked.",
            },
          ],
        },
      ],
    },
    {
      id: "product-line-wall",
      pill: "Pull Labeler Group price book",
      messages: [
        {
          role: "user",
          text: "I need the Labeler Group discount matrix and the last three Midwest labeler quotes to match a competitor deal.",
        },
        {
          role: "assistant",
          blocked: true,
          text: "Blocked by access wall.\n\nYour seat is scoped to Filling and Capping - Direct and Midwest manufacturers' reps. Labeler Group price books and quotes are tagged Labeling / Separate P&L and are outside your retrieval set.\n\nYou can search HL-series proposals, AG-12, Midwest filler CRM notes, and factory FAQs for filling and capping. You cannot retrieve labeler discount matrices or labeler quotes.\n\nRequest a wall exception from sales ops or a Labeler Group manager. I will not quote Labeler Group content.",
          sources: [
            {
              title: "Sales retrieval walls Rev 2",
              system: "Policy",
              date: "Rev 2",
              excerpt: "Filters by product line, region, and role before any chunk is returned.",
            },
            {
              title: "Your session scope",
              system: "Session",
              date: "Active",
              excerpt: "Filling and Capping - Direct and Midwest reps. Labeler Group excluded.",
            },
          ],
        },
      ],
    },
  ],
};

window.DEMO_LEGAL = {
  id: "legal",
  label: "Legal",
  header: "On-site matter assistant",
  placeholder: "Ask about a matter, clause, or work product...",
  sessions: [
    {
      id: "limitation-clause",
      pill: "Limitation of liability clause",
      messages: [
        {
          role: "user",
          text: "We need a limitation of liability cap at fees paid in the prior 12 months, no consequential damages. What language have we used?",
        },
        {
          role: "assistant",
          blocked: false,
          text: "The firm brief bank has a closing-set clause used in three commercial agreements in 2024-2025. Core terms:\n\n* Cap: fees paid to the provider in the twelve (12) months before the claim\n* Exclusion: consequential, incidental, special, and lost-profits damages\n* Carve-out kept in the 2025 version only: fraud, willful misconduct, and bodily injury\n\nThe 2024 vendor-form redline added a customer-backup condition: customer must maintain its own backups as a condition of service. That sentence is in the work-product memo, not in the short-form clause itself.\n\nThis is prior work product, not a recommendation for the current counterparty.",
          sources: [
            {
              title: "Brief bank - Limitation of Liability",
              system: "Brief bank",
              date: "2025-02-11",
              excerpt: "SaaS / managed service form: cap at fees paid in prior twelve months; consequential damages excluded.",
            },
            {
              title: "Matter 2024-118, Vendor MSA redline section 9",
              system: "Matter file",
              date: "2024",
              excerpt: "Redline retained fees-paid cap and expanded consequential-damages exclusion.",
            },
            {
              title: "Memo - Backup duty as a damages limiter",
              system: "Work product",
              date: "2025-01-09",
              excerpt: "Customer backup duty framed as a condition of service and a limiter on recoverable loss.",
            },
            {
              title: "Engagement letter template, commercial",
              system: "Template",
              date: "2024",
              excerpt: "Commercial template references standard limitation set from brief bank.",
            },
          ],
        },
      ],
    },
    {
      id: "harbor-argument",
      pill: "What did we argue last time?",
      messages: [
        {
          role: "user",
          text: "In the Harbor logistics contract fight, what did we tell the court about consequential damages?",
        },
        {
          role: "assistant",
          blocked: false,
          text: "In Harbor Logistics v. North Pier Services (matter 2023-044), the opposition brief argued that lost-throughput claims were consequential and barred by section 12.4 of the services agreement, and that Harbor had a contractual duty to keep operational backups.\n\nThe court did not reach the backup argument. It granted partial summary judgment on the consequential-damages waiver as to lost throughput only. Other damage theories were left for trial.\n\nDo not treat that order as a template holding. It is this firm's prior matter.",
          sources: [
            {
              title: "Matter 2023-044, Def. Opp. to MSJ pp. 11-14",
              system: "Work product",
              date: "2024",
              excerpt: "Lost-throughput claims characterized as consequential and barred by section 12.4; backup duty noted.",
            },
            {
              title: "Matter 2023-044, Order on MSJ",
              system: "Court filing",
              date: "2024-06-03",
              excerpt: "Partial SJ granted on consequential-damages waiver as to lost throughput only; other theories reserved.",
            },
            {
              title: "Matter 2023-044, Agreement section 12.4",
              system: "Matter file",
              date: "Agreement",
              excerpt: "Services agreement section 12.4 - consequential damages waiver.",
            },
            {
              title: "DMS: Harbor Logistics work product",
              system: "iManage",
              date: "2023-044",
              excerpt: "Work-product folder for Harbor Logistics / North Pier Services matter.",
            },
          ],
        },
      ],
    },
    {
      id: "depo-vs-memo",
      pill: "Deposition vs the memo",
      messages: [
        {
          role: "user",
          text: "Does the witness deposition in 2024-118 match what we put in the internal memo on backup obligations?",
        },
        {
          role: "assistant",
          blocked: false,
          text: "Not cleanly. The 2025-01-09 memo says the customer's backup duty was \"a condition of service\" and \"a limiter on recoverable loss.\"\n\nIn the 2024-118 30(b)(6) deposition, the witness agreed backups were \"expected\" but would not agree they were a condition of the contract. That gap is flagged in the post-depo note dated 2026-03-22.\n\nIf this comes up again, the memo and the testimony should not be cited as if they say the same thing.",
          sources: [
            {
              title: "Memo - Backup duty as a damages limiter",
              system: "Work product",
              date: "2025-01-09",
              excerpt: "Backup duty described as a condition of service and limiter on recoverable loss.",
            },
            {
              title: "Matter 2024-118, 30(b)(6) transcript pp. 44-47",
              system: "Deposition",
              date: "2026-03-19",
              excerpt: "Witness: backups \"expected\"; declined to agree they were a contractual condition.",
            },
            {
              title: "Post-depo note",
              system: "Work product",
              date: "2026-03-22",
              excerpt: "Flag: memo vs testimony gap on whether backups are a condition of the contract.",
            },
            {
              title: "DMS: 2024-118 Work Product",
              system: "iManage",
              date: "2024-118",
              excerpt: "Work-product set for matter 2024-118.",
            },
          ],
        },
      ],
    },
    {
      id: "meridian-wall",
      pill: "Open the Meridian file",
      messages: [
        {
          role: "user",
          text: "Open the Meridian Holdings file and pull the conflict notes. I think we saw this indemnified last year.",
        },
        {
          role: "assistant",
          blocked: true,
          text: "Blocked by ethical wall.\n\nMeridian Holdings is outside your matter and client scope. Retrieval is limited to matters you are staffed on. I cannot surface Meridian notes, emails, or work product.\n\nI can search your active matters, the generic brief bank tagged firm-wide, and templates that are not client-specific.\n\nRequest a wall exception through ethics counsel if you believe you are mis-scoped. I will not quote Meridian content.",
          sources: [
            {
              title: "Ethical wall policy, retrieval layer Rev 3",
              system: "Policy",
              date: "Rev 3",
              excerpt: "Matter and client walls are enforced at retrieval. Out-of-scope client content is not returned.",
            },
            {
              title: "Your session scope",
              system: "Session",
              date: "Active",
              excerpt: "2024-118, 2023-044, firm brief bank. Meridian Holdings is outside scope.",
            },
          ],
        },
      ],
    },
  ],
};
