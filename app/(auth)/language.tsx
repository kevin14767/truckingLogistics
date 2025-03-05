import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';
import { 
  Colors, 
  Typography, 
  Spacing, 
  horizontalScale, 
  verticalScale, 
  moderateScale, 
  BorderRadius,
  Shadow 
} from '../../src/themes';
import FormButton from '@/src/components/forms/FormButton';

export default function LanguageScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState('en');

  const handleLanguageChange = async (language: string) => {
    setCurrentLang(language);
    await i18n.changeLanguage(language);
    router.push("/(auth)/onboarding");
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
          <Text style={styles.subtitle}>
            {t('chooseLanguage', 'Choose your preferred language')}
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          <FormButton
            buttonTitle={'English'}
            onPress={() => handleLanguageChange('en')}
            backgroundColor={currentLang === 'en' ? Colors.primary.main : Colors.gray.dark}
          />
          <FormButton
            buttonTitle={'Spanish'}
            onPress={() => handleLanguageChange('es')}
            backgroundColor={currentLang === 'es' ? Colors.primary.main : Colors.gray.dark}
          />
        </View>
        
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {t('chooseLater', 'You can change the language later in settings')}
          </Text>
        </View>
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
    paddingHorizontal: horizontalScale(Spacing.l),
    paddingTop: verticalScale(Spacing.xl),
    paddingBottom: verticalScale(Spacing.l),
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(Spacing.xl),
  },
  logo: {
    height: moderateScale(120),
    width: moderateScale(120),
    resizeMode: 'cover',
    borderRadius: BorderRadius.circle(120),
    ...Shadow.medium,
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: '700',
    lineHeight: moderateScale(34),
    color: Colors.text.primary,
    marginTop: verticalScale(Spacing.m),
  },
  subtitle: {
    ...Typography.body.large,
    color: Colors.text.secondary,
    marginTop: verticalScale(Spacing.xs),
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginTop: verticalScale(Spacing.m),
    gap: verticalScale(Spacing.s),
  },
  footerContainer: {
    marginTop: verticalScale(Spacing.l),
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: verticalScale(Spacing.l),
  },
  footerText: {
    color: Colors.text.secondary,
    ...Typography.body.medium,
    textAlign: 'center',
  }
});