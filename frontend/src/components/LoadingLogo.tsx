import clsx from 'clsx';

interface LoadingLogoProps {
  label: string;
  hint?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const SIZE_MAP = {
  sm: {
    box: 'w-14 h-14',
    glow: 'w-24 h-24',
    bar: 'w-1.5',
    label: 'text-base',
  },
  md: {
    box: 'w-20 h-20',
    glow: 'w-32 h-32',
    bar: 'w-2',
    label: 'text-accessibility-lg',
  },
};

export function LoadingLogo({ label, hint, size = 'md', className }: LoadingLogoProps) {
  const styles = SIZE_MAP[size];
  const barHeights = size === 'sm' ? [10, 18, 14] : [16, 26, 20];

  return (
    <div
      className={clsx('flex flex-col items-center text-center gap-3', className)}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex items-center justify-center">
        <div
          className={clsx(
            'absolute rounded-full bg-gradient-to-br from-accent/40 via-purple/30 to-teal/40 blur-2xl animate-pulse',
            styles.glow
          )}
        />
        <div
          className={clsx(
            'relative rounded-2xl bg-surface border border-white/10 shadow-xl flex items-center justify-center',
            styles.box
          )}
        >
          <div
            className="absolute -inset-1 rounded-2xl border border-accent/40 animate-spin"
            style={{ animationDuration: '7s' }}
            aria-hidden="true"
          />
          <div className="flex items-end gap-1.5">
            {barHeights.map((height, index) => (
              <span
                key={`bar-${height}-${index}`}
                className={clsx('rounded-full bg-accent/90 animate-pulse', styles.bar)}
                style={{ height, animationDelay: `${index * 0.2}s` }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <p className={clsx(styles.label, 'font-semibold text-textPrimary')}>{label}</p>
        {hint && <p className="text-sm text-textMuted">{hint}</p>}
      </div>
    </div>
  );
}
