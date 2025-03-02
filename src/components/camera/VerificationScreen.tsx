// src/components/camera/VerificationScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CameraStackParamList } from '@/src/types/camera_navigation';
import { Colors, moderateScale, verticalScale, horizontalScale } from '../../../src/themes';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

type VerificationItem = {
  id: string;
  title: string;
  verified: boolean;
};

export default function VerificationScreen() {
  const params = useLocalSearchParams<CameraStackParamList['verification']>();
  const router = useRouter();
  const { t } = useTranslation();
  
  // Parse the imageData
  const imageData = params.imageData ? JSON.parse(params.imageData) : { uri: '', recognizedText: '' };
  
  const [verificationItems, setVerificationItems] = useState<VerificationItem[]>([
    { id: '1', title: 'Document Clarity', verified: false },
    { id: '2', title: 'Document Type', verified: false },
    { id: '3', title: 'Information Complete', verified: false },
    { id: '4', title: 'No Damage', verified: false },
  ]);

  const handleVerifyItem = (id: string) => {
    setVerificationItems(items =>
      items.map(item =>
        item.id === id ? { ...item, verified: !item.verified } : item
      )
    );
  };

  const handleSubmit = () => {
    const verificationData = {
      verificationResults: verificationItems,
      imageData: imageData,
      timestamp: new Date().toISOString()
    };
  
    router.push({
      pathname: '/camera/report',
      params: { 
        verificationData: JSON.stringify(verificationData)
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('verifyDocument', 'Verify Document')}</Text>
      </View>

      {imageData.recognizedText && (
        <View style={styles.ocrSection}>
          <Text style={styles.ocrTitle}>{t('recognizedText', 'Recognized Text')}:</Text>
          <ScrollView style={styles.ocrScrollView}>
            <Text style={styles.ocrText}>{imageData.recognizedText}</Text>
          </ScrollView>
        </View>
      )}

      <ScrollView style={styles.content}>
        {verificationItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[styles.verificationItem, item.verified && styles.verificationItemActive]}
            onPress={() => handleVerifyItem(item.id)}
          >
            <Text style={styles.itemTitle}>{item.title}</Text>
            <MaterialIcons
              name={item.verified ? "check-circle" : "radio-button-unchecked"}
              size={24}
              color={item.verified ? Colors.greenThemeColor : Colors.grey}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={[
          styles.submitButton,
          verificationItems.every(item => item.verified) && styles.submitButtonActive
        ]}
        onPress={handleSubmit}
        disabled={!verificationItems.every(item => item.verified)}
      >
        <Text style={styles.submitButtonText}>{t('generateReport', 'Generate Report')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black_grey,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    marginTop: verticalScale(40),
  },
  backButton: {
    padding: moderateScale(8),
  },
  headerTitle: {
    color: Colors.white,
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginLeft: horizontalScale(16),
  },
  content: {
    padding: moderateScale(16),
  },
  verificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.darkGrey,
    padding: moderateScale(16),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(12),
  },
  verificationItemActive: {
    borderColor: Colors.greenThemeColor,
    borderWidth: 1,
  },
  itemTitle: {
    color: Colors.white,
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: Colors.grey,
    padding: moderateScale(16),
    borderRadius: moderateScale(10),
    margin: moderateScale(16),
    alignItems: 'center',
  },
  submitButtonActive: {
    backgroundColor: Colors.greenThemeColor,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  ocrSection: {
    margin: moderateScale(16),
    padding: moderateScale(16),
    backgroundColor: Colors.darkGrey,
    borderRadius: moderateScale(10),
    maxHeight: verticalScale(150),
  },
  ocrTitle: {
    color: Colors.white,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    marginBottom: verticalScale(8),
  },
  ocrScrollView: {
    maxHeight: verticalScale(100),
  },
  ocrText: {
    color: Colors.white,
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
  }
});