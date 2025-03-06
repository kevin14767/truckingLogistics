// src/components/camera/OCRProcessor.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  Animated,
  Easing
} from 'react-native';
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
import { useTranslation } from 'react-i18next';
import { OcrService } from '@/src/services/OcrService';
import { MaterialIcons } from '@expo/vector-icons';

interface OCRProcessorProps {
  imageUri: string;
  onTextRecognized: (text: string) => void;
}

const OCRProcessor: React.FC<OCRProcessorProps> = ({ imageUri, onTextRecognized }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'preparing' | 'processing' | 'analyzing' | 'finalizing'>('preparing');
  const { t } = useTranslation();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  
  // Create rotation interpolation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  useEffect(() => {
    if (imageUri) {
      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        })
      ]).start();
      
      // Start continuous rotation animation
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true
        })
      ).start();
      
      processImage(imageUri);
    }
  }, [imageUri]);

  const processImage = async (uri: string) => {
    setIsProcessing(true);
    setStage('preparing');
    
    try {
      // Start progress animation with stages
      const stageTimer = setTimeout(() => setStage('processing'), 1000);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          // Different progression rates based on stage
          let increment = 5;
          if (prev < 20) increment = 10;
          else if (prev >= 70) increment = 3;
          
          // Update stage based on progress
          if (prev >= 30 && prev < 35) setStage('processing');
          else if (prev >= 60 && prev < 65) setStage('analyzing');
          else if (prev >= 85 && prev < 90) setStage('finalizing');
          
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return Math.min(90, prev + increment);
        });
      }, 300);
      
      // Process with OCR service
      const text = await OcrService.recognizeText(uri);
      
      // Complete progress
      clearInterval(interval);
      clearTimeout(stageTimer);
      setProgress(100);
      setStage('finalizing');
      
      // Short delay before completing to show 100%
      setTimeout(() => {
        // Fade out animation
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.9,
            duration: 300,
            useNativeDriver: true
          })
        ]).start(() => {
          setIsProcessing(false);
          // Pass text to parent component
          onTextRecognized(text);
        });
      }, 500);
    } catch (error) {
      console.error('OCR Error:', error);
      
      // Fade out animation on error
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start(() => {
        setIsProcessing(false);
        onTextRecognized('Text extraction failed. Please try again with a clearer image.');
      });
    }
  };

  // Return null if not processing
  if (!isProcessing) return null;
  
  // Get stage message
  const getStageMessage = () => {
    switch (stage) {
      case 'preparing': return t('preparingImage', 'Preparing image...');
      case 'processing': return t('extractingText', 'Extracting text...');
      case 'analyzing': return t('analyzingContent', 'Analyzing content...');
      case 'finalizing': return t('finalizing', 'Finalizing results...');
      default: return t('processing', 'Processing...');
    }
  };
  
  // Get icon for current stage
  const getStageIcon = () => {
    switch (stage) {
      case 'preparing': return 'image';
      case 'processing': return 'document-scanner';
      case 'analyzing': return 'analytics';
      case 'finalizing': return 'check-circle';
      default: return 'hourglass-empty';
    }
  };

  return (
    <View style={styles.overlay}>
      <Animated.View 
        style={[
          styles.processingCard,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <View style={styles.iconContainer}>
          <Animated.View style={{
            transform: [{ rotate: spin }]
          }}>
            <MaterialIcons 
              name="autorenew" 
              size={28} 
              color={Colors.primary.main} 
            />
          </Animated.View>
        </View>
        
        <Text style={styles.processingTitle}>{t('processingImage', 'Processing Image')}</Text>
        <Text style={styles.stageText}>{getStageMessage()}</Text>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBackground}>
            <Animated.View 
              style={[
                styles.progressFill,
                { width: `${progress}%` }
              ]}
            />
          </View>
          <Text style={styles.progressText}>{`${Math.round(progress)}%`}</Text>
        </View>
        
        <View style={styles.stageIndicator}>
          <MaterialIcons 
            name={getStageIcon()} 
            size={20} 
            color={progress >= 25 ? Colors.primary.main : Colors.text.secondary} 
          />
          <View style={[styles.stageLine, progress >= 50 && styles.stageLineActive]} />
          <MaterialIcons 
            name="text-fields" 
            size={20} 
            color={progress >= 50 ? Colors.primary.main : Colors.text.secondary} 
          />
          <View style={[styles.stageLine, progress >= 75 && styles.stageLineActive]} />
          <MaterialIcons 
            name="auto-awesome" 
            size={20} 
            color={progress >= 75 ? Colors.primary.main : Colors.text.secondary} 
          />
          <View style={[styles.stageLine, progress >= 90 && styles.stageLineActive]} />
          <MaterialIcons 
            name="check-circle" 
            size={20} 
            color={progress >= 100 ? Colors.primary.main : Colors.text.secondary} 
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 999,
  },
  processingCard: {
    backgroundColor: Colors.background.card,
    padding: Spacing.l,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    width: '80%',
    maxWidth: 350,
    ...Shadow.large,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  processingTitle: {
    color: Colors.text.primary,
    fontSize: Typography.header.small.fontSize,
    fontWeight: '600',
    marginBottom: Spacing.s,
  },
  stageText: {
    color: Colors.text.secondary,
    fontSize: Typography.body.medium.fontSize,
    marginBottom: Spacing.m,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: Spacing.m,
  },
  progressBackground: {
    height: verticalScale(8),
    backgroundColor: Colors.background.elevated,
    borderRadius: BorderRadius.pill,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary.main,
    borderRadius: BorderRadius.pill,
  },
  progressText: {
    color: Colors.text.secondary,
    fontSize: Typography.body.small.fontSize,
    textAlign: 'right',
  },
  stageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Spacing.xs,
  },
  stageLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.background.elevated,
    marginHorizontal: Spacing.xs,
  },
  stageLineActive: {
    backgroundColor: Colors.primary.main,
  },
});

export default OCRProcessor;