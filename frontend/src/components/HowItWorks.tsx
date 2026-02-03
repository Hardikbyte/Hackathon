// TODO's -> 



/**
 * How It Works: 5-step flow with animated background glow and step-in animations.
 */
const steps = [
  { number: 1, title: 'Voice Command', description: 'User speaks their intent via browser microphone.', tech: 'Frontend / React', color: 'bg-error text-white border-error' },
  { number: 2, title: 'Transcription', description: 'Audio chunks sent to API for high-accuracy text conversion.', tech: 'Wispr Flow', color: 'bg-accentBright text-white border-accentBright' },
  { number: 3, title: 'Intent Extraction', description: 'Text analyzed to extract action, site, and parameters.', tech: 'Google Gemini', color: 'bg-purple text-white border-purple' },
  { number: 4, title: 'Workflow Trigger', description: 'Backend calls webhook with structured JSON payload.', tech: 'n8n Webhook', color: 'bg-warning text-surface border-warning' },
  { number: 5, title: 'Browser Action', description: 'Headless browser navigates site; updates stream back.', tech: 'Playwright', color: 'bg-success text-white border-success' },
];

export function HowItWorks() {
  return (
    <section
      className="relative py-12 md:py-16 overflow-hidden rounded-2xl"
      aria-labelledby="how-it-works-heading"
    >
      {/* Animated background light / glow + shifting gradient */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl animate-glow-pulse animate-bg-shift"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 50%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 70% 60% at 50% 80%, rgba(13, 148, 136, 0.08) 0%, transparent 50%),
            linear-gradient(90deg, rgba(59,130,246,0.03) 0%, rgba(168,85,247,0.02) 50%, rgba(13,148,136,0.02) 100%)
          `,
          backgroundSize: '200% 200%',
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-surface/40 rounded-2xl pointer-events-none" aria-hidden />
      {/* Decorative animated blobs */}
      <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-gradient-to-tr from-accentBright/40 via-purple/30 to-teal/20 blur-3xl opacity-60 animate-blob pointer-events-none" aria-hidden />
      <div className="absolute right-8 top-10 w-24 h-24 rounded-full bg-accentBright/20 blur-2xl opacity-60 animate-float-y-lg pointer-events-none" aria-hidden />
      <div className="absolute left-6 bottom-6 w-16 h-16 rounded-full bg-teal/20 blur-2xl opacity-60 animate-float-y pointer-events-none" aria-hidden />
      <div className="absolute right-20 bottom-24 w-10 h-10 rounded-full bg-purple/20 blur-xl opacity-60 animate-float-y pointer-events-none" aria-hidden />
      <div className="absolute inset-0 pointer-events-none -z-10">
        <svg className="w-full h-full" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="sparkle" x1="0" x2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.02)"></stop>
              <stop offset="100%" stopColor="rgba(255,255,255,0)"></stop>
            </linearGradient>
          </defs>
          <rect className="animate-bg-shift" width="100%" height="100%" fill="url(#sparkle)" />
        </svg>
      </div>
      <div className="relative">
        <div className="mb-4 w-20 h-1.5 rounded-full bg-gradient-to-r from-accentBright/90 via-purple/70 to-surface/60 animate-pulse" aria-hidden />
        <h2 id="how-it-works-heading" className="text-2xl md:text-3xl font-bold text-textPrimary mb-2">
          How It Works
        </h2>
        <p className="text-textMuted text-accessibility-lg mb-8">
          End-to-end flow from natural language voice command to browser execution.
        </p>
        <div className="overflow-x-auto pb-4 snap-x snap-mandatory">
          <div role="list" className="flex flex-nowrap md:flex-wrap gap-4 md:gap-2 min-w-max md:min-w-0 px-2 md:px-0">
            {steps.map((step, i) => (
              <div
                key={step.number}
                role="listitem"
                tabIndex={0}
                className="flex items-start flex-shrink-0 md:flex-shrink opacity-0 animate-step-in transform transition-transform duration-300 hover:scale-105 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accentBright focus-visible:ring-offset-2 rounded-xl group snap-start"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex flex-col items-center w-40 md:w-36 p-1">
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-bold ${step.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                    aria-hidden
                  >
                    {step.number}
                  </div>
                  <div className="mt-2 p-3 rounded-xl bg-surfaceLight/90 border border-slate-600 text-center backdrop-blur-sm transition-shadow duration-300 group-hover:shadow-2xl group-hover:backdrop-brightness-105 howitworks-card relative overflow-hidden">
                    <h3 className="font-semibold text-textPrimary text-sm">{step.title}</h3>
                    <p className="text-textMuted text-xs mt-1">{step.description}</p>
                    <p className="text-accentBright text-xs mt-2 font-medium">{step.tech}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="block flex-shrink-0 w-6 h-0.5 bg-slate-600 self-center mx-1 transition-colors duration-200 group-hover:bg-accentBright animate-pulse-connector" aria-hidden />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


