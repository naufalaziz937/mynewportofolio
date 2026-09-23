import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { portfolioService } from '../services/portfolio.service';
import type { Profile, Project, Skill, Experience, Certificate, PersonalItem, SiteSettings } from '../types/portfolio';

interface Resource<T> { data: T; loading: boolean; error: string | null }
interface PortfolioContextValue { profile: Resource<Profile | null>; projects: Resource<Project[]>; skills: Resource<Skill[]>; experience: Resource<Experience[]>; certificates: Resource<Certificate[]>; personal: Resource<PersonalItem[]>; settings: Resource<SiteSettings | null>; retry: () => void }
const PortfolioContext = createContext<PortfolioContextValue | null>(null);
const initial = <T,>(data: T): Resource<T> => ({ data, loading: true, error: null });
export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Resource<Profile | null>>(initial(null));
  const [projects, setProjects] = useState<Resource<Project[]>>(initial([]));
  const [skills, setSkills] = useState<Resource<Skill[]>>(initial([]));
  const [experience, setExperience] = useState<Resource<Experience[]>>(initial([]));
  const [certificates, setCertificates] = useState<Resource<Certificate[]>>(initial([]));
  const [personal, setPersonal] = useState<Resource<PersonalItem[]>>(initial([]));
  const [settings, setSettings] = useState<Resource<SiteSettings | null>>(initial(null));
  const [revision, setRevision] = useState(0);
  const retry = useCallback(() => {
    setProfile(initial(null));
    setProjects(initial([]));
    setSkills(initial([]));
    setExperience(initial([]));
    setCertificates(initial([]));
    setPersonal(initial([]));
    setSettings(initial(null));
    setRevision(value => value + 1);
  }, []);
  useEffect(() => {
    let active = true;
    portfolioService.bootstrap().then(data => {
      if (!active) return;
      setProfile({ data: data.profile, loading: false, error: null });
      setProjects({ data: data.projects, loading: false, error: null });
      setSkills({ data: data.skills, loading: false, error: null });
      setExperience({ data: data.experience, loading: false, error: null });
      setCertificates({ data: data.certificates, loading: false, error: null });
      setPersonal({ data: data.personal, loading: false, error: null });
      setSettings({ data: data.settings, loading: false, error: null });
    }).catch((error: unknown) => {
      if (!active) return;
      const message = error instanceof Error ? error.message : 'Unable to retrieve data';
      setProfile({ data: null, loading: false, error: message });
      setProjects({ data: [], loading: false, error: message });
      setSkills({ data: [], loading: false, error: message });
      setExperience({ data: [], loading: false, error: message });
      setCertificates({ data: [], loading: false, error: message });
      setPersonal({ data: [], loading: false, error: message });
      setSettings({ data: null, loading: false, error: message });
    });
    return () => { active = false; };
  }, [revision]);
  return <PortfolioContext.Provider value={{ profile, projects, skills, experience, certificates, personal, settings, retry }}>{children}</PortfolioContext.Provider>;
}
export function usePortfolio(): PortfolioContextValue { const value = useContext(PortfolioContext); if (!value) throw new Error('PortfolioProvider missing'); return value; }
