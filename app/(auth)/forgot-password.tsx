import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity 
} from 'react-native';
import { useRouter } from "expo-router";
import { Colors, horizontalScale, verticalScale, moderateScale } from '../../src/themes';
import FormButton from '@/src/components/FormButton';
import FormInput from '@/src/components/FormInput';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/src/context/AuthContext';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const { resetPassword, loading } = useAuth();

  const handleReset = async () => {
    if (!email) {
      alert(t('pleaseEnterEmail'));
      return;
    }
  
    try {
      await resetPassword(email);
      router.back();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{t('back')}</Text>
        </TouchableOpacity>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{t('forgotPasswordTitle')}</Text>
          <Text style={styles.subtitle}>
            {t('forgotPasswordSubtitle')}
          </Text>
          <View style={styles.inputContainer}>
            <FormInput
              labelValue={email}
              onChangeText={setEmail}
              placeholderText={t('enterEmail')}
              iconType="mail"
              keyboardType="email-address"
            />
          </View>
          <FormButton
            buttonTitle={loading ? t('sending') : t('resetPassword')}
            onPress={handleReset}
            disabled={loading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
 safeArea: {
   flex: 1,
   backgroundColor: Colors.black_grey,
 },
 container: {
   flex: 1,
   padding: horizontalScale(20),
 },
 backButton: {
 },
 backText: {
   color: Colors.white,
   fontSize: moderateScale(16),
 },
 contentContainer: {
   flex: 1,
   alignItems: 'center',
   justifyContent: 'center',
 },
 image: {
   width: moderateScale(200),
   height: moderateScale(200),
   marginBottom: verticalScale(30),
 },
 title: {
   fontSize: moderateScale(26),
   fontWeight: 'bold',
   color: Colors.white,
   marginBottom: verticalScale(10),
 },
 subtitle: {
   fontSize: moderateScale(14),
   color: Colors.grey,
   textAlign: 'center',
   marginBottom: verticalScale(30),
   paddingHorizontal: horizontalScale(20),
 },
 inputContainer: {
   width: '100%',
   marginBottom: verticalScale(20),
 }
});

