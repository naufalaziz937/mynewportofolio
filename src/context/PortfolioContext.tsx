import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { portfolioService } from '../services/portfolio.service';
import type { Profile, Project, Skill, Experience, Certificate, SiteSettings } from '../types/portfolio';

interface Resource<T> { data: T; loading: boolean; error: string | null }
interface PortfolioContextValue { profile: Resource<Profile | null>; projects: Resource<Project[]>; skills: Resource<Skill[]>; experience: Resource<Experience[]>; certificates: Resource<Certificate[]>; settings: Resource<SiteSettings | null>; retry: () => void }
const PortfolioContext = createContext<PortfolioContextValue | null>(null);
const initial = <T,>(data: T): Resource<T> => ({ data, loading: true, error: null });
export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Resource<Profile | null>>(initial(null));
  const [projects, setProjects] = useState<Resource<Project[]>>(initial([]));
  const [skills, setSkills] = useState<Resource<Skill[]>>(initial([]));
  const [experience, setExperience] = useState<Resource<Experience[]>>(initial([]));
  const [certificates, setCertificates] = useState<Resource<Certificate[]>>(initial([]));
  const [settings, setSettings] = useState<Resource<SiteSettings | null>>(initial(null));
  const [revision, setRevision] = useState(0);
  const retry = useCallback(() => setRevision(value => value + 1), []);
  useEffect(() => {
    let active = true;
    const load = <T,>(request: () => Promise<T>, setter: (value: Resource<T>) => void, previous: T) => {
      setter({ data: previous, loading: true, error: null });
      request().then(data => { if (active) setter({ data, loading: false, error: null }); }).catch((error: unknown) => { if (active) setter({ data: previous, loading: false, error: error instanceof Error ? error.message : 'Unable to retrieve data' }); });
    };
    load(portfolioService.profile, setProfile, null);
    load(portfolioService.projects, setProjects, []);
    load(portfolioService.skills, setSkills, []);
    load(portfolioService.experience, setExperience, []);
    load(portfolioService.certificates, setCertificates, []);
    load(portfolioService.settings, setSettings, null);
    return () => { active = false; };
  }, [revision]);
  return <PortfolioContext.Provider value={{ profile, projects, skills, experience, certificates, settings, retry }}>{children}</PortfolioContext.Provider>;
}
export function usePortfolio(): PortfolioContextValue { const value = useContext(PortfolioContext); if (!value) throw new Error('PortfolioProvider missing'); return value; }
