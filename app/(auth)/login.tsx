import React, { useState } from 'react';
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
import { 
  Colors, 
  Typography, 
  Spacing, 
  BorderRadius, 
  Shadow,
  horizontalScale, 
  verticalScale, 
  moderateScale 
} from '@/src/themes';
import FormButton from '@/src/components/forms/FormButton';
import FormInput from '@/src/components/forms/FormInput';
import SocialButton from '@/src/components/forms/SocialButton';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/src/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loading, googleLogin } = useAuth();
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
      // Error handling
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
            color={Colors.primary.main}
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
    backgroundColor: Colors.background.main,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.l,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logo: {
    height: moderateScale(120),
    width: moderateScale(120),
    resizeMode: 'cover',
    borderRadius: BorderRadius.circle(120),
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: '700',
    lineHeight: moderateScale(34),
    color: Colors.text.primary,
    marginTop: Spacing.m,
  },
  subtitle: {
    ...Typography.body.large,
    color: Colors.text.primary,
    marginTop: Spacing.s,
    marginHorizontal: Spacing.l,
    textAlign: 'center',
    opacity: 0.9,
    letterSpacing: 0.3,
  },
  formContainer: {
    width: '100%',
    marginBottom: Spacing.xs,
  },
  forgotButton: {
    marginVertical: Spacing.s,
    paddingHorizontal: Spacing.xs,
    opacity: 0.8,
  },
  forgotButtonText: {
    color: Colors.text.secondary,
    ...Typography.body.large,
    fontWeight: '600',
    textAlign: 'center',
  },
  orText: {
    color: Colors.text.secondary,
    paddingHorizontal: Spacing.s,
    ...Typography.body.medium,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: Spacing.s,
  },
  createAccountButton: {
    marginTop: Spacing.l,
  },
  createAccountText: {
    color: Colors.text.secondary,
    ...Typography.body.medium,
    textAlign: 'center',
  },
  signUpText: {
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
});