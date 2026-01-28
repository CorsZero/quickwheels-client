/**
 * Quick Wheel Vehicle Rental App
 * Page: Login
 * Description: Email/password login page
 * Tech: React + TypeScript + CSS Modules
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserService } from '../../services/UserService';
import { useGoogleLogin } from '../../queries/user.queries';
import Alert from '../../components/Alert/Alert';
import styles from './Login.module.css';

// Declare Google Sign-In types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (element: HTMLElement, options: { theme: string; size: string }) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { LoginUser, isPending } = useUserService();
  const googleLoginMutation = useGoogleLogin();
  const navigate = useNavigate();

  // Initialize Google Sign-In
  useEffect(() => {
    // Load Google Sign-In script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  }, []);

  const initializeGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse,
      });

      // Render Google button into visible container so SDK handles user click (opens chooser)
      const googleBtnContainer = document.getElementById('googleBtn');
      if (googleBtnContainer) {
        window.google.accounts.id.renderButton(googleBtnContainer, {
          theme: 'outline',
          size: 'large',
        });
      }
    }
  };

  const handleGoogleCredentialResponse = (response: { credential: string }) => {
    setGoogleLoading(true);
    setError('');

    googleLoginMutation.mutate(response.credential, {
      onSuccess: (data) => {
        const successMessage = data?.message || 'Google Sign-In successful! Redirecting...';
        setSuccess(true);
        setError(successMessage);
        setTimeout(() => {
          navigate('/');
          window.location.reload(); // Reload to fetch profile with new cookies
        }, 1000);
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || error?.message || 'Google Sign-In failed. Please try again.';
        setError(errorMessage);
        setGoogleLoading(false);
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    LoginUser(
      email,
      password,
      (data) => {
        const successMessage = data?.message || 'Login successful! Redirecting...';
        setSuccess(true);
        setError(successMessage);
        setTimeout(() => {
          navigate('/');
          window.location.reload(); // Reload to fetch profile with new cookies
        });
      },
      (error) => {
        const errorMessage = error?.response?.data?.message || error?.message || 'Login failed. Please try again.';
        setError(errorMessage);
      }
    );
  };

  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <div className={styles.header}>
            <h1 className={styles.title}>Log in</h1>
            <p className={styles.subtitle}>
              Ready to embark on your next adventure? Log in now and let QuickWheel
              take you there.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && !success && (
              <Alert
                message={error}
                type="error"
                onClose={() => setError('')}
                duration={4000}
              />
            )}
            {success && (
              <Alert
                message={error}
                type="success"
                duration={3000}
                onClose={() => setSuccess(false)}
              />
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="Input email"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="••••••••••"
                  required
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.accountLinks}>
              <span className={styles.newAccount}>
                New to QuickWheel? <Link to="/register" className={styles.link}>Create an Account</Link>
              </span>
            </div>

            <div className={styles.options}>
              <Link to="/forgot-password" className={styles.forgotLink}>
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isPending.login}
              className={styles.submitButton}
            >
              {isPending.login ? (
                <>
                  <span className={styles.spinner}></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>

            <div className={styles.divider}>
              <span>Or</span>
            </div>

            <div className={styles.socialButtons}>
              {/* Google SDK button container (visible) - SDK will render its button here and handle the popup */}
              <div className={styles.googleButtonWrapper} style={{ position: 'relative', opacity: googleLoading ? 0.6 : 1, pointerEvents: googleLoading ? 'none' : 'auto' }}>
                <div id="googleBtn" />
                {googleLoading && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px' }}>
                    <span className={styles.spinner}></span>
                    <span>Signing in with Google...</span>
                  </div>
                )}
              </div>

              <button type="button" className={`${styles.socialButton} ${styles.apple}`} disabled>
                <svg width="18" height="18" viewBox="0 0 814 1000" fill="white">
                  <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
                </svg>
                Sign in with Apple
              </button>

              <button type="button" className={`${styles.socialButton} ${styles.facebook}`} disabled>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
                  <path d="M18 9c0-4.97-4.03-9-9-9S0 4.03 0 9c0 4.49 3.29 8.21 7.59 8.88v-6.28H5.31V9h2.28V7.02c0-2.25 1.34-3.49 3.39-3.49.98 0 2.01.18 2.01.18v2.21h-1.13c-1.11 0-1.46.69-1.46 1.4V9h2.49l-.4 2.6h-2.09v6.28C14.71 17.21 18 13.49 18 9z" />
                </svg>
                Sign in with Facebook
              </button>
            </div>
          </form>

          <div className={styles.footer}>
            {/* <p className={styles.demoInfo}>
              <strong>Demo Account:</strong><br />
              Email: user1@example.com | Password: password
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;