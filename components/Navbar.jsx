import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiZap, FiMenu, FiX, FiBookOpen, FiFileText, FiHelpCircle, FiLayers, FiClock, FiGrid } from 'react-icons/fi';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <FiGrid /> },
    { to: '/explain', label: 'Explain', icon: <FiBookOpen /> },
    { to: '/summarize', label: 'Summarize', icon: <FiFileText /> },
    { to: '/quiz', label: 'Quiz', icon: <FiHelpCircle /> },
    { to: '/flashcards', label: 'Flashcards', icon: <FiLayers /> },
    { to: '/history', label: 'History', icon: <FiClock /> },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <FiZap className="logo-icon" />
            <span className="logo-text">StudyBuddy</span>
          </Link>

          <ul className="navbar-links">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="navbar-auth">
            <button
              className="mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => isActive ? 'active' : ''}
            onClick={closeMobile}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default Navbar;
