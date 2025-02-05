// app/(app)/settings.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, horizontalScale, verticalScale, moderateScale } from '../../../src/themes';
import { useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';
import { setLanguage } from '../../../src/i18n';
import { useAuth } from '../../../src/context/AuthContext';
import Animated, { FadeIn } from 'react-native-reanimated';
import { TouchableRipple } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

// Add before your component:
const AnimatedSwitch = Animated.createAnimatedComponent(Switch);

export default function Settings() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { user, logout, userData } = useAuth();
  const [isLanguageLoading, setIsLanguageLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const [form, setForm] = useState({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: false,
  });

  const handleLanguageChange = async () => {
    await Haptics.selectionAsync();
    setIsLanguageLoading(true);
    try {
      const newLanguage = i18n.language === 'en' ? 'es' : 'en';
      await setLanguage(newLanguage);
    } catch (error) {
      console.log('Error changing language:', error);
    } finally {
      setIsLanguageLoading(false);
    }
  };

  const handleLogout = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      alert("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Keep your existing helper functions
  const getLocation = () => {
    if (!userData) return t('unknownLocation');
    const { city = '', state = '' } = userData;
    return `${city}, ${state}`.trim().replace(/^, |, $/g, '');
  };

  const getFullName = () => {
    if (!userData) return t('defaultName');
    const { fname = '', lname = '' } = userData;
    return `${fname} ${lname}`.trim();
  };

  const renderAvatar = () => {
    if (userData?.fname && userData?.lname) {
      const initials = `${userData.fname[0]}${userData.lname[0]}`.toUpperCase();
      return (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      );
    }
    return (
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>JD</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.black_grey }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('settings')}</Text>
          <Text style={styles.headerSubtitle}>{t('manageAccount')}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Animated.View 
            entering={FadeIn.duration(600)} 
            style={styles.profile}
          >
            {renderAvatar()}
            <Text style={styles.profileName}>{getFullName()}</Text>
            <Text style={styles.profileEmail}>{userData?.email || t('defaultEmail')}</Text>

            <TouchableOpacity
              onPress={() => router.push("/(app)/settings/edit")}>
              <View style={styles.profileAction}>
                <Text style={styles.profileActionText}>{t('editProfile')}</Text>
                <Feather color="#fff" name="edit" size={16} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout} disabled={isLoggingOut}>
              <View style={styles.profileAction}>
                <Text style={styles.profileActionText}>
                  {isLoggingOut ? t('loggingOut') : t('logOut')}
                </Text>
                {isLoggingOut ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Feather color="#fff" name="log-out" size={16} />
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('preferences')}</Text>

            <View style={styles.sectionBody}>
              <View style={[styles.rowWrapper, styles.rowFirst]}>
                <TouchableRipple 
                  onPress={handleLanguageChange}
                  rippleColor="rgba(255, 255, 255, 0.1)"
                  style={styles.row}
                >
                  <>
                    <View style={[styles.rowIcon, { backgroundColor: '#fe9400' }]}>
                      <Feather color="#29292b" name="globe" size={20} />
                    </View>
                    <Text style={styles.rowLabel}>{t('languagePreference')}</Text>
                    <View style={styles.rowSpacer} />
                    {isLanguageLoading ? (
                      <ActivityIndicator size="small" color={Colors.greenThemeColor} />
                    ) : (
                      <>
                        <Text style={styles.rowValue}>
                          {i18n.language === 'en' ? t('english') : t('spanish')}
                        </Text>
                        <Feather color="#C6C6C6" name="chevron-right" size={20} />
                      </>
                    )}
                  </>
                </TouchableRipple>
              </View>

              <View style={styles.rowWrapper}>
                <View style={styles.row}>
                  <View style={[styles.rowIcon, { backgroundColor: '#007AFF' }]}>
                    <Feather color="#29292b" name="moon" size={20} />
                  </View>
                  <Text style={styles.rowLabel}>{t('darkMode')}</Text>
                  <View style={styles.rowSpacer} />
                  <AnimatedSwitch
                    entering={FadeIn}
                    onValueChange={darkMode => {
                      Haptics.selectionAsync();
                      setForm({ ...form, darkMode });
                    }}
                    value={form.darkMode}
                  />
                </View>
              </View>

              <View style={styles.rowWrapper}>
                <View style={styles.row}>
                  <View style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
                    <Feather color="#29292b" name="navigation" size={20} />
                  </View>
                  <Text style={styles.rowLabel}>{t('location')}</Text>
                  <View style={styles.rowSpacer} />
                  <Text style={styles.rowValue}>{getLocation()}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('notifications')}</Text>

            <View style={styles.sectionBody}>
              <View style={[styles.rowWrapper, styles.rowFirst]}>
                <View style={styles.row}>
                  <View style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
                    <Feather color="#29292b" name="at-sign" size={20} />
                  </View>
                  <Text style={styles.rowLabel}>{t('emailNotifications')}</Text>
                  <View style={styles.rowSpacer} />
                  <AnimatedSwitch
                    entering={FadeIn}
                    onValueChange={emailNotifications => {
                      Haptics.selectionAsync();
                      setForm({ ...form, emailNotifications });
                    }}
                    value={form.emailNotifications}
                  />
                </View>
              </View>

              <View style={styles.rowWrapper}>
                <View style={styles.row}>
                  <View style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
                    <Feather color="#29292b" name="bell" size={20} />
                  </View>
                  <Text style={styles.rowLabel}>{t('pushNotifications')}</Text>
                  <View style={styles.rowSpacer} />
                  <AnimatedSwitch
                    entering={FadeIn}
                    onValueChange={pushNotifications => {
                      Haptics.selectionAsync();
                      setForm({ ...form, pushNotifications });
                    }}
                    value={form.pushNotifications}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.black_grey,
    paddingVertical: verticalScale(24),
    flex: 1,
  },
  header: {
    paddingHorizontal: horizontalScale(24),
    marginBottom: verticalScale(20),
  },
  headerTitle: {
    fontSize: moderateScale(34),
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: moderateScale(16),
    color: Colors.grey,
    marginTop: verticalScale(8),
  },
  profile: {
    padding: moderateScale(24),
    alignItems: 'center',
    backgroundColor: Colors.darkGrey,
    borderRadius: moderateScale(16),
    marginHorizontal: horizontalScale(16),
    marginBottom: verticalScale(24),
    marginTop: verticalScale(10), // Added top margin
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,

  },
  avatar: {
    height: moderateScale(80),
    width: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: Colors.greenThemeColor,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.greenThemeColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
  },
  avatarText: {
    fontSize: moderateScale(28),
    color: Colors.white,
    fontWeight: '700',
  },
  profileName: {
    marginTop: verticalScale(16),
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: Colors.white,
  },
  profileEmail: {
    marginTop: verticalScale(8),
    fontSize: moderateScale(16),
    color: Colors.grey,
  },
  profileAction: {
    marginTop: verticalScale(12),
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.greenThemeColor,
    borderRadius: moderateScale(12),
    minWidth: horizontalScale(120),
    gap: horizontalScale(8),
  },
  profileActionText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: Colors.white,
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    marginBottom: verticalScale(12),
    marginHorizontal: horizontalScale(24),
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: Colors.grey,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionBody: {
    backgroundColor: Colors.darkGrey,
    borderRadius: moderateScale(16),
    marginHorizontal: horizontalScale(16),
    paddingLeft: horizontalScale(16),
    overflow: 'hidden',
  },
  row: {
    paddingVertical: verticalScale(16),
    paddingRight: horizontalScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(70), // Increased height for better text visibility
    minHeight: verticalScale(60), // Added minimum height

  },
  rowWrapper: {
    borderTopWidth: 1,
    borderColor: Colors.transParent,
    backdropFilter: 'blur(10px)',
  },
  rowFirst: {
    borderTopWidth: 0,
  },
  rowLabel: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    color: Colors.white,
    flex: 1,
    flexWrap: 'wrap', // Allow text to wrap
  },
  rowValue: {
    fontSize: moderateScale(16),
    color: Colors.grey,
    marginRight: horizontalScale(8),
  },
  rowIcon: {
    marginRight: horizontalScale(16),
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 1.1 }],
  },
  rowSpacer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: moderateScale(13),
    color: Colors.grey,
    marginTop: verticalScale(4),
  }
});