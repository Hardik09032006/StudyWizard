import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../utils/api';
import {
  FiHelpCircle, FiSend, FiAlertCircle, FiChevronRight,
  FiRefreshCw, FiPlus, FiMinus, FiAward, FiTarget
} from 'react-icons/fi';

const LETTERS = ['A', 'B', 'C', 'D'];

// Confetti component
const Confetti = () => {
  const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--warning)', 'var(--success)', 'var(--primary-light)'];
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    duration: `${2 + Math.random() * 2}s`,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: `${Math.random() * 360}deg`,
    size: `${6 + Math.random() * 8}px`,
  }));

  return (
    <div className="confetti-container">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDelay: p.delay,
            animationDuration: p.duration,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
};

const QuizGenerator = () => {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('intermediate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizId, setQuizId] = useState(null);

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'hard', label: 'Hard' },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for the quiz.');
      return;
    }

    setError('');
    setQuestions([]);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setShowResults(false);
    setAnswers([]);
    setLoading(true);

    try {
      const response = await API.post('/ai/generate-quiz', {
        topic: topic.trim(),
        numQuestions,
        numberOfQuestions: numQuestions,
        difficulty,
      });

      const quiz = response.data.quiz || response.data;
      const quizData = quiz.questions || response.data.questions || response.data.data?.questions || [];
      setQuizId(quiz._id || response.data._id || null);

      if (!Array.isArray(quizData) || quizData.length === 0) {
        setError('No questions were generated. Please try a different topic.');
        return;
      }

      // Normalize question data
      const normalized = quizData.map((q) => ({
        question: q.question || q.text || '',
        options: q.options || q.choices || [],
        correctAnswer: q.correctAnswer ?? q.correct_answer ?? q.answer ?? 0,
        explanation: q.explanation || '',
      }));

      setQuestions(normalized);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Failed to generate quiz. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = useCallback((index) => {
    if (answered) return;

    setSelectedAnswer(index);
    setAnswered(true);

    const current = questions[currentQ];
    const isCorrect = index === current.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setAnswers((prev) => [...prev, { selected: index, correct: current.correctAnswer, isCorrect }]);
  }, [answered, questions, currentQ]);

  const handleNext = async () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setShowResults(true);
      // Save score to backend
      const percent = Math.round((score / questions.length) * 100);
      if (quizId) {
        try {
          await API.post(`/ai/quiz/${quizId}/score`, {
            score: percent,
            totalQuestions: questions.length,
          });
        } catch (err) {
          console.error('Failed to save score:', err);
        }
      }
    }
  };

  const handleNewQuiz = () => {
    setQuestions([]);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setShowResults(false);
    setAnswers([]);
    setQuizId(null);
    setTopic('');
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setShowResults(false);
    setAnswers([]);
  };

  const getScoreInfo = () => {
    const percent = Math.round((score / questions.length) * 100);
    if (percent >= 90) return { grade: 'excellent', message: '🎉 Outstanding! You\'re a master of this topic!', emoji: '🏆' };
    if (percent >= 70) return { grade: 'good', message: '👏 Great job! You have a solid understanding!', emoji: '⭐' };
    if (percent >= 50) return { grade: 'average', message: '📚 Not bad! Keep studying to improve!', emoji: '💪' };
    return { grade: 'poor', message: '📖 Keep learning! Practice makes perfect!', emoji: '📝' };
  };

  const getOptionClass = (index) => {
    if (!answered) return selectedAnswer === index ? 'selected' : '';
    const current = questions[currentQ];
    if (index === current.correctAnswer) return 'correct';
    if (index === selectedAnswer && index !== current.correctAnswer) return 'wrong';
    return '';
  };

  // Quiz Results View
  if (showResults && questions.length > 0) {
    const percent = Math.round((score / questions.length) * 100);
    const info = getScoreInfo();

    return (
      <motion.div
        className="tool-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {percent >= 80 && <Confetti />}

        <div className="quiz-results">
          <motion.div
            className="quiz-results-card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <div className={`quiz-score-circle ${info.grade}`}>
              <span className="quiz-score-percent">{percent}%</span>
              <span className="quiz-score-label">Score</span>
            </div>

            <h2>{info.emoji} {score} / {questions.length} Correct</h2>
            <p className="score-message">{info.message}</p>

            <div className="quiz-results-actions">
              <button className="btn btn-outline" onClick={handleRetry}>
                <FiRefreshCw />
                Try Again
              </button>
              <button className="btn btn-primary" onClick={handleNewQuiz}>
                <FiPlus />
                New Quiz
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Quiz Interface View
  if (questions.length > 0) {
    const current = questions[currentQ];
    const progress = ((currentQ + 1) / questions.length) * 100;

    return (
      <motion.div
        className="tool-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="tool-header">
          <h1>
            <FiHelpCircle style={{ color: 'var(--accent)' }} />
            Quiz: {topic}
          </h1>
        </div>

        <div className="quiz-interface">
          {/* Progress */}
          <div className="quiz-progress">
            <div className="quiz-progress-bar">
              <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="quiz-progress-text">
              <span>Question {currentQ + 1} of {questions.length}</span>
              <span>Score: {score}/{currentQ + (answered ? 1 : 0)}</span>
            </div>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              className="quiz-question-card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="quiz-question-number">
                <FiTarget style={{ marginRight: 6 }} />
                Question {currentQ + 1}
              </div>
              <div className="quiz-question-text">
                {current.question}
              </div>

              <div className="quiz-options">
                {current.options.map((option, index) => (
                  <button
                    key={index}
                    className={`quiz-option ${getOptionClass(index)}`}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={answered}
                  >
                    <span className="option-letter">{LETTERS[index]}</span>
                    <span>{option}</span>
                  </button>
                ))}
              </div>

              {answered && current.explanation && (
                <div className="quiz-explanation">
                  <strong>Explanation: </strong>
                  {current.explanation}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {answered && (
            <motion.div
              className="quiz-nav"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button className="btn btn-primary" onClick={handleNext}>
                {currentQ < questions.length - 1 ? (
                  <>
                    Next Question
                    <FiChevronRight />
                  </>
                ) : (
                  <>
                    <FiAward />
                    See Results
                  </>
                )}
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  // Setup View
  return (
    <motion.div
      className="tool-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="tool-header">
        <h1>
          <FiHelpCircle style={{ color: 'var(--accent)' }} />
          Quiz Generator
        </h1>
        <p>Generate interactive quizzes on any topic. Test your knowledge with instant feedback!</p>
      </div>

      <div className="quiz-setup">
        <div className="input-group">
          <label htmlFor="quizTopic">Quiz Topic</label>
          <input
            id="quizTopic"
            type="text"
            placeholder="e.g., World War II, Python Programming, Cell Biology..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
        </div>

        <div className="quiz-controls">
          <div className="quiz-control-group">
            <label>Number of Questions</label>
            <div className="num-selector">
              <button
                onClick={() => setNumQuestions((prev) => Math.max(5, prev - 1))}
                disabled={numQuestions <= 5}
              >
                <FiMinus />
              </button>
              <span>{numQuestions}</span>
              <button
                onClick={() => setNumQuestions((prev) => Math.min(20, prev + 1))}
                disabled={numQuestions >= 20}
              >
                <FiPlus />
              </button>
            </div>
          </div>

          <div className="quiz-control-group">
            <label>Difficulty</label>
            <div className="difficulty-selector">
              {difficulties.map((d) => (
                <button
                  key={d.value}
                  className={`difficulty-btn ${difficulty === d.value ? 'active' : ''}`}
                  onClick={() => setDifficulty(d.value)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="tool-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
          >
            {loading ? (
              <>
                <div className="loading-spinner" />
                Generating Quiz...
              </>
            ) : (
              <>
                <FiSend />
                Generate Quiz
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <motion.div
          className="auth-error"
          style={{ marginTop: 'var(--space-lg)' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FiAlertCircle />
          {error}
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuizGenerator;
