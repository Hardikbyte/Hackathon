import { useState, useCallback, useEffect } from 'react';
import { VoiceRecorder } from './components/VoiceRecorder';
import { IntentDisplay } from './components/IntentDisplay';
import { StatusPanel } from './components/StatusPanel';
import { DownloadAndGitHub } from './components/DownloadAndGitHub';
import { transcribeAudio, getIntent, triggerAutomation, getStatus } from './api';
import type { IntentResult, StatusUpdate } from './types';

const POLL_INTERVAL_MS = 2000;

function App() {
  const [intent, setIntent] = useState<IntentResult | null>(null);
  const [intentLoading, setIntentLoading] = useState(false);
  const [intentError, setIntentError] = useState('');
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [runId, setRunId] = useState<string | null>(null);
  const [lastTranscriptForReplay, setLastTranscriptForReplay] = useState('');

  const handleRecorded = useCallback(async (blob: Blob) => {
    setIntent(null);
    setIntentError('');
    setStatusUpdates([]);
    setStatusError('');
    setRunId(null);
    setIntentLoading(true);
    try {
      const { text: transcribed } = await transcribeAudio(blob);
      const toUse = transcribed?.trim() || '(no speech detected)';
      setLastTranscriptForReplay(toUse !== '(no speech detected)' ? toUse : '');
      const { intent: extracted } = await getIntent(toUse);
      setIntent(extracted);
      setIntentLoading(false);
      const { runId: id, status } = await triggerAutomation(extracted);
      setRunId(id);
      if (status?.length) setStatusUpdates(status);
      setStatusLoading(true);
    } catch (e) {
      setIntentLoading(false);
      setIntentError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      return;
    }
  }, []);

  const pollStatus = useCallback(async () => {
    if (!runId) return;
    try {
      const { updates } = await getStatus(runId);
      setStatusUpdates(updates);
      const hasEnd = updates.some((u) => u.status === 'success' || u.status === 'error');
      if (hasEnd) setStatusLoading(false);
    } catch {
      setStatusLoading(false);
      setStatusError('Could not fetch status.');
    }
  }, [runId]);

  useEffect(() => {
    if (!runId || !statusLoading) return;
    const t = setInterval(pollStatus, POLL_INTERVAL_MS);
    return () => clearInterval(t);
  }, [runId, statusLoading, pollStatus]);

  return (
    <div className="min-h-screen bg-surface text-textPrimary">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <header className="border-b border-slate-600 py-4 px-6">
        <h1 className="text-2xl md:text-3xl font-bold text-textPrimary">
          Voice-Activated Browser Automation
        </h1>
        <p className="text-textMuted text-accessibility-lg mt-1">
          Control booking sites with your voice. No mouse or keyboard required.
        </p>
      </header>
      <main id="main" className="max-w-4xl mx-auto p-6 space-y-6">
        <VoiceRecorder
        onRecorded={handleRecorded}
        lastTranscript={lastTranscriptForReplay}
        onTranscriptConsumed={() => setLastTranscriptForReplay('')}
      />
        <IntentDisplay intent={intent} loading={intentLoading} error={intentError} />
        <StatusPanel updates={statusUpdates} loading={statusLoading} error={statusError} />
        <DownloadAndGitHub />
      </main>
      <footer className="border-t border-slate-600 py-4 px-6 text-center text-textMuted text-sm">
        Built for accessibility (WCAG AA). Wispr Flow · Gemini · n8n · Playwright.
      </footer>
    </div>
  );
}

export default App;
