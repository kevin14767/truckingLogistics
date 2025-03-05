// src/components/camera/OCRProcessor.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { 
  Colors, 
  moderateScale, 
  verticalScale, 
  horizontalScale,
  Typography,
  Spacing,
  BorderRadius 
} from '@/src/themes';
import { useTranslation } from 'react-i18next';
import { OcrService } from '@/src/services/OcrService';

interface OCRProcessorProps {
  imageUri: string;
  onTextRecognized: (text: string) => void;
}

const OCRProcessor: React.FC<OCRProcessorProps> = ({ imageUri, onTextRecognized }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    if (imageUri) {
      processImage(imageUri);
    }
  }, [imageUri]);

  const processImage = async (uri: string) => {
    setIsProcessing(true);
    
    try {
      // Start progress animation
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Process with OCR service
      const text = await OcrService.recognizeText(uri);
      
      // Complete progress
      clearInterval(interval);
      setProgress(100);
      
      // Pass text to parent component
      onTextRecognized(text);
    } catch (error) {
      console.error('OCR Error:', error);
      onTextRecognized('Text extraction failed. Please try again with a clearer image.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isProcessing) return null;

  return (
    <View style={styles.container}>
      <View style={styles.processingCard}>
        <ActivityIndicator size="large" color={Colors.primary.main} />
        <Text style={styles.processingText}>{t('processingImage', 'Processing Image')}</Text>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 999,
  },
  processingCard: {
    backgroundColor: Colors.background.card,
    padding: Spacing.l,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    minWidth: horizontalScale(200),
  },
  processingText: {
    color: Colors.text.primary,
    fontSize: Typography.header.small.fontSize,
    fontWeight: '500',
    marginTop: Spacing.m,
  },
  progressText: {
    color: Colors.text.secondary,
    fontSize: Typography.body.large.fontSize,
    marginTop: Spacing.s,
  }
});

export default OCRProcessor;