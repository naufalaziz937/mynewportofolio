import { X } from 'lucide-react';
import { navigation } from '../../data/profile';
import type { SectionId } from '../../types/portfolio';
import { scrollToSection } from '../../utils/scrollToSection';

interface MobileNavigationProps { open: boolean; active: SectionId; onClose: () => void }
export function MobileNavigation({ open, active, onClose }: MobileNavigationProps) {
  if (!open) return null;
  return <div className="mobile-nav-backdrop" onClick={onClose}><div className="mobile-nav" role="dialog" aria-modal="true" aria-label="Navigation" onClick={event => event.stopPropagation()}><div className="mobile-nav-header"><span>/navigation</span><button onClick={onClose} aria-label="Close navigation"><X size={19} /></button></div>{navigation.map((item, index) => <button key={item.sectionId} className={active === item.sectionId ? 'active' : ''} onClick={() => { scrollToSection(item.sectionId); onClose(); }}><span>0{index + 1}</span>{item.label}<span>↗</span></button>)}</div></div>;
}
