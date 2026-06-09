import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../utils/api';
import {
  FiBookOpen, FiFileText, FiHelpCircle, FiLayers,
  FiArrowRight, FiClock, FiAward, FiTrendingUp
} from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState({ notes: 0, quizzes: 0, flashcards: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  const features = [
    {
      to: '/explain',
      icon: <FiBookOpen />,
      title: 'Topic Explainer',
      description: 'Get clear AI explanations for any topic at your level.',
      colorClass: 'purple',
    },
    {
      to: '/summarize',
      icon: <FiFileText />,
      title: 'Note Summarizer',
      description: 'Transform lengthy notes into concise summaries.',
      colorClass: 'teal',
    },
    {
      to: '/quiz',
      icon: <FiHelpCircle />,
      title: 'Quiz Generator',
      description: 'Test your knowledge with AI-generated quizzes.',
      colorClass: 'pink',
    },
    {
      to: '/flashcards',
      icon: <FiLayers />,
      title: 'Flashcard Generator',
      description: 'Create interactive flashcards for study sessions.',
      colorClass: 'orange',
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesRes, quizzesRes, flashcardsRes] = await Promise.allSettled([
          API.get('/history/notes'),
          API.get('/history/quizzes'),
          API.get('/history/flashcards'),
        ]);

        const notes = notesRes.status === 'fulfilled' ? (notesRes.value.data.data || notesRes.value.data || []) : [];
        const quizzes = quizzesRes.status === 'fulfilled' ? (quizzesRes.value.data.data || quizzesRes.value.data || []) : [];
        const flashcards = flashcardsRes.status === 'fulfilled' ? (flashcardsRes.value.data.data || flashcardsRes.value.data || []) : [];

        setStats({
          notes: Array.isArray(notes) ? notes.length : 0,
          quizzes: Array.isArray(quizzes) ? quizzes.length : 0,
          flashcards: Array.isArray(flashcards) ? flashcards.length : 0,
        });

        // Build recent activity from all sources
        const allItems = [];

        if (Array.isArray(notes)) {
          notes.slice(0, 3).forEach((n) => {
            allItems.push({
              type: 'note',
              title: n.topic || n.title || 'Note Summary',
              date: n.createdAt,
              icon: <FiFileText />,
            });
          });
        }

        if (Array.isArray(quizzes)) {
          quizzes.slice(0, 3).forEach((q) => {
            allItems.push({
              type: 'quiz',
              title: q.topic || q.title || 'Quiz',
              date: q.createdAt,
              icon: <FiHelpCircle />,
            });
          });
        }

        if (Array.isArray(flashcards)) {
          flashcards.slice(0, 3).forEach((f) => {
            allItems.push({
              type: 'flashcard',
              title: f.topic || f.title || 'Flashcards',
              date: f.createdAt,
              icon: <FiLayers />,
            });
          });
        }

        // Sort by date, most recent first
        allItems.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        setRecentActivity(allItems.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoadingActivity(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Welcome */}
      <div className="dashboard-welcome">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {getGreeting()}, <span className="gradient-text">Learner</span> 👋
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Ready to continue your learning journey? Pick a tool below to get started.
        </motion.p>
      </div>

      {/* Stats */}
      <motion.div
        className="dashboard-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}>
            <FiAward />
          </div>
          <div className="stat-card-info">
            <h3>{stats.quizzes}</h3>
            <p>Quizzes Taken</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--secondary-glow)', color: 'var(--secondary)' }}>
            <FiLayers />
          </div>
          <div className="stat-card-info">
            <h3>{stats.flashcards}</h3>
            <p>Flashcard Sets</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}>
            <FiTrendingUp />
          </div>
          <div className="stat-card-info">
            <h3>{stats.notes}</h3>
            <p>Notes Saved</p>
          </div>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <div className="dashboard-features">
        <h2>Study Tools</h2>
        <div className="dashboard-grid stagger-children">
          {features.map((feature) => (
            <Link
              key={feature.to}
              to={feature.to}
              className="dashboard-feature-card"
            >
              <div className={`feature-icon ${feature.colorClass}`}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <div className="flex-between" style={{ marginBottom: 'var(--space-lg)' }}>
          <h2>Recent Activity</h2>
          <Link to="/history" className="btn btn-ghost btn-sm">
            View All <FiArrowRight />
          </Link>
        </div>

        {loadingActivity ? (
          <div className="activity-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="activity-item">
                <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton skeleton-title" />
                  <div className="skeleton skeleton-text" style={{ width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : recentActivity.length > 0 ? (
          <div className="activity-list">
            {recentActivity.map((item, index) => (
              <motion.div
                key={index}
                className="activity-item"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className="activity-icon"
                  style={{
                    background: item.type === 'note' ? 'var(--secondary-glow)' :
                               item.type === 'quiz' ? 'var(--accent-glow)' :
                               'rgba(255, 140, 0, 0.15)',
                    color: item.type === 'note' ? 'var(--secondary)' :
                           item.type === 'quiz' ? 'var(--accent)' : 'var(--warning)',
                  }}
                >
                  {item.icon}
                </div>
                <div className="activity-info">
                  <h4>{item.title}</h4>
                  <p>{formatDate(item.date)}</p>
                </div>
                <span className={`badge badge-${item.type === 'note' ? 'secondary' : item.type === 'quiz' ? 'accent' : 'warning'}`}>
                  {item.type}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-activity">
            <div className="empty-activity-icon">
              <FiClock />
            </div>
            <p>No recent activity yet. Start using the tools above!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
