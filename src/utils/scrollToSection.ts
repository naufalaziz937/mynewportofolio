import type { SectionId } from '../types/portfolio';
export function scrollToSection(id: SectionId): void {
  document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
}
