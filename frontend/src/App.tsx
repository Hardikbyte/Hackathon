import { useState, useCallback, useEffect, useRef } from 'react';
import { Navbar, type NavSection } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { FeaturesSection } from './components/FeaturesSection';
import { HowItWorks } from './components/HowItWorks';
import { TargetUsersSection } from './components/TargetUsersSection';
import { VoiceRecorder } from './components/VoiceRecorder';
import { IntentDisplay } from './components/IntentDisplay';
import { StatusPanel } from './components/StatusPanel';
// import { DownloadAndGitHub } from './components/DownloadAndGitHub';
import { transcribeAudio, getIntent, triggerAutomation, getStatus } from './api';
import type { IntentResult, StatusUpdate } from './types';

const SECTION_IDS: NavSection[] = ['overview', 'features', 'how-it-works', 'users', 'demo'];
const NAV_OFFSET = 80;

const POLL_INTERVAL_MS = 2000;

function App() {
  const overviewRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const usersRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<NavSection | null>(null);
  const [intent, setIntent] = useState<IntentResult | null>(null);
  const [intentLoading, setIntentLoading] = useState(false);
  const [intentError, setIntentError] = useState('');
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [runId, setRunId] = useState<string | null>(null);
  const [lastTranscriptForReplay, setLastTranscriptForReplay] = useState('');

  const handleRecorded = useCallback(async (blob: Blob) => {
    setIntent(null);
    setIntentError('');
    setStatusUpdates([]);
    setStatusError('');
    setRunId(null);
    setIntentLoading(true);
    try {
      const { text: transcribed } = await transcribeAudio(blob);
      const toUse = transcribed?.trim() || '(no speech detected)';
      setLastTranscriptForReplay(toUse !== '(no speech detected)' ? toUse : '');
      const { intent: extracted } = await getIntent(toUse);
      setIntent(extracted);
      setIntentLoading(false);
      const { runId: id, status } = await triggerAutomation(extracted);
      setRunId(id);
      if (status?.length) setStatusUpdates(status);
      setStatusLoading(true);
    } catch (e) {
      setIntentLoading(false);
      setIntentError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      return;
    }
  }, []);

  const pollStatus = useCallback(async () => {
    if (!runId) return;
    try {
      const { updates } = await getStatus(runId);
      setStatusUpdates(updates);
      const hasEnd = updates.some((u) => u.status === 'success' || u.status === 'error');
      if (hasEnd) setStatusLoading(false);
    } catch {
      setStatusLoading(false);
      setStatusError('Could not fetch status.');
    }
  }, [runId]);

  useEffect(() => {
    if (!runId || !statusLoading) return;
    const t = setInterval(pollStatus, POLL_INTERVAL_MS);
    return () => clearInterval(t);
  }, [runId, statusLoading, pollStatus]);

  const scrollToSection = useCallback((section: NavSection) => {
    const el =
      section === 'overview' ? overviewRef.current
      : section === 'features' ? featuresRef.current
      : section === 'how-it-works' ? howItWorksRef.current
      : section === 'users' ? usersRef.current
      : demoRef.current;
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useEffect(() => {
    const refMap: Record<NavSection, React.RefObject<HTMLElement | null>> = {
      overview: overviewRef,
      features: featuresRef,
      'how-it-works': howItWorksRef,
      users: usersRef,
      demo: demoRef,
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = SECTION_IDS.find(
            (s) => refMap[s].current === e.target
          );
          if (id) setActiveSection(id);
        }
      },
      { rootMargin: `-${NAV_OFFSET}px 0px -60% 0px`, threshold: 0 }
    );
    SECTION_IDS.forEach((id) => {
      const ref = refMap[id];
      if (ref?.current) observer.observe(ref.current);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToDemo = useCallback(() => {
    demoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className="min-h-screen bg-surface text-textPrimary relative z-10">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Navbar onNavigate={scrollToSection} activeSection={activeSection} />
      <main id="main" className="max-w-5xl mx-auto px-6 pt-20 pb-8 md:pt-24 md:pb-12">
        <div ref={overviewRef} id="overview" className="scroll-mt-20">
          <LandingHero />
        </div>
        <div ref={featuresRef} id="features" className="scroll-mt-20">
          <FeaturesSection onTryDemo={scrollToDemo} />
        </div>
        <div ref={howItWorksRef} id="how-it-works" className="scroll-mt-20">
          <HowItWorks />
        </div>
        <div ref={usersRef} id="users" className="scroll-mt-20">
          <TargetUsersSection />
        </div>
        <div ref={demoRef} id="demo" className="pt-8 scroll-mt-20">
          <h2 className="text-2xl font-bold text-textPrimary mb-6">Live Demo</h2>
          <div className="space-y-6">
            <VoiceRecorder
              onRecorded={handleRecorded}
              lastTranscript={lastTranscriptForReplay}
              onTranscriptConsumed={() => setLastTranscriptForReplay('')}
            />
            <IntentDisplay intent={intent} loading={intentLoading} error={intentError} />
            <StatusPanel updates={statusUpdates} loading={statusLoading} error={statusError} />
            
            
            {/* <DownloadAndGitHub /> */}


          </div>
        </div>
      </main>
      <footer className="border-t border-slate-600 mt-16 py-6 px-6 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-textMuted text-sm">
          <div className="flex flex-wrap gap-4">
            <a href="#" className="hover:text-textPrimary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">MIT License</a>
            <span>Open Source Hackathon Project</span>
          </div>
          <div className="flex flex-col sm:items-end gap-1">
            <span>Designed for Accessibility</span>
            <span>Accessibility Hackathon 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
