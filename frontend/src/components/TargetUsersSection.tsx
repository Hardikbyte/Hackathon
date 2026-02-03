/**
 * Target Users & Use Cases: user categories + use case cards with sample commands.
 */
const userCategories = [
  {
    title: 'Elderly Users',
    description: 'Overcoming tremors & small UI targets',
    borderColor: 'border-l-accentBright',
    icon: (
      <svg className="w-6 h-6 text-accentBright" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    title: 'Motor Impaired',
    description: 'RSI, Arthritis, or Paralysis support',
    borderColor: 'border-l-success',
    icon: (
      <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Contextual Use',
    description: 'Hands-busy or mobile scenarios',
    borderColor: 'border-l-purple',
    icon: (
      <svg className="w-6 h-6 text-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
  },
];

const useCases = [
  {
    title: 'Train Booking (IRCTC)',
    description: 'Handles search, passenger details, and complex form navigation automatically.',
    command: 'Book a train from Delhi to Mumbai for tomorrow morning.',
    iconColor: 'text-success',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    title: 'Flight Search (Goibibo)',
    description: 'Quickly compares options and filters results without endless clicking.',
    command: 'Find the cheapest flight to Bengaluru next Friday.',
    iconColor: 'text-pink-400',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
  },
  {
    title: 'Government Forms',
    description: 'Fills repetitive personal data and navigates multi-page applications.',
    command: 'Fill out the appointment form for Dr. Sharma.',
    iconColor: 'text-warning',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Everyday Utilities',
    description: 'Checks status, refills prescriptions, or retrieves information instantly.',
    command: 'Check the PNR status for my last booking.',
    iconColor: 'text-purple',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export function TargetUsersSection() {
  return (
    <section className="py-12 md:py-16" aria-labelledby="target-users-heading">
      <div className="mb-2 w-12 h-0.5 rounded-full bg-accentBright" aria-hidden />
      <h2 id="target-users-heading" className="text-2xl md:text-3xl font-bold text-textPrimary mb-2">
        Target Users & Use Cases
      </h2>
      <p className="text-textMuted text-accessibility-lg mb-8">
        Bridging the digital divide with voice-first interactions for critical services.
      </p>
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {userCategories.map((cat) => (
          <div
            key={cat.title}
            className={`rounded-xl border border-slate-600 border-l-4 ${cat.borderColor} bg-surfaceLight p-4 flex gap-3`}
          >
            <div className="flex-shrink-0" aria-hidden>{cat.icon}</div>
            <div>
              <h3 className="font-bold text-textPrimary">{cat.title}</h3>
              <p className="text-textMuted text-sm mt-0.5">{cat.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {useCases.map((uc) => (
          <div
            key={uc.title}
            className="rounded-xl border border-slate-600 bg-surfaceLight p-5 flex flex-col"
          >
            <div className={`flex-shrink-0 mb-3 ${uc.iconColor}`} aria-hidden>{uc.icon}</div>
            <h3 className="font-bold text-textPrimary text-lg">{uc.title}</h3>
            <p className="text-textMuted text-sm mt-1 flex-1">{uc.description}</p>
            <div className="mt-4 p-3 rounded-lg bg-surface border border-slate-600 flex items-center gap-2">
              <svg className="w-4 h-4 text-accentBright flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0V8m0 0V4m0 0h4m-4 0H8" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v4" />
              </svg>
              <span className="text-textMuted text-sm italic">&ldquo;{uc.command}&rdquo;</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
