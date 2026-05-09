import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Vector Addition Playground
function VectorAdditionPlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [v1, setV1] = useState({ x: 100, y: -80 });
  const [v2, setV2] = useState({ x: -60, y: 100 });
  const dragRef = useRef<string | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    for (let i = 0; i < canvas.width; i += 25) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
    for (let i = 0; i < canvas.height; i += 25) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke(); }

    const drawArrow = (vx: number, vy: number, color: string, label: string) => {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + vx, cy - vy); ctx.stroke();
      const angle = Math.atan2(-vy, vx);
      ctx.beginPath();
      ctx.moveTo(cx + vx, cy - vy);
      ctx.lineTo(cx + vx - 10 * Math.cos(angle - 0.3), cy - vy + 10 * Math.sin(angle - 0.3));
      ctx.lineTo(cx + vx - 10 * Math.cos(angle + 0.3), cy - vy + 10 * Math.sin(angle + 0.3));
      ctx.closePath(); ctx.fill();
      ctx.font = '12px sans-serif'; ctx.fillText(label, cx + vx + 8, cy - vy - 5);
    };

    drawArrow(v1.x, v1.y, '#c8f07d', 'A');
    drawArrow(v2.x, v2.y, '#7ec8e3', 'B');
    drawArrow(v1.x + v2.x, v1.y + v2.y, '#ff8c69', 'A+B');

    const dot = v1.x * v2.x + v1.y * v2.y;
    const m1 = Math.sqrt(v1.x ** 2 + v1.y ** 2).toFixed(1);
    const m2 = Math.sqrt(v2.x ** 2 + v2.y ** 2).toFixed(1);
    ctx.fillStyle = '#c8f07d'; ctx.font = '11px monospace';
    ctx.fillText(`A·B=${dot}  |A|=${m1}  |B|=${m2}`, 8, canvas.height - 8);
  }, [v1, v2]);

  useEffect(() => { draw(); }, [draw]);

  const onDown = (e: React.MouseEvent) => {
    const c = canvasRef.current; if (!c) return;
    const r = c.getBoundingClientRect();
    const mx = e.clientX - r.left - c.width / 2;
    const my = c.height / 2 - (e.clientY - r.top);
    if (Math.hypot(mx - v1.x, my - v1.y) < 20) dragRef.current = 'v1';
    else if (Math.hypot(mx - v2.x, my - v2.y) < 20) dragRef.current = 'v2';
  };
  const onMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    const c = canvasRef.current; if (!c) return;
    const r = c.getBoundingClientRect();
    const nx = e.clientX - r.left - c.width / 2;
    const ny = c.height / 2 - (e.clientY - r.top);
    if (dragRef.current === 'v1') setV1({ x: nx, y: ny });
    else setV2({ x: nx, y: ny });
  };
  const onUp = () => { dragRef.current = null; };

  return (
    <div className="bg-[#12140f] rounded-2xl border border-white/[0.08] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <span className="text-sm font-semibold text-white/80">Vector Addition Playground</span>
      </div>
      <canvas ref={canvasRef} width={360} height={300} className="w-full cursor-crosshair"
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp} />
      <div className="px-4 py-2 border-t border-white/[0.06] text-xs text-white/40">Drag A or B tips</div>
    </div>
  );
}

// Gaussian Curve Explorer
function GaussianExplorer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2, sx = w / 8, sy = h * 0.75;
    const g = (x: number) => (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mu) / sigma) ** 2);

    // Shaded regions
    [[1, 'rgba(200,240,125,0.15)'], [2, 'rgba(200,240,125,0.07)']].forEach(([r, col]) => {
      ctx.fillStyle = col as string;
      ctx.beginPath();
      const range = r as number;
      ctx.moveTo(cx + (mu - range * sigma) * sx, h);
      for (let px = cx + (mu - range * sigma) * sx; px <= cx + (mu + range * sigma) * sx; px++) {
        ctx.lineTo(px, h - 15 - g((px - cx) / sx) * sy);
      }
      ctx.lineTo(cx + (mu + range * sigma) * sx, h); ctx.closePath(); ctx.fill();
    });

    // Curve
    ctx.strokeStyle = '#c8f07d'; ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px <= w; px++) {
      const y = h - 15 - g((px - cx) / sx) * sy;
      px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
    }
    ctx.stroke();

    // Center line
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx + mu * sx, 0); ctx.lineTo(cx + mu * sx, h); ctx.stroke();

    ctx.fillStyle = '#c8f07d'; ctx.font = '11px sans-serif';
    ctx.fillText(`μ=${mu.toFixed(1)}, σ=${sigma.toFixed(1)}`, 8, 15);
  }, [mu, sigma]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div className="bg-[#12140f] rounded-2xl border border-white/[0.08] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <span className="text-sm font-semibold text-white/80">Gaussian Curve Explorer</span>
      </div>
      <canvas ref={canvasRef} width={360} height={240} className="w-full" />
      <div className="px-4 py-3 border-t border-white/[0.06] space-y-2">
        <div><label className="text-xs text-white/40">Mean μ</label><input type="range" min="-2" max="2" step="0.1" value={mu} onChange={e => setMu(parseFloat(e.target.value))} className="w-full accent-[#c8f07d]" /></div>
        <div><label className="text-xs text-white/40">Std Dev σ</label><input type="range" min="0.3" max="2" step="0.1" value={sigma} onChange={e => setSigma(parseFloat(e.target.value))} className="w-full accent-[#c8f07d]" /></div>
      </div>
    </div>
  );
}

// Matrix Transformation Visualizer
function MatrixTransformVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [preset, setPreset] = useState('identity');

  const presets: Record<string, number[]> = {
    identity: [1, 0, 0, 1],
    rotation: [0.707, -0.707, 0.707, 0.707],
    scale: [1.5, 0, 0, 1.5],
    shear: [1, 0.5, 0, 1],
    reflection: [-1, 0, 0, 1],
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const m = presets[preset];
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    for (let i = -100; i <= 100; i += 25) {
      const x1 = cx + (m[0] * i + m[1] * -100); const y1 = cy - (m[2] * i + m[3] * -100);
      const x2 = cx + (m[0] * i + m[1] * 100); const y2 = cy - (m[2] * i + m[3] * 100);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      const x3 = cx + (m[0] * -100 + m[1] * i); const y3 = cy - (m[2] * -100 + m[3] * i);
      const x4 = cx + (m[0] * 100 + m[1] * i); const y4 = cy - (m[2] * 100 + m[3] * i);
      ctx.beginPath(); ctx.moveTo(x3, y3); ctx.lineTo(x4, y4); ctx.stroke();
    }

    // Basis vectors
    ctx.strokeStyle = '#c8f07d'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + m[0] * 60, cy - m[2] * 60); ctx.stroke();
    ctx.strokeStyle = '#7ec8e3';
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + m[1] * 60, cy - m[3] * 60); ctx.stroke();

    ctx.fillStyle = 'rgba(200,240,125,0.1)';
    ctx.fillRect(cx - 60, cy - 60, 120, 120);

    ctx.fillStyle = '#c8f07d'; ctx.font = '11px sans-serif';
    ctx.fillText(`[${m[0].toFixed(2)} ${m[1].toFixed(2)}]`, 8, 15);
    ctx.fillText(`[${m[2].toFixed(2)} ${m[3].toFixed(2)}]`, 8, 30);
  }, [preset]);

  return (
    <div className="bg-[#12140f] rounded-2xl border border-white/[0.08] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <span className="text-sm font-semibold text-white/80">Matrix Transformation Visualizer</span>
      </div>
      <canvas ref={canvasRef} width={360} height={240} className="w-full" />
      <div className="px-4 py-3 border-t border-white/[0.06] grid grid-cols-3 gap-2">
        {Object.keys(presets).map((p) => (
          <button key={p} onClick={() => setPreset(p)}
            className={`text-xs py-1.5 rounded-lg transition-colors ${preset === p ? 'bg-[#c8f07d] text-[#12140f] font-semibold' : 'bg-white/[0.05] text-white/50 hover:text-white'}`}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

// Bayes' Theorem Visualizer
function BayesVisualizer() {
  const [pA, setPA] = useState(0.3);
  const [pBGivenA, setPBGivenA] = useState(0.8);
  const [pB, setPB] = useState(0.4);
  const pAGivenB = (pBGivenA * pA) / pB;

  return (
    <div className="bg-[#12140f] rounded-2xl border border-white/[0.08] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <span className="text-sm font-semibold text-white/80">Bayes' Theorem Visualizer</span>
      </div>
      <div className="p-4 space-y-3">
        <div><label className="text-xs text-white/40">P(A) — Prior</label><input type="range" min="0.05" max="0.95" step="0.05" value={pA} onChange={e => setPA(parseFloat(e.target.value))} className="w-full accent-[#c8f07d]" /></div>
        <div><label className="text-xs text-white/40">P(B|A) — Likelihood</label><input type="range" min="0.05" max="0.95" step="0.05" value={pBGivenA} onChange={e => setPBGivenA(parseFloat(e.target.value))} className="w-full accent-[#c8f07d]" /></div>
        <div><label className="text-xs text-white/40">P(B) — Evidence</label><input type="range" min="0.05" max="0.95" step="0.05" value={pB} onChange={e => setPB(parseFloat(e.target.value))} className="w-full accent-[#c8f07d]" /></div>
        <div className="mt-3 p-3 bg-[#c8f07d]/[0.08] rounded-lg border border-[#c8f07d]/20">
          <div className="text-center">
            <span className="text-xs text-white/50">P(A|B) = </span>
            <span className="text-lg font-bold text-[#c8f07d]">{pAGivenB.toFixed(3)}</span>
          </div>
          <div className="text-center text-xs text-white/40 mt-1">
            {pBGivenA.toFixed(2)} × {pA.toFixed(2)} / {pB.toFixed(2)} = {pAGivenB.toFixed(3)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VisualLab() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('.animate-card'),
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none none' },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="visual-lab" className="w-full py-28 bg-[#1e2417]" ref={sectionRef}>
      <div className="section-container">
        <div className="animate-card text-center mb-14">
          <span className="eyebrow">HANDS ON</span>
          <h2 className="section-title mt-3">Visual Learning Lab</h2>
          <p className="section-subtitle">المختبر البصري</p>
          <p className="text-white/60 mt-3 max-w-xl mx-auto">
            Interactive visualizations that bring mathematical concepts to life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="animate-card">
            <VectorAdditionPlayground />
            <p className="text-xs text-white/40 mt-3 px-2">
              Drag vector tips to see real-time dot product, magnitudes, and sum vector.
            </p>
          </div>
          <div className="animate-card">
            <GaussianExplorer />
            <p className="text-xs text-white/40 mt-3 px-2">
              Adjust μ and σ to explore the Gaussian distribution and the 68-95-99.7 rule.
            </p>
          </div>
          <div className="animate-card">
            <MatrixTransformVisualizer />
            <p className="text-xs text-white/40 mt-3 px-2">
              Select transformation presets to visualize how matrices transform a 2D grid.
            </p>
          </div>
          <div className="animate-card">
            <BayesVisualizer />
            <p className="text-xs text-white/40 mt-3 px-2">
              Adjust probabilities to see Bayes' theorem compute the posterior in real-time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
