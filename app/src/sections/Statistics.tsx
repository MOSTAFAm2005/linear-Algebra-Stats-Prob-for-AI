import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const topics = [
  {
    title: 'Descriptive Statistics',
    arabic: 'وصف البيانات — المتوسط والتباين وغيرها',
    description:
      'Descriptive statistics summarize datasets through measures of central tendency (mean, median, mode) and measures of spread (variance, standard deviation, range). These form the foundation of all data analysis in AI.',
    takeaway:
      'Standard deviation (σ) quantifies data spread. In normal distributions, 68-95-99.7% of data falls within 1-2-3 standard deviations of the mean — this rule underpins confidence intervals.',
    formula: 'σ = √(Σ(xᵢ - μ)² / N)',
  },
  {
    title: 'Probability Distributions',
    arabic: 'توزيعات الاحتمال — نمذجة عدم اليقين',
    description:
      'Probability distributions model uncertainty in data. The Gaussian (normal) distribution, Bernoulli, binomial, and multinomial distributions are essential for understanding how data is generated and for building probabilistic models.',
    takeaway:
      'Maximum Likelihood Estimation (MLE) finds distribution parameters that maximize the probability of observing the training data — the foundation of training probabilistic models.',
    formula: 'P(x|μ,σ) = (1/σ√(2π)) × e^(-(x-μ)²/(2σ²))',
  },
  {
    title: "Bayes' Theorem",
    arabic: 'مبرهنة بايز — تحديث الاعتقادات',
    description:
      "Bayes' theorem provides a mathematical framework for updating beliefs based on new evidence. It powers Naive Bayes classifiers, Bayesian optimization, and probabilistic graphical models.",
    takeaway:
      'Naive Bayes assumes feature independence and uses Bayes\' theorem to compute P(class|features) — surprisingly effective for text classification and spam filtering.',
    formula: 'P(A|B) = P(B|A) × P(A) / P(B)',
  },
  {
    title: 'Correlation & Covariance',
    arabic: 'الارتباط والتغاير — قياس العلاقات',
    description:
      'Covariance measures how two variables change together. Correlation normalizes covariance to a [-1, 1] scale, making it interpretable. The covariance matrix captures all pairwise relationships in a dataset.',
    takeaway:
      'The covariance matrix is central to PCA — its eigenvectors point in the directions of maximum variance (principal components), and eigenvalues indicate the variance magnitude.',
    formula: 'Cov(X,Y) = E[(X-μₓ)(Y-μᵧ)] | Corr(X,Y) = Cov(X,Y)/(σₓσᵧ)',
  },
  {
    title: 'Hypothesis Testing',
    arabic: 'اختبار الفرضيات — اتخاذ القرارات بالبيانات',
    description:
      'Hypothesis testing provides a statistical framework for making decisions. The t-test, chi-squared test, and p-values help determine whether observed effects are statistically significant or due to random chance.',
    takeaway:
      'The p-value measures the probability of observing the data if the null hypothesis were true. p < 0.05 is the conventional threshold for statistical significance in ML experiments.',
    formula: 't = (x̄ - μ₀) / (s/√n)',
  },
];

const quickFormulas = [
  'Mean: μ = (Σxᵢ) / N',
  'Variance: σ² = Σ(xᵢ-μ)² / N',
  'Gaussian: P(x) = (1/σ√2π)e^(-(x-μ)²/2σ²)',
  'Bayes: P(A|B) = P(B|A)P(A)/P(B)',
  'Covariance: Cov(X,Y) = E[(X-μₓ)(Y-μᵧ)]',
  'Std Dev: σ = √σ²',
];

// Interactive Gaussian Visualizer
function GaussianVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const scaleX = w / 8;
    const scaleY = h * 0.8;

    const gaussian = (x: number) => {
      return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mu) / sigma) ** 2);
    };

    // Draw 68% and 95% regions
    const regions = [
      { range: 1, label: '68%', color: 'rgba(200,240,125,0.15)' },
      { range: 2, label: '95%', color: 'rgba(200,240,125,0.08)' },
    ];

    regions.forEach(({ range, color }) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx + (mu - range * sigma) * scaleX, h);
      for (let px = cx + (mu - range * sigma) * scaleX; px <= cx + (mu + range * sigma) * scaleX; px += 1) {
        const xv = (px - cx) / scaleX;
        ctx.lineTo(px, h - 20 - gaussian(xv) * scaleY);
      }
      ctx.lineTo(cx + (mu + range * sigma) * scaleX, h);
      ctx.closePath();
      ctx.fill();

      // Vertical lines
      ctx.strokeStyle = 'rgba(200,240,125,0.3)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      [-range, range].forEach(r => {
        ctx.beginPath();
        ctx.moveTo(cx + (mu + r * sigma) * scaleX, h);
        ctx.lineTo(cx + (mu + r * sigma) * scaleX, h - 20 - gaussian(mu + r * sigma) * scaleY);
        ctx.stroke();
      });
      ctx.setLineDash([]);
    });

    // Draw curve
    ctx.strokeStyle = '#c8f07d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px <= w; px++) {
      const xv = (px - cx) / scaleX;
      const yv = gaussian(xv);
      const py = h - 20 - yv * scaleY;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Glow under curve
    ctx.strokeStyle = 'rgba(200,240,125,0.3)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    for (let px = 0; px <= w; px++) {
      const xv = (px - cx) / scaleX;
      const yv = gaussian(xv);
      const py = h - 20 - yv * scaleY;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Center line
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx + mu * scaleX, 0);
    ctx.lineTo(cx + mu * scaleX, h);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#c8f07d';
    ctx.font = '11px Geist Sans, sans-serif';
    ctx.fillText(`μ = ${mu.toFixed(1)}`, cx + mu * scaleX + 5, 15);
    ctx.fillText(`σ = ${sigma.toFixed(1)}`, cx + mu * scaleX + 5, 30);
    ctx.fillText('68%', cx + (mu + 0.5 * sigma) * scaleX, h - 20 - gaussian(mu + 0.5 * sigma) * scaleY - 10);
  }, [mu, sigma]);

  useEffect(() => { draw(); }, [draw]);

  return (
    <div className="sticky top-28">
      <div className="bg-[#12140f] rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.06]">
          <span className="text-sm font-semibold text-white/80">Gaussian Curve Explorer</span>
        </div>
        <canvas ref={canvasRef} width={400} height={280} className="w-full" />
        <div className="px-4 py-4 border-t border-white/[0.06] space-y-3">
          <div>
            <label className="text-xs text-white/50">Mean (μ) — المتوسط</label>
            <input
              type="range" min="-2" max="2" step="0.1" value={mu}
              onChange={(e) => setMu(parseFloat(e.target.value))}
              className="w-full mt-1 accent-[#c8f07d]"
            />
          </div>
          <div>
            <label className="text-xs text-white/50">Std Dev (σ) — الانحراف المعياري</label>
            <input
              type="range" min="0.3" max="2" step="0.1" value={sigma}
              onChange={(e) => setSigma(parseFloat(e.target.value))}
              className="w-full mt-1 accent-[#c8f07d]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Statistics() {
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
    <section id="statistics" className="w-full py-28 bg-[#1e2417]" ref={sectionRef}>
      <div className="section-container">
        <div className="animate-card mb-14">
          <span className="eyebrow">LECTURE 02</span>
          <h2 className="section-title mt-3">Statistics & Probability for AI</h2>
          <p className="section-subtitle">الإحصاء والاحتمالات للذكاء الاصطناعي</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-10">
          <div className="hidden lg:block order-1">
            <GaussianVisualizer />
          </div>

          <div className="space-y-6 order-2 lg:order-2">
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
              <h3 className="text-xl font-bold text-white mb-5">Quick Revision — Statistics & Probability</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {quickFormulas.map((f, i) => (
                  <div key={i} className="bg-[#12140f]/60 rounded-lg px-3 py-2 text-xs text-[#c8f07d] font-mono border border-white/[0.06]">
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
