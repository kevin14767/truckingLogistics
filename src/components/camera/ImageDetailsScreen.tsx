// src/components/camera/ImageDetailsScreen.tsx
import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CameraStackParamList } from '@/src/types/camera_navigation';
import { Colors, moderateScale, verticalScale, horizontalScale } from '@/src/themes';
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
        <MaterialIcons name="arrow-back" size={24} color={Colors.white} />
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
    backgroundColor: Colors.black_grey,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: verticalScale(50),
    left: horizontalScale(20),
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: moderateScale(8),
    borderRadius: moderateScale(20),
  },
  image: {
    width: '100%',
    height: '50%',
    marginTop: verticalScale(50),
  },
  verifyButton: {
    position: 'absolute',
    bottom: verticalScale(40),
    backgroundColor: Colors.greenThemeColor,
    padding: moderateScale(15),
    borderRadius: moderateScale(10),
    width: '80%',
    alignItems: 'center',
  },
  ocrButton: {
    position: 'absolute',
    bottom: verticalScale(100),
    backgroundColor: Colors.darkGrey,
    padding: moderateScale(15),
    borderRadius: moderateScale(10),
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
  textContainer: {
    position: 'absolute',
    bottom: verticalScale(100),
    width: '90%',
    backgroundColor: Colors.darkGrey,
    borderRadius: moderateScale(10),
    padding: moderateScale(15),
    maxHeight: verticalScale(200),
  },
  textTitle: {
    color: Colors.white,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    marginBottom: verticalScale(8),
  },
  textScroll: {
    maxHeight: verticalScale(150),
  },
  recognizedText: {
    color: Colors.white,
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
  }
});