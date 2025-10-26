'use client';

import React, { useState } from 'react';
import { signInWithGoogle, signInWithEmailAndPassword } from '@/lib/local-auth';
import { useAuth } from '@/contexts/AuthContext';

interface AuthComponentProps {
    onSignInSuccess?: (user: any) => void;
}

const AuthComponent: React.FC<AuthComponentProps> = ({ onSignInSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { refreshUser } = useAuth();

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            setError(null);
            const user = await signInWithGoogle();
            console.log('Google sign-in successful:', user);
            
            // Refresh auth context
            refreshUser();
            
            if (onSignInSuccess) {
                onSignInSuccess(user);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
            console.error('Sign-in error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            
            if (!email || !password) {
                setError('Please enter both email and password');
                return;
            }
            
            const user = await signInWithEmailAndPassword(email, password);
            console.log('Email sign-in successful:', user);
            
            // Refresh auth context
            refreshUser();
                    
                    if (onSignInSuccess) {
                onSignInSuccess(user);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign in');
            console.error('Sign-in error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {error && (
                <div className="auth-error-message" style={{ 
                    padding: '12px', 
                    marginBottom: '16px', 
                    backgroundColor: '#fee',
                    color: '#c33',
                    borderRadius: '4px'
                }}>
                    {error}
                </div>
            )}
            
            <div className="auth-methods">
                {/* Google Sign In */}
                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        marginBottom: '12px',
                        backgroundColor: '#4285f4',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    {loading ? '⏳ Loading...' : '🔵 Continue with Google'}
                </button>

                {/* Divider */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    margin: '20px 0',
                    color: '#999'
                }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
                    <span style={{ padding: '0 12px' }}>or</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
                </div>

                {/* Email/Password Sign In */}
                <form onSubmit={handleEmailSignIn}>
                    <div style={{ marginBottom: '12px' }}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '16px'
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#000',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign in with Email'}
                    </button>
                </form>

                <div style={{ marginTop: '16px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
                    <p>Demo Mode: You'll be automatically registered</p>
                </div>
            </div>
        </div>
    );
};

export default AuthComponent;