# 🚀 Voice Agent - 60 Second Setup

## Local (2 mins)
```bash
git clone https://github.com/Hardikwb/Hackathon
cd Hackathon
npm install
npx playwright install chromium
npm run dev
```

Open http://localhost:3000 → 🎤 say: "Book train Kota to Delhi next Friday"

Demo Flow
- Speak/type: "Book from Kota to Delhi next Friday 2 passengers"
- NLP extracts: {from:"Kota", to:"Delhi", date:"2026-02-13", passengers:2}
- Playwright fills IRCTC → payment page ready
- Screenshot + direct checkout link returned

<!-- 
WORKING ON THIS
Live Demo (optional)
https://voice-agent-hackathon.vercel.app
Vercel
- Push to a GitHub repo and use one-click deploy (see README)
 -->

Notes
- The IRCTC adapter will fall back to a local demo flow for the Kota→Delhi demo to avoid CAPTCHA and keep tests stable.
- To test real IRCTC behavior, use site: 'irctc' and be prepared for possible CAPTCHA requirements.

## How to Run (Windows)
- Requirements: Node.js 18+, PowerShell
- Install dependencies:
  - `npm install`
  - `npx playwright install chromium`
- Start locally:
  - Development (server + test UI): `npm run dev`
  - Production server only: `npm start` then open `http://localhost:3000/`
- Use the UI:
  - Open `http://localhost:3000/`
  - Type a command or click Record and speak
  - Example: `Book a train ticket for two passengers from Kota to Delhi next Friday evening`
- Call the API directly (PowerShell):
  - `Invoke-WebRequest -Uri http://localhost:3000/run -Method POST -Body '{"command":"Book a ticket from Kota to Delhi for next Friday","headless":true}' -ContentType 'application/json' | Select-Object -ExpandProperty Content`
- Troubleshooting:
  - Port already in use (EADDRINUSE): stop other processes on port 3000 or run with `cross-env PORT=3001 npm start` and use `http://localhost:3001/`
  - Missing Playwright test runner: run `npm install` to install `@playwright/test`
  - Browser download errors: re-run `npx playwright install chromium`

