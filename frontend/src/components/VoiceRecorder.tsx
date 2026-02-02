import { useCallback, useRef, useState } from 'react';
import type { TranscriptEntry } from '../types';

interface VoiceRecorderProps {
  onRecorded: (blob: Blob) => void;
  /** When set, this transcript is added to the replay list (e.g. after API returns). */
  lastTranscript?: string;
  onTranscriptConsumed?: () => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onRecorded, lastTranscript, onTranscriptConsumed, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [replayList, setReplayList] = useState<TranscriptEntry[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Add API-returned transcript to replay list
  React.useEffect(() => {
    if (lastTranscript?.trim()) {
      setReplayList((prev) => [
        ...prev,
        { id: crypto.randomUUID(), text: lastTranscript.trim(), timestamp: Date.now() },
      ]);
      onTranscriptConsumed?.();
    }
  }, [lastTranscript, onTranscriptConsumed]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (blob.size > 0) onRecorded(blob);
      };
      mediaRecorderRef.current = recorder;
      recorder.start(500);
      setIsRecording(true);
      setLiveTranscript('Listening…');
    } catch (err) {
      setLiveTranscript('Microphone access denied. Please allow microphone and try again.');
    }
  }, [onRecorded, liveTranscript]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
      setLiveTranscript('');
    }
  }, [isRecording]);

  const replay = useCallback((entry: TranscriptEntry) => {
    setLiveTranscript(entry.text);
  }, []);

  return (
    <section
      className="rounded-2xl bg-surfaceLight p-6 border border-slate-600"
      aria-labelledby="voice-heading"
    >
      <h2 id="voice-heading" className="text-accessibility-xl font-semibold text-textPrimary mb-4">
        Voice control
      </h2>
      <div className="flex flex-wrap items-center gap-4">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            disabled={disabled}
            className="min-h-[56px] min-w-[56px] rounded-full bg-accent hover:bg-accent-dark text-white font-semibold text-accessibility-lg px-6 py-3 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50"
            aria-label="Start recording voice command"
          >
            Record
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="min-h-[56px] min-w-[56px] rounded-full bg-error hover:bg-red-600 text-white font-semibold text-accessibility-lg px-6 py-3 focus:outline-none focus-visible:ring-4 focus-visible:ring-error focus-visible:ring-offset-2"
            aria-label="Stop recording"
          >
            Stop
          </button>
        )}
      </div>
      {liveTranscript && (
        <div className="mt-4 p-4 rounded-xl bg-surface border border-slate-600">
          <p className="text-accessibility-lg text-textPrimary" role="status" aria-live="polite">
            {liveTranscript}
          </p>
        </div>
      )}
      {replayList.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-textMuted mb-2">Recent (replay)</h3>
          <ul className="space-y-2">
            {replayList.slice(-5).reverse().map((entry) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => replay(entry)}
                  className="text-left w-full p-3 rounded-lg bg-surface hover:bg-surfaceLight text-textPrimary text-accessibility-lg border border-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {entry.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
