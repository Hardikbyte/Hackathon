import { getUpdates } from '../automation/runStore.js';

export async function statusRoute(req, res) {
  const { runId } = req.params;
  if (!runId) return res.status(400).json({ ok: false, message: 'Missing runId' });
  const updates = getUpdates(runId);
  return res.json({
    ok: true,
    updates,
    message: updates.length ? undefined : 'No updates yet.',
  });
}
