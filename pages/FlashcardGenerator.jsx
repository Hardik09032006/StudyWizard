import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import API from '../utils/api';
import {
  FiLayers, FiSend, FiAlertCircle, FiChevronLeft, FiChevronRight,
  FiRefreshCw, FiPlus, FiMinus, FiRotateCw
} from 'react-icons/fi';

const FlashcardGenerator = () => {
  const [topic, setTopic] = useState('');
  const [numCards, setNumCards] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Flashcard state
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for the flashcards.');
      return;
    }

    setError('');
    setCards([]);
    setCurrentIndex(0);
    setFlipped(false);
    setLoading(true);

    try {
      const response = await API.post('/ai/generate-flashcards', {
        topic: topic.trim(),
        numberOfCards: numCards,
      });

      const cardData = response.data.flashcardSet?.cards || response.data.flashcards || response.data.cards || response.data.data || [];

      if (!Array.isArray(cardData) || cardData.length === 0) {
        setError('No flashcards were generated. Please try a different topic.');
        return;
      }

      // Normalize cards
      const normalized = cardData.map((c) => ({
        front: c.front || c.question || c.term || '',
        back: c.back || c.answer || c.definition || '',
      }));

      setCards(normalized);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Failed to generate flashcards. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handlePrev = useCallback(() => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }, 150);
  }, []);

  const handleNext = useCallback(() => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => Math.min(cards.length - 1, prev + 1));
    }, 150);
  }, [cards.length]);

  const handleShuffle = () => {
    setFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const goToCard = (index) => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex(index);
    }, 150);
  };

  const handleNewSet = () => {
    setCards([]);
    setCurrentIndex(0);
    setFlipped(false);
    setTopic('');
  };

  // Flashcard Viewer
  if (cards.length > 0) {
    const current = cards[currentIndex];

    return (
      <motion.div
        className="tool-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="tool-header">
          <h1>
            <FiLayers style={{ color: 'var(--warning)' }} />
            Flashcards: {topic}
          </h1>
        </div>

        <div className="flashcard-viewer">
          {/* Top Controls */}
          <div className="flashcard-controls-top">
            <span className="flashcard-counter">
              Card {currentIndex + 1} of {cards.length}
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-ghost btn-sm" onClick={handleShuffle}>
                <FiRefreshCw />
                Shuffle
              </button>
              <button className="btn btn-ghost btn-sm" onClick={handleNewSet}>
                <FiPlus />
                New Set
              </button>
            </div>
          </div>

          {/* Flashcard */}
          <motion.div
            className="flashcard-container"
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`flashcard ${flipped ? 'flipped' : ''}`}
              onClick={handleFlip}
            >
              {/* Front */}
              <div className="flashcard-face flashcard-front">
                <span className="flashcard-label">Concept</span>
                <div className="flashcard-text">{current.front}</div>
                <div className="flashcard-hint">
                  <FiRotateCw size={14} />
                  Click to flip
                </div>
              </div>

              {/* Back */}
              <div className="flashcard-face flashcard-back">
                <span className="flashcard-label">Explanation</span>
                <div className="flashcard-text">{current.back}</div>
                <div className="flashcard-hint">
                  <FiRotateCw size={14} />
                  Click to flip back
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flashcard-nav">
            <button
              className="flashcard-nav-btn"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Previous card"
            >
              <FiChevronLeft />
            </button>

            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, minWidth: 60, textAlign: 'center' }}>
              {currentIndex + 1} / {cards.length}
            </span>

            <button
              className="flashcard-nav-btn"
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              aria-label="Next card"
            >
              <FiChevronRight />
            </button>
          </div>

          {/* Progress Dots */}
          <div className="flashcard-dots">
            {cards.map((_, index) => (
              <button
                key={index}
                className={`flashcard-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToCard(index)}
                aria-label={`Go to card ${index + 1}`}
              />
            ))}
          </div>
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
          <FiLayers style={{ color: 'var(--warning)' }} />
          Flashcard Generator
        </h1>
        <p>Generate interactive flashcards on any topic with beautiful 3D flip animations.</p>
      </div>

      <div className="flashcard-setup">
        <div className="input-group">
          <label htmlFor="flashcardTopic">Topic</label>
          <input
            id="flashcardTopic"
            type="text"
            placeholder="e.g., Spanish Vocabulary, Organic Chemistry, JavaScript Concepts..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
        </div>

        <div className="quiz-controls">
          <div className="quiz-control-group">
            <label>Number of Cards</label>
            <div className="num-selector">
              <button
                onClick={() => setNumCards((prev) => Math.max(5, prev - 1))}
                disabled={numCards <= 5}
              >
                <FiMinus />
              </button>
              <span>{numCards}</span>
              <button
                onClick={() => setNumCards((prev) => Math.min(20, prev + 1))}
                disabled={numCards >= 20}
              >
                <FiPlus />
              </button>
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
                Generating Flashcards...
              </>
            ) : (
              <>
                <FiSend />
                Generate Flashcards
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

export default FlashcardGenerator;
