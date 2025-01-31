// app/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
  en: {
    translation: {
      // Auth & Onboarding
      english: 'English',
      spanish: 'Spanish',
      continue: 'Continue',
      skip: 'Skip',
      next: 'Next',
      getStarted: 'Get Started',
      onboardingTitle1: 'Welcome to Trucking Logistics Pro',
      onboardingSubtitle1: 'Simplify your logistics with advanced tools for seamless trucking operations.',
      onboardingTitle2: 'Generate Insightful Reports',
      onboardingSubtitle2: 'Track and analyze your performance with professional-grade reporting tools.',
      onboardingTitle3: 'Stay on Track',
      onboardingSubtitle3: 'Real-time navigation and scheduling for efficient deliveries.',

      // Login Screen
      welcomeBack: 'Welcome back!',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot Password?',
      signIn: 'Sign In',
      signInWithGoogle: 'Sign In with Google',
      noAccount: "Don't have an account?",
      signUpLink: 'Sign Up',
      or: 'OR',

      // Signup Screen
      createAccount: 'Create an Account',
      joinTruckingPro: 'Join Trucking Logistics Pro',
      confirmPassword: 'Confirm Password',
      signUp: 'Sign Up',
      signingUp: 'Signing Up',
      signUpWithGoogle: 'Sign Up with Google',
      termsText: 'By registering, you confirm that you accept our',
      termsService: 'Terms of Service',
      and: 'and',
      privacyPolicy: 'Privacy Policy',
      haveAccount: 'Have an account?',
      signInLink: 'Sign In',
      firstName: "First Name",
      lastName: 'Last Name',

      // Forgot Password Screen
      forgotPasswordTitle: 'Forgot Password?',
      forgotPasswordSubtitle: "No worries! Enter your email and we'll send you instructions to reset your password.",
      enterEmail: 'Enter your email',
      resetPassword: 'Reset Password',
      back: '← Back',
      // Navigation
      home: 'HOME',
      reports: 'REPORTS',
      stats: 'STATS',
      settings: 'SETTINGS',
      
      // Settings
      languagePreference: 'Language Preference',
      // Common
      save: 'Save',
      cancel: 'Cancel',
      // Settings tab
      manageAccount: 'Manage your account settings.',
      preferences: 'Preferences',
      notifications: 'Notifications',
      language: 'Language',
      darkMode: 'Dark Mode',
      location: 'Location',
      emailNotifications: 'Email Notifications',
      pushNotifications: 'Push Notifications',
      // onboarding
      welcome: 'Welcome to TruckingLogisticsPro',
      selectLanguage: 'Choose your preferred language',
      chooseLater: 'You can change the language later in settings'
    }
  },
  es: {
    translation: {
      // Auth & Onboarding
      welcome: 'Bienvenido a TruckingLogisticsPro',
      selectLanguage: 'Elige tu idioma preferido',
      english: 'Inglés',
      spanish: 'Español',
      chooseLater: 'Puedes cambiar el idioma más tarde en configuración',
      continue: 'Continuar',
      skip: 'Saltar',
      next: 'Siguiente',
      getStarted: 'Comenzar',
      onboardingTitle1: 'Bienvenido a Trucking Logistics Pro',
      onboardingSubtitle1: 'Simplifica tu logística con herramientas avanzadas para operaciones de transporte sin problemas.',
      onboardingTitle2: 'Genera Informes Perspicaces',
      onboardingSubtitle2: 'Rastrea y analiza tu rendimiento con herramientas de informes profesionales.',
      onboardingTitle3: 'Mantente en la Ruta',
      onboardingSubtitle3: 'Navegación y programación en tiempo real para entregas eficientes.',    
      
      // Login Screen
      welcomeBack: '¡Bienvenido de nuevo!',
      email: 'Correo electrónico',
      password: 'Contraseña',
      forgotPassword: '¿Olvidaste tu contraseña?',
      signIn: 'Iniciar Sesión',
      signInWithGoogle: 'Iniciar Sesión con Google',
      noAccount: '¿No tienes una cuenta?',
      signUpLink: 'Regístrate',
      or: 'O',

      // Signup Screen
      createAccount: 'Crear una Cuenta',
      joinTruckingPro: 'Únete a Trucking Logistics Pro',
      confirmPassword: 'Confirmar Contraseña',
      signUp: 'Registrarse',
      signingUp: 'Registrándose',
      firstName: 'Primer Nombre',
      lastName: 'Ultimo Nombre',
      signUpWithGoogle: 'Registrarse con Google',
      termsText: 'Al registrarte, confirmas que aceptas nuestros',
      termsService: 'Términos de Servicio',
      and: 'y',
      privacyPolicy: 'Política de Privacidad',
      haveAccount: '¿Ya tienes una cuenta?',
      signInLink: 'Inicia Sesión',

      // Forgot Password Screen
      forgotPasswordTitle: '¿Olvidaste tu Contraseña?',
      forgotPasswordSubtitle: '¡No te preocupes! Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.',
      enterEmail: 'Ingresa tu correo electrónico',
      resetPassword: 'Restablecer Contraseña',
      back: '← Atrás',



      // Navigation
      home: 'INICIO',
      reports: 'INFORMES',
      stats: 'ESTADÍSTICAS',
      settings: 'AJUSTES',
      // Settings
      languagePreference: 'Preferencia de Idioma',
      // Common
      save: 'Guardar',
      cancel: 'Cancelar',
      manageAccount: 'Administra la configuración de tu cuenta.',
      preferences: 'Preferencias',
      notifications: 'Notificaciones',
      language: 'Idioma',
      darkMode: 'Modo Oscuro',
      location: 'Ubicación',
      emailNotifications: 'Notificaciones por Correo',
      pushNotifications: 'Notificaciones Push'
    }
  }
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Helper functions for language persistence
export const loadStoredLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem('userLanguage');
    if (savedLanguage) {
      await i18n.changeLanguage(savedLanguage);
    }
  } catch (error) {
    console.error('Error loading language:', error);
  }
};

export const setLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem('userLanguage', language);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

export default i18n;