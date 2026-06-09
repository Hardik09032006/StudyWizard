import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import API from '../utils/api';
import { FiFileText, FiSend, FiCopy, FiCheck, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const NoteSummarizer = () => {
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const maxChars = 10000;

  const handleSummarize = async () => {
    if (!notes.trim()) {
      setError('Please paste some notes to summarize.');
      return;
    }

    if (notes.trim().length < 50) {
      setError('Please provide at least 50 characters for a meaningful summary.');
      return;
    }

    setError('');
    setResult('');
    setSaved(false);
    setLoading(true);

    try {
      const response = await API.post('/ai/summarize', {
        text: notes.trim(),
      });

      const summary = response.data.summary || response.data.data?.summary || response.data.content || '';
      setResult(summary);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Failed to summarize. Please try again.';
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

  return (
    <motion.div
      className="tool-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="tool-header">
        <h1>
          <FiFileText style={{ color: 'var(--secondary)' }} />
          Note Summarizer
        </h1>
        <p>Paste your notes below and get a concise, well-structured AI summary.</p>
      </div>

      <div className="tool-input-area">
        <div className="input-group">
          <label htmlFor="notes">Your Notes</label>
          <textarea
            id="notes"
            placeholder="Paste your notes, lecture content, or any text you want to summarize..."
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, maxChars))}
            rows={10}
            style={{ minHeight: '200px' }}
          />
          <div className="char-count">
            <span style={{ color: notes.length > maxChars * 0.9 ? 'var(--warning)' : 'inherit' }}>
              {notes.length.toLocaleString()} / {maxChars.toLocaleString()} characters
            </span>
          </div>
        </div>

        <div className="tool-actions">
          <button
            className="btn btn-primary"
            onClick={handleSummarize}
            disabled={loading || !notes.trim()}
          >
            {loading ? (
              <>
                <div className="loading-spinner" />
                Summarizing...
              </>
            ) : (
              <>
                <FiSend />
                Summarize Notes
              </>
            )}
          </button>

          {saved && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--success)',
                fontSize: '0.9rem',
              }}
            >
              <FiCheckCircle />
              Saved to history
            </motion.span>
          )}
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
        <motion.div
          className="result-area"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="result-header">
            <h3>
              <FiFileText style={{ color: 'var(--secondary)' }} />
              Summary
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
              <span style={{ color: 'var(--text-muted)' }}>Generating summary...</span>
            </div>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default NoteSummarizer;
