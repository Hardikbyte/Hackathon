# Voice-Activated Browser Automation for Accessibility

A production-ready hackathon project that enables **elderly and motor-impaired users** to control websites (e.g., booking portals) using **voice commands**. The system captures voice via the browser microphone, transcribes with **Wispr Flow**, extracts intent with **Gemini**, and triggers **n8n** workflows that automate the browser with **Playwright**. Voice and visual feedback keep users informed at every step.

---

## Accessibility Problem Statement

Many users cannot reliably use a mouse or keyboard due to:

- **Age-related motor decline** (tremors, reduced dexterity)
- **Temporary or permanent motor impairment** (stroke, arthritis, RSI)
- **Preference for hands-free interaction** in busy or mobile contexts

Booking travel (IRCTC, Goibibo) or filling forms on government/health sites often requires precise clicks and typing. Voice-activated automation removes that barrier: users say what they want (e.g., *"Book a train from Delhi to Mumbai tomorrow"*), and the system executes the steps in the browser while providing clear feedback.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Browser (React Frontend)                                                    │
│  • Voice UI (Record / Stop)  • Live transcript  • Intent display  • Status   │
│  • MediaRecorder → Audio chunks sent to backend                              │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Backend (Node.js + Express)                                                 │
│  • POST /api/transcribe  → Wispr Flow API → text                             │
│  • POST /api/intent      → Gemini API → intent JSON                          │
│  • POST /api/automate    → n8n webhook (intent + params)                     │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  n8n Workflow                                                                │
│  • Webhook trigger  • Branch by intent  • Playwright node (IRCTC/Goibibo)   │
│  • Retries, robust selectors  • Status callback to frontend (SSE or poll)    │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Data flow:**

1. **Voice** → MediaRecorder → backend sends audio to **Wispr Flow** → **transcript text**.
2. **Transcript** → backend sends to **Gemini** → **intent JSON** (action, site, params).
3. **Intent JSON** → backend calls **n8n webhook** with payload.
4. **n8n** runs **Playwright** automation; status updates are sent back (e.g., via webhook callback or SSE).

---

## Technology Stack

| Layer        | Technology |
|-------------|------------|
| Frontend    | React 18, TypeScript, Tailwind CSS, Vite |
| Backend     | Node.js, Express.js |
| Transcription | [Wispr Flow API](https://www.wispr.ai/) |
| Intent      | [Google Gemini API](https://ai.google.dev/) |
| Automation  | n8n + Playwright (community node) |
| Accessibility | WCAG AA, high contrast, large fonts, keyboard-free design |

---

## Local Setup

### Prerequisites

- Node.js 18+
- n8n (Docker or npm: `npx n8n`)
- Wispr Flow API key
- Google Gemini API key

### 1. Clone and install

```bash
git clone <repo-url>
cd voice-activated-browser-automation
npm run install:all
```

### 2. Environment

- Copy `backend/.env.example` to `backend/.env` and set:
  - `WISPR_API_KEY`
  - `GEMINI_API_KEY`
  - `N8N_WEBHOOK_URL` (e.g. `http://localhost:5678/webhook/voice-automation`)
  - `FRONTEND_URL` (e.g. `http://localhost:5173`)

### 3. n8n workflow

- Start n8n: `npx n8n` (or use Docker).
- In n8n: **Import from File** and select `n8n-workflow/voice-automation.json`.
- Activate the workflow and copy the **Production** webhook URL (e.g. `http://localhost:5678/webhook/voice-automation`) into `backend/.env` as `N8N_WEBHOOK_URL`.
- For real browser automation, replace the Code node in the workflow with a Playwright community node (e.g. [n8n-playwright](https://github.com/toema/n8n-playwright)) and add steps for IRCTC/Goibibo selectors.

### 4. Run

- **Backend:** `npm run dev:backend` (default: http://localhost:4000)
- **Frontend:** `npm run dev:frontend` (default: http://localhost:5173)

Open the frontend URL, allow microphone access, and use the voice UI to record commands.

---

## APIs Used

- **Wispr Flow** – Speech-to-text (REST) for voice input. Expects base64 16 kHz WAV; the app sends WebM from the browser—if Wispr rejects it, add a server-side conversion step (e.g. ffmpeg) to WAV before calling the API.
- **Google Gemini** – Intent and parameter extraction from transcript (structured JSON).
- **n8n Webhook** – Receives intent + params and runs the workflow; responds with a `status` array for the frontend.

---

## Demo Video Script (2–3 min)

1. **Problem (15 s):** “Many users can’t use a mouse or keyboard. Booking a train or flight is frustrating.”
2. **Solution (15 s):** “We built a voice-controlled system. You speak; the browser does the rest.”
3. **Live demo (90 s):**
   - Open app, show Record, speak: *“Book a train from Delhi to Mumbai tomorrow.”*
   - Show live transcript and extracted intent (from, to, date).
   - Trigger automation; show status panel (“Opening IRCTC…”, “Filling form…”).
   - Optional: show n8n canvas and Playwright step.
4. **Accessibility (20 s):** “Large buttons, high contrast, no mouse needed. Built for WCAG AA.”
5. **Tech (20 s):** “Wispr for speech, Gemini for intent, n8n and Playwright for automation.”

---

## Potential Improvements

- **Offline / edge:** On-device STT (e.g., Whisper.cpp) for privacy.
- **More sites:** Add workflows for other booking or form-heavy sites.
- **Confirmation step:** “Say ‘confirm’ to proceed” before destructive actions.
- **Multi-language:** Gemini and Wispr support multiple languages; expose in UI.
- **Analytics:** Anonymized usage metrics to improve intent accuracy and flows.

---

## Project Structure

```
.
├── frontend/          # React + TypeScript + Tailwind
├── backend/           # Express API (Wispr, Gemini, n8n)
├── n8n-workflow/      # voice-automation.json
├── prompts/           # Gemini system/user prompts
├── README.md
├── package.json
└── .env.example
```

---

## License

MIT.
