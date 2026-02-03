//  MAke this resonive and have a hamburger in it when it become Small

// Self
//  IChange name of uses and usecases to something else
  
import react from 'react';

export type NavSection = 'overview' | 'features' | 'how-it-works' | 'users' | 'demo';

interface NavbarProps {
  onNavigate: (section: NavSection) => void;
  activeSection: NavSection | null;
}

const LINKS: { id: NavSection; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'users', label: 'Users & Use Cases' },
  { id: 'demo', label: 'Demo' },
];

export function Navbar({ onNavigate, activeSection }: NavbarProps) {
  const [pressedId, setPressedId] = react.useState<NavSection | null>(null);

  const handleClick = react.useCallback(
    (id: NavSection) => {
      setPressedId(id);
      onNavigate(id);
      const t = setTimeout(() => setPressedId(null), 300);
      return () => clearTimeout(t);
    },
    [onNavigate]
  );

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-slate-600/80 bg-surface/95 backdrop-blur-md"
      aria-label="Main navigation"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            handleClick('overview');
          }}
          className="text-lg font-bold text-textPrimary hover:text-accentBright transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-2 py-1"
          aria-label="Go to overview"
        >
          Voice Automation
        </a>
        <ul className="flex items-center gap-1 md:gap-2">
          {LINKS.map(({ id, label }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => handleClick(id)}
                className={`
                  nav-link relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface
                  ${activeSection === id ? 'text-accentBright' : 'text-textMuted hover:text-textPrimary'}
                  ${pressedId === id ? 'scale-95' : 'active:scale-95'}
                `}
                aria-current={activeSection === id ? 'true' : undefined}
                aria-label={`Go to ${label}`}
              >
                <span className="relative z-10">{label}</span>
                {activeSection === id && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-accentBright rounded-full animate-nav-underline"
                    aria-hidden
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
