


"use client";
import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';

// Import your configured Firebase elements from your own local setup file
// NOTE: Make sure the relative path below accurately points to where you created your firebase configuration file!
import { 
  auth, 
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  sendPasswordResetEmail
} from '../Firebase.js'; 

type AuthView = 'login' | 'register' | 'forgot-password';

type LoginModalProps = {
  onClose: () => void;
};

export default function LoginModal({ onClose }: LoginModalProps) {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (view === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        onClose(); // Close modal on success
      } else if (view === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
        onClose();
      } else if (view === 'forgot-password') {
        await sendPasswordResetEmail(auth, email);
        setMessage('Check your inbox for a password reset email!');
      }
    } catch (err: any) {
      setError(err.message.replace("Firebase: ", "")); // Clean up Firebase error formatting
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    try {
      await signInAnonymously(auth);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="auth__overlay" onClick={handleOverlayClick}>
      <div className="auth__modal">
        <button className="auth__close" onClick={onClose} aria-label="Close modal">&times;</button>

        <h2 className="auth__title">
          {view === 'login' && 'Log in to Summarist'}
          {view === 'register' && 'Sign up for Summarist'}
          {view === 'forgot-password' && 'Reset Password'}
        </h2>

        {/* Error / Success Notifications */}
        {error && <div style={{ color: 'red', textAlign: 'center', fontSize: '14px' }}>{error}</div>}
        {message && <div style={{ color: 'green', textAlign: 'center', fontSize: '14px' }}>{message}</div>}

        {view !== 'forgot-password' && (
          <>
            <button className="auth__google" onClick={handleGoogleLogin}>
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#EA4335" d="M12 5.04c1.65 0 3.13.57 4.3 1.69l3.21-3.21C17.56 1.63 14.98 1 12 1 7.35 1 3.4 3.65 1.49 7.52l3.85 2.99C6.29 7.11 8.93 5.04 12 5.04z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.44c-.28 1.46-1.1 2.7-2.34 3.53l3.64 2.82c2.13-1.97 3.75-4.86 3.75-8.44z"/>
                <path fill="#FBBC05" d="M5.34 14.51c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.49 6.94C.54 8.87 0 11.03 0 13.33s.54 4.46 1.49 6.39l3.85-2.99z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.64-2.82c-1.01.68-2.3 1.09-3.96 1.09-3.07 0-5.71-2.07-6.66-4.98L.85 16.32C2.76 20.19 6.71 23 12 23z"/>
              </svg>
              Log in with Google
            </button>

            <button className="auth__guest" onClick={handleGuestLogin}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Login as Guest
            </button>

            <div className="auth__divider"><span>or</span></div>
          </>
        )}

        <form className="auth__form" onSubmit={handleSubmit}>
          <input 
            className="auth__input" 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          
          {view !== 'forgot-password' && (
            <input 
              className="auth__input" 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          )}

          <button type="submit" className="auth__submit">
            {view === 'login' && 'Log In'}
            {view === 'register' && 'Sign Up'}
            {view === 'forgot-password' && 'Send Reset Link'}
          </button>
        </form>

        <div className="auth__footer">
          {view === 'login' && (
            <>
              <button type="button" className="footer_link" onClick={() => setView('forgot-password')}>Forgot password?</button>
              <p>Don't have an account? <button type="button" className="footer_link" onClick={() => setView('register')}>Sign up</button></p>
            </>
          )}
          {view === 'register' && (
            <p>Already have an account? <button type="button" className="footer_link" onClick={() => setView('login')}>Log in</button></p>
          )}
          {view === 'forgot-password' && (
            <button type="button" className="footer_link" onClick={() => setView('login')}>Back to Log In</button>
          )}
        </div>
      </div>
    </div>
  );
}