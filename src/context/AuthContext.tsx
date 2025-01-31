import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
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
GoogleSignin.configure({
  iosClientId: '109641224107-qeear70iu9183fcl29r1le38bpnklupe.apps.googleusercontent.com',
  webClientId: '109641224107-bov0hmctvj2td85cmb9rnda27fjac6ls.apps.googleusercontent.com',
  offlineAccess: true,
});

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
  googleLogin: () => Promise<void>;

};


const handleAuthError = (error: any) => {
  console.log('Auth error:', {
    code: error.code,
    message: error.message,
    fullError: JSON.stringify(error, null, 2)
  });

  let errorMessage = 'An error occurred during sign in';

  switch (error.code) {
    case 'SIGN_IN_CANCELLED':
      errorMessage = 'Sign in was cancelled';
      break;
    case 'IN_PROGRESS':
      errorMessage = 'Sign in is already in progress';
      break;
    case 'PLAY_SERVICES_NOT_AVAILABLE':
      errorMessage = 'Google Play Services is not available';
      break;
    default:
      errorMessage = error.message;
  }

  Alert.alert('Error', errorMessage);
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

  const googleLogin = async () => {
    try {
      setLoading(true);
      
      // Sign out from any existing Google session
      await GoogleSignin.signOut();

      // Start Google Sign In flow
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      // Get tokens
      const { accessToken } = await GoogleSignin.getTokens();
      
      // Create Firebase credential
      const credential = GoogleAuthProvider.credential(
        userInfo.data?.idToken,
        accessToken
      );

      // Sign in to Firebase
      const result = await signInWithCredential(auth, credential);

      // Check/create Firestore user document
      if (result.user) {
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
          
        if (!userDoc.exists()) {
          const newUser = {
            uid: result.user.uid,
            fname: result.user.displayName?.split(' ')[0] || '',
            lname: result.user.displayName?.split(' ').slice(1).join(' ') || '',
            email: result.user.email || '',
            createdAt: Timestamp.now(),
          };

          await setDoc(doc(db, 'users', result.user.uid), newUser);
        }
      }
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
        googleLogin,
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