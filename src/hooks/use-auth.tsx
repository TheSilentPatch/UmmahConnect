'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser, sendPasswordResetEmail as firebaseSendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import type { User } from '@/types';
import { app, auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (details: Omit<User, 'id' | 'email'> & {email: string, password: string}) => Promise<boolean>;
  logout: () => void;
  updateUser: (details: Partial<User>) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
        } else {
          // Handle case where user exists in Auth but not Firestore
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password';
      if (!user && !isAuthPage) {
        router.push('/login');
      }
      if (user && isAuthPage) {
        router.push('/');
      }
    }
  }, [user, loading, pathname, router]);

  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }, [router]);

  const signup = useCallback(async (details: Omit<User, 'id' | 'email'> & {email: string, password: string}): Promise<boolean> => {
    try {
      const { email, password, ...rest } = details;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userToSave = {
        email: firebaseUser.email,
        ...rest,
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userToSave);
      
      // Fetch the full user data to set in state
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
      }

      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  }, [router]);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    router.push('/login');
  }, [router]);
  
  const updateUser = useCallback(async (details: Partial<User>) => {
    if (user) {
        try {
            const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, details);
            setUser(prevUser => prevUser ? { ...prevUser, ...details } : null);
        } catch (error) {
            console.error("Update user error:", error);
        }
    }
  }, [user]);

  const sendPasswordResetEmail = useCallback(async (email: string): Promise<boolean> => {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error("Password reset error:", error);
      return false;
    }
  }, []);


  const value = { user, loading, login, signup, logout, updateUser, sendPasswordResetEmail };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
