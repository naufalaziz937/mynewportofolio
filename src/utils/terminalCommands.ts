import type { PortfolioSnapshot, TerminalCommand, TerminalCommandName, TerminalCommandResult } from '../types/terminal';

const section = (id: 'about' | 'projects' | 'skills' | 'experience' | 'certificates' | 'contact', lines: string[]): TerminalCommandResult => ({ lines, navigateTo: id });
export function createCommands(data: PortfolioSnapshot): Record<TerminalCommandName, TerminalCommand> {
  const commands: Record<TerminalCommandName, TerminalCommand> = {
    help: { name: 'help', description: 'List available commands', execute: () => ({ lines: ['Available commands:', ...Object.values(commands).filter(command => command.name !== 'help').map(command => `${command.name.padEnd(14)} ${command.description}`)] }) },
    whoami: { name: 'whoami', description: 'Show current user', execute: () => ({ lines: data.profile ? [`${data.profile.name} — ${data.profile.role}`, `${data.profile.location} · ${data.profile.status}`] : [data.profileLoading ? 'FETCHING_PROFILE...' : '[ERROR] Profile unavailable.'], navigateTo: 'home' }) },
    about: { name: 'about', description: 'Open about section', execute: () => section('about', [data.profile?.biography ?? (data.profileLoading ? 'FETCHING_PROFILE...' : '[ERROR] Profile unavailable.')]) },
    projects: { name: 'projects', description: 'List projects', execute: () => section('projects', data.projects.map(project => `${project.name.padEnd(16)} ${project.status}`)) },
    skills: { name: 'skills', description: 'List installed packages', execute: () => section('skills', data.skills.map(skill => `${skill.name.padEnd(16)} ${skill.category}`)) },
    experience: { name: 'experience', description: 'Show work history', execute: () => section('experience', data.experience.map(item => `${item.role} @ ${item.company}`)) },
    certificates: { name: 'certificates', description: 'List certificates', execute: () => section('certificates', data.certificates.length ? data.certificates.map(item => `${item.name} — ${item.issuer}`) : ['No public credentials listed yet.']) },
    contact: { name: 'contact', description: 'Establish connection', execute: () => section('contact', [data.profile ? `Email: ${data.profile.email}` : data.profileLoading ? 'FETCHING_PROFILE...' : '[ERROR] Contact email unavailable.', 'Opening contact section...']) },
    clear: { name: 'clear', description: 'Clear terminal', execute: () => ({ lines: [], clear: true }) },
    date: { name: 'date', description: 'Show current date', execute: () => ({ lines: [new Date().toString()] }) },
    status: { name: 'status', description: 'Show system status', execute: () => ({ lines: [`OS: ${data.settings?.systemOS ?? (data.settingsLoading ? 'FETCHING...' : 'UNAVAILABLE')}`, `USER: ${data.profile?.name ?? (data.profileLoading ? 'FETCHING...' : 'UNAVAILABLE')}`, `STATUS: ${data.profile?.status ?? (data.profileLoading ? 'FETCHING...' : 'UNAVAILABLE')}`, 'INTERFACE: online'] }) }
  };
  return commands;
}
export function executeCommand(input: string, commands: Record<TerminalCommandName, TerminalCommand>): TerminalCommandResult {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return { lines: [] };
  const command = commands[normalized as TerminalCommandName];
  return command ? command.execute() : { lines: [`Command not found: ${input.trim()}`, "Type 'help' to see available commands."] };
}
