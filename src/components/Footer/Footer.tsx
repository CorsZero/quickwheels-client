/**
 * Quick Wheel Vehicle Rental App Component
 * Component: Footer
 * Description: Website footer with links, contact info, and social media
 * Tech: React + TypeScript + CSS Modules
 * Behavior:
 * - Company information and links
 * - Contact details
 * - Social media links
 * - Copyright information
 */

import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.content}>
          {/* Company Info */}
          <div className={styles.section}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>🚗</span>
              <span className={styles.logoText}>Quick Wheel</span>
            </div>
            <p className={styles.description}>
              Sri Lanka's premier vehicle rental platform. Find the perfect ride for every journey.
            </p>
            <div className={styles.social}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                📘
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                🐦
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                📷
              </a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn">
                💼
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Quick Links</h3>
            <ul className={styles.linkList}>
              <li>
                <Link to="/" className={styles.link}>Home</Link>
              </li>
              <li>
                <Link to="/ads" className={styles.link}>Browse Vehicles</Link>
              </li>
              <li>
                <Link to="/create-ad" className={styles.link}>List Your Vehicle</Link>
              </li>
              <li>
                <Link to="/profile" className={styles.link}>My Account</Link>
              </li>
            </ul>
          </div>

          {/* Vehicle Categories */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Vehicle Types</h3>
            <ul className={styles.linkList}>
              <li>
                <span className={styles.link}>🚗 Cars</span>
              </li>
              <li>
                <span className={styles.link}>🛴 Scooters</span>
              </li>
              <li>
                <span className={styles.link}>🏍️ Motorcycles</span>
              </li>
              <li>
                <span className={styles.link}>🚐 Vans</span>
              </li>
              <li>
                <span className={styles.link}>🚚 Large Vehicles</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Contact Us</h3>
            <div className={styles.contact}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📞</span>
                <span>+94 11 234 5678</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>✉️</span>
                <span>hello@quickwheel.lk</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📍</span>
                <span>Colombo, Sri Lanka</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>🕒</span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottom}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              © {currentYear} Quick Wheel. All rights reserved.
            </p>
            <div className={styles.legalLinks}>
              <a href="#" className={styles.legalLink}>Privacy Policy</a>
              <a href="#" className={styles.legalLink}>Terms of Service</a>
              <a href="#" className={styles.legalLink}>Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;