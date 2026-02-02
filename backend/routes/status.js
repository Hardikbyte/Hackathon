import { getRunUpdates } from './automate.js';

export async function statusRoute(req, res) {
  const { runId } = req.params;
  if (!runId) return res.status(400).json({ message: 'Missing runId' });
  const updates = getRunUpdates(runId);
  return res.json({ updates });
}
