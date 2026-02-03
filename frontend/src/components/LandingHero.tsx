/**
 * Landing hero: title with accent line, subtitle box, and tech stack icons.
 * Matches design: Voice-Activated / Browser Automation / for Accessibility.
 */
export function LandingHero() {
  return (
    <section className="relative text-center py-12 md:py-16" aria-labelledby="landing-heading">
      {/* Accent line above title */}
      <div className="w-16 h-1 rounded-full bg-success mx-auto mb-6" aria-hidden />
      <h1
        id="landing-heading"
        className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight max-w-4xl mx-auto"
      >
        <span className="text-textPrimary block">Voice-Activated</span>
        <span className="text-accentBright block">Browser Automation</span>
        <span className="text-textPrimary block">for Accessibility</span>
      </h1>
      <p
        className="mt-6 max-w-2xl mx-auto px-4 py-3 rounded-xl bg-teal-light/10 border border-teal-light/30 text-textPrimary text-lg md:text-xl"
        style={{ backgroundColor: 'rgba(94, 234, 212, 0.08)' }}
      >
        Empowering elderly and motor-impaired users with hands-free web control.
      </p>
      {/* Tech stack icons */}
      <div className="mt-10 flex flex-wrap justify-center gap-8 md:gap-12" role="list" aria-label="Technologies">
        <div className="flex flex-col items-center gap-2" role="listitem">
          <div className="w-12 h-12 rounded-xl bg-teal-light/20 border border-teal-light/40 flex items-center justify-center text-teal-light">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0V8m0 0V4m0 0h4m-4 0H8" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v4" />
            </svg>
          </div>
          <span className="text-textPrimary font-medium text-sm uppercase tracking-wider">Wispr Flow</span>
        </div>
        <div className="flex flex-col items-center gap-2" role="listitem">
          <div className="w-12 h-12 rounded-xl bg-teal-light/20 border border-teal-light/40 flex items-center justify-center text-teal-light">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="text-textPrimary font-medium text-sm uppercase tracking-wider">Gemini AI</span>
        </div>
        <div className="flex flex-col items-center gap-2" role="listitem">
          <div className="w-12 h-12 rounded-xl bg-teal-light/20 border border-teal-light/40 flex items-center justify-center text-teal-light">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-textPrimary font-medium text-sm uppercase tracking-wider">n8n + Playwright</span>
        </div>
      </div>
    </section>
  );
}
