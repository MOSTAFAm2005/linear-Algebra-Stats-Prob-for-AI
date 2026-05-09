import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const takeaways = [
  {
    num: '01',
    title: 'Linear Algebra is the Language of AI',
    arabic: 'الجبر الخطي هو لغة الذكاء الاصطناعي',
    text: 'Every data point is a vector, every dataset is a matrix, and every model is a transformation. Mastering linear algebra means understanding how AI sees the world.',
  },
  {
    num: '02',
    title: 'Dot Products Measure Similarity',
    arabic: 'الجداء النقطي يقيس التشابه',
    text: "From cosine similarity in NLP to attention mechanisms in transformers, the dot product is arguably the most important operation in modern AI.",
  },
  {
    num: '03',
    title: 'Probability Quantifies Uncertainty',
    arabic: 'الاحتمال ي quantifies عدم اليقين',
    text: "AI models must reason under uncertainty. Probability distributions and Bayes' theorem provide the mathematical framework for this reasoning.",
  },
  {
    num: '04',
    title: 'The Normal Distribution is Everywhere',
    arabic: 'التوزيع الطبيعي في كل مكان',
    text: 'The Central Limit Theorem ensures that sums of random variables tend toward normality, making the Gaussian distribution foundational for statistical inference.',
  },
  {
    num: '05',
    title: 'Matrices Transform Feature Spaces',
    arabic: 'المصفوفات تحول فضاءات الميزات',
    text: 'Neural networks are compositions of linear transformations and nonlinear activations. Each layer\'s weight matrix reshapes the feature space to make patterns separable.',
  },
  {
    num: '06',
    title: 'Statistics Validates AI Models',
    arabic: 'الإحصاء يتحقق من نماذج الذكاء الاصطناعي',
    text: 'Hypothesis testing, confidence intervals, and p-values ensure that observed model improvements are statistically significant, not due to chance.',
  },
];

export default function KeyTakeaways() {
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
    <section className="w-full py-28" style={{ background: 'linear-gradient(180deg, #12140f 0%, #1e2417 100%)' }} ref={sectionRef}>
      <div className="section-container">
        <div className="animate-card text-center mb-14">
          <span className="eyebrow">SUMMARY</span>
          <h2 className="section-title mt-3">Key Takeaways</h2>
          <p className="section-subtitle">النقاط الرئيسية</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {takeaways.map((t, i) => (
            <div
              key={i}
              className="animate-card group rounded-2xl p-7 border border-[#c8f07d]/10 card-hover"
              style={{ background: 'rgba(30, 36, 23, 0.6)', backdropFilter: 'blur(8px)' }}
            >
              <span className="text-[#c8f07d] text-2xl font-extrabold">{t.num}</span>
              <h3 className="text-lg font-bold text-white mt-3">
                {t.title}
              </h3>
              <p className="text-white/40 text-sm mt-1 italic">{t.arabic}</p>
              <p className="text-white/60 text-sm mt-3 leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
