import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../utils/api';
import {
  FiFileText, FiHelpCircle, FiLayers, FiTrash2,
  FiClock, FiChevronDown, FiChevronUp, FiAlertCircle
} from 'react-icons/fi';

const TABS = [
  { id: 'notes', label: 'Notes', icon: <FiFileText /> },
  { id: 'quizzes', label: 'Quizzes', icon: <FiHelpCircle /> },
  { id: 'flashcards', label: 'Flashcards', icon: <FiLayers /> },
];

const History = () => {
  const [activeTab, setActiveTab] = useState('notes');
  const [items, setItems] = useState({ notes: [], quizzes: [], flashcards: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchAllHistory();
  }, []);

  const fetchAllHistory = async () => {
    setLoading(true);
    setError('');

    try {
      const [notesRes, quizzesRes, flashcardsRes] = await Promise.allSettled([
        API.get('/history/notes'),
        API.get('/history/quizzes'),
        API.get('/history/flashcards'),
      ]);

      const extractData = (res) => {
        if (res.status !== 'fulfilled') return [];
        const d = res.value.data;
        return Array.isArray(d) ? d : (d.data || d.notes || d.quizzes || d.flashcards || []);
      };

      setItems({
        notes: extractData(notesRes),
        quizzes: extractData(quizzesRes),
        flashcards: extractData(flashcardsRes),
      });
    } catch (err) {
      setError('Failed to load history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    try {
      const endpoints = {
        notes: `/history/notes/${id}`,
        quizzes: `/history/quizzes/${id}`,
        flashcards: `/history/flashcards/${id}`,
      };

      await API.delete(endpoints[type]);
      setItems((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => (item._id || item.id) !== id),
      }));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown date';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPreview = (item, type) => {
    switch (type) {
      case 'notes':
        return item.summary || item.content?.substring(0, 150) || 'No preview available';
      case 'quizzes':
        return `${item.questions?.length || 0} questions${item.score != null ? ` • Score: ${item.score}%` : ''}`;
      case 'flashcards':
        return `${item.flashcards?.length || item.cards?.length || 0} cards`;
      default:
        return '';
    }
  };

  const getTitle = (item, type) => {
    return item.topic || item.title || (type === 'notes' ? 'Note Summary' : type === 'quizzes' ? 'Quiz' : 'Flashcard Set');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'notes': return <FiFileText />;
      case 'quizzes': return <FiHelpCircle />;
      case 'flashcards': return <FiLayers />;
      default: return null;
    }
  };

  const getIconStyle = (type) => {
    switch (type) {
      case 'notes': return { background: 'var(--secondary-glow)', color: 'var(--secondary)' };
      case 'quizzes': return { background: 'var(--accent-glow)', color: 'var(--accent)' };
      case 'flashcards': return { background: 'rgba(255, 140, 0, 0.15)', color: 'var(--warning)' };
      default: return {};
    }
  };

  const currentItems = items[activeTab] || [];

  const renderExpandedContent = (item, type) => {
    switch (type) {
      case 'notes':
        return (
          <div style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '0.5rem' }}>Summary:</strong>
            {item.summary || item.content || 'No content available'}
          </div>
        );
      case 'quizzes':
        return (
          <div style={{ marginTop: '1rem' }}>
            {item.questions?.map((q, i) => (
              <div key={i} style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--surface)', borderRadius: '0.5rem' }}>
                <p style={{ color: 'var(--text)', fontWeight: 500, marginBottom: '0.5rem' }}>
                  {i + 1}. {q.question || q.text}
                </p>
                {q.options?.map((opt, j) => (
                  <p key={j} style={{
                    color: j === (q.correctAnswer ?? q.correct_answer) ? 'var(--success)' : 'var(--text-muted)',
                    fontSize: '0.85rem',
                    paddingLeft: '1rem',
                    marginBottom: '0.25rem',
                  }}>
                    {['A', 'B', 'C', 'D'][j]}. {opt}
                    {j === (q.correctAnswer ?? q.correct_answer) && ' ✓'}
                  </p>
                ))}
              </div>
            ))}
          </div>
        );
      case 'flashcards':
        return (
          <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
            {(item.flashcards || item.cards)?.map((card, i) => (
              <div key={i} style={{ padding: '0.75rem', background: 'var(--surface)', borderRadius: '0.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary-light)', textTransform: 'uppercase', fontWeight: 600 }}>Front</span>
                  <p style={{ color: 'var(--text)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{card.front || card.question || card.term}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Back</span>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{card.back || card.answer || card.definition}</p>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="page-header">
        <h1 className="page-title">
          <FiClock style={{ color: 'var(--primary-light)', marginRight: 8 }} />
          History
        </h1>
        <p className="page-subtitle">View and manage your saved notes, quizzes, and flashcards.</p>
      </div>

      {/* Tabs */}
      <div className="history-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`history-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.id);
              setExpandedId(null);
            }}
          >
            {tab.icon}
            {tab.label}
            {items[tab.id]?.length > 0 && (
              <span style={{
                background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'var(--border)',
                padding: '0.1rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                marginLeft: '0.25rem',
              }}>
                {items[tab.id].length}
              </span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="auth-error" style={{ marginBottom: 'var(--space-lg)' }}>
          <FiAlertCircle />
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="history-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="history-item" style={{ opacity: 0.6 }}>
              <div className="history-item-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 8 }} />
                  <div>
                    <div className="skeleton" style={{ width: 180, height: 16, marginBottom: 6 }} />
                    <div className="skeleton" style={{ width: 100, height: 12 }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : currentItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            {getIcon(activeTab)}
          </div>
          <h3>No {activeTab} yet</h3>
          <p>
            {activeTab === 'notes' && 'Summarize some notes to see them here.'}
            {activeTab === 'quizzes' && 'Generate a quiz to see it here.'}
            {activeTab === 'flashcards' && 'Create flashcards to see them here.'}
          </p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="history-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentItems.map((item, index) => {
              const id = item._id || item.id || index;
              const isExpanded = expandedId === id;

              return (
                <motion.div
                  key={id}
                  className="history-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => toggleExpand(id)}
                >
                  <div className="history-item-header">
                    <div className="history-item-title">
                      <div
                        className="activity-icon"
                        style={getIconStyle(activeTab)}
                      >
                        {getIcon(activeTab)}
                      </div>
                      {getTitle(item, activeTab)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="history-item-date">
                        {formatDate(item.createdAt)}
                      </span>
                      {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                    </div>
                  </div>

                  {!isExpanded && (
                    <p className="history-item-preview">
                      {getPreview(item, activeTab)}
                    </p>
                  )}

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        {renderExpandedContent(item, activeTab)}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="history-item-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="history-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(activeTab, id);
                      }}
                    >
                      <FiTrash2 size={14} />
                      Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default History;
