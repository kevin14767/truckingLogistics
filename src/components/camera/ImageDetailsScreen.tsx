// src/components/camera/ImageDetailsScreen.tsx
import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CameraStackParamList } from '@/src/types/camera_navigation';
import { 
  Colors, 
  moderateScale, 
  verticalScale, 
  horizontalScale,
  BorderRadius, 
  Spacing, 
  Typography
} from '@/src/themes';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import OCRProcessor from './OCRprocessor';

export default function ImageDetailsScreen() {
  const { uri } = useLocalSearchParams<CameraStackParamList['imagedetails']>();
  const router = useRouter();
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [showOCR, setShowOCR] = useState<boolean>(false);
  const { t } = useTranslation();

  const handleVerification = () => {
    const imageData = {
      uri,
      recognizedText
    };
    
    router.push({
      pathname: '/camera/verification',
      params: { imageData: JSON.stringify(imageData) }
    });
  };

  const handleTextRecognized = (text: string) => {
    setRecognizedText(text);
    setShowOCR(false);
  };

  const startOCR = () => {
    setShowOCR(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back" size={24} color={Colors.text.primary} />
      </TouchableOpacity>
      
      <Image 
        source={{ uri }} 
        style={styles.image}
        resizeMode="contain"
      />
      
      {recognizedText ? (
        <View style={styles.textContainer}>
          <Text style={styles.textTitle}>{t('recognizedText')}</Text>
          <ScrollView style={styles.textScroll}>
            <Text style={styles.recognizedText}>{recognizedText}</Text>
          </ScrollView>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.ocrButton}
          onPress={startOCR}
        >
          <Text style={styles.buttonText}>{t('extractText', 'Extract Text')}</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity 
        style={styles.verifyButton}
        onPress={handleVerification}
      >
        <Text style={styles.buttonText}>{t('verifyImage')}</Text>
      </TouchableOpacity>
      
      {showOCR && (
        <OCRProcessor 
          imageUri={uri} 
          onTextRecognized={handleTextRecognized} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main, // Updated from Colors.black_grey
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: verticalScale(50),
    left: horizontalScale(20),
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: Spacing.s, // Updated from moderateScale(8)
    borderRadius: BorderRadius.pill, // Updated from moderateScale(20)
  },
  image: {
    width: '100%',
    height: '50%',
    marginTop: verticalScale(50),
  },
  verifyButton: {
    position: 'absolute',
    bottom: verticalScale(40),
    backgroundColor: Colors.primary.main, // Updated from Colors.greenThemeColor
    padding: Spacing.m, // Updated from moderateScale(15)
    borderRadius: BorderRadius.medium, // Updated from moderateScale(10)
    width: '80%',
    alignItems: 'center',
  },
  ocrButton: {
    position: 'absolute',
    bottom: verticalScale(100),
    backgroundColor: Colors.background.card, // Updated from Colors.darkGrey
    padding: Spacing.m, // Updated from moderateScale(15)
    borderRadius: BorderRadius.medium, // Updated from moderateScale(10)
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.text.primary, // Updated from Colors.white
    fontWeight: 'bold',
    fontSize: Typography.button.fontSize, // Updated from moderateScale(16)
  },
  textContainer: {
    position: 'absolute',
    bottom: verticalScale(100),
    width: '90%',
    backgroundColor: Colors.background.card, // Updated from Colors.darkGrey
    borderRadius: BorderRadius.medium, // Updated from moderateScale(10)
    padding: Spacing.m, // Updated from moderateScale(15)
    maxHeight: verticalScale(200),
  },
  textTitle: {
    color: Colors.text.primary, // Updated from Colors.white
    fontSize: Typography.body.large.fontSize, // Updated from moderateScale(16)
    fontWeight: 'bold',
    marginBottom: Spacing.s, // Updated from verticalScale(8)
  },
  textScroll: {
    maxHeight: verticalScale(150),
  },
  recognizedText: {
    color: Colors.text.primary, // Updated from Colors.white
    fontSize: Typography.body.medium.fontSize, // Updated from moderateScale(14)
    lineHeight: Typography.body.medium.lineHeight, // Updated from moderateScale(20)
  }
});