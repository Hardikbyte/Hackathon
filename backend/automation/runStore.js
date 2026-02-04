import { randomUUID } from 'crypto';

const runs = new Map();

export function createRun(command) {
  const runId = randomUUID();
  runs.set(runId, {
    command,
    updates: [],
    createdAt: Date.now(),
  });
  return runId;
}

export function addUpdate(runId, update) {
  const run = runs.get(runId);
  if (!run) return;
  run.updates.push(update);
}

export function getUpdates(runId) {
  const run = runs.get(runId);
  return run ? run.updates : [];
}

export function hasRun(runId) {
  return runs.has(runId);
}
