import type { IntentResult } from '../types';

interface IntentDisplayProps {
  intent: IntentResult | null;
  loading?: boolean;
  error?: string;
}

export function IntentDisplay({ intent, loading, error }: IntentDisplayProps) {
  if (loading) {
    return (
      <section
        className="rounded-2xl bg-surfaceLight p-6 border border-slate-600"
        aria-labelledby="intent-heading"
        aria-busy="true"
      >
        <h2 id="intent-heading" className="text-accessibility-xl font-semibold text-textPrimary mb-4">
          Detected intent
        </h2>
        <p className="text-accessibility-lg text-textMuted">Extracting intent…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="rounded-2xl bg-surfaceLight p-6 border border-slate-600"
        aria-labelledby="intent-heading"
      >
        <h2 id="intent-heading" className="text-accessibility-xl font-semibold text-textPrimary mb-4">
          Detected intent
        </h2>
        <p className="text-accessibility-lg text-error" role="alert">
          {error}
        </p>
      </section>
    );
  }

  if (!intent) {
    return (
      <section
        className="rounded-2xl bg-surfaceLight p-6 border border-slate-600"
        aria-labelledby="intent-heading"
      >
        <h2 id="intent-heading" className="text-accessibility-xl font-semibold text-textPrimary mb-4">
          Detected intent
        </h2>
        <p className="text-accessibility-lg text-textMuted">Record a command to see intent here.</p>
      </section>
    );
  }

  return (
    <section
      className="rounded-2xl bg-surfaceLight p-6 border border-slate-600"
      aria-labelledby="intent-heading"
    >
      <h2 id="intent-heading" className="text-accessibility-xl font-semibold text-textPrimary mb-4">
        Detected intent
      </h2>
      <dl className="space-y-2 text-accessibility-lg">
        <div>
          <dt className="text-textMuted">Action</dt>
          <dd className="text-textPrimary font-medium">{intent.action}</dd>
        </div>
        {intent.site && (
          <div>
            <dt className="text-textMuted">Site</dt>
            <dd className="text-textPrimary font-medium">{intent.site}</dd>
          </div>
        )}
        {Object.keys(intent.params).length > 0 && (
          <div>
            <dt className="text-textMuted">Parameters</dt>
            <dd className="mt-1">
              <pre className="p-3 rounded-lg bg-surface text-textPrimary overflow-x-auto text-base border border-slate-600">
                {JSON.stringify(intent.params, null, 2)}
              </pre>
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}
