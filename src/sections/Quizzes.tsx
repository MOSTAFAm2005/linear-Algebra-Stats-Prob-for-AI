import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const laQuestions: Question[] = [
  {
    question: 'What does the dot product of two perpendicular vectors equal?',
    options: ['0', '1', '-1', 'undefined'],
    correct: 0,
    explanation: 'Perpendicular vectors have a 90° angle, and cos(90°) = 0, so A·B = ||A|| ||B|| cos(90°) = 0.',
  },
  {
    question: 'In matrix multiplication AB, what must be true about dimensions?',
    options: ['Rows of A = Columns of B', 'Columns of A = Rows of B', 'A and B must be square', 'A and B must be same size'],
    correct: 1,
    explanation: 'For AB to be defined, the number of columns in A must equal the number of rows in B. If A is m×n and B is n×p, then AB is m×p.',
  },
  {
    question: 'What does the identity matrix I do when multiplied by any matrix A?',
    options: ['Returns A unchanged', 'Returns zero matrix', 'Returns inverse of A', 'Returns transpose of A'],
    correct: 0,
    explanation: 'The identity matrix acts like the number 1 in scalar multiplication: AI = IA = A.',
  },
  {
    question: 'In linear regression, what does the normal equation compute?',
    options: ['The optimal parameter vector θ', 'The prediction error', 'The correlation matrix', 'The eigenvalues'],
    correct: 0,
    explanation: 'θ = (XᵀX)⁻¹Xᵀy directly computes the parameters that minimize the sum of squared errors.',
  },
  {
    question: 'What does SVD decompose a matrix A into?',
    options: ['UΣVᵀ', 'LU', 'QR', 'A²'],
    correct: 0,
    explanation: 'Singular Value Decomposition factors any m×n matrix into U (m×m orthogonal), Σ (m×n diagonal), and Vᵀ (n×n orthogonal).',
  },
];

const statsQuestions: Question[] = [
  {
    question: 'In a normal distribution, what percentage of data falls within 2 standard deviations of the mean?',
    options: ['68%', '95%', '99.7%', '50%'],
    correct: 1,
    explanation: 'The empirical rule states approximately 95% of data in a normal distribution lies within μ ± 2σ.',
  },
  {
    question: 'What does a p-value < 0.05 typically indicate?',
    options: ['The result is wrong', 'Statistical significance — reject the null hypothesis', 'The sample size is too small', 'The data is normally distributed'],
    correct: 1,
    explanation: 'A p-value below the 0.05 threshold suggests the observed result is unlikely under the null hypothesis.',
  },
  {
    question: "Bayes' theorem relates which probabilities?",
    options: ['Mean, median, and mode', 'Posterior, likelihood, prior, and evidence', 'Type I and Type II errors', 'Correlation and causation'],
    correct: 1,
    explanation: 'P(A|B) = P(B|A)P(A)/P(B) combines the posterior, likelihood, prior, and marginal likelihood (evidence).',
  },
  {
    question: 'What does correlation = 0 between two variables mean?',
    options: ['The variables are independent', 'No linear relationship', 'The variables are identical', 'No relationship of any kind'],
    correct: 1,
    explanation: 'Zero correlation indicates no linear association, but nonlinear relationships may still exist.',
  },
  {
    question: 'Maximum Likelihood Estimation (MLE) finds parameters that:',
    options: ['Minimize prediction error', 'Maximize the probability of observed data', 'Minimize variance', 'Maximize correlation'],
    correct: 1,
    explanation: 'MLE finds the parameter values that make the observed data most probable under the assumed distribution.',
  },
];

const quizSets = [
  { title: 'Vector Operations Quiz', topic: 'Linear Algebra', difficulty: 2, questions: laQuestions },
  { title: 'Matrix & Transformations Quiz', topic: 'Linear Algebra', difficulty: 3, questions: laQuestions.slice(1, 4) },
  { title: 'Probability Distributions Quiz', topic: 'Statistics', difficulty: 2, questions: statsQuestions.slice(0, 3) },
  { title: 'Bayes & Hypothesis Testing Quiz', topic: 'Statistics', difficulty: 3, questions: statsQuestions.slice(2, 5) },
];

function QuizModal({ questions, title, onClose }: { questions: Question[]; title: string; onClose: () => void }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const progress = ((current + (selected !== null ? 1 : 0)) / questions.length) * 100;

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="fixed inset-0 bg-[#12140f]/95 z-[200] flex items-center justify-center p-6">
        <div className="bg-[#1e2417] rounded-3xl p-10 max-w-md w-full text-center border border-white/[0.08]">
          <h3 className="text-3xl font-bold text-white">Quiz Complete!</h3>
          <p className="text-white/60 mt-2">{title}</p>
          <div className="mt-8 text-6xl font-extrabold text-[#c8f07d]">
            {Math.round((score / questions.length) * 100)}%
          </div>
          <p className="text-white/60 mt-2">
            You got {score} out of {questions.length} correct
          </p>
          <button onClick={onClose} className="btn-primary mt-8">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#12140f]/95 z-[200] flex items-center justify-center p-6">
      <div className="bg-[#1e2417] rounded-3xl p-8 max-w-xl w-full border border-white/[0.08]">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs text-white/40">Question {current + 1} of {questions.length}</span>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="w-full h-1 bg-white/10 rounded-full mb-8">
          <div className="h-full bg-[#c8f07d] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <h3 className="text-xl font-semibold text-white mb-6">{q.question}</h3>

        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let btnClass = 'w-full text-left p-4 rounded-xl border transition-all duration-200 ';
            if (selected === null) {
              btnClass += 'bg-[#12140f] border-white/[0.08] hover:border-[#c8f07d] text-white/80';
            } else if (i === q.correct) {
              btnClass += 'bg-green-500/10 border-green-500/50 text-green-400';
            } else if (i === selected && i !== q.correct) {
              btnClass += 'bg-red-500/10 border-red-500/50 text-red-400';
            } else {
              btnClass += 'bg-[#12140f] border-white/[0.08] text-white/40';
            }

            return (
              <button key={i} className={btnClass} onClick={() => handleSelect(i)} disabled={selected !== null}>
                {opt}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="mt-6 p-4 bg-[#c8f07d]/[0.06] rounded-xl border border-[#c8f07d]/20">
            <p className="text-sm text-white/70">{q.explanation}</p>
          </div>
        )}

        {selected !== null && (
          <button onClick={handleNext} className="btn-primary mt-6 w-full text-center">
            {current + 1 < questions.length ? 'Next Question' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Quizzes() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);

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
    <section id="quizzes" className="w-full py-28 bg-[#12140f]" ref={sectionRef}>
      <div className="section-container">
        <div className="animate-card text-center mb-14">
          <span className="eyebrow">TEST YOUR KNOWLEDGE</span>
          <h2 className="section-title mt-3">Interactive Quizzes</h2>
          <p className="section-subtitle">اختبارات تفاعلية</p>
          <p className="text-white/60 mt-3 max-w-xl mx-auto">
            Challenge yourself with topic-specific quizzes. Immediate feedback with detailed explanations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizSets.map((quiz, i) => (
            <div key={i} className="animate-card bg-[#12140f] rounded-[20px] p-8 border border-white/[0.08]">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#c8f07d]/15 text-[#c8f07d] rounded-full px-3 py-1 text-xs font-semibold">
                  {quiz.topic}
                </span>
                <span className="text-white/40 text-xs">{quiz.questions.length} Questions</span>
              </div>
              <h3 className="text-lg font-bold text-white">{quiz.title}</h3>
              <div className="flex items-center gap-1 mt-3">
                {[1, 2, 3].map((d) => (
                  <div key={d} className={`w-2 h-2 rounded-full ${d <= quiz.difficulty ? 'bg-[#c8f07d]' : 'bg-white/10'}`} />
                ))}
                <span className="text-white/30 text-xs ml-2">
                  {quiz.difficulty === 1 ? 'Easy' : quiz.difficulty === 2 ? 'Medium' : 'Hard'}
                </span>
              </div>
              <button onClick={() => setActiveQuiz(i)} className="btn-primary mt-6">
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      </div>

      {activeQuiz !== null && (
        <QuizModal
          questions={quizSets[activeQuiz].questions}
          title={quizSets[activeQuiz].title}
          onClose={() => setActiveQuiz(null)}
        />
      )}
    </section>
  );
}
