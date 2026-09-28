/**
 * Scripted demo threads only. No live model. Fictional names.
 * DEMO_PLANTS = OEM sales automation (not plant-floor ops).
 * Fictional OEM using the product: Northline Process Equipment.
 */
window.DEMO_PLANTS = {
  id: "plants",
  label: "OEM Sales",
  header: "On-site sales assistant · Northline Process Equipment",
  placeholder: "Ask about a proposal, duty, rep question, or account promise…",
  sessions: [
    {
      id: "proposal-from-wins",
      pill: "Build proposal from past wins",
      messages: [
        {
          role: "user",
          text: "App eng queue: new RFQ for fly-ash transfer, 40 TPH, 600 ft. Which closed proposals should I clone, and what sections does Sales Ops require?",
        },
        {
          role: "assistant",
          blocked: false,
          text: "Clone from closed wins in the proposal archive:\n\n• P-25006 (Summit Cement, 2025) — 45 TPH / 640 ft — best skeleton for this duty\n• P-24118 (River Bend Materials, 2024) — 35 TPH / 520 ft — shorter run reference only\n\nBoth used the PX-440 blower skid with dual airlocks. Summit’s Option B (spare airlock rotor) closed — include it as optional.\n\nSales Ops playbook Rev C required set: cover, duty sheet, PX-440 cut sheet, airlock schedule, GA note, commercial terms.\n\nApply AG-12 §4.2 derate note for the 600 ft horizontal run before you lock the blower paragraph.\n\nThis is package structure from prior wins — not a priced quote.",
          sources: [
            {
              title: "P-25006 — Summit Cement (closed)",
              system: "Proposal archive",
              date: "2025-03-02",
              excerpt: "45 TPH / 640 ft. PX-440 skid, dual airlocks, Option B spare rotor accepted.",
            },
            {
              title: "P-24118 — River Bend Materials (closed)",
              system: "Proposal archive",
              date: "2024-09-18",
              excerpt: "35 TPH / 520 ft. Same PX family; use only as shorter-run reference.",
            },
            {
              title: "Sales Ops playbook Rev C",
              system: "Sales ops",
              date: "2025-01-10",
              excerpt: "Required proposal sections for engineered packages.",
            },
            {
              title: "AG-12 §4.2 — long horizontal runs",
              system: "Application guide",
              date: "2023",
              excerpt: "Apply derate table before locking blower selection on long runs.",
            },
          ],
        },
      ],
    },
    {
      id: "app-sizing",
      pill: "Rep asks: will PX-320 work?",
      messages: [
        {
          role: "user",
          text: "Midwest rep (Ohio) needs a same-day factory answer: PX-320 on limestone fines, 18 TPH, 280 ft, two 90s. Yes/no?",
        },
        {
          role: "assistant",
          blocked: false,
          text: "Do not give the rep an unconditional yes.\n\nAG-12 Table 3 puts this near the top of the PX-320 band. Two 90s add equivalent length (+15% EL per §3.4) and push the duty into the review band.\n\nPrior app-eng outcomes:\n• A-884 Toledo Minerals (2023): PX-320 + high-wear kit + quarterly inspection language — held up\n• A-901 (2024): PX-320 without wear kit — returned for PX-440 in six months\n\nFactory position for the rep: quote PX-320 with high-wear kit and inspection note, or step to PX-440 if the account will pay for uptime. Flag “conditional” in the CRM reply template.",
          sources: [
            {
              title: "AG-12 Table 3 — PX-320 capacity",
              system: "Application guide",
              date: "2023",
              excerpt: "Limestone fines band; 280 ft near upper limit before fittings.",
            },
            {
              title: "AG-12 §3.4 — equivalent length",
              system: "Application guide",
              date: "2023",
              excerpt: "Each 90° elbow adds 15% EL before selection.",
            },
            {
              title: "App log A-884 — Toledo Minerals",
              system: "App eng log",
              date: "2023-06-11",
              excerpt: "PX-320 + high-wear kit; inspection language in proposal.",
            },
            {
              title: "App log A-901",
              system: "App eng log",
              date: "2024-01-22",
              excerpt: "No wear kit; upsold to PX-440 within six months.",
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
          text: "Direct salesperson is back in with Lakeside Aggregates. Pull lead-time and spare-parts promises already made so we don’t contradict ourselves.",
        },
        {
          role: "assistant",
          blocked: false,
          text: "Promise trail on the company network (CRM + email):\n\n• 2025-11-03 — J. Ortiz call note: “14–16 weeks after approved drawings,” not stock\n• 2025-11-18 — email: spare airlock seal kit no-charge on the first order only (not standing policy)\n• 2026-02-02 — handoff: freight “review on orders over $80k” — no written commitment\n\nFactory note (2026-08): PX-440 skids remain build-to-order. Do not tell the account we have stock.\n\nBefore the next visit, get commercial sign-off if you expand the freight language.",
          sources: [
            {
              title: "CRM — Lakeside Aggregates call note",
              system: "CRM",
              date: "2025-11-03",
              excerpt: "Lead time: 14–16 weeks after approved drawings.",
            },
            {
              title: "Email — seal kit closer",
              system: "Company email",
              date: "2025-11-18",
              excerpt: "Spare seal kit no-charge on first order only.",
            },
            {
              title: "CRM handoff — freight",
              system: "CRM",
              date: "2026-02-02",
              excerpt: "Freight review discussed above $80k; not committed in writing.",
            },
            {
              title: "Sales ops — PX-440 build policy",
              system: "Sales ops",
              date: "2026-08",
              excerpt: "Build-to-order; not stocked finished goods.",
            },
          ],
        },
      ],
    },
    {
      id: "product-line-wall",
      pill: "Pull Blender Group price book",
      messages: [
        {
          role: "user",
          text: "I need the Blender Group discount matrix and the last three Midwest blender quotes to match a competitor deal.",
        },
        {
          role: "assistant",
          blocked: true,
          text: "Blocked by access wall.\n\nYour seat is scoped to Pneumatic Conveying — Direct & Midwest manufacturers’ reps. Blender Group price books and quotes are tagged Blender / Separate P&L and are outside your retrieval set.\n\nYou can search PX-series proposals, AG-12, Midwest conveying CRM notes, and factory FAQs for conveying. You cannot retrieve blender discount matrices or blender quotes.\n\nRequest a wall exception from sales ops or a Blender Group manager. I will not quote Blender Group content.",
          sources: [
            {
              title: "Sales retrieval walls Rev 2",
              system: "Policy",
              date: "Rev 2",
              excerpt: "Filters by product line / region / role before any chunk is returned.",
            },
            {
              title: "Your session scope",
              system: "Session",
              date: "Active",
              excerpt: "Pneumatic Conveying — Direct & Midwest reps. Blender Group excluded.",
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
  placeholder: "Ask about a matter, clause, or work product…",
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
          text: "The firm brief bank has a closing-set clause used in three commercial agreements in 2024–2025. Core terms:\n\n• Cap: fees paid to the provider in the twelve (12) months before the claim\n• Exclusion: consequential, incidental, special, and lost-profits damages\n• Carve-out kept in the 2025 version only: fraud, willful misconduct, and bodily injury\n\nThe 2024 vendor-form redline added a customer-backup condition: customer must maintain its own backups as a condition of service. That sentence is in the work-product memo, not in the short-form clause itself.\n\nThis is prior work product, not a recommendation for the current counterparty.",
          sources: [
            {
              title: "Brief bank — Limitation of Liability",
              system: "Brief bank",
              date: "2025-02-11",
              excerpt:
                "SaaS / managed service form: cap at fees paid in prior twelve months; consequential damages excluded.",
            },
            {
              title: "Matter 2024-118, Vendor MSA redline §9",
              system: "Matter file",
              date: "2024",
              excerpt: "Redline retained fees-paid cap and expanded consequential-damages exclusion.",
            },
            {
              title: "Memo — Backup duty as a damages limiter",
              system: "Work product",
              date: "2025-01-09",
              excerpt:
                "Customer backup duty framed as a condition of service and a limiter on recoverable loss.",
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
          text: "In Harbor Logistics v. North Pier Services (matter 2023-044), the opposition brief argued that lost-throughput claims were consequential and barred by §12.4 of the services agreement, and that Harbor had a contractual duty to keep operational backups.\n\nThe court did not reach the backup argument. It granted partial summary judgment on the consequential-damages waiver as to lost throughput only. Other damage theories were left for trial.\n\nDo not treat that order as a template holding. It is this firm’s prior matter.",
          sources: [
            {
              title: "Matter 2023-044, Def. Opp. to MSJ pp. 11–14",
              system: "Work product",
              date: "2024",
              excerpt:
                "Lost-throughput claims characterized as consequential and barred by §12.4; backup duty noted.",
            },
            {
              title: "Matter 2023-044, Order on MSJ",
              system: "Court filing",
              date: "2024-06-03",
              excerpt:
                "Partial SJ granted on consequential-damages waiver as to lost throughput only; other theories reserved.",
            },
            {
              title: "Matter 2023-044, Agreement §12.4",
              system: "Matter file",
              date: "Agreement",
              excerpt: "Services agreement §12.4 — consequential damages waiver.",
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
          text: "Not cleanly. The 2025-01-09 memo says the customer’s backup duty was “a condition of service” and “a limiter on recoverable loss.”\n\nIn the 2024-118 30(b)(6) deposition, the witness agreed backups were “expected” but would not agree they were a condition of the contract. That gap is flagged in the post-depo note dated 2026-03-22.\n\nIf this comes up again, the memo and the testimony should not be cited as if they say the same thing.",
          sources: [
            {
              title: "Memo — Backup duty as a damages limiter",
              system: "Work product",
              date: "2025-01-09",
              excerpt: "Backup duty described as a condition of service and limiter on recoverable loss.",
            },
            {
              title: "Matter 2024-118, 30(b)(6) transcript pp. 44–47",
              system: "Deposition",
              date: "2026-03-19",
              excerpt:
                "Witness: backups “expected”; declined to agree they were a contractual condition.",
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
              excerpt:
                "Matter and client walls are enforced at retrieval. Out-of-scope client content is not returned.",
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
