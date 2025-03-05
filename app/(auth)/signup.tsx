import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
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
  horizontalScale, 
  verticalScale, 
  moderateScale 
} from '@/src/themes';
import FormButton from '@/src/components/forms/FormButton';
import FormInput from '@/src/components/forms/FormInput';
import SocialButton from '@/src/components/forms/SocialButton';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/src/context/AuthContext';

export default function SignupScreen() {
  const router = useRouter();
  const { register, loading } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !fname || !lname) {
      alert(t('fillAllFields'));
      return;
    }
  
    if (password !== confirmPassword) {
      alert(t('passwordsDoNotMatch'));
      return;
    }
  
    if (password.length < 6) {
      alert(t('passwordTooShort'));
      return;
    }
  
    try {
      await register(email, password, fname, lname);
      router.replace("/(app)/reports");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{t('createAccount')}</Text>
          <Text style={styles.subtitle}>{t('joinTruckingPro')}</Text>
        </View>

        <View style={styles.formContainer}>
          <FormInput
            labelValue={fname}
            onChangeText={setFname}
            placeholderText={t('firstName')}
            iconType="user"
            autoCorrect={false}
          />
          <FormInput
            labelValue={lname}
            onChangeText={setLname}
            placeholderText={t('lastName')}
            iconType="user"
            autoCorrect={false}
          />
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
          <FormInput
            labelValue={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderText={t('confirmPassword')}
            iconType="lock"
            secureTextEntry
          />

          <FormButton 
            buttonTitle={loading ? t('signingUp') : t('signUp')}
            onPress={handleSignup}
            disabled={loading}     
          />
        </View>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            {t('termsText')}{' '}
            <Text style={styles.termsLink}>{t('termsService')}</Text>
            {' '}{t('and')}{' '}
            <Text style={styles.termsLink}>{t('privacyPolicy')}</Text>
          </Text>
        </View>

        <SocialButton
          buttonTitle={t('signUpWithGoogle')}
          btnType="google"
          color={Colors.primary.main}
          backgroundColor={Colors.white}
          // onPress={googleLogin}
        />

        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.signInText}>
            {t('haveAccount')} <Text style={styles.signInLink}>{t('signInLink')}</Text>
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
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: '700',
    lineHeight: moderateScale(34),
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body.large,
    color: Colors.text.secondary,
  },
  formContainer: {
    width: '100%',
    marginBottom: Spacing.l,
  },
  termsContainer: {
    marginVertical: Spacing.xs,
    paddingHorizontal: Spacing.s,
    paddingBottom: Spacing.xs,
  },
  termsText: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },
  termsLink: {
    color: Colors.primary.main,
    fontWeight: '500',
  },
  signInButton: {
    marginTop: Spacing.l,
  },
  signInText: {
    ...Typography.body.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  signInLink: {
    color: Colors.text.primary,
    fontWeight: 'bold',
  },
});