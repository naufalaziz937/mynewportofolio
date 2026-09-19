import { useEffect, useState } from 'react';
import { navigation } from '../data/profile';
import type { SectionId } from '../types/portfolio';

export function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>('home');
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.id as SectionId);
    }, { rootMargin: '-15% 0px -60% 0px', threshold: [0, .1, .3, .6] });
    navigation.forEach(item => {
      const element = document.getElementById(item.sectionId);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}
