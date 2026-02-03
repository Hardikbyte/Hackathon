import { useCallback, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, RotateCcw, Sparkles } from 'lucide-react';
import clsx from 'clsx';
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
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  const stopSpeechRecognition = useCallback(() => {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    if (recognition && typeof recognition.stop === 'function') {
      try {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.stop();
      } catch {
      }
    }
  }, []);

  const stopMediaStreamTracks = useCallback(() => {
    const stream = streamRef.current;
    streamRef.current = null;
    if (!stream) return;
    stream.getTracks().forEach((t) => {
      try {
        t.stop();
      } catch {
      }
    });
  }, []);

  // Add API-returned transcript to replay list
  useEffect(() => {
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
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stopSpeechRecognition();
        stopMediaStreamTracks();
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (blob.size > 0) onRecorded(blob);
      };
      mediaRecorderRef.current = recorder;
      recorder.start(500);
      setIsRecording(true);
      setLiveTranscript('Listening… (say “stop” to finish)');

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let combined = '';
          for (let i = event.resultIndex; i < event.results.length; i += 1) {
            const result = event.results[i];
            const transcript = result?.[0]?.transcript ? String(result[0].transcript) : '';
            if (transcript) combined += transcript;
          }
          const normalized = combined.trim();
          if (normalized) setLiveTranscript(normalized);

          const lower = normalized.toLowerCase().trim();
          if (lower && /\bstop\b/.test(lower)) {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
              setLiveTranscript('Stopping…');
              mediaRecorderRef.current.stop();
              mediaRecorderRef.current = null;
              setIsRecording(false);
            }
          }
        };

        recognition.onerror = () => {
        };

        recognition.onend = () => {
        };

        try {
          recognition.start();
        } catch {
        }
      }
    } catch (err) {
      setLiveTranscript('Microphone access denied. Please allow microphone and try again.');
    }
  }, [onRecorded, stopMediaStreamTracks, stopSpeechRecognition]);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      setLiveTranscript('Stopping…');
      try {
        recorder.stop();
      } catch {
      }
    }
    mediaRecorderRef.current = null;
    stopSpeechRecognition();
    stopMediaStreamTracks();
    setIsRecording(false);
  }, [stopMediaStreamTracks, stopSpeechRecognition]);

  useEffect(() => {
    return () => {
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        try {
          recorder.stop();
        } catch {
        }
      }
      mediaRecorderRef.current = null;
      stopSpeechRecognition();
      stopMediaStreamTracks();
    };
  }, [stopMediaStreamTracks, stopSpeechRecognition]);

  const replay = useCallback((entry: TranscriptEntry) => {
    setLiveTranscript(entry.text);
    // In a real app, you might also trigger the action again here
  }, []);

  return (
    <section
      className="relative rounded-3xl bg-surfaceLight/50 backdrop-blur-md p-8 border border-white/10 shadow-2xl overflow-hidden group"
      aria-labelledby="voice-heading"
    >
      {/* Dynamic Background Glow */}
      <div className={clsx(
        "absolute inset-0 transition-opacity duration-700 pointer-events-none",
        isRecording ? "opacity-100" : "opacity-0"
      )}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8">
        <h2 id="voice-heading" className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-accent" />
          Voice Control
        </h2>

        <div className="relative">
          {/* Ripple Effect Rings */}
          <AnimatePresence>
            {isRecording && (
              <>
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeOut"
                    }}
                    className="absolute inset-0 rounded-full bg-accent/30 z-0"
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={disabled}
            className={clsx(
              "relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border-4",
              isRecording 
                ? "bg-error border-error/30 shadow-error/50" 
                : "bg-accent border-accent/30 shadow-accent/50 hover:bg-accentBright",
              disabled && "opacity-50 cursor-not-allowed grayscale"
            )}
            aria-label={isRecording ? "Stop recording" : "Start recording voice command"}
          >
            {isRecording ? (
              <Square className="w-10 h-10 text-white fill-current" />
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}
          </motion.button>
        </div>

        <div className="space-y-4 w-full max-w-lg">
          <AnimatePresence mode="wait">
            {liveTranscript ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 rounded-2xl bg-surface/80 border border-white/10 backdrop-blur-sm"
              >
                <p className="text-lg text-textPrimary font-medium animate-pulse">
                  {liveTranscript}
                </p>
              </motion.div>
            ) : (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-textMuted text-lg"
              >
                Tap the microphone to start speaking
              </motion.p>
            )}
          </AnimatePresence>

          {replayList.length > 0 && (
            <div className="pt-6 border-t border-white/10 w-full">
              <h3 className="text-sm font-semibold text-textMuted uppercase tracking-wider mb-3">Recent Commands</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {replayList.slice(-3).map((item) => (
                  <motion.button
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => replay(item)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-surfaceLight border border-slate-700 text-sm text-textMuted hover:text-white hover:border-slate-500 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span className="truncate max-w-[150px]">{item.text}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
