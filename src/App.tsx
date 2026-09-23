import { useCallback, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SideDataStream } from './components/effects/SideDataStream';
import { CRTOverlay } from './components/effects/CRTOverlay';
import { TopBar } from './components/layout/TopBar';
import { TerminalSidebar } from './components/layout/TerminalSidebar';
import { MobileNavigation } from './components/layout/MobileNavigation';
import { BottomStatusBar } from './components/layout/BottomStatusBar';
import { BootScreen } from './components/system/BootScreen';
import { HeroSection } from './components/sections/HeroSection';
import { LatestCommit } from './components/sections/LatestCommit';
import { AboutSection } from './components/sections/AboutSection';
import { BeyondTheCodeSection } from './components/sections/BeyondTheCodeSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { CertificatesSection } from './components/sections/CertificatesSection';
import { ContactSection } from './components/sections/ContactSection';
import { InteractiveTerminal } from './components/terminal/InteractiveTerminal';
import { useActiveSection } from './hooks/useActiveSection';
import { usePortfolio } from './context/PortfolioContext';
import { ProtectedRoute } from './components/manage/ProtectedRoute';
import { ManageLayout } from './components/manage/ManageLayout';
import { ManageDashboard } from './pages/manage/ManageDashboard';
import { ManageProfile } from './pages/manage/ManageProfile';
import { ManageCollection } from './pages/manage/ManageCollection';
import { ManageAppearance } from './pages/manage/ManageAppearance';
import { ManageMessages } from './pages/manage/ManageMessages';
import { ManagePersonal } from './pages/manage/ManagePersonal';
import { ProjectDetail } from './pages/ProjectDetail';

type AppPhase = 'booting' | 'failed' | 'revealing';
const MIN_BOOT_DURATION = 950;
const CRITICAL_TIMEOUT = 15000;
const FAILURE_DISPLAY_DURATION = 1200;
let initialBootCompleted = false;

function PortfolioContent() {
  const active = useActiveSection();
  const location = useLocation();
  const { settings: resource } = usePortfolio();
  const settings = resource.data;
  useEffect(() => { if (location.hash) window.requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView()); }, [location.hash]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const openTerminal = useCallback(() => setTerminalOpen(true), []);
  const closeTerminal = useCallback(() => setTerminalOpen(false), []);
  return <div className="portfolio-reveal">{settings?.sideStreamEnabled && <SideDataStream />}{settings?.crtEnabled && <CRTOverlay />}<div className="app-shell"><TopBar active={active} onMenuToggle={() => setMenuOpen(current => !current)} /><MobileNavigation open={menuOpen} active={active} onClose={() => setMenuOpen(false)} /><div className="app-layout"><TerminalSidebar active={active} /><main className="main-content"><HeroSection /><LatestCommit /><AboutSection /><BeyondTheCodeSection /><ProjectsSection /><SkillsSection /><ExperienceSection /><CertificatesSection /><ContactSection /><div className="end-marker">// END OF FILE <span>— Thanks for scrolling.</span></div></main></div><InteractiveTerminal open={terminalOpen} onOpen={openTerminal} onClose={closeTerminal} /><BottomStatusBar onTerminalOpen={openTerminal} /></div></div>;
}

function PublicLanding() {
  const { profile, settings, retry } = usePortfolio();
  const [phase, setPhase] = useState<AppPhase>(() => initialBootCompleted ? 'revealing' : 'booting');
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [completing, setCompleting] = useState(false);
  const criticalReady = !profile.loading && !settings.loading && !!profile.data && !!settings.data && !profile.error && !settings.error;
  const criticalError = profile.error || settings.error || (!profile.loading && !profile.data ? 'Profile is unavailable.' : null) || (!settings.loading && !settings.data ? 'Site settings are unavailable.' : null) || (timedOut ? 'The portfolio API did not respond in time.' : null);

  useEffect(() => {
    if (phase === 'revealing') return;
    const minimum = window.setTimeout(() => setMinimumElapsed(true), MIN_BOOT_DURATION);
    return () => window.clearTimeout(minimum);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'booting' || criticalReady) return;
    const timeout = window.setTimeout(() => setTimedOut(true), CRITICAL_TIMEOUT);
    return () => window.clearTimeout(timeout);
  }, [phase, criticalReady]);

  useEffect(() => {
    if (phase === 'booting' && criticalError) setPhase('failed');
  }, [phase, criticalError]);

  useEffect(() => {
    if (phase !== 'failed') return;
    const timeout = window.setTimeout(() => { initialBootCompleted = true; setPhase('revealing'); }, FAILURE_DISPLAY_DURATION);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  const canComplete = phase === 'booting' && criticalReady && (minimumElapsed || settings.data?.bootEnabled === false);
  useEffect(() => {
    if (!canComplete) return;
    setCompleting(true);
    const timeout = window.setTimeout(() => { initialBootCompleted = true; setPhase('revealing'); }, 180);
    return () => window.clearTimeout(timeout);
  }, [canComplete]);

  const handleRetry = useCallback(() => {
    setTimedOut(false);
    setCompleting(false);
    setPhase('booting');
    retry();
  }, [retry]);

  const revealPortfolio = useCallback(() => { initialBootCompleted = true; setPhase('revealing'); }, []);

  return <><PortfolioContent />{phase !== 'revealing' && <BootScreen os={settings.data?.systemOS || 'portfolioOS'} username={settings.data?.terminalUsername} hostname={settings.data?.terminalHostname} dataReady={criticalReady} skipCosmetics={false} completing={completing} error={phase === 'failed' ? criticalError || 'Unable to load portfolio data.' : null} onRetry={handleRetry} onSkip={revealPortfolio} onContinue={revealPortfolio} />}</>;
}

export default function App() {
  return <Routes><Route path="/" element={<PublicLanding />} /><Route path="/projects/:slug" element={<ProjectDetail />} /><Route element={<ProtectedRoute />}><Route path="/manage" element={<ManageLayout />}><Route index element={<ManageDashboard />} /><Route path="profile" element={<ManageProfile />} /><Route path="projects" element={<ManageCollection resource="projects" title="Projects" description="Create, edit, and order portfolio projects." />} /><Route path="skills" element={<ManageCollection resource="skills" title="Skills" description="Manage the packages shown on your portfolio." />} /><Route path="experience" element={<ManageCollection resource="experience" title="Experience" description="Keep your work history current." />} /><Route path="certificates" element={<ManageCollection resource="certificates" title="Certificates" description="Publish verified credentials." />} /><Route path="personal" element={<ManagePersonal />} /><Route path="appearance" element={<ManageAppearance />} /><Route path="messages" element={<ManageMessages />} /><Route path="settings" element={<Navigate to="/manage/appearance" replace />} /></Route></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
}
