// app/(app)/settings/edit.tsx
import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Alert,
  ScrollView, SafeAreaView
} from "react-native";
import { Feather, FontAwesome } from '@expo/vector-icons';
import { 
  Colors, 
  Typography, 
  Spacing, 
  BorderRadius,
  Shadow,
  moderateScale, 
  horizontalScale, 
  verticalScale 
} from '@/src/themes';
import FormButton from "@/src/components/forms/FormButton";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/src/context/AuthContext';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

interface UserData {
  fname: string;
  lname: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  state: string;
}

const INPUT_FIELDS = [
  { 
    icon: 'user-o',
    iconComponent: FontAwesome,
    name: 'fname',
    label: 'firstName',
    type: 'default',
    validation: (value: string) => value.length >= 2,
    errorMessage: 'firstNameError',
    autoCapitalize: 'words'
  },
  // ... (keep other fields the same)
] as const;

export default function EditScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    if (!user) return;
    try {
      const documentSnapshot = await getDoc(doc(db, 'users', user.uid));
      if (documentSnapshot.exists()) {
        setUserData(documentSnapshot.data());
      }
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  const handleUpdate = async () => {
    if (!user) return;
  
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        fname: userData?.fname || '',
        lname: userData?.lname || '',
        phone: userData?.phone || '',
        email: userData?.email || '',
        country: userData?.country || '',
        city: userData?.city || '',
        state: userData?.state || '',
      });
  
      Alert.alert('Success', t('profileUpdated'));
      router.back();
    } catch (error) {
      console.log('Error updating user profile:', error);
      Alert.alert('Error', t('updateFailed'));
    }
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
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={25} color={Colors.text.primary} />
      </TouchableOpacity>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View style={styles.profileSection}>
            <View style={styles.imageContainer}>{renderAvatar()}</View>
            <Text style={styles.userName}>
              {userData ? `${userData.fname} ${userData.lname}` : ''}
            </Text>
          </View>

          <View style={styles.action}>
            <FontAwesome name="user-o" size={20} color={Colors.text.secondary} />
            <TextInput
              placeholder={t('firstName')}
              placeholderTextColor={Colors.text.secondary}
              value={userData?.fname || ''}
              onChangeText={(txt) => setUserData({ ...userData, fname: txt })}
              style={styles.textInput}
            />
          </View>

          <View style={styles.action}>
            <FontAwesome name="user-o" size={20} color={Colors.text.secondary} />
            <TextInput
              placeholder={t('lastName')}
              placeholderTextColor={Colors.text.secondary}
              value={userData?.lname || ''}
              onChangeText={(txt) => setUserData({ ...userData, lname: txt })}
              style={styles.textInput}
            />
          </View>

          <View style={styles.action}>
            <FontAwesome name="phone" size={20} color={Colors.text.secondary} />
            <TextInput
              placeholder={t('phone')}
              keyboardType="number-pad"
              placeholderTextColor={Colors.text.secondary}
              value={userData?.phone || ''}
              onChangeText={(txt) => setUserData({ ...userData, phone: txt })}
              style={styles.textInput}
            />
          </View>

          <View style={styles.action}>
            <FontAwesome name="envelope-o" size={20} color={Colors.text.secondary} />
            <TextInput
              placeholder={t('email')}
              keyboardType="email-address"
              placeholderTextColor={Colors.text.secondary}
              value={userData?.email || ''}
              onChangeText={(txt) => setUserData({ ...userData, email: txt })}
              style={styles.textInput}
            />
          </View>

          <View style={styles.action}>
            <FontAwesome name="globe" size={20} color={Colors.text.secondary} />
            <TextInput
              placeholder={t('country')}
              placeholderTextColor={Colors.text.secondary}
              value={userData?.country || ''}
              onChangeText={(txt) => setUserData({ ...userData, country: txt })}
              style={styles.textInput}
            />
          </View>

          <View style={styles.action}>
            <Feather name="map-pin" size={20} color={Colors.text.secondary} />
            <TextInput
              placeholder={t('city')}
              placeholderTextColor={Colors.text.secondary}
              value={userData?.city || ''}
              onChangeText={(txt) => setUserData({ ...userData, city: txt })}
              style={styles.textInput}
            />
          </View>

          <View style={styles.action}>
            <Feather name="map" size={20} color={Colors.text.secondary} />
            <TextInput
              placeholder={t('state')}
              placeholderTextColor={Colors.text.secondary}
              value={userData?.state || ''}
              onChangeText={(txt) => setUserData({ ...userData, state: txt })}
              style={styles.textInput}
            />
          </View>

          <FormButton 
            buttonTitle={t('update')}
            onPress={handleUpdate}
            style={styles.updateButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background.main,
    },
    contentContainer: {
      padding: Spacing.l,
      paddingBottom: Spacing.xl,
    },
    backButton: {
      padding: Spacing.m,
      marginLeft: Spacing.xs,
    },
    profileSection: {
      alignItems: "center",
      marginBottom: Spacing.l,
    },
    imageContainer: {
      height: moderateScale(120),
      width: moderateScale(120),
      borderRadius: BorderRadius.circle(120),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Colors.primary.main,
      ...Shadow.medium,
    },
    avatar: {
      height: moderateScale(120),
      width: moderateScale(120),
      borderRadius: BorderRadius.circle(120),
      backgroundColor: Colors.primary.main,
      justifyContent: "center",
      alignItems: "center",
      ...Shadow.medium,
    },
    avatarText: {
      fontSize: Typography.header.large.fontSize,
      color: Colors.text.primary,
      fontWeight: "700",
    },
    imageBackground: {
      height: moderateScale(120),
      width: moderateScale(120),
    },
    imageStyle: {
      borderRadius: BorderRadius.circle(120),
    },
    userName: {
      marginTop: Spacing.m,
      fontSize: Typography.header.small.fontSize,
      fontWeight: "700",
      color: Colors.text.primary,
      marginBottom: Spacing.l,
    },
    action: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.background.card,
      marginVertical: Spacing.xs,
      borderRadius: BorderRadius.medium,
      padding: Spacing.m,
      ...Shadow.small,
    },
    textInput: {
      flex: 1,
      paddingLeft: Spacing.m,
      color: Colors.text.primary,
      fontSize: Typography.body.large.fontSize,
    },
    updateButton: {
      marginTop: Spacing.l,
      backgroundColor: Colors.primary.main,
      borderRadius: BorderRadius.medium,
      padding: Spacing.m,
      marginBottom: Spacing.l,
    }
});