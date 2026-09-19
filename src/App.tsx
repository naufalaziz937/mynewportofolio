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
import { ProjectsSection } from './components/sections/ProjectsSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { CertificatesSection } from './components/sections/CertificatesSection';
import { ContactSection } from './components/sections/ContactSection';
import { InteractiveTerminal } from './components/terminal/InteractiveTerminal';
import { useActiveSection } from './hooks/useActiveSection';
import { usePortfolio } from './context/PortfolioContext';
import { defaultSettings } from './data/profile';
import { ProtectedRoute } from './components/manage/ProtectedRoute';
import { ManageLayout } from './components/manage/ManageLayout';
import { ManageDashboard } from './pages/manage/ManageDashboard';
import { ManageProfile } from './pages/manage/ManageProfile';
import { ManageCollection } from './pages/manage/ManageCollection';
import { ManageAppearance } from './pages/manage/ManageAppearance';
import { ManageMessages } from './pages/manage/ManageMessages';
import { ProjectDetail } from './pages/ProjectDetail';

function PublicLanding() {
  const active = useActiveSection();
  const location = useLocation();
  const { settings: resource } = usePortfolio();
  const settings = resource.data ?? defaultSettings;
  useEffect(() => { document.title = settings.siteTitle; }, [settings.siteTitle]);
  useEffect(() => { if (location.hash) window.requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView()); }, [location.hash]);
  const [booted, setBooted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const finishBoot = useCallback(() => setBooted(true), []);
  const openTerminal = useCallback(() => setTerminalOpen(true), []);
  const closeTerminal = useCallback(() => setTerminalOpen(false), []);
  return <>{settings.sideStreamEnabled && <SideDataStream />}{settings.crtEnabled && <CRTOverlay />}<div className="app-shell"><TopBar active={active} onMenuToggle={() => setMenuOpen(current => !current)} /><MobileNavigation open={menuOpen} active={active} onClose={() => setMenuOpen(false)} /><div className="app-layout"><TerminalSidebar active={active} /><main className="main-content"><HeroSection /><LatestCommit /><AboutSection /><ProjectsSection /><SkillsSection /><ExperienceSection /><CertificatesSection /><ContactSection /><div className="end-marker">// END OF FILE <span>— Thanks for scrolling.</span></div></main></div><InteractiveTerminal open={terminalOpen} onOpen={openTerminal} onClose={closeTerminal} /><BottomStatusBar onTerminalOpen={openTerminal} /></div>{!booted && settings.bootEnabled && <BootScreen onComplete={finishBoot} os={settings.systemOS} username={settings.terminalUsername} hostname={settings.terminalHostname} />}</>;
}

export default function App() {
  return <Routes><Route path="/" element={<PublicLanding />} /><Route path="/projects/:slug" element={<ProjectDetail />} /><Route element={<ProtectedRoute />}><Route path="/manage" element={<ManageLayout />}><Route index element={<ManageDashboard />} /><Route path="profile" element={<ManageProfile />} /><Route path="projects" element={<ManageCollection resource="projects" title="Projects" description="Create, edit, and order portfolio projects." />} /><Route path="skills" element={<ManageCollection resource="skills" title="Skills" description="Manage the packages shown on your portfolio." />} /><Route path="experience" element={<ManageCollection resource="experience" title="Experience" description="Keep your work history current." />} /><Route path="certificates" element={<ManageCollection resource="certificates" title="Certificates" description="Publish verified credentials." />} /><Route path="appearance" element={<ManageAppearance />} /><Route path="messages" element={<ManageMessages />} /><Route path="settings" element={<Navigate to="/manage/appearance" replace />} /></Route></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
}
