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

export function voiceCommandRoute(bus) {
  return async function handler(req, res) {
    const { command } = req.body || {};
    if (!command) return res.status(400).json({ ok: false, message: 'Missing command' });
    const runId = createRun(command);
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
    runAgent({ command, bus, runId });
    return res.json({ ok: true, runId });
  };
}
