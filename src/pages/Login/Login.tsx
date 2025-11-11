/**
 * Quick Wheel Vehicle Rental App
 * Page: Login
 * Description: Email/password login page
 * Tech: React + TypeScript + CSS Modules
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/profile');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <div className={styles.header}>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Sign in to your Quick Wheel account</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <div className={styles.error}>
                <span className={styles.errorIcon}>⚠️</span>
                {error}
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className={styles.footer}>
            <p className={styles.demoInfo}>
              <strong>Demo Account:</strong><br />
              Email: user1@example.com<br />
              Password: password
            </p>
            
            <div className={styles.links}>
              <Link to="/" className={styles.link}>
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.features}>
          <h3 className={styles.featuresTitle}>Why Join Quick Wheel?</h3>
          <ul className={styles.featuresList}>
            <li className={styles.feature}>
              <span className={styles.featureIcon}>🚗</span>
              <span>Access to 50+ verified vehicles</span>
            </li>
            <li className={styles.feature}>
              <span className={styles.featureIcon}>💰</span>
              <span>Best prices with no hidden fees</span>
            </li>
            <li className={styles.feature}>
              <span className={styles.featureIcon}>📞</span>
              <span>24/7 customer support</span>
            </li>
            <li className={styles.feature}>
              <span className={styles.featureIcon}>🛡️</span>
              <span>Secure booking and payments</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;