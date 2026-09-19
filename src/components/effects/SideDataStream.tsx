import { useEffect, useRef } from 'react';

interface DataCharacter { x: number; y: number; speed: number; value: string; opacity: number; mutationRate: number; bright: boolean }
const characters = '01ABCDEFabcdef#$%&*+-/\\<>[]{}:;_';
const words = ['DEV', 'BUILD', 'SHIP', 'CODE', 'PUSH', 'COMMIT', 'NODE', 'REACT', 'TS', 'MERN', 'ROOT', 'CTRL+`', 'TRY HELP'];
const randomValue = () => Math.random() < .025 ? words[Math.floor(Math.random() * words.length)] : characters[Math.floor(Math.random() * characters.length)];

export function SideDataStream() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    let raf = 0;
    let width = 0;
    let height = 0;
    let particles: DataCharacter[] = [];
    let lastFrame = 0;
    let reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => { reduced = motion.matches; };
    const edgeWidth = () => width < 600 ? 20 : width < 1100 ? 54 : 100;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const columns = width < 600 ? 1 : width < 1100 ? 3 : 6;
      const rows = Math.ceil(height / (width < 600 ? 45 : 25));
      particles = [];
      for (const side of [0, 1]) for (let col = 0; col < columns; col++) for (let row = 0; row < rows; row++) {
        if (Math.random() < (width < 600 ? .55 : .28)) continue;
        const x = side ? width - edgeWidth() + 5 + col * (edgeWidth() / columns) : 5 + col * (edgeWidth() / columns);
        particles.push({ x, y: row * (height / rows) + Math.random() * 8, speed: Math.random() < .35 ? 4 + Math.random() * 10 : 0, value: randomValue(), opacity: .05 + Math.random() * .1, mutationRate: .001 + Math.random() * .008, bright: Math.random() < .07 });
      }
    };
    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      if (time - lastFrame < (reduced ? 950 : 80)) return;
      const delta = Math.min((time - lastFrame) / 1000, .1);
      lastFrame = time;
      context.clearRect(0, 0, width, height);
      context.font = width < 600 ? '10px JetBrains Mono, monospace' : '11px JetBrains Mono, monospace';
      for (const particle of particles) {
        if (!reduced && particle.speed) particle.y = (particle.y + particle.speed * delta) % height;
        if (Math.random() < particle.mutationRate * (reduced ? 2 : 8)) particle.value = randomValue();
        if (Math.random() < .003) particle.opacity = .025 + Math.random() * .14;
        const edgeOpacity = particle.x > 16 && particle.x < edgeWidth() ? .35 : 1;
        context.fillStyle = `rgba(0,255,102,${(particle.bright ? Math.min(particle.opacity * 3, .43) : particle.opacity) * edgeOpacity})`;
        context.fillText(particle.value, particle.x, particle.y);
      }
    };
    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    motion.addEventListener('change', onMotion);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); motion.removeEventListener('change', onMotion); };
  }, []);
  return <canvas ref={canvasRef} aria-hidden="true" className="side-stream" />;
}
