import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'Linear Algebra', href: 'linear-algebra' },
  { label: 'Statistics', href: 'statistics' },
  { label: 'Quizzes', href: 'quizzes' },
  { label: 'Flashcards', href: 'flashcards' },
  { label: 'Visual Lab', href: 'visual-lab' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300 ${
        scrolled ? 'bg-[#12140f]/85 backdrop-blur-xl border-b border-white/[0.06]' : 'bg-transparent'
      }`}
    >
      <div className="section-container flex items-center justify-between w-full">
        <button onClick={() => scrollTo('hero')} className="text-[#c8f07d] font-bold text-xl tracking-tight">
          AI Fundamentals Hub
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-[15px] font-medium text-white/60 hover:text-[#c8f07d] transition-colors duration-300"
            >
              {link.label}
            </button>
          ))}
          <button onClick={() => scrollTo('linear-algebra')} className="btn-primary !py-2 !px-5 !text-[13px]">
            Start Learning
          </button>
        </div>

        <button
          className="md:hidden text-white/60 hover:text-[#c8f07d] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#12140f]/95 backdrop-blur-xl border-b border-white/[0.06] md:hidden">
          <div className="section-container py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-left text-white/60 hover:text-[#c8f07d] py-2 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
