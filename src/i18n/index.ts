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


  // en: {
      extractText: 'Extract Text',
      processingImage: 'Processing Image',
      recognizedText: 'Recognized Text',
      verifyImage: 'Verify Image',
  // },
  // es: {
  //   extractText: 'Extraer Texto',
  //   processingImage: 'Procesando Imagen',
  //   recognizedText: 'Texto Reconocido',
  //   verifyImage: 'Verificar Imagen'
  // }





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
      chooseLater: 'You can change the language later in settings',

      // Home Screen
      welcomeTitle: 'Welcome to Truck Logistics Pro!',
      welcomeSubtitle: 'Your one-stop app for managing truck logistics.',
      recentActivity: 'Recent Activity',
      lastReceipt: 'Last Receipt: Delivered 2 hours ago',
      maintenanceCheck: 'Maintenance Check: 3 days left',
      oilChange: 'Next Oil Change: 200 miles remaining',
      quickAccess: 'Quick Access',
      viewReceipts: 'View All Receipts',
      manageFleet: 'Manage Fleet',
      statistics: 'Statistics',
      activeTrucks: 'Active Trucks',
      income: 'Income',
      avgDelivery: 'Avg Delivery',


      // Reports Screen
      receipts: 'Receipts',
      searchReceipts: 'Search receipts...',
      fuel: 'Fuel',
      maintenance: 'Maintenance',
      approved: 'Approved',
      pending: 'Pending',
      viewDetails: 'View Details',
      uploadReceipt: 'Upload Receipt',

      // Stats Screen
      fleetOverview: 'Fleet Performance Overview',
      week: 'Week',
      month: 'Month',
      year: 'Year',
      totalTrips: 'Total Trips',
      activeVehicles: 'Active Vehicles',
      avgDistance: 'Avg Distance',
      fuelUsage: 'Fuel Usage',
      performanceMetrics: 'Performance Metrics',
      vehicleMaintenance: 'Vehicle Maintenance',
      routeEfficiency: 'Route Efficiency',
      onTimeDelivery: 'On-Time Delivery',


      // Settings Screen
      editProfile: 'Edit Profile',
      logOut: 'Log Out',
      defaultName: 'John Doe',
      defaultEmail: 'john.doe@mail.com',
      unknownLocation: 'Unknown Location',      

      // ... existing translations ...
      phone: 'Phone',
      country: 'Country',
      city: 'City',
      state: 'State',
      update: 'Update',
      profileUpdated: 'Your profile has been updated successfully.',
      updateFailed: 'Something went wrong while updating your profile.',

      //nav
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


      extractText: 'Extraer Texto',
      processingImage: 'Procesando Imagen',
      recognizedText: 'Texto Reconocido',
      verifyImage: 'Verificar Imagen',




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
      stats: 'DATA',
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
      pushNotifications: 'Notificaciones Push',

      // Home Screen
      welcomeTitle: '¡Bienvenido a Truck Logistics Pro!',
      welcomeSubtitle: 'Tu aplicación todo en uno para gestionar la logística de camiones.',
      recentActivity: 'Actividad Reciente',
      lastReceipt: 'Último Recibo: Entregado hace 2 horas',
      maintenanceCheck: 'Revisión de Mantenimiento: 3 días restantes',
      oilChange: 'Próximo Cambio de Aceite: 200 millas restantes',
      quickAccess: 'Acceso Rápido',
      viewReceipts: 'Ver Todos los Recibos',
      manageFleet: 'Gestionar Flota',
      statistics: 'Estadísticas',
      activeTrucks: 'Camiones Activos',
      income: 'Ingresos',
      avgDelivery: 'Tiempo Promedio de Entrega',


      // Reports Screen
      receipts: 'Recibos',
      searchReceipts: 'Buscar recibos...',
      fuel: 'Combustible',
      maintenance: 'Mantenimiento',
      approved: 'Aprobado',
      pending: 'Pendiente',
      viewDetails: 'Ver Detalles',
      uploadReceipt: 'Subir Recibo',

      // Stats Screen
      fleetOverview: 'Resumen de Rendimiento de Flota',
      week: 'Semana',
      month: 'Mes',
      year: 'Año',
      totalTrips: 'Viajes Totales',
      activeVehicles: 'Vehículos Activos',
      avgDistance: 'Distancia Promedio',
      fuelUsage: 'Uso de Combustible',
      performanceMetrics: 'Métricas de Rendimiento',
      vehicleMaintenance: 'Mantenimiento de Vehículos',
      routeEfficiency: 'Eficiencia de Ruta',
      onTimeDelivery: 'Entregas a Tiempo',

      // Settings Screen
      editProfile: 'Editar Perfil',
      logOut: 'Cerrar Sesión',
      defaultName: 'Juan Pérez',
      defaultEmail: 'juan.perez@mail.com',
      unknownLocation: 'Ubicación Desconocida',     
      // ... existing translations ...
      phone: 'Teléfono',
      country: 'País',
      city: 'Ciudad',
      state: 'Estado',
      update: 'Actualizar',
      profileUpdated: 'Tu perfil ha sido actualizado exitosamente.',
      updateFailed: 'Algo salió mal al actualizar tu perfil.',
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