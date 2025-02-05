import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';
import { useRouter } from "expo-router";
import { Colors, horizontalScale, verticalScale, moderateScale } from '../../src/themes';
import FormButton from '@/src/components/FormButton';
import FormInput from '@/src/components/FormInput';
import SocialButton from '@/src/components/SocialButton';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/src/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loading, googleLogin } = useAuth(); //
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Error, Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
      router.replace("/(app)/reports");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      await googleLogin();
      router.replace("/(app)/home");
    } catch (error: any) {
    } finally {
      setIsGoogleLoading(false);
    }
  };

  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Image 
            source={require('../../assets/icons/logo.jpg')} 
            style={styles.logo} 
          />
          <Text style={styles.title}>Trucking Logistics Pro</Text>
          <Text style={styles.subtitle}>{t('welcomeBack')}</Text>
        </View>

        <View style={styles.formContainer}>
          <FormInput
            labelValue={email}
            onChangeText={setEmail}
            placeholderText={t('email')}
            iconType="user"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <FormInput
            labelValue={password}
            onChangeText={setPassword}
            placeholderText={t('password')}
            iconType="lock"
            secureTextEntry
          />
          
          <TouchableOpacity 
            style={styles.forgotButton} 
            onPress={() => router.push("/(auth)/forgot-password")}
          >
            <Text style={styles.forgotButtonText}>{t('forgotPassword')}</Text>
          </TouchableOpacity>

          <FormButton 
            buttonTitle={t('signIn')}
            onPress={handleLogin}
            disabled={loading}
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.orText}>- {t('or')} -</Text>
          <SocialButton
            buttonTitle={t('signInWithGoogle')}
            btnType="google"
            color="#004d40"
            backgroundColor={Colors.white}
            onPress={handleGoogleLogin}
            disabled={isGoogleLoading}
          />        
          </View>

        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() => router.push("/(auth)/signup")}
        >
          <Text style={styles.createAccountText}>
            {t('noAccount')} <Text style={styles.signUpText}>{t('signUpLink')}</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.black_grey,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(40),
    paddingBottom: verticalScale(20),
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  logo: {
    height: moderateScale(120),
    width: moderateScale(120),
    resizeMode: 'cover',
    borderRadius: moderateScale(60),
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: verticalScale(15),
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: Colors.white, // Changed to darker shade for better readability
    marginTop: verticalScale(12),
    marginHorizontal: horizontalScale(20), // Added side margins for better layout
    lineHeight: moderateScale(24), // Added for better text spacing
    letterSpacing: 0.3, // Subtle letter spacing for elegance
    textAlign: 'center', // Centers the text nicely
    opacity: 0.9, // Slightly softens the text
  },
  formContainer: {
    width: '100%',
    marginBottom: verticalScale(5),
  },
  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginVertical: verticalScale(15),
  },
  forgotButtonText: {
    color: Colors.grey,
    fontWeight: '600',
    fontSize: moderateScale(16),
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(5),
    paddingHorizontal: horizontalScale(10),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.grey,
  },
  orText: {
    color: Colors.grey,
    paddingHorizontal: horizontalScale(10),
    fontSize: moderateScale(14),
    fontWeight: '600',
    textAlign: 'center',
  },
  createAccountButton: {
    marginTop: verticalScale(20),
  },
  createAccountText: {
    color: Colors.grey,
    fontSize: moderateScale(14),
    textAlign: 'center',
  },
  signUpText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  forgotButton: {
    marginVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(4),
    opacity: 0.8,
    color: Colors.darkGrey,
    fontSize: moderateScale(14),
    fontFamily: 'System', // Or your app's preferred font family 
    textAlign: 'center'
  }
});