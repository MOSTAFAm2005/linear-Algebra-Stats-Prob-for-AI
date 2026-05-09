import { useLenis } from './hooks/useLenis';
import { useCustomCursor } from './hooks/useCustomCursor';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import LinearAlgebra from './sections/LinearAlgebra';
import Statistics from './sections/Statistics';
import Quizzes from './sections/Quizzes';
import Flashcards from './sections/Flashcards';
import VisualLab from './sections/VisualLab';
import KeyTakeaways from './sections/KeyTakeaways';
import Footer from './sections/Footer';

function App() {
  useLenis();
  useCustomCursor();

  return (
    <div className="min-h-screen bg-[#12140f] text-white overflow-x-hidden">
      <Navigation />
      <Hero />
      <LinearAlgebra />
      <Statistics />
      <Quizzes />
      <Flashcards />
      <VisualLab />
      <KeyTakeaways />
      <Footer />
    </div>
  );
}

export default App;
