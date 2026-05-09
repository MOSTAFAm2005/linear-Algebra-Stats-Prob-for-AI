import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const topics = [
  {
    title: 'Vectors — The Building Blocks',
    arabic: 'المتجهات — اللبنات الأساسية',
    description:
      'Vectors are ordered lists of numbers representing data points in space. In AI, each data sample is a vector in a high-dimensional feature space. Learn vector addition, scalar multiplication, dot product, and their geometric interpretations.',
    takeaway:
      'The dot product measures similarity between vectors — cosine similarity normalizes this to a range of [-1, 1], making it essential for recommendation systems and NLP.',
    formula: 'cos(θ) = (A · B) / (||A|| × ||B||)',
  },
  {
    title: 'Matrices — Structured Data Representation',
    arabic: 'المصفوفات — تمثيل البيانات المنظم',
    description:
      'Matrices are 2D arrays of numbers that organize data efficiently. Matrix multiplication transforms data, and the inverse matrix undoes transformations. Eigenvalues and eigenvectors reveal the principal directions of data variance.',
    takeaway:
      'Matrix factorization (SVD, eigendecomposition) is the mathematical engine behind PCA, latent semantic analysis, and many dimensionality reduction techniques in machine learning.',
    formula: 'A = UΣVᵀ',
  },
  {
    title: 'Linear Transformations',
    arabic: 'التحويلات الخطية — تعيين الفضاءات',
    description:
      'Every matrix defines a linear transformation — it scales, rotates, and shears space. Understanding how matrices transform vectors is key to grasping how neural network layers operate.',
    takeaway:
      'Neural network layers are compositions of linear transformations (weights) and nonlinear activations. The weights matrix at each layer transforms the input feature space.',
    formula: 'T(v) = Av',
  },
  {
    title: 'Feature Spaces',
    arabic: 'فضاءات الميزات — التفكير متعدد الأبعاد',
    description:
      'AI models operate in high-dimensional feature spaces where each dimension represents a feature. The curse of dimensionality and the kernel trick for implicit mapping to higher dimensions.',
    takeaway:
      'The kernel trick allows SVMs and other algorithms to operate in implicitly high-dimensional spaces without computing the transformation explicitly — this is the φ(x) mapping.',
    formula: 'K(xᵢ, xⱼ) = φ(xᵢ) · φ(xⱼ)',
  },
  {
    title: 'Linear Regression',
    arabic: 'الانحدار الخطي — ملاءمة الخطوط للبيانات',
    description:
      'Linear regression finds the best-fitting line through data points by minimizing the sum of squared errors. The normal equation provides a closed-form solution using matrix operations.',
    takeaway:
      'The normal equation θ = (XᵀX)⁻¹Xᵀy uses matrix inversion to directly compute optimal parameters — this is pure linear algebra in action.',
    formula: 'θ = (XᵀX)⁻¹Xᵀy',
  },
];

const quickFormulas = [
  'Dot Product: A · B = Σ(aᵢ × bᵢ)',
  'Matrix Mult: (AB)ᵢⱼ = Σ(Aᵢₖ × Bₖⱼ)',
  'Norm: ||v|| = √(Σvᵢ²)',
  'Cosine Sim: cos(θ) = (A·B)/(||A|| ||B||)',
  'Inverse: A × A⁻¹ = I',
  'Normal Eq: θ = (XᵀX)⁻¹Xᵀy',
];

// Interactive Vector Visualization
function VectorVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [v1, setV1] = useState({ x: 150, y: -100 });
  const [v2, setV2] = useState({ x: -80, y: 120 });
  const draggingRef = useRef<string | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 30) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 30) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, canvas.height); ctx.stroke();

    // Draw vectors
    const drawArrow = (vx: number, vy: number, color: string, label: string) => {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + vx, cy - vy);
      ctx.stroke();

      // Arrowhead
      const angle = Math.atan2(-vy, vx);
      ctx.beginPath();
      ctx.moveTo(cx + vx, cy - vy);
      ctx.lineTo(cx + vx - 12 * Math.cos(angle - 0.3), cy - vy + 12 * Math.sin(angle - 0.3));
      ctx.lineTo(cx + vx - 12 * Math.cos(angle + 0.3), cy - vy + 12 * Math.sin(angle + 0.3));
      ctx.closePath();
      ctx.fill();

      ctx.font = '13px Geist Sans, sans-serif';
      ctx.fillText(label, cx + vx + 10, cy - vy - 5);
    };

    // Sum vector
    const sx = v1.x + v2.x;
    const sy = v1.y + v2.y;

    drawArrow(v1.x, v1.y, '#c8f07d', 'A');
    drawArrow(v2.x, v2.y, '#7ec8e3', 'B');
    drawArrow(sx, sy, '#ff8c69', 'A+B');

    // Draw v2 translated to tip of v1
    ctx.strokeStyle = 'rgba(126,200,227,0.3)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(cx + v1.x, cy - v1.y);
    ctx.lineTo(cx + sx, cy - sy);
    ctx.stroke();
    ctx.setLineDash([]);

    // Stats
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2).toFixed(1);
    const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2).toFixed(1);
    const cosSim = (dot / (parseFloat(mag1) * parseFloat(mag2))).toFixed(3);

    ctx.fillStyle = '#c8f07d';
    ctx.font = '12px monospace';
    ctx.fillText(`|A| = ${mag1}`, 10, 20);
    ctx.fillText(`|B| = ${mag2}`, 10, 38);
    ctx.fillText(`A·B = ${dot}`, 10, 56);
    ctx.fillText(`cos(θ) = ${cosSim}`, 10, 74);
  }, [v1, v2]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left - canvas.width / 2;
    const my = canvas.height / 2 - (e.clientY - rect.top);

    const d1 = Math.hypot(mx - v1.x, my - v1.y);
    const d2 = Math.hypot(mx - v2.x, my - v2.y);

    if (d1 < 25) draggingRef.current = 'v1';
    else if (d2 < 25) draggingRef.current = 'v2';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const nx = e.clientX - rect.left - canvas.width / 2;
    const ny = canvas.height / 2 - (e.clientY - rect.top);

    if (draggingRef.current === 'v1') setV1({ x: nx, y: ny });
    else if (draggingRef.current === 'v2') setV2({ x: nx, y: ny });
  };

  const handleMouseUp = () => { draggingRef.current = null; };

  return (
    <div className="sticky top-28">
      <div className="bg-[#12140f] rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
          <span className="text-sm font-semibold text-white/80">Interactive Vector Playground</span>
          <span className="text-xs text-[#c8f07d]">Drag vector tips</span>
        </div>
        <canvas
          ref={canvasRef}
          width={400}
          height={350}
          className="w-full cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        <div className="px-4 py-3 border-t border-white/[0.06] grid grid-cols-2 gap-2 text-xs text-white/50">
          <span className="text-[#c8f07d]">● Vector A (lime)</span>
          <span className="text-[#7ec8e3]">● Vector B (blue)</span>
          <span className="text-[#ff8c69]">● A+B (coral)</span>
          <span>Drag tips to interact</span>
        </div>
      </div>
    </div>
  );
}

export default function LinearAlgebra() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('.animate-card'),
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="linear-algebra" className="w-full py-28 bg-[#12140f]" ref={sectionRef}>
      <div className="section-container">
        <div className="animate-card mb-14">
          <span className="eyebrow">LECTURE 01</span>
          <h2 className="section-title mt-3">Linear Algebra for AI</h2>
          <p className="section-subtitle">الجبر الخطي للذكاء الاصطناعي</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10">
          <div className="space-y-6">
            {topics.map((topic, i) => (
              <div key={i} className="animate-card card-dark">
                <h3 className="text-xl font-bold text-white">
                  {topic.title}
                  <span className="arabic-inline">({topic.arabic})</span>
                </h3>
                <p className="mt-3 text-white/60 text-sm leading-relaxed">{topic.description}</p>
                <div className="formula-block mt-3">{topic.formula}</div>
                <div className="key-takeaway">
                  <span className="text-[#c8f07d] text-xs font-bold uppercase tracking-wide">Key Takeaway</span>
                  <p className="text-white/80 text-sm mt-1">{topic.takeaway}</p>
                </div>
              </div>
            ))}

            <div className="animate-card rounded-[20px] p-8 border border-[#c8f07d]/20"
              style={{ background: 'linear-gradient(135deg, #1e2417, #30362b)' }}>
              <h3 className="text-xl font-bold text-white mb-5">Quick Revision — Linear Algebra</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {quickFormulas.map((f, i) => (
                  <div key={i} className="bg-[#12140f]/60 rounded-lg px-3 py-2 text-xs text-[#c8f07d] font-mono border border-white/[0.06]">
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <VectorVisualizer />
          </div>
        </div>
      </div>
    </section>
  );
}
