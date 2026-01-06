/**
 * Quick Wheel Vehicle Rental App
 * Page: Forgot Password
 * Description: Password reset request and reset form
 * Tech: React + TypeScript + CSS Modules
 */

import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useUserService } from '../../services/UserService';
import Alert from '../../components/Alert/Alert';
import styles from './ForgotPassword.module.css';

const ForgotPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const emailFromUrl = searchParams.get('email');

    const [email, setEmail] = useState(emailFromUrl || '');
    const [otp, setOtp] = useState(token || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showResetForm, setShowResetForm] = useState(false);

    const { ForgotPassword, ResetPassword, isPending } = useUserService();
    const navigate = useNavigate();

    const isResetMode = !!token || showResetForm;

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        ForgotPassword(
            email,
            (data) => {
                const message = data?.message || 'Password reset link has been sent to your email.';
                setSuccessMessage(message);
                setShowResetForm(true);
            },
            (error) => {
                const errorMessage = error?.response?.data?.message || error?.message || 'Failed to send reset link. Please try again.';
                setError(errorMessage);
            }
        );
    };

    const handleResendCode = () => {
        setError('');
        setSuccessMessage('');

        ForgotPassword(
            email,
            (data) => {
                const message = data?.message || 'Reset code has been resent to your email.';
                setSuccessMessage(message);
            },
            (error) => {
                const errorMessage = error?.response?.data?.message || error?.message || 'Failed to resend code. Please try again.';
                setError(errorMessage);
            }
        );
    };

    const handleResetPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        ResetPassword(
            email,
            otp,
            newPassword,
            confirmPassword,
            (data) => {
                const message = data?.message;
                setSuccessMessage(message);
                setTimeout(() => navigate('/login'), 3000);
            },
            (error) => {
                const errorMessage = error?.response?.data?.message || error?.message || 'Failed to reset password. Please try again.';
                setError(errorMessage);
            }
        );
    };

    return (
        <div className={styles.forgotPassword}>
            <div className={styles.container}>
                <div className={styles.passwordCard}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>
                            {isResetMode ? 'Reset Password' : 'Forgot Password'}
                        </h1>
                        <p className={styles.subtitle}>
                            {isResetMode
                                ? 'Enter your new password below.'
                                : 'Enter your email address and we\'ll send you a link to reset your password.'}
                        </p>
                    </div>

                    <form onSubmit={isResetMode ? handleResetPasswordSubmit : handleForgotPasswordSubmit} className={styles.form}>
                        {error && (
                            <Alert
                                message={error}
                                type="error"
                                onClose={() => setError('')}
                                duration={3000}
                            />
                        )}
                        {successMessage && (
                            <Alert
                                message={successMessage}
                                type="success"
                                duration={3000}
                                onClose={() => setSuccessMessage('')}
                            />
                        )}

                        {!isResetMode && (
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
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        )}

                        {isResetMode && (
                            <>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="otp" className={styles.label}>
                                        Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className={styles.input}
                                        placeholder="Enter the code sent to your email"
                                        required
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="newPassword" className={styles.label}>
                                        New Password
                                    </label>
                                    <div className={styles.passwordWrapper}>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="newPassword"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
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

                                <div className={styles.inputGroup}>
                                    <label htmlFor="confirmPassword" className={styles.label}>
                                        Confirm New Password
                                    </label>
                                    <div className={styles.passwordWrapper}>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={styles.input}
                                            placeholder="••••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className={styles.togglePassword}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            aria-label="Toggle confirm password visibility"
                                        >
                                            {showConfirmPassword ? (
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
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={isResetMode ? isPending.resetPassword : isPending.forgotPassword}
                            className={styles.submitButton}
                        >
                            {isResetMode ? (
                                isPending.resetPassword ? (
                                    <>
                                        <span className={styles.spinner}></span>
                                        Resetting Password...
                                    </>
                                ) : (
                                    'Reset Password'
                                )
                            ) : (
                                isPending.forgotPassword ? (
                                    <>
                                        <span className={styles.spinner}></span>
                                        Sending Reset Link...
                                    </>
                                ) : (
                                    'Send Reset Link'
                                )
                            )}
                        </button>

                        {isResetMode && (
                            <div className={styles.resendSection}>
                                <p className={styles.resendText}>
                                    Didn't receive the code?{' '}
                                    <button
                                        type="button"
                                        onClick={handleResendCode}
                                        className={styles.resendButton}
                                        disabled={isPending.forgotPassword}
                                    >
                                        {isPending.forgotPassword ? 'Sending...' : 'Resend Code'}
                                    </button>
                                </p>
                            </div>
                        )}

                        <div className={styles.footer}>
                            <Link to="/login" className={styles.backLink}>
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
