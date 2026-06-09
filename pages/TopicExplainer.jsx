import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import API from '../utils/api';
import { FiBookOpen, FiSend, FiCopy, FiCheck, FiAlertCircle } from 'react-icons/fi';

const TopicExplainer = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const resultRef = useRef(null);

  const difficulties = [
    { value: 'simple', label: 'Simple' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  // Typing animation effect
  useEffect(() => {
    if (!result) {
      setDisplayedText('');
      return;
    }

    let index = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      if (index < result.length) {
        setDisplayedText(result.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 5);

    return () => clearInterval(interval);
  }, [result]);

  useEffect(() => {
    if (displayedText && resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [displayedText]);

  const handleExplain = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic to explain.');
      return;
    }

    setError('');
    setResult('');
    setLoading(true);

    try {
      const response = await API.post('/ai/explain', {
        topic: topic.trim(),
        difficulty,
      });

      const explanation = response.data.explanation || response.data.data?.explanation || response.data.content || '';
      setResult(explanation);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Failed to generate explanation. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleExplain();
    }
  };

  return (
    <motion.div
      className="tool-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="tool-header">
        <h1>
          <FiBookOpen style={{ color: 'var(--primary-light)' }} />
          Topic Explainer
        </h1>
        <p>Enter any topic and get a clear, AI-powered explanation tailored to your level.</p>
      </div>

      <div className="tool-input-area">
        <div className="input-group">
          <label htmlFor="topic">What would you like to learn about?</label>
          <input
            id="topic"
            type="text"
            placeholder="e.g., Quantum Computing, Photosynthesis, Machine Learning..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div style={{ marginTop: 'var(--space-md)' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-sm)' }}>
            Difficulty Level
          </label>
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

        <div className="tool-actions">
          <button
            className="btn btn-primary"
            onClick={handleExplain}
            disabled={loading || !topic.trim()}
          >
            {loading ? (
              <>
                <div className="loading-spinner" />
                Explaining...
              </>
            ) : (
              <>
                <FiSend />
                Explain Topic
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <motion.div
          className="auth-error"
          style={{ marginBottom: 'var(--space-lg)' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FiAlertCircle />
          {error}
        </motion.div>
      )}

      {(result || loading) && (
        <div className="result-area" ref={resultRef}>
          <div className="result-header">
            <h3>
              <FiBookOpen style={{ color: 'var(--primary-light)' }} />
              Explanation
            </h3>
            {result && (
              <button
                className={`copy-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
              >
                {copied ? <FiCheck /> : <FiCopy />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
              <div className="loading-spinner" />
              <span style={{ color: 'var(--text-muted)' }}>Generating explanation...</span>
            </div>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown>{displayedText}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default TopicExplainer;
