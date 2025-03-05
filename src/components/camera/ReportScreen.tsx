// src/components/camera/ReportScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CameraStackParamList, VerificationData } from '@/src/types/camera_navigation';
import { 
  Colors, 
  moderateScale, 
  verticalScale, 
  horizontalScale,
  Typography,
  Spacing,
  BorderRadius
} from '@/src/themes';
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
                color={item.verified ? Colors.status.success : Colors.text.secondary}
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
    backgroundColor: Colors.background.main,
  },
  header: {
    padding: Spacing.m,
    marginTop: verticalScale(40),
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.text.primary,
    fontSize: Typography.header.medium.fontSize,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: Spacing.m,
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    color: Colors.text.primary,
    fontSize: Typography.header.small.fontSize,
    fontWeight: '600',
    marginBottom: Spacing.m,
  },
  infoCard: {
    backgroundColor: Colors.background.card,
    padding: Spacing.m,
    borderRadius: BorderRadius.medium,
  },
  infoText: {
    color: Colors.text.primary,
    fontSize: Typography.body.medium.fontSize,
    marginBottom: Spacing.s,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    padding: Spacing.m,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.s,
  },
  resultText: {
    color: Colors.text.primary,
    fontSize: Typography.body.large.fontSize,
  },
  footer: {
    padding: Spacing.m,
  },
  footerButton: {
    backgroundColor: Colors.primary.main,
    padding: Spacing.m,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  footerButtonText: {
    color: Colors.text.primary,
    fontSize: Typography.button.fontSize,
    fontWeight: 'bold',
  },
  textScroll: {
    maxHeight: verticalScale(120),
  },
  extractedText: {
    color: Colors.text.primary,
    fontSize: Typography.body.medium.fontSize,
    lineHeight: Typography.body.medium.lineHeight,
  }
});