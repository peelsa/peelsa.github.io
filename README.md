# One domain · two doors

Source of truth: `../SITE-BRIEF.md`, `../AGENTS.md`.

Temporary wordmark: `Onsite` in `js/config.js` (`SITE.brand`) — swap when the parent name locks.

## Map

| Path | File |
|------|------|
| `/` | `index.html` |
| `/plants` | `plants.html` |
| `/legal` | `legal.html` |
| `/how-it-works` | `how-it-works.html` |
| `/security` | `security.html` |
| `/hardware` | `hardware.html` |
| `/pricing` | `pricing.html` |
| `/about` | `about.html` |
| `/contact` | `contact.html` |

Old URLs (`product`, `approach`, `architecture`, `offerings`) redirect.

## Preview

```powershell
cd site
python -m http.server 5173
```

## Rules

- Do not mix plant and legal talk tracks across doors
- No healthcare
- No second brand / domain
