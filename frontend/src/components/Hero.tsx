/**
 * Hero section: first thing users see. Clear value prop and visual anchor.
 * Uses existing WCAG-friendly palette and typography.
 */
export function Hero() {
  return (
    <section
      className="relative rounded-2xl overflow-hidden border border-slate-600 bg-surfaceLight"
      aria-labelledby="hero-heading"
    >
      {/* Subtle gradient band for visual interest */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, transparent 50%, rgba(34, 197, 94, 0.08) 100%)',
        }}
        aria-hidden
      />
      <div className="relative p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <h2
              id="hero-heading"
              className="text-accessibility-xl md:text-2xl font-bold text-textPrimary tracking-tight"
            >
              Say it. We do it.
            </h2>
            <p className="text-accessibility-lg text-textMuted max-w-xl">
              Use the <strong className="text-textPrimary">Record</strong> button below to give a voice command.
              We transcribe it, detect your intent, and run the automation—no mouse or keyboard needed.
            </p>
          </div>
          <div
            className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center"
            aria-hidden
          >
            <svg
              className="w-8 h-8 md:w-10 md:h-10 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0V8m0 0V4m0 0h4m-4 0H8"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14v4"
              />
            </svg>
          </div>
        </div>
        <ul className="mt-6 flex flex-wrap gap-4 text-sm text-textMuted" role="list">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" aria-hidden />
            Voice → transcript
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent" aria-hidden />
            Intent extraction
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning" aria-hidden />
            n8n + Playwright
          </li>
        </ul>
      </div>
    </section>
  );
}
