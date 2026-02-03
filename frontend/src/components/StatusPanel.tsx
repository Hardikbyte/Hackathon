import type { StatusUpdate } from '../types';
import { LoadingLogo } from './LoadingLogo';

interface StatusPanelProps {
  updates: StatusUpdate[];
  loading?: boolean;
  error?: string;
}

const statusStyles: Record<StatusUpdate['status'], string> = {
  pending: 'text-textMuted',
  running: 'text-accent',
  success: 'text-success',
  error: 'text-error',
};

export function StatusPanel({ updates, loading, error }: StatusPanelProps) {
  const hasUpdates = updates.length > 0;

  return (
    <section
      className="rounded-2xl bg-surfaceLight p-6 border border-slate-600"
      aria-labelledby="status-heading"
      aria-live="polite"
    >
      <h2 id="status-heading" className="text-accessibility-xl font-semibold text-textPrimary mb-4">
        Status
      </h2>
      {error && (
        <p className="text-accessibility-lg text-error mb-4" role="alert">
          {error}
        </p>
      )}
      {loading && (
        <div className="mb-4">
          <LoadingLogo
            size="sm"
            label={hasUpdates ? 'Automation in progress' : 'Starting automation'}
            hint={hasUpdates ? 'Tracking live workflow updates' : 'Waiting for the first update from n8n'}
          />
        </div>
      )}
      <ul className="space-y-2">
        {updates.map((u) => (
          <li key={u.id} className={`text-accessibility-lg ${statusStyles[u.status]}`}>
            <span className="font-medium">{u.message}</span>
            {u.detail && <span className="block text-sm text-textMuted mt-0.5">{u.detail}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
