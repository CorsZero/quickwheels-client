import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './EmailVerified.css';

export default function EmailVerified() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    const status = searchParams.get('status');
    const message = searchParams.get('message');

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/login');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    const getContent = () => {
        switch (status) {
            case 'success':
                return {
                    icon: '✅',
                    title: 'Email Verified Successfully!',
                    message: 'Your email has been verified. You can now log in to your account.',
                    color: 'success'
                };
            case 'already-verified':
                return {
                    icon: 'ℹ️',
                    title: 'Email Already Verified',
                    message: 'Your email was already verified. You can log in to your account.',
                    color: 'info'
                };
            case 'error':
                return {
                    icon: '❌',
                    title: 'Verification Failed',
                    message: message || 'Invalid verification link. Please try again or contact support.',
                    color: 'error'
                };
            default:
                return {
                    icon: '❓',
                    title: 'Unknown Status',
                    message: 'Something went wrong. Please try again.',
                    color: 'error'
                };
        }
    };

    const content = getContent();

    return (
        <div className="email-verified-container">
            <div className={`email-verified-card ${content.color}`}>
                <div className="icon">{content.icon}</div>
                <h1>{content.title}</h1>
                <p>{content.message}</p>
                <div className="redirect-info">
                    <p>Redirecting to login in <strong>{countdown}</strong> seconds...</p>
                </div>
                <button
                    className="login-button"
                    onClick={() => navigate('/login')}
                >
                    Go to Login Now
                </button>
            </div>
        </div>
    );
}
