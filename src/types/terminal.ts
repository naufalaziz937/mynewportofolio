import type { SectionId, Profile, Project, Skill, Experience, Certificate, SiteSettings } from './portfolio';
export interface PortfolioSnapshot { profile: Profile | null; projects: Project[]; skills: Skill[]; experience: Experience[]; certificates: Certificate[]; settings: SiteSettings | null; profileLoading: boolean; settingsLoading: boolean }
export type TerminalCommandName = 'help' | 'whoami' | 'about' | 'projects' | 'skills' | 'experience' | 'certificates' | 'contact' | 'clear' | 'date' | 'status';
export interface TerminalCommandResult { lines: string[]; navigateTo?: SectionId; clear?: boolean }
export interface TerminalCommand { name: TerminalCommandName; description: string; execute: () => TerminalCommandResult; hidden?: boolean }
export interface TerminalHistoryItem { id: number; input: string; output: string[] }
