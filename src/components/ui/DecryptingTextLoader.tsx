import { useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const scramble = (length: number) => Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');

interface DecryptingTextLoaderProps {
  value?: string | null;
  loading?: boolean;
  estimatedLength?: number;
  className?: string;
  interval?: number;
  revealDuration?: number;
}

export function DecryptingTextLoader({ value, loading = false, estimatedLength = 8, className = '', interval = 60, revealDuration = 500 }: DecryptingTextLoaderProps) {
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState<{ value: string; text: string }>({ value: '', text: '' });
  const target = value ?? '';
  const pending = loading && !target;
  useEffect(() => {
    if (reducedMotion || (!loading && !target)) return;
    const width = Math.max(1, Math.min(pending ? estimatedLength : target.length, 30));
    const started = Date.now();
    const duration = Math.max(300, Math.min(revealDuration, 700));
    const update = () => {
      if (pending) { setDisplay({ value: '', text: scramble(width) }); return; }
      const count = Math.min(target.length, Math.floor((Date.now() - started) / duration * target.length));
      if (count === target.length) { setDisplay({ value: target, text: target }); window.clearInterval(timer); return; }
      setDisplay({ value: target, text: target.slice(0, count) + scramble(Math.max(0, width - count)) });
    };
    const timer = window.setInterval(update, Math.max(40, Math.min(interval, 80)));
    update();
    return () => window.clearInterval(timer);
  }, [target, loading, pending, estimatedLength, interval, revealDuration, reducedMotion]);
  const text = reducedMotion ? (pending ? '░'.repeat(Math.max(1, estimatedLength)) : target) : pending ? (display.value === '' ? display.text : '') || '░'.repeat(Math.max(1, estimatedLength)) : target ? (display.value === target ? display.text : '░'.repeat(target.length)) : '';
  return <span className={`decrypting-text ${className}`} style={pending ? { minWidth: `${Math.max(1, estimatedLength)}ch` } : undefined} aria-label={pending ? 'Loading content' : target} aria-live="off">{text}</span>;
}
