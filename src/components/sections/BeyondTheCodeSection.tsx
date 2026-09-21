import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { PERSONAL_CATEGORIES, personalCategoryLabel, type PersonalCategory, type PersonalCardSize } from '../../data/personalCategories';
import type { PersonalItem } from '../../types/portfolio';
import { usePortfolio } from '../../context/PortfolioContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionCommand } from '../ui/SectionCommand';
import { DecryptingTextLoader } from '../ui/DecryptingTextLoader';
import { ResourceState } from '../ui/ResourceState';

const skeletonSizes: PersonalCardSize[] = ['large', 'small', 'tall', 'wide', 'small', 'wide'];

function PersonalCard({ item, index }: { item: PersonalItem; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const visual = item.displayMode === 'visual' && !!item.image && !imageFailed;
  const category = personalCategoryLabel(item.category);
  const activate = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setExpanded(value => !value); }
  };
  return <article className={`personal-card personal-${item.size} ${visual ? 'personal-visual' : 'personal-text'} ${expanded ? 'expanded' : ''}`} tabIndex={visual ? 0 : undefined} role={visual ? 'button' : undefined} aria-expanded={visual ? expanded : undefined} aria-label={visual ? `${item.title}. ${expanded ? 'Hide' : 'Show'} details` : undefined} onKeyDown={visual ? activate : undefined} onClick={visual ? () => setExpanded(value => !value) : undefined}>
    {visual && <img src={item.image} alt={item.imageAlt || item.title} loading="lazy" decoding="async" onError={() => setImageFailed(true)} />}
    {!visual && <div className="personal-card-grid" aria-hidden="true" />}
    {visual && <div className="personal-card-teaser"><span>{item.label || category}</span><strong>{item.title}</strong></div>}
    <div className="personal-card-content">
      <div className="personal-card-top"><span>{item.icon && <span aria-hidden="true">{item.icon} </span>}{item.label || category}</span><span>{String(index + 1).padStart(2, '0')}</span></div>
      <div className="personal-card-copy">
        {item.category === 'bucket-list' && <span className="personal-completion">{item.completed ? '[x] COMPLETE' : '[ ] ON THE LIST'}</span>}
        {item.status && <span className="personal-status">● {item.status}</span>}
        <h3>{item.title}</h3>
        {item.description && item.size !== 'small' && <p>{item.description}</p>}
        {item.url && <a href={item.url} target="_blank" rel="noreferrer" onClick={event => event.stopPropagation()} aria-label={`Open link for ${item.title}`}>{item.size === 'small' ? 'OPEN' : 'OPEN LINK'} <ArrowUpRight size={13} /></a>}
      </div>
    </div>
  </article>;
}

export function BeyondTheCodeSection() {
  const { personal, retry } = usePortfolio();
  const [active, setActive] = useState<PersonalCategory>('hobbies');
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const scroller = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const reducedMotion = useReducedMotion();
  const items = personal.data.filter(item => item.category === active);

  const updateOverflow = () => {
    const element = scroller.current;
    if (!element) return;
    setCanLeft(element.scrollLeft > 2);
    setCanRight(element.scrollLeft + element.clientWidth < element.scrollWidth - 2);
  };
  useEffect(() => {
    const element = scroller.current;
    if (!element) return;
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(element);
    const wheel = (event: WheelEvent) => {
      if (element.scrollWidth <= element.clientWidth || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const atStart = element.scrollLeft <= 1 && event.deltaY < 0;
      const atEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - 1 && event.deltaY > 0;
      if (!atStart && !atEnd) { event.preventDefault(); element.scrollLeft += event.deltaY; }
    };
    element.addEventListener('wheel', wheel, { passive: false });
    updateOverflow();
    return () => { observer.disconnect(); element.removeEventListener('wheel', wheel); };
  }, []);
  useEffect(() => {
    const element = scroller.current;
    const button = tabRefs.current[active];
    if (!element || !button) return;
    const left = button.offsetLeft - element.offsetLeft - (element.clientWidth - button.clientWidth) / 2;
    element.scrollTo({ left, behavior: reducedMotion ? 'instant' : 'smooth' });
    const timeout = window.setTimeout(updateOverflow, reducedMotion ? 0 : 300);
    return () => window.clearTimeout(timeout);
  }, [active, reducedMotion]);
  const move = (direction: number) => scroller.current?.scrollBy({ left: direction * Math.max(180, (scroller.current?.clientWidth ?? 0) * .7), behavior: reducedMotion ? 'instant' : 'smooth' });
  const tabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = event.key === 'ArrowRight' ? index + 1 : event.key === 'ArrowLeft' ? index - 1 : -1;
    if (next < 0 || next >= PERSONAL_CATEGORIES.length) return;
    event.preventDefault();
    const key = PERSONAL_CATEGORIES[next].key;
    setActive(key);
    tabRefs.current[key]?.focus();
  };

  return <section id="personal" className="section standard-section personal-section">
    <SectionCommand command="cat ./beyond_the_code" index="02" label="personal" />
    <div className="section-heading"><div className="section-kicker">DIRECTORY: /PERSONAL</div><h2>Beyond the <span>Code.</span></h2><p>A few things about me that don't fit into a résumé.</p></div>
    <div className="personal-nav-shell">
      <button type="button" className="personal-nav-arrow" onClick={() => move(-1)} disabled={!canLeft} aria-label="Scroll categories left"><ChevronLeft size={17} /></button>
      <div className="personal-tabs" ref={scroller} role="tablist" aria-label="Personal categories" onScroll={updateOverflow}>
        {PERSONAL_CATEGORIES.map((category, index) => <button key={category.key} ref={node => { tabRefs.current[category.key] = node; }} type="button" role="tab" id={`personal-tab-${category.key}`} aria-controls="personal-panel" aria-selected={active === category.key} tabIndex={active === category.key ? 0 : -1} className={active === category.key ? 'active' : ''} onClick={() => setActive(category.key)} onKeyDown={event => tabKey(event, index)}>{category.label.toUpperCase()}</button>)}
      </div>
      <button type="button" className="personal-nav-arrow" onClick={() => move(1)} disabled={!canRight} aria-label="Scroll categories right"><ChevronRight size={17} /></button>
    </div>
    <div id="personal-panel" role="tabpanel" aria-labelledby={`personal-tab-${active}`} className="personal-panel" key={active}>
      <div className="personal-panel-meta"><span>&gt; ls ./personal/<DecryptingTextLoader value={personalCategoryLabel(active)} /></span><span>{personal.loading ? 'FETCHING...' : `${items.length.toString().padStart(2, '0')} ENTRIES`}</span></div>
      {personal.loading ? <div className="personal-mosaic" aria-label="Loading personal entries">{skeletonSizes.map((size, index) => <div key={index} className={`personal-card personal-${size} personal-skeleton`} aria-hidden="true"><div className="personal-skeleton-line" /><div className="personal-skeleton-line short" /></div>)}</div> : personal.error ? <ResourceState name="personal" loading={false} error={personal.error} onRetry={retry} /> : items.length ? <div className="personal-mosaic">{items.map((item, index) => <PersonalCard key={item.id} item={item} index={index} />)}</div> : <div className="personal-empty"><strong>[ EMPTY ]</strong><span>No public entries in {personalCategoryLabel(active)} yet.</span></div>}
    </div>
  </section>;
}
