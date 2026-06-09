import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import TopicExplainer from './pages/TopicExplainer';
import NoteSummarizer from './pages/NoteSummarizer';
import QuizGenerator from './pages/QuizGenerator';
import FlashcardGenerator from './pages/FlashcardGenerator';
import History from './pages/History';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explain" element={<TopicExplainer />} />
            <Route path="/summarize" element={<NoteSummarizer />} />
            <Route path="/quiz" element={<QuizGenerator />} />
            <Route path="/flashcards" element={<FlashcardGenerator />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
