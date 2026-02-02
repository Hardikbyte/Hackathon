# n8n Workflow: Voice Automation

Import `voice-automation.json` into n8n (Import from File). The workflow:

1. **Webhook** – Receives POST with `{ intent, runId }` from the backend.
2. **Code** – Builds a demo `status` array by intent (IRCTC/Goibibo/other).
3. **Respond to Webhook** – Returns `{ runId, status }` to the backend.

## Adding real browser automation (Playwright)

- Install a Playwright node (e.g. [n8n-playwright](https://github.com/toema/n8n-playwright)) in your n8n instance.
- Replace or extend the Code node with a branch by `intent.action` / `intent.site`.
- For **IRCTC**: navigate to the site, fill from/to/date using robust selectors; add retries for flaky elements.
- For **Goibibo**: same pattern for flight search.
- Keep returning a `status` array (e.g. "Opening IRCTC…", "Filling form…", "Done") so the frontend status panel stays in sync.

Use the Production webhook URL in `backend/.env` as `N8N_WEBHOOK_URL`.
