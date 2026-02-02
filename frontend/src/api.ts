import type { IntentResult, StatusUpdate } from './types';

const API_BASE = '/api';

export async function transcribeAudio(blob: Blob): Promise<{ text: string }> {
  const formData = new FormData();
  formData.append('audio', blob, 'recording.webm');
  const res = await fetch(`${API_BASE}/transcribe`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Transcription failed');
  }
  return res.json();
}

export async function getIntent(text: string): Promise<{ intent: IntentResult }> {
  const res = await fetch(`${API_BASE}/intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Intent extraction failed');
  }
  return res.json();
}

export async function triggerAutomation(intent: IntentResult): Promise<{ runId: string; status?: StatusUpdate[] }> {
  const res = await fetch(`${API_BASE}/automate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intent }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Automation trigger failed');
  }
  return res.json();
}

export async function getStatus(runId: string): Promise<{ updates: StatusUpdate[] }> {
  const res = await fetch(`${API_BASE}/status/${runId}`);
  if (!res.ok) throw new Error('Status fetch failed');
  return res.json();
}

export async function downloadProjectZip(): Promise<Blob> {
  const res = await fetch(`${API_BASE}/download-project`);
  if (!res.ok) throw new Error('Download failed');
  return res.blob();
}

export async function createGitHubRepo(options: {
  name: string;
  description: string;
  isPublic: boolean;
}): Promise<{ url: string; cloneUrl: string }> {
  const res = await fetch(`${API_BASE}/github/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'GitHub repo creation failed');
  }
  return res.json();
}
