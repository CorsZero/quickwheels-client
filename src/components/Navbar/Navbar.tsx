
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import QuickWheelLogo from '../../assets/images/quickWheelLogo.svg';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in from localStorage
  const userString = localStorage.getItem('currentUser');
  const user = userString ? JSON.parse(userString) : null;
  const isLoggedIn = !!user;

  const handleLogout = async () => {
    localStorage.removeItem('currentUser');
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo} onClick={closeMenus}>
          <img src={QuickWheelLogo} alt="Quick Wheel" className={styles.logoIcon} />
          <span className={styles.logoText}>Quick Wheel</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className={styles.navLinks}>
          <Link
            to="/"
            className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}
          >
            Home
          </Link>
          <Link
            to="/ads"
            className={`${styles.navLink} ${location.pathname === '/ads' ? styles.active : ''}`}
          >
            Ads
          </Link>
          {isLoggedIn && (
            <Link
              to="/create-ad"
              className={`${styles.navLink} ${location.pathname === '/create-ad' ? styles.active : ''}`}
            >
              Create Ad
            </Link>
          )}
        </div>

        {/* User Authentication */}
        <div className={styles.authSection}>
          {isLoggedIn ? (
            <div className={styles.profileDropdown}>
              <button
                className={styles.profileButton}
                onClick={toggleProfileDropdown}
                aria-label="User menu"
              >
                <span className={styles.profileIcon} aria-hidden="true">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                  >
                    <circle cx="12" cy="7" r="4" fill="white" />
                    <path d="M4 20c0-4 4-7 8-7s8 3 8 7" fill="white" />
                  </svg>
                </span>
                <span className={styles.profileName}>{user?.name}</span>
                <span className={styles.dropdownArrow}>
                  {isProfileDropdownOpen ? '▲' : '▼'}
                </span>
              </button>

              {isProfileDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link
                    to="/profile"
                    className={styles.dropdownItem}
                    onClick={closeMenus}
                  >
                    Profile
                  </Link>
                  <button
                    className={styles.dropdownItem}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className={styles.loginButton}>
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={styles.hamburger}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link
            to="/"
            className={`${styles.mobileNavLink} ${location.pathname === '/' ? styles.active : ''}`}
            onClick={closeMenus}
          >
            Home
          </Link>
          <Link
            to="/ads"
            className={`${styles.mobileNavLink} ${location.pathname === '/ads' ? styles.active : ''}`}
            onClick={closeMenus}
          >
            Ads
          </Link>
          {isLoggedIn && (
            <Link
              to="/create-ad"
              className={`${styles.mobileNavLink} ${location.pathname === '/create-ad' ? styles.active : ''}`}
              onClick={closeMenus}
            >
              Create Ad
            </Link>
          )}

          <div className={styles.mobileAuth}>
            {isLoggedIn ? (
              <>
                <Link to="/profile" className={styles.mobileNavLink} onClick={closeMenus}>
                  Profile ({user?.name})
                </Link>
                <button className={styles.mobileLogoutButton} onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className={styles.mobileLoginButton} onClick={closeMenus}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;