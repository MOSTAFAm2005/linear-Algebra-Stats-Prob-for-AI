import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const flashcards = [
  { front: 'Vector (المتجه)', back: 'An ordered list of numbers representing magnitude and direction in space. In AI, data points are vectors in feature space.' },
  { front: 'Dot Product (الجداء النقطي)', back: 'A·B = ||A|| ||B|| cos(θ). Measures vector similarity. Ranges from negative (opposite) to positive (aligned).' },
  { front: 'Matrix (المصفوفة)', back: 'A 2D array of numbers. Matrix multiplication transforms data. Each layer in a neural network uses matrix operations.' },
  { front: 'Eigenvalue & Eigenvector (القيمة والمتجه الذاتيان)', back: 'For matrix A, eigenvector v satisfies Av = λv. Eigenvectors show directions of transformation; eigenvalues show scaling magnitude.' },
  { front: 'SVD (التحليل القيمي المنفرد)', back: 'Singular Value Decomposition: A = UΣVᵀ. Factorizes any matrix into orthogonal and diagonal components. Basis for PCA and dimensionality reduction.' },
  { front: 'Gaussian Distribution (التوزيع الطبيعي)', back: 'The bell curve. P(x) = (1/σ√2π)e^(-(x-μ)²/2σ²). The most important distribution in statistics and the foundation of many ML algorithms.' },
  { front: 'Standard Deviation (الانحراف المعياري)', back: 'σ = √(Σ(xᵢ-μ)²/N). Measures data spread. Key to the 68-95-99.7 rule and confidence intervals.' },
  { front: "Bayes' Theorem (مبرهنة بايز)", back: "P(A|B) = P(B|A)P(A)/P(B). Updates beliefs with evidence. Powers Naive Bayes, Bayesian optimization, and more." },
  { front: 'Covariance Matrix (مصفوفة التغاير)', back: 'A square matrix where each element Cov(i,j) measures how features i and j vary together. Essential for PCA and multivariate analysis.' },
  { front: 'p-value (قيمة p)', back: 'The probability of observing the data if the null hypothesis is true. p < 0.05 typically indicates statistical significance.' },
];

function FlashcardItem({ front, back }: { front: string; back: string }) {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleFlip = () => {
    const card = cardRef.current;
    if (!card) return;
    const target = flipped ? 0 : 180;
    gsap.to(card, { rotationY: target, duration: 0.6, ease: 'power2.inOut' });
    setFlipped(!flipped);
  };

  return (
    <div className="flex-shrink-0 w-[320px] md:w-[400px] h-[220px] md:h-[280px] cursor-pointer" style={{ perspective: '1000px' }} onClick={handleFlip}>
      <div ref={cardRef} className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        <div className="absolute inset-0 rounded-[20px] flex items-center justify-center p-8" style={{
          background: 'linear-gradient(135deg, #1e2417, #30362b)',
          border: '1px solid rgba(200,240,125,0.15)',
          backfaceVisibility: 'hidden',
        }}>
          <h3 className="text-xl md:text-2xl font-bold text-white text-center">{front}</h3>
        </div>
        <div className="absolute inset-0 rounded-[20px] flex items-center justify-center p-8" style={{
          background: '#1e2417',
          border: '1px solid rgba(255,255,255,0.08)',
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}>
          <p className="text-white/80 text-sm md:text-base text-center leading-relaxed">{back}</p>
        </div>
      </div>
    </div>
  );
}

export default function Flashcards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('.animate-in'),
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none none' },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const scrollTo = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 340;
    const newScroll = el.scrollLeft + (dir === 'right' ? scrollAmount : -scrollAmount);
    el.scrollTo({ left: newScroll, behavior: 'smooth' });
    const newIndex = Math.round(newScroll / scrollAmount);
    setActiveIndex(Math.max(0, Math.min(newIndex, flashcards.length - 1)));
  };

  return (
    <section id="flashcards" className="w-full py-28 bg-[#1e2417]" ref={sectionRef}>
      <div className="section-container">
        <div className="animate-in text-center mb-14">
          <span className="eyebrow">LEARNING AIDS</span>
          <h2 className="section-title mt-3">Flashcards</h2>
          <p className="section-subtitle">بطاقات التعلم</p>
          <p className="text-white/60 mt-3 max-w-xl mx-auto">
            Flip through key concepts. Test your recall before checking the answer.
          </p>
        </div>

        <div className="animate-in relative">
          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollTo('left')}
              className="hidden md:flex flex-shrink-0 w-10 h-10 rounded-full bg-[#12140f] border border-white/[0.08] items-center justify-center text-white/40 hover:text-[#c8f07d] hover:border-[#c8f07d]/30 transition-all"
              aria-label="Previous"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {flashcards.map((card, i) => (
                <FlashcardItem key={i} front={card.front} back={card.back} />
              ))}
            </div>

            <button
              onClick={() => scrollTo('right')}
              className="hidden md:flex flex-shrink-0 w-10 h-10 rounded-full bg-[#12140f] border border-white/[0.08] items-center justify-center text-white/40 hover:text-[#c8f07d] hover:border-[#c8f07d]/30 transition-all"
              aria-label="Next"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {flashcards.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${i === activeIndex ? 'bg-[#c8f07d]' : 'bg-white/15'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
