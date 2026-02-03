import { motion, AnimatePresence } from 'framer-motion';
import { Code, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { IntentResult } from '../types';
import { LoadingLogo } from './LoadingLogo';

interface IntentDisplayProps {
  intent: IntentResult | null;
  loading?: boolean;
  error?: string;
}

export function IntentDisplay({ intent, loading, error }: IntentDisplayProps) {
  return (
    <section
      className="h-full rounded-3xl bg-surfaceLight/50 backdrop-blur-md p-8 border border-white/10 shadow-lg flex flex-col"
      aria-labelledby="intent-heading"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 id="intent-heading" className="text-2xl font-bold text-white flex items-center gap-2">
          <Code className="w-6 h-6 text-purple" />
          Detected Intent
        </h2>
      </div>

      <div className="flex-1 bg-surface/50 rounded-xl border border-white/5 p-4 overflow-hidden relative min-h-[200px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <LoadingLogo
                label="Analyzing your voice command"
                hint="Transcribing audio and extracting intent"
              />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-error gap-3 text-center p-4"
            >
              <AlertCircle className="w-10 h-10" />
              <p>{error}</p>
            </motion.div>
          ) : intent ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-success mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Analysis Complete</span>
              </div>
              
              <div className="space-y-3">
                <div className="bg-surface/80 rounded-lg p-3 border border-white/5">
                  <span className="text-textMuted text-xs uppercase tracking-wider block mb-1">Action</span>
                  <span className="text-lg text-accentBright font-mono">{intent.action}</span>
                </div>
                
                {intent.site && (
                  <div className="bg-surface/80 rounded-lg p-3 border border-white/5">
                    <span className="text-textMuted text-xs uppercase tracking-wider block mb-1">Target Site</span>
                    <span className="text-lg text-textPrimary font-mono">{intent.site}</span>
                  </div>
                )}

                {Object.keys(intent.params).length > 0 && (
                  <div className="bg-surface/80 rounded-lg p-3 border border-white/5">
                    <span className="text-textMuted text-xs uppercase tracking-wider block mb-1">Parameters</span>
                    <pre className="text-sm text-textMuted font-mono overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(intent.params, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-textMuted/50 gap-3"
            >
              <Code className="w-12 h-12 opacity-20" />
              <p>Waiting for input...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
