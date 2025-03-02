// src/components/camera/ReportScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CameraStackParamList, VerificationData } from '@/src/types/camera_navigation';
import { Colors, moderateScale, verticalScale, horizontalScale } from '../../../src/themes';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function ReportScreen() {
  const { verificationData } = useLocalSearchParams<CameraStackParamList['report']>();
  const router = useRouter();
  const { t } = useTranslation();

  // Parse the verification data
  const parsedData: any = verificationData ? 
    JSON.parse(verificationData) : 
    { verificationResults: [], imageData: null, timestamp: new Date().toISOString() };

  const handleFinish = () => {
    router.push('/reports');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('reportSummary', 'Report Summary')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('documentDetails', 'Document Details')}</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>{t('reportId', 'Report ID')}: {Date.now()}</Text>
            <Text style={styles.infoText}>
              {t('date', 'Date')}: {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>

        {parsedData.imageData?.recognizedText && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('extractedText', 'Extracted Text')}</Text>
            <View style={styles.infoCard}>
              <ScrollView style={styles.textScroll}>
                <Text style={styles.extractedText}>
                  {parsedData.imageData.recognizedText}
                </Text>
              </ScrollView>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('verificationResults', 'Verification Results')}</Text>
          {parsedData.verificationResults.map((item: any) => (
            <View key={item.id} style={styles.resultItem}>
              <Text style={styles.resultText}>{item.title}</Text>
              <MaterialIcons
                name={item.verified ? "check-circle" : "cancel"}
                size={24}
                color={item.verified ? Colors.greenThemeColor : Colors.grey}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={handleFinish}>
          <Text style={styles.footerButtonText}>{t('complete', 'Complete')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black_grey,
  },
  header: {
    padding: moderateScale(16),
    marginTop: verticalScale(40),
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: moderateScale(24),
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: moderateScale(16),
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginBottom: verticalScale(12),
  },
  infoCard: {
    backgroundColor: Colors.darkGrey,
    padding: moderateScale(16),
    borderRadius: moderateScale(10),
  },
  infoText: {
    color: Colors.white,
    fontSize: moderateScale(14),
    marginBottom: verticalScale(8),
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.darkGrey,
    padding: moderateScale(16),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(8),
  },
  resultText: {
    color: Colors.white,
    fontSize: moderateScale(16),
  },
  footer: {
    padding: moderateScale(16),
  },
  footerButton: {
    backgroundColor: Colors.greenThemeColor,
    padding: moderateScale(16),
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },
  footerButtonText: {
    color: Colors.white,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  textScroll: {
    maxHeight: verticalScale(120),
  },
  extractedText: {
    color: Colors.white,
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
  }
});