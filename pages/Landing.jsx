import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiZap, FiBookOpen, FiFileText, FiHelpCircle, FiLayers, FiArrowRight, FiStar } from 'react-icons/fi';

const Landing = () => {

  const features = [
    {
      icon: <FiBookOpen />,
      title: 'Topic Explainer',
      description: 'Get clear, AI-powered explanations for any topic at your preferred difficulty level.',
      colorClass: 'purple',
    },
    {
      icon: <FiFileText />,
      title: 'Note Summarizer',
      description: 'Paste your notes and get concise, well-structured summaries in seconds.',
      colorClass: 'teal',
    },
    {
      icon: <FiHelpCircle />,
      title: 'Quiz Generator',
      description: 'Generate interactive quizzes with instant feedback and detailed explanations.',
      colorClass: 'pink',
    },
    {
      icon: <FiLayers />,
      title: 'Flashcard Generator',
      description: 'Create beautiful flashcards with 3D flip animations for effective studying.',
      colorClass: 'orange',
    },
  ];

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient-orb" />
          <div className="hero-gradient-orb" />
          <div className="hero-gradient-orb" />
          <div className="hero-particles">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="hero-particle" />
            ))}
          </div>
        </div>

        <motion.div
          className="hero-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FiZap />
            <span>AI-Powered Learning</span>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Study Smarter{' '}
            <span className="gradient-text">with AI</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Your intelligent study companion that explains topics, summarizes notes,
            generates quizzes, and creates flashcards — all powered by advanced AI.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to="/dashboard"
              className="btn btn-primary btn-lg"
            >
              <FiZap />
              Get Started Free
              <FiArrowRight />
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg">
              Learn More
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <motion.div
            className="section-badge"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <FiStar />
            Features
          </motion.div>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Everything You Need to <span className="gradient-text">Excel</span>
          </motion.h2>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Powerful AI tools designed to transform the way you study and retain information.
          </motion.p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`feature-icon ${feature.colorClass}`}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <motion.div
            className="stat-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="stat-value gradient-text">1000+</div>
            <div className="stat-label">Topics Covered</div>
          </motion.div>
          <motion.div
            className="stat-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="stat-value gradient-text">AI</div>
            <div className="stat-label">Powered Learning</div>
          </motion.div>
          <motion.div
            className="stat-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="stat-value gradient-text">Instant</div>
            <div className="stat-label">Results Generated</div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p className="footer-text">
          © {new Date().getFullYear()} StudyBuddy AI — Built with ❤️ for learners everywhere.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
