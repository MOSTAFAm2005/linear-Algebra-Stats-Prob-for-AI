import { useRef, useEffect, useCallback } from 'react';

interface Particle {
  x: number; y: number; baseX: number; baseY: number;
  vx: number; phase: number; size: number;
}

const TEXT = 'AI FUNDAMENTALS';
const SCAN_SPEED = 0.8;
const WAVE_WIDTH = 150;
const DENSITY = 1;
const PARTICLE_SPEED = 1.5;
const BG_COLOR = '#12140f';
const BRIGHT_COLOR = '#c8f07d';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const scanPosRef = useRef(-50);
  const animRef = useRef<number>(0);

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    offscreen.width = canvas.width;
    offscreen.height = canvas.height;

    const fontSize = Math.min(120, canvas.width / 12);
    offCtx.fillStyle = 'white';
    offCtx.font = `bold ${fontSize}px Arial`;

    const textWidth = offCtx.measureText(TEXT).width;
    const startX = (canvas.width - textWidth) / 2;
    const startY = canvas.height / 2 + fontSize * 0.3;

    offCtx.fillText(TEXT, startX, startY);

    const imgData = offCtx.getImageData(0, 0, canvas.width, canvas.height).data;
    const particles: Particle[] = [];
    const step = Math.max(1, Math.floor(DENSITY * 2));

    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const alpha = imgData[(y * canvas.width + x) * 4 + 3];
        if (alpha > 128) {
          particles.push({
            x: Math.random() * canvas.width,
            y: y + (Math.random() - 0.5) * 2,
            baseX: x,
            baseY: y,
            vx: 1.0 + Math.random() * PARTICLE_SPEED,
            phase: Math.random() * Math.PI * 2,
            size: 1.0,
          });
        }
      }
    }

    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
      scanPosRef.current = -50;
    };

    const animate = () => {
      if (!ctx) return;
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = BRIGHT_COLOR;

      const particles = particlesRef.current;
      const scanPos = scanPosRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dist = scanPos - p.baseX;
        let brightness = 0;
        let size = p.size * 0.5;

        if (dist >= 0 && dist < WAVE_WIDTH) {
          brightness = 1 - (dist / WAVE_WIDTH);
          size = p.size * (0.5 + brightness * 1.5);
        }

        if (brightness > 0) {
          ctx.globalAlpha = brightness;
          ctx.fillRect(p.x, p.y, size, size);
        }

        p.x += p.vx;
        if (p.x > canvas.width) {
          p.x = 0;
        }
      }

      scanPosRef.current += SCAN_SPEED;
      if (scanPosRef.current > canvas.width + WAVE_WIDTH) {
        scanPosRef.current = -50;
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animRef.current);
    };
  }, [initParticles]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-[#c8f07d]/[0.08] at-[30%_50%] to-transparent" />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto" style={{ marginTop: '10vh' }}>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
          Master the Math Behind Intelligence
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/60 max-w-xl mx-auto">
          Linear Algebra & Statistics for AI — explained visually, interactively, and bilingually.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => scrollTo('linear-algebra')} className="btn-outline">
            Explore Linear Algebra
          </button>
          <button onClick={() => scrollTo('statistics')} className="btn-primary">
            Explore Statistics
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
