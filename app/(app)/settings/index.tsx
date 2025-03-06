// app/(app)/settings/index.tsx
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
import { useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';
import { setLanguage } from '@/src/i18n';
import { useAuth } from '@/src/context/AuthContext';
import Animated, { FadeIn } from 'react-native-reanimated';
import { TouchableRipple } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

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
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background.main }}>
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
                <Feather color={Colors.text.primary} name="edit" size={16} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout} disabled={isLoggingOut}>
              <View style={styles.profileAction}>
                <Text style={styles.profileActionText}>
                  {isLoggingOut ? t('loggingOut') : t('logOut')}
                </Text>
                {isLoggingOut ? (
                  <ActivityIndicator size="small" color={Colors.text.primary} />
                ) : (
                  <Feather color={Colors.text.primary} name="log-out" size={16} />
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
                      <Feather color={Colors.background.card} name="globe" size={20} />
                    </View>
                    <Text style={styles.rowLabel}>{t('languagePreference')}</Text>
                    <View style={styles.rowSpacer} />
                    {isLanguageLoading ? (
                      <ActivityIndicator size="small" color={Colors.primary.main} />
                    ) : (
                      <>
                        <Text style={styles.rowValue}>
                          {i18n.language === 'en' ? t('english') : t('spanish')}
                        </Text>
                        <Feather color={Colors.text.secondary} name="chevron-right" size={20} />
                      </>
                    )}
                  </>
                </TouchableRipple>
              </View>

              <View style={styles.rowWrapper}>
                <View style={styles.row}>
                  <View style={[styles.rowIcon, { backgroundColor: '#007AFF' }]}>
                    <Feather color={Colors.background.card} name="moon" size={20} />
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
                    <Feather color={Colors.background.card} name="navigation" size={20} />
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
                    <Feather color={Colors.background.card} name="at-sign" size={20} />
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
                    <Feather color={Colors.background.card} name="bell" size={20} />
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
    backgroundColor: Colors.background.main,
    paddingVertical: Spacing.l,
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.m,
  },
  headerTitle: {
    fontSize: Typography.header.medium.fontSize,
    fontWeight: '800',
    color: Colors.text.primary,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: Typography.body.large.fontSize,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  profile: {
    padding: Spacing.l,
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.large,
    marginHorizontal: Spacing.m,
    marginBottom: Spacing.l,
    marginTop: Spacing.xs,
    ...Shadow.small,
  },
  avatar: {
    height: moderateScale(80),
    width: moderateScale(80),
    borderRadius: BorderRadius.circle(80),
    backgroundColor: Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.medium,
  },
  avatarText: {
    fontSize: Typography.header.small.fontSize,
    color: Colors.text.primary,
    fontWeight: '700',
  },
  profileName: {
    marginTop: Spacing.m,
    fontSize: Typography.header.small.fontSize,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  profileEmail: {
    marginTop: Spacing.xs,
    fontSize: Typography.body.large.fontSize,
    color: Colors.text.secondary,
  },
  profileAction: {
    marginTop: Spacing.m,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.main,
    borderRadius: BorderRadius.medium,
    minWidth: horizontalScale(120),
    gap: Spacing.xs,
  },
  profileActionText: {
    fontSize: Typography.body.large.fontSize,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  section: {
    marginBottom: Spacing.l,
  },
  sectionTitle: {
    marginBottom: Spacing.m,
    marginHorizontal: Spacing.l,
    fontSize: Typography.body.medium.fontSize,
    fontWeight: '600',
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionBody: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.large,
    marginHorizontal: Spacing.m,
    paddingLeft: Spacing.m,
    overflow: 'hidden',
  },
  row: {
    paddingVertical: Spacing.m,
    paddingRight: Spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(70),
    minHeight: verticalScale(60),
  },
  rowWrapper: {
    borderTopWidth: 1,
    borderColor: Colors.gray.transparent,
    backdropFilter: 'blur(10px)',
  },
  rowFirst: {
    borderTopWidth: 0,
  },
  rowLabel: {
    fontSize: Typography.body.large.fontSize,
    fontWeight: '500',
    color: Colors.text.primary,
    flex: 1,
    flexWrap: 'wrap',
  },
  rowValue: {
    fontSize: Typography.body.large.fontSize,
    color: Colors.text.secondary,
    marginRight: Spacing.xs,
  },
  rowIcon: {
    marginRight: Spacing.m,
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: BorderRadius.small,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ scale: 1.1 }],
  },
  rowSpacer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: Typography.body.small.fontSize,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  }
});