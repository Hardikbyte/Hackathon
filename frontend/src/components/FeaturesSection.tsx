// Page of features page -2
export function FeaturesSection({ onTryDemo }: { onTryDemo: () => void }) {
  const features = [
    {
      title: 'Restores Digital Independence',
      description: 'Empowers elderly and motor-impaired users to navigate complex services without assistance.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      iconBg: 'bg-accentBright/20 text-accentBright border-accentBright/40',
    },
    {
      title: 'Reduces Friction',
      description: 'Transforms multi-step, error-prone forms into simple, natural language conversations.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBg: 'bg-success/20 text-success border-success/40',
    },
    {
      title: 'Inclusive Compliance',
      description: 'Helps organizations meet and exceed accessibility goals with minimal infrastructure changes.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      iconBg: 'bg-purple/20 text-purple border-purple/40',
    },
  ];

  const techStack = [
    { name: 'Wispr Flow', dot: 'bg-accentBright' },
    { name: 'Gemini', dot: 'bg-purple' },
    { name: 'n8n', dot: 'bg-error' },
    { name: 'Playwright', dot: 'bg-success' },
  ];

  return (
    <section className="py-12 md:py-16" aria-labelledby="features-heading">
      <div className="grid lg:grid-cols-[1fr,380px] gap-10 lg:gap-12 items-start">
        {/* Left: title + feature cards */}
        <div>
          <h2 id="features-heading" className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
            <span className="text-textPrimary">Bridging the </span>
            <span className="text-accentBright">Digital Divide</span>
            <span className="text-textPrimary"> with </span>
            <span className="text-success">Voice Automation</span>
          </h2>
          <ul className="space-y-6">
            {features.map((f, i) => (
              <li key={i} className="flex gap-4">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full border flex items-center justify-center ${f.iconBg}`}
                  aria-hidden
                >
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-textPrimary mb-1">{f.title}</h3>
                  <p className="text-textMuted text-accessibility-lg">{f.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* Right: CTA card */}
        <div
          className="rounded-2xl border-2 p-6 md:p-8 bg-surfaceCard border-teal-light/40 shadow-lg"
          style={{ boxShadow: '0 0 24px rgba(94, 234, 212, 0.12)' }}
        >
          <h3 className="text-2xl font-bold text-textPrimary mb-2">Ready to Automate?</h3>
          <p className="text-textMuted text-accessibility-lg mb-6">
            Experience the future of accessible web interaction today.
          </p>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={onTryDemo}
              className="flex items-center justify-center gap-2 w-full min-h-[48px] px-6 py-3 rounded-xl bg-accentBright hover:bg-accent-dark text-white font-semibold text-accessibility-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2"
              aria-label="Try the live demo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0V8m0 0V4m0 0h4m-4 0H8" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v4" />
              </svg>
              Try the Live Demo
            </button>
            <a
              href="https://github.com/Hardikwb/VoiceAutomation"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full min-h-[48px] px-6 py-3 rounded-xl bg-surfaceLight hover:bg-slate-600 text-textPrimary font-semibold text-accessibility-lg border border-slate-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2"
              aria-label="View source code on GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View Source Code
            </a>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-600 flex flex-wrap gap-3">
            {techStack.map((t) => (
              <span key={t.name} className="flex items-center gap-2 text-sm text-textMuted">
                <span className={`w-2 h-2 rounded-full ${t.dot}`} aria-hidden />
                {t.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
