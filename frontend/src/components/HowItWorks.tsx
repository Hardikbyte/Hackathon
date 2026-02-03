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
      {/* Animated background light / glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl animate-glow-pulse"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 50%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 70% 60% at 50% 80%, rgba(13, 148, 136, 0.08) 0%, transparent 50%)
          `,
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-surface/40 rounded-2xl pointer-events-none" aria-hidden />
      <div className="relative">
        <div className="mb-2 w-12 h-0.5 rounded-full bg-accentBright" aria-hidden />
        <h2 id="how-it-works-heading" className="text-2xl md:text-3xl font-bold text-textPrimary mb-2">
          How It Works
        </h2>
        <p className="text-textMuted text-accessibility-lg mb-10">
          End-to-end flow from natural language voice command to browser execution.
        </p>
        <div className="overflow-x-auto pb-4">
          <div className="flex flex-nowrap md:flex-wrap gap-4 md:gap-2 min-w-max md:min-w-0">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="flex items-start flex-shrink-0 md:flex-shrink opacity-0 animate-step-in"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex flex-col items-center w-40 md:w-36">
                  <div
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg font-bold ${step.color} shadow-lg`}
                    aria-hidden
                  >
                    {step.number}
                  </div>
                  <div className="mt-2 p-3 rounded-xl bg-surfaceLight/90 border border-slate-600 text-center backdrop-blur-sm">
                    <h3 className="font-semibold text-textPrimary text-sm">{step.title}</h3>
                    <p className="text-textMuted text-xs mt-1">{step.description}</p>
                    <p className="text-accentBright text-xs mt-2 font-medium">{step.tech}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block flex-shrink-0 w-6 h-0.5 bg-slate-600 self-[4.5rem] mx-1" aria-hidden />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


