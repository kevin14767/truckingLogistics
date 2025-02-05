// app/(app)/settings/edit.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Alert,
  ScrollView, SafeAreaView, ActivityIndicator, KeyboardAvoidingView,
  Platform, Animated, Keyboard
} from "react-native";
import { Feather, FontAwesome } from '@expo/vector-icons';
import { Colors, moderateScale, horizontalScale, verticalScale } from '../../../src/themes';
import FormButton from "@/src/components/forms/FormButton";
import { useRouter } from "expo-router";
import { useAuth } from "../../../src/context/AuthContext";
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../src/context/AuthContext';
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
    if (!user) return; // Add null check
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
    if (!user) return; // Add null check
  
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
        <Feather name="arrow-left" size={25} color={Colors.white} />
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
            <FontAwesome name="user-o" size={20} color={Colors.grey} />
            <TextInput
              placeholder={t('firstName')}
              placeholderTextColor={Colors.grey}
              value={userData?.fname || ''}
              onChangeText={(txt) => setUserData({ ...userData, fname: txt })}
              style={styles.textInput}
            />
          </View>

          <View style={styles.action}>
            <FontAwesome name="user-o" size={20} color={Colors.grey} />
            <TextInput
              placeholder={t('lastName')}
              placeholderTextColor={Colors.grey}
              value={userData?.lname || ''}
              onChangeText={(txt) => setUserData({ ...userData, lname: txt })}
              style={styles.textInput}
            />
          </View>

          <View style={styles.action}>
            <FontAwesome name="phone" size={20} color={Colors.grey} />
            <TextInput
              placeholder={t('phone')}
              keyboardType="number-pad"
              placeholderTextColor={Colors.grey}
              value={userData?.phone || ''}
              onChangeText={(txt) => setUserData({ ...userData, phone: txt })}
              style={styles.textInput}
            />
          </View>

          <View style={styles.action}>
            <FontAwesome name="envelope-o" size={20} color={Colors.grey} />
            <TextInput
              placeholder={t('email')}
              keyboardType="email-address"
              placeholderTextColor={Colors.grey}
              value={userData?.email || ''}
              onChangeText={(txt) => setUserData({ ...userData, email: txt })}
              style={styles.textInput}
            />
          </View>

          <View style={styles.action}>
            <FontAwesome name="globe" size={20} color={Colors.grey} />
            <TextInput
              placeholder={t('country')}
              placeholderTextColor={Colors.grey}
              value={userData?.country || ''}
              onChangeText={(txt) => setUserData({ ...userData, country: txt })}
              style={styles.textInput}
            />
          </View>

          <View style={styles.action}>
            <Feather name="map-pin" size={20} color={Colors.grey} />
            <TextInput
              placeholder={t('city')}
              placeholderTextColor={Colors.grey}
              value={userData?.city || ''}
              onChangeText={(txt) => setUserData({ ...userData, city: txt })}
              style={styles.textInput}
            />
          </View>

          <View style={styles.action}>
            <Feather name="map" size={20} color={Colors.grey} />
            <TextInput
              placeholder={t('state')}
              placeholderTextColor={Colors.grey}
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
      backgroundColor: Colors.black_grey,
    },
    contentContainer: {
      padding: moderateScale(20),
      paddingBottom: moderateScale(40),
    },
    backButton: {
      padding: moderateScale(16),
      marginLeft: horizontalScale(8),
    },
    profileSection: {
      alignItems: "center",
      marginBottom: verticalScale(20),
    },
    imageContainer: {
      height: moderateScale(120),
      width: moderateScale(120),
      borderRadius: moderateScale(60),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Colors.greenThemeColor,
      elevation: 4,
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
    },
    avatar: {
      height: moderateScale(120),
      width: moderateScale(120),
      borderRadius: moderateScale(60),
      backgroundColor: Colors.greenThemeColor,
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
    },
    avatarText: {
      fontSize: moderateScale(42),
      color: Colors.white,
      fontWeight: "700",
    },
    imageBackground: {
      height: moderateScale(120),
      width: moderateScale(120),
    },
    imageStyle: {
      borderRadius: moderateScale(60),
    },
    userName: {
      marginTop: verticalScale(16),
      fontSize: moderateScale(24),
      fontWeight: "700",
      color: Colors.white,
      marginBottom: verticalScale(24),
    },
    action: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.darkGrey,
      marginVertical: verticalScale(8),
      borderRadius: moderateScale(12),
      padding: moderateScale(16),
      elevation: 2,
      shadowColor: Colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
    },
    textInput: {
      flex: 1,
      paddingLeft: horizontalScale(12),
      color: Colors.white,
      fontSize: moderateScale(16),
    },
    updateButton: {
      marginTop: verticalScale(24),
      backgroundColor: Colors.greenThemeColor,
      borderRadius: moderateScale(12),
      padding: moderateScale(16),
      marginBottom: moderateScale(32),
    }
  });
  