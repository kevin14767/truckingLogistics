import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  Animated
} from 'react-native';
import { useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';
import { Colors, horizontalScale, verticalScale, moderateScale } from '../../src/themes';
import FormButton from '../../src/components/FormButton';

export default function LanguageScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState('en');

  // Remove the useEffect that was switching languages

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
            {t('selectLanguage')}
          </Text>
        </View>
        <View style={styles.formContainer}>
          <FormButton
            buttonTitle={t('english')}
            onPress={() => handleLanguageChange('en')}
            backgroundColor={currentLang === 'en' ? Colors.greenThemeColor : Colors.grey}
          />
          <FormButton
            buttonTitle={t('spanish')}
            onPress={() => handleLanguageChange('es')}
            backgroundColor={currentLang === 'es' ? Colors.greenThemeColor : Colors.grey}
          />
        </View>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {t('chooseLater')}
          </Text>
        </View>
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
    color: Colors.grey,
    marginTop: verticalScale(5),
  },
  formContainer: {
    width: '100%',
    marginTop: verticalScale(10),
  },
  footerContainer: {
    marginTop: verticalScale(20),
  },
  footerText: {
    color: Colors.grey,
    fontSize: moderateScale(14),
    textAlign: 'center',
  }
});