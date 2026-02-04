import { createRun, addUpdate } from '../automation/runStore.js';
import { runAgent } from '../automation/agent.js';

function buildStatus({ status, message, step, totalSteps, done, runId }) {
  return {
    status,
    message,
    step,
    totalSteps,
    done,
    runId,
    timestamp: Date.now(),
  };
}

export function automateRoute(bus) {
  return async function handler(req, res) {
    const { intent, command } = req.body || {};
    const resolved = command || intent?.action || intent?.text;
    if (!resolved) return res.status(400).json({ ok: false, message: 'Missing command' });
    const runId = createRun(resolved);
    const queued = buildStatus({
      status: 'progress',
      message: 'Command received. Starting automation...',
      step: 1,
      totalSteps: 8,
      done: false,
      runId,
    });
    addUpdate(runId, queued);
    bus.broadcast(queued);
    runAgent({ command: resolved, bus, runId });
    return res.json({ ok: true, runId });
  };
}

// import fetch from 'node-fetch';
// import { randomUUID } from 'crypto';

// const runs = new Map();

// export async function automateRoute(req, res) {
//   const { intent } = req.body || {};
//   const webhookUrl = process.env.N8N_WEBHOOK_URL;
//   if (!webhookUrl) {
//     return res.status(500).json({ ok: false, message: 'N8N_WEBHOOK_URL not configured' });
//   }
//   if (!intent || !intent.action) {
//     return res.status(400).json({ ok: false, message: 'Missing intent' });
//   }
//   const runId = randomUUID();
//   runs.set(runId, [
//     {
//       id: randomUUID(),
//       timestamp: Date.now(),
//       status: 'running',
//       message: 'Triggering n8n workflow...',
//       detail: intent.action,
//     },
//   ]);
//   try {
//     const response = await fetch(webhookUrl, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ intent, runId }),
//     });
//     const data = await response.json().catch(() => ({}));
//     const updates = runs.get(runId) || [];
//     if (response.ok && Array.isArray(data.status)) {
//       data.status.forEach((u) => updates.push({
//         id: randomUUID(),
//         timestamp: Date.now(),
//         status: u.status || 'running',
//         message: u.message || '',
//         detail: u.detail,
//       }));
//     } else if (response.ok) {
//       updates.push({
//         id: randomUUID(),
//         timestamp: Date.now(),
//         status: 'success',
//         message: 'Workflow triggered.',
//         detail: data.message || undefined,
//       });
//     } else {
//       updates.push({
//         id: randomUUID(),
//         timestamp: Date.now(),
//         status: 'error',
//         message: 'Workflow failed.',
//         detail: data.message || response.statusText,
//       });
//     }
//     runs.set(runId, updates);
//     return res.json({ ok: true, runId, status: updates });
//   } catch (e) {
//     console.error(e);
//     const updates = runs.get(runId) || [];
//     updates.push({
//       id: randomUUID(),
//       timestamp: Date.now(),
//       status: 'error',
//       message: 'Could not reach n8n. Is it running?',
//       detail: e.message,
//     });
//     runs.set(runId, updates);
//     return res.json({ ok: false, runId, status: updates });
//   }
// }

// export function getRunUpdates(runId) {
//   return runs.get(runId) || [];
// }
