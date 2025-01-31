import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  sendPasswordResetEmail
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  Timestamp
} from 'firebase/firestore';

// Replace with your Firebase config

const firebaseConfig = {
    apiKey: "AIzaSyA-HFg6UA20VVyr-IyT5x1wniPFisK4J3k",
    authDomain: "truckinglogistics-b28e6.firebaseapp.com",  
    projectId: "truckinglogistics-b28e6",
    storageBucket: "truckinglogistics-b28e6.firebasestorage.app",
    messagingSenderId: "109641224107",
    appId: "1:109641224107:web:bf3c59fb6ab7a5b8784cee"
};
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);

type User = {
  uid: string;
  email: string;
  fname: string;
  lname: string;
  createdAt: Timestamp;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fname: string, lname: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>; 
};


const handleAuthError = (error: any) => {
  console.log('Detailed error information:', {
    errorCode: error.code,
    errorMessage: error.message,
    fullError: JSON.stringify(error, null, 2)
  });
  
  if (error?.response) {
    console.log('Error response:', error.response);
  }

  if (error.code === 'SIGN_IN_CANCELLED') {
    console.log('User cancelled the sign-in flow');
  } else if (error.code === 'IN_PROGRESS') {
    console.log('Sign-in is already in progress');
  }
};



export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setUser(userDoc.data());
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Helper function for validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      throw new Error('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      throw new Error('Password must contain at least one number');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      validateEmail(email);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      handleAuthError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, fname: string, lname: string) => {
    try {
      setLoading(true);
      validateEmail(email);
      validatePassword(password);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = {
        uid: userCredential.user.uid,
        email,
        fname,
        lname,
        createdAt: Timestamp.now(),
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
    } catch (error: any) {
      handleAuthError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
    } catch (error: any) {
      handleAuthError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      validateEmail(email);
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email has been sent');
    } catch (error: any) {
      handleAuthError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};