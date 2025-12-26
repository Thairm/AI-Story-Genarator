import React, { useState } from 'react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } from '../services/authService';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [mode, setMode] = useState<AuthMode>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        try {
            if (mode === 'forgot') {
                await resetPassword(email);
                setSuccessMessage('Password reset email sent! Check your inbox.');
                return;
            }

            if (mode === 'signup') {
                if (password !== confirmPassword) {
                    setError('Passwords do not match');
                    return;
                }
                if (password.length < 6) {
                    setError('Password must be at least 6 characters');
                    return;
                }
                await signUpWithEmail(email, password);
                setSuccessMessage('Account created! Check your email to verify your account.');
            } else {
                await signInWithEmail(email, password);
                onSuccess();
                onClose();
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setError(null);
        setIsLoading(true);
        try {
            await signInWithGoogle();
            // Google OAuth redirects, so we don't need to call onSuccess here
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google');
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError(null);
        setSuccessMessage(null);
    };

    const switchMode = (newMode: AuthMode) => {
        resetForm();
        setMode(newMode);
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="auth-modal-header">
                    <h2>
                        {mode === 'signin' && 'Welcome Back'}
                        {mode === 'signup' && 'Create Account'}
                        {mode === 'forgot' && 'Reset Password'}
                    </h2>
                    <button className="auth-close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="auth-message auth-error">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="auth-message auth-success">
                        {successMessage}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleEmailAuth} className="auth-form">
                    <div className="auth-input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {mode !== 'forgot' && (
                        <div className="auth-input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                disabled={isLoading}
                                minLength={6}
                            />
                        </div>
                    )}

                    {mode === 'signup' && (
                        <div className="auth-input-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                        {isLoading ? (
                            <span className="auth-spinner"></span>
                        ) : (
                            <>
                                {mode === 'signin' && 'Sign In'}
                                {mode === 'signup' && 'Create Account'}
                                {mode === 'forgot' && 'Send Reset Link'}
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                {mode !== 'forgot' && (
                    <>
                        <div className="auth-divider">
                            <span>or</span>
                        </div>

                        {/* Google Button */}
                        <button
                            className="auth-google-btn"
                            onClick={handleGoogleAuth}
                            disabled={isLoading}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                    </>
                )}

                {/* Footer Links */}
                <div className="auth-footer">
                    {mode === 'signin' && (
                        <>
                            <button className="auth-link" onClick={() => switchMode('forgot')}>
                                Forgot password?
                            </button>
                            <span className="auth-footer-text">
                                Don't have an account?{' '}
                                <button className="auth-link" onClick={() => switchMode('signup')}>
                                    Sign up
                                </button>
                            </span>
                        </>
                    )}
                    {mode === 'signup' && (
                        <span className="auth-footer-text">
                            Already have an account?{' '}
                            <button className="auth-link" onClick={() => switchMode('signin')}>
                                Sign in
                            </button>
                        </span>
                    )}
                    {mode === 'forgot' && (
                        <button className="auth-link" onClick={() => switchMode('signin')}>
                            Back to sign in
                        </button>
                    )}
                </div>
            </div>

            <style>{`
        .auth-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .auth-modal {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 16px;
          padding: 32px;
          width: 100%;
          max-width: 420px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .auth-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .auth-modal-header h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #fff;
        }

        .auth-close-btn {
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          padding: 4px;
          transition: color 0.2s;
        }

        .auth-close-btn:hover {
          color: #fff;
        }

        .auth-message {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .auth-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
        }

        .auth-success {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #4ade80;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .auth-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .auth-input-group label {
          font-size: 14px;
          font-weight: 500;
          color: #ccc;
        }

        .auth-input-group input {
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #fff;
          font-size: 16px;
          transition: border-color 0.2s, background 0.2s;
        }

        .auth-input-group input:focus {
          outline: none;
          border-color: #f97316;
          background: rgba(255, 255, 255, 0.08);
        }

        .auth-input-group input::placeholder {
          color: #666;
        }

        .auth-submit-btn {
          padding: 14px 24px;
          background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
        }

        .auth-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
        }

        .auth-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .auth-divider {
          display: flex;
          align-items: center;
          margin: 24px 0;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
        }

        .auth-divider span {
          padding: 0 16px;
          color: #666;
          font-size: 14px;
        }

        .auth-google-btn {
          width: 100%;
          padding: 12px 24px;
          background: #fff;
          border: none;
          border-radius: 8px;
          color: #333;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: background 0.2s, transform 0.2s;
        }

        .auth-google-btn:hover:not(:disabled) {
          background: #f5f5f5;
          transform: translateY(-1px);
        }

        .auth-google-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-footer {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .auth-footer-text {
          color: #888;
          font-size: 14px;
        }

        .auth-link {
          background: none;
          border: none;
          color: #f97316;
          cursor: pointer;
          font-size: 14px;
          padding: 0;
          text-decoration: none;
          transition: color 0.2s;
        }

        .auth-link:hover {
          color: #fb923c;
          text-decoration: underline;
        }
      `}</style>
        </div>
    );
};

export default AuthModal;
