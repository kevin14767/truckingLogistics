import React, { useContext, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';
import { useRouter } from "expo-router";
import { Colors, horizontalScale, verticalScale, moderateScale } from '../../src/themes';
import FormButton from '@/src/components/forms/FormButton';
import FormInput from '@/src/components/forms/FormInput';
import SocialButton from '@/src/components/forms/SocialButton';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/src/context/AuthContext';
import { use } from 'i18next';

// import { AuthContext } from '../../navigation/AuthProvider';

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
          color="#004d40"
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
    marginBottom: verticalScale(40),
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: verticalScale(5),
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: Colors.grey,
  },
  formContainer: {
    width: '100%',
    marginBottom: verticalScale(20),
  },
  termsContainer: {
    marginVertical: verticalScale(1),
    paddingHorizontal: horizontalScale(10),
    paddingBottom: verticalScale(6),
  },
  termsText: {
    fontSize: moderateScale(14),
    color: Colors.grey,
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },
  termsLink: {
    color: Colors.greenThemeColor,
    fontWeight: '500',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(5),
    marginBottom: verticalScale(15),
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
  },
  signInButton: {
    marginTop: verticalScale(20),
  },
  signInText: {
    color: Colors.grey,
    fontSize: moderateScale(14),
    textAlign: 'center',
  },
  signInLink: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});

