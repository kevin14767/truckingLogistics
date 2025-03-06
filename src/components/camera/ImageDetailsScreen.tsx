// src/components/camera/ImageDetailsScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  ScrollView, 
  ActivityIndicator,
  Animated,
  Dimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  Colors, 
  moderateScale, 
  verticalScale, 
  horizontalScale,
  BorderRadius, 
  Spacing, 
  Typography,
  Shadow
} from '@/src/themes';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import OCRProcessor from './OCRprocessor';
import { AIClassificationService } from '@/src/services/AIClassificationService';
import { AIClassifiedReceipt, Receipt } from '@/src/types/ReceiptInterfaces';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function ImageDetailsScreen() {
  const { uri } = useLocalSearchParams();
  const router = useRouter();
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [showOCR, setShowOCR] = useState<boolean>(false);
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [classifiedData, setClassifiedData] = useState<AIClassifiedReceipt | null>(null);
  const { t } = useTranslation();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Handle OCR recognition completion
  const handleTextRecognized = async (text: string) => {
    setRecognizedText(text);
    setShowOCR(false);
    
    // Animate in the text container
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();
    
    // Provide haptic feedback for completion
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Automatically start AI classification
    await classifyText(text);
  };

  // Function to classify recognized text
  const classifyText = async (text: string) => {
    setIsClassifying(true);
    try {
      const classified = await AIClassificationService.classifyReceipt(text);
      
      // Ensure all required fields exist
      const validatedClassification: AIClassifiedReceipt = {
        date: classified?.date || new Date().toISOString().split('T')[0],
        type: classified?.type || 'Other',
        amount: classified?.amount || '$0.00',
        vehicle: classified?.vehicle || 'Unknown Vehicle',
        vendorName: classified?.vendorName || 'Unknown Vendor',
        location: classified?.location || '',
        confidence: classified?.confidence || 0.5
      };
      
      setClassifiedData(validatedClassification);
      
      // Haptic feedback for classification completion
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error classifying text:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsClassifying(false);
    }
  };

  // Start OCR processing
  const startOCR = () => {
    setShowOCR(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Navigate to verification screen
  const handleContinue = () => {
    if (!recognizedText) {
      alert('Please extract the text first');
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Create default values for missing fields
    const defaultReceipt: Partial<Receipt> = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: 'Other',
      amount: '$0.00',
      vehicle: 'Unknown Vehicle',
      status: 'Pending',
      extractedText: recognizedText,
      imageUri: uri as string,
      timestamp: new Date().toISOString()
    };
    
    // Merge with classified data (if available)
    const receiptData = classifiedData 
      ? { ...defaultReceipt, ...classifiedData }
      : defaultReceipt;
    
    // Navigate to verification screen with receipt data and image URI
    router.push({
      pathname: '/camera/verification',
      params: { 
        receipt: JSON.stringify(receiptData),
        uri: uri as string 
      }
    });
  };

  // Start OCR automatically when screen loads
  useEffect(() => {
    if (uri && !recognizedText) {
      // Add a small delay for better UX
      const timer = setTimeout(() => {
        startOCR();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [uri]);

  // Format currency amount with proper formatting
  const formatCurrency = (amount: string | undefined) => {
    // Handle undefined or empty string
    if (!amount) return '$0.00';
    
    try {
      // If it already has a currency symbol, return as is
      if (amount.includes('$') || amount.includes('€') || amount.includes('£')) {
        return amount;
      }
      
      // Otherwise, format as USD
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum)) return '$0.00';
      
      return `$${amountNum.toFixed(2)}`;
    } catch (error) {
      console.error('Error formatting currency:', error);
      return '$0.00';
    }
  };

  // Get confidence level color
  const getConfidenceColor = (confidence: number = 0) => {
    if (confidence >= 0.8) return Colors.status.success;
    if (confidence >= 0.6) return Colors.status.warning;
    return Colors.status.error;
  };

  // Safe way to get properties with default values
  const safeGetProperty = <T,>(obj: any, property: string, defaultValue: T): T => {
    if (!obj) return defaultValue;
    return (obj[property] !== undefined && obj[property] !== null) ? obj[property] : defaultValue;
  };

  // Simple solution with button inside ScrollView
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <MaterialIcons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('receiptScanner', 'Receipt Scanner')}</Text>
        <View style={styles.rightHeaderPlaceholder} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* Image Container */}
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: uri as string }} 
              style={styles.image}
              resizeMode="cover" 
            />
            {!recognizedText && (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>
                  {t('tapToScan', 'Tap to scan receipt')}
                </Text>
              </View>
            )}
          </View>
          
          {/* Text Recognition Results */}
          {recognizedText ? (
            <Animated.View 
              style={[
                styles.textContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <View style={styles.sectionHeader}>
                <MaterialIcons name="document-scanner" size={20} color={Colors.primary.main} />
                <Text style={styles.sectionTitle}>{t('recognizedText', 'Recognized Text')}</Text>
              </View>
              <ScrollView style={styles.textScroll}>
                <Text style={styles.recognizedText}>{recognizedText}</Text>
              </ScrollView>
            </Animated.View>
          ) : (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={startOCR}
            >
              <MaterialIcons name="document-scanner" size={24} color={Colors.text.primary} />
              <Text style={styles.buttonText}>{t('scanReceipt', 'Scan Receipt')}</Text>
            </TouchableOpacity>
          )}
          
          {/* Classification Results */}
          {classifiedData && (
            <View style={styles.classificationContainer}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="auto-awesome" size={20} color={Colors.primary.main} />
                <Text style={styles.sectionTitle}>{t('aiClassification', 'AI Classification')}</Text>
                <View style={[
                  styles.confidenceBadge,
                  { backgroundColor: getConfidenceColor(safeGetProperty(classifiedData, 'confidence', 0)) }
                ]}>
                  <Text style={styles.confidenceText}>
                    {Math.round((safeGetProperty(classifiedData, 'confidence', 0) * 100))}%
                  </Text>
                </View>
              </View>
              
              <View style={styles.classificationGrid}>
                <View style={styles.classificationItem}>
                  <Text style={styles.itemLabel}>{t('receiptType', 'Type')}</Text>
                  <View style={styles.typeTag}>
                    <Text style={styles.typeTagText}>
                      {safeGetProperty(classifiedData, 'type', 'Other')}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.classificationItem}>
                  <Text style={styles.itemLabel}>{t('amount', 'Amount')}</Text>
                  <Text style={styles.itemValueLarge}>
                    {formatCurrency(safeGetProperty(classifiedData, 'amount', ''))}
                  </Text>
                </View>
                
                <View style={styles.classificationItem}>
                  <Text style={styles.itemLabel}>{t('date', 'Date')}</Text>
                  <Text style={styles.itemValue}>
                    {safeGetProperty(classifiedData, 'date', 'Unknown')}
                  </Text>
                </View>
                
                <View style={styles.classificationItem}>
                  <Text style={styles.itemLabel}>{t('vendor', 'Vendor')}</Text>
                  <Text style={styles.itemValue} numberOfLines={1}>
                    {safeGetProperty(classifiedData, 'vendorName', 'Unknown Vendor')}
                  </Text>
                </View>
                
                <View style={styles.classificationItem}>
                  <Text style={styles.itemLabel}>{t('vehicle', 'Vehicle')}</Text>
                  <Text style={styles.itemValue}>
                    {safeGetProperty(classifiedData, 'vehicle', 'Unknown Vehicle')}
                  </Text>
                </View>
                
                {safeGetProperty(classifiedData, 'location', '') && (
                  <View style={styles.classificationItem}>
                    <Text style={styles.itemLabel}>{t('location', 'Location')}</Text>
                    <Text style={styles.itemValue} numberOfLines={1}>
                      {safeGetProperty(classifiedData, 'location', '')}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
          
          {/* Classification Loading */}
          {isClassifying && (
            <View style={styles.classifyingContainer}>
              <ActivityIndicator size="small" color={Colors.primary.main} />
              <Text style={styles.classifyingText}>{t('analyzing', 'Analyzing receipt...')}</Text>
            </View>
          )}
          
          {/* Continue Button */}
          {recognizedText && !isClassifying && (
            <View style={styles.buttonWrapper}>
              <TouchableOpacity 
                style={styles.continueButton}
                onPress={handleContinue}
              >
                <Text style={styles.buttonText}>{t('continue', 'Continue')}</Text>
                <Feather name="arrow-right" size={20} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* OCR Processing Component */}
      {showOCR && (
        <OCRProcessor 
          imageUri={uri as string} 
          onTextRecognized={handleTextRecognized} 
        />
      )}
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.m,
    paddingTop: verticalScale(60),
    paddingBottom: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.card,
  },
  headerTitle: {
    color: Colors.text.primary,
    fontSize: Typography.header.small.fontSize,
    fontWeight: 'bold',
  },
  backButton: {
    padding: Spacing.s,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.background.card,
  },
  rightHeaderPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  buttonWrapper: {
    marginTop: Spacing.l,  // Add good margin above the button
    marginBottom: Spacing.xl, // Add margin below to ensure it's not cut off
    paddingHorizontal: Spacing.m,
  },
  scrollViewContent: {
    paddingBottom: verticalScale(120), // Add extra padding at bottom to allow scrolling content to be visible above the button
  },
  contentContainer: {
    padding: Spacing.m,
  },
  imageContainer: {
    width: '100%',
    height: verticalScale(200),
    borderRadius: BorderRadius.medium,
    overflow: 'hidden',
    marginBottom: Spacing.m,
    backgroundColor: Colors.background.card,
    ...Shadow.medium,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  imagePlaceholderText: {
    color: Colors.text.primary,
    fontSize: Typography.body.medium.fontSize,
    fontWeight: '500',
  },
  textContainer: {
    width: '100%',
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.medium,
    padding: Spacing.m,
    marginBottom: Spacing.m,
    ...Shadow.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  sectionTitle: {
    color: Colors.text.primary,
    fontSize: Typography.body.large.fontSize,
    fontWeight: 'bold',
    marginLeft: Spacing.xs,
  },
  textScroll: {
    maxHeight: verticalScale(100),
  },
  recognizedText: {
    color: Colors.text.secondary,
    fontSize: Typography.body.small.fontSize,
    lineHeight: Typography.body.small.lineHeight * 1.2,
  },
  actionButton: {
    backgroundColor: Colors.primary.main,
    padding: Spacing.m,
    borderRadius: BorderRadius.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.m,
    ...Shadow.medium,
  },
  buttonText: {
    color: Colors.text.primary,
    fontWeight: 'bold',
    fontSize: Typography.button.fontSize,
    marginLeft: Spacing.s,
  },
  classificationContainer: {
    width: '100%',
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.medium,
    padding: Spacing.m,
    marginBottom: Spacing.m,
    ...Shadow.small,
  },
  classificationGrid: {
    marginTop: Spacing.s,
  },
  classificationItem: {
    marginBottom: Spacing.s,
  },
  itemLabel: {
    color: Colors.text.secondary,
    fontSize: Typography.body.small.fontSize,
    marginBottom: Spacing.xs / 2,
  },
  itemValue: {
    color: Colors.text.primary,
    fontSize: Typography.body.medium.fontSize,
    fontWeight: '500',
  },
  itemValueLarge: {
    color: Colors.text.primary,
    fontSize: Typography.header.small.fontSize,
    fontWeight: 'bold',
  },
  typeTag: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.small,
    alignSelf: 'flex-start',
  },
  typeTagText: {
    color: Colors.text.primary,
    fontSize: Typography.body.small.fontSize,
    fontWeight: '600',
  },
  confidenceBadge: {
    marginLeft: 'auto',
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.pill,
  },
  confidenceText: {
    color: Colors.background.main,
    fontSize: Typography.body.small.fontSize,
    fontWeight: '600',
  },
  classifyingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.m,
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.medium,
    ...Shadow.small,
  },
  classifyingText: {
    color: Colors.text.secondary,
    marginLeft: Spacing.s,
    fontSize: Typography.body.medium.fontSize,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.m,
    backgroundColor: Colors.background.main,
    borderTopWidth: 1,
    borderTopColor: Colors.background.card,
    ...Shadow.large, // Added shadow for emphasis
    zIndex: 10, // Ensure button appears above scroll content
  },
  continueButton: {
    backgroundColor: Colors.primary.main,
    padding: Spacing.m,
    borderRadius: BorderRadius.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // Make button more visible
    borderWidth: 1,
    borderColor: Colors.text.primary,
    // Add shadow for better visibility
    ...Shadow.medium,
    // These will work on iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // This will work on Android
    elevation: 5,
  },
});