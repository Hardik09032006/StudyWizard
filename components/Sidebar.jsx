import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiBookOpen, FiFileText, FiHelpCircle,
  FiLayers, FiClock, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';

const sidebarItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiGrid /> },
  { to: '/explain', label: 'Explain', icon: <FiBookOpen /> },
  { to: '/summarize', label: 'Summarize', icon: <FiFileText /> },
  { to: '/quiz', label: 'Quiz', icon: <FiHelpCircle /> },
  { to: '/flashcards', label: 'Flashcards', icon: <FiLayers /> },
  { to: '/history', label: 'History', icon: <FiClock /> },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      className="sidebar"
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        top: 'var(--navbar-height)',
        left: 0,
        bottom: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--glass-border)',
        zIndex: 100,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem 0.5rem',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {sidebarItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={{
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: '0.75rem',
              borderRadius: '0.75rem',
              whiteSpace: 'nowrap',
            }}
            title={collapsed ? item.label : undefined}
          >
            <span style={{ fontSize: '1.15rem', flexShrink: 0 }}>{item.icon}</span>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '0.5rem',
          color: 'var(--text-muted)',
          padding: '0.5rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          marginTop: 'auto',
        }}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
      </button>
    </motion.aside>
  );
};

export default Sidebar;
