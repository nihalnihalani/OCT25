// src/lib/local-auth.ts
import { createUser, getUserByEmail, getUserById } from './local-db';

export interface LocalUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// In-memory session storage
const sessions = new Map<string, LocalUser>();

// Sign in with email and password (simplified - no actual password hashing for demo)
export async function signInWithEmailAndPassword(email: string, password: string): Promise<LocalUser> {
  // In a real app, you'd verify the password hash here
  // For demo purposes, we'll just check if user exists
  let user = await getUserByEmail(email);
  
  if (!user) {
    // Create user if doesn't exist (auto-register)
    const userData = await createUser({
      email,
      displayName: email.split('@')[0],
      photoURL: null,
    });
    user = userData;
  }

  const sessionId = `session_${Date.now()}`;
  const localUser: LocalUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
  sessions.set(sessionId, localUser);
  
  // Store session ID in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_session', sessionId);
    localStorage.setItem('auth_user', JSON.stringify(localUser));
  }

  return localUser;
}

// Sign in with Google (simplified - just creates a demo user)
export async function signInWithGoogle(): Promise<LocalUser> {
  // For demo, create a guest user
  const userData = await createUser({
    email: `guest_${Date.now()}@demo.com`,
    displayName: 'Guest User',
    photoURL: null,
  });

  const sessionId = `session_${Date.now()}`;
  const localUser: LocalUser = {
    uid: userData.uid,
    email: userData.email,
    displayName: userData.displayName,
    photoURL: userData.photoURL,
  };
  
  sessions.set(sessionId, localUser);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_session', sessionId);
    localStorage.setItem('auth_user', JSON.stringify(localUser));
  }

  return localUser;
}

// Get current user from session
export function getCurrentUser(): LocalUser | null {
  if (typeof window === 'undefined') return null;
  
  const sessionId = localStorage.getItem('auth_session');
  if (!sessionId) return null;
  
  // Try to get from memory first
  const user = sessions.get(sessionId);
  if (user) return user;
  
  // Fallback to localStorage
  const storedUser = localStorage.getItem('auth_user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      return null;
    }
  }
  
  return null;
}

// Sign out
export function signOut(): void {
  if (typeof window === 'undefined') return;
  
  const sessionId = localStorage.getItem('auth_session');
  if (sessionId) {
    sessions.delete(sessionId);
  }
  
  localStorage.removeItem('auth_session');
  localStorage.removeItem('auth_user');
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Refresh user data from storage
export function refreshCurrentUser(): LocalUser | null {
  return getCurrentUser();
}

