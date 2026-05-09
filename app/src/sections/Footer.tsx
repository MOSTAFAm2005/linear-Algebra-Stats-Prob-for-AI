const links = [
  { label: 'Linear Algebra', href: 'linear-algebra' },
  { label: 'Statistics', href: 'statistics' },
  { label: 'Quizzes', href: 'quizzes' },
  { label: 'Flashcards', href: 'flashcards' },
  { label: 'Visual Lab', href: 'visual-lab' },
];

export default function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#12140f] pt-20 pb-10">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div>
            <span className="text-[#c8f07d] font-bold text-xl tracking-tight">AI Fundamentals Hub</span>
            <p className="text-white/40 text-sm mt-2">Master the math. Build the future.</p>
          </div>
          <div className="flex flex-wrap gap-6">
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-sm text-white/50 hover:text-[#c8f07d] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/[0.08] my-10" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-[13px] text-white/40">
            Based on lectures by Dr. Mahmoud Abdellahi
          </p>
          <p className="text-[13px] text-white/40">
            Built with React, Framer Motion & GSAP
          </p>
        </div>
      </div>
    </footer>
  );
}
