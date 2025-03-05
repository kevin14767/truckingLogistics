// src/components/camera/VerificationScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CameraStackParamList } from '@/src/types/camera_navigation';
import { 
  Colors, 
  moderateScale, 
  verticalScale, 
  horizontalScale,
  Typography,
  Spacing,
  BorderRadius,
  Shadow
} from '@/src/themes';
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
          <MaterialIcons name="arrow-back" size={24} color={Colors.text.primary} />
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
              color={item.verified ? Colors.primary.main : Colors.text.secondary}
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
    backgroundColor: Colors.background.main,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.m,
    marginTop: verticalScale(40),
  },
  backButton: {
    padding: Spacing.s,
  },
  headerTitle: {
    color: Colors.text.primary,
    fontSize: Typography.header.small.fontSize,
    fontWeight: 'bold',
    marginLeft: Spacing.m,
  },
  content: {
    padding: Spacing.m,
  },
  verificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    padding: Spacing.m,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.m,
  },
  verificationItemActive: {
    borderColor: Colors.primary.main,
    borderWidth: 1,
  },
  itemTitle: {
    color: Colors.text.primary,
    fontSize: Typography.body.large.fontSize,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: Colors.gray.light,
    padding: Spacing.m,
    borderRadius: BorderRadius.medium,
    margin: Spacing.m,
    alignItems: 'center',
  },
  submitButtonActive: {
    backgroundColor: Colors.primary.main,
  },
  submitButtonText: {
    color: Colors.text.primary,
    fontSize: Typography.button.fontSize,
    fontWeight: 'bold',
  },
  ocrSection: {
    margin: Spacing.m,
    padding: Spacing.m,
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.medium,
    maxHeight: verticalScale(150),
  },
  ocrTitle: {
    color: Colors.text.primary,
    fontSize: Typography.body.large.fontSize,
    fontWeight: 'bold',
    marginBottom: Spacing.s,
  },
  ocrScrollView: {
    maxHeight: verticalScale(100),
  },
  ocrText: {
    color: Colors.text.primary,
    fontSize: Typography.body.medium.fontSize,
    lineHeight: Typography.body.medium.lineHeight,
  }
});