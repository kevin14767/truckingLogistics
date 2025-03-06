// src/components/camera/VerificationScreen.tsx
import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Alert,
  Animated,
  Dimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Receipt } from '@/src/types/ReceiptInterfaces';
import { DocumentStorage } from '@/src/services/DocumentStorage';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function VerificationScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  
  // Parse receipt data from params
  const initialReceipt: Receipt = params.receipt ? 
    JSON.parse(params.receipt as string) : 
    {} as Receipt;
  
  const imageUri = params.uri as string;
  
  // State for editable receipt data
  const [receiptData, setReceiptData] = useState<Receipt>(initialReceipt);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  
  // Animation values
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  // Handle input changes
  const handleInputChange = (field: keyof Receipt, value: string) => {
    setReceiptData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Start field editing
  const startEditing = (field: string) => {
    setActiveField(field);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Stop field editing
  const stopEditing = () => {
    setActiveField(null);
  };
  
  // Validate receipt fields
  const validateReceipt = (): boolean => {
    // Check for required fields
    const requiredFields: (keyof Receipt)[] = ['date', 'type', 'amount'];
    
    for (const field of requiredFields) {
      if (!receiptData[field] || receiptData[field].trim() === '') {
        // Shake animation for error feedback
        Animated.sequence([
          Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true })
        ]).start();
        
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        
        // Show alert with missing field
        Alert.alert(
          t('missingInformation', 'Missing Information'),
          t('pleaseEnterField', 'Please enter {{field}}', { field: t(field.toLowerCase(), field) })
        );
        
        setActiveField(field);
        return false;
      }
    }
    
    return true;
  };
  
  // Save document and navigate to report screen
  const handleSaveAndContinue = async () => {
    // Validate fields first
    if (!validateReceipt()) return;
    
    setIsSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      // Animate fade out
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true
      }).start();
      
      // Save the receipt document
      const savedReceipt = await DocumentStorage.saveReceipt({
        ...receiptData,
        status: 'Pending', // Default to pending
        timestamp: new Date().toISOString()
      });
      
      // Navigate to report screen
      router.push({
        pathname: '/camera/report',
        params: { 
          receipt: JSON.stringify(savedReceipt)
        }
      });
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error saving receipt:', error);
      
      // Animate fade back in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }).start();
      
      Alert.alert(
        t('error', 'Error'),
        t('errorSavingReceipt', 'Failed to save the receipt. Please try again.')
      );
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle image preview
  const handleImagePress = () => {
    setIsModalVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  const closeModal = () => {
    setIsModalVisible(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Get editable fields and ignore internal/system fields
  const getEditableFields = () => {
    const excludeFields = ['id', 'imageUri', 'extractedText', 'timestamp', 'confidence'];
    const orderedFields: (keyof Receipt)[] = ['date', 'type', 'amount', 'vehicle', 'vendorName', 'location'];
    
    return orderedFields.filter(field => !excludeFields.includes(field) && field in receiptData);
  };
  
  // Format a field name for display
  const formatFieldName = (field: string): string => {
    return t(field.toLowerCase(), field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
  };
  
  // Get field icon
  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'date': return 'calendar-today';
      case 'type': return 'category';
      case 'amount': return 'attach-money';
      case 'vehicle': return 'local-shipping';
      case 'vendorName': return 'store';
      case 'location': return 'place';
      default: return 'edit';
    }
  };
  
  // Create placeholder based on field type
  const getFieldPlaceholder = (field: string) => {
    switch (field) {
      case 'date': return 'YYYY-MM-DD';
      case 'amount': return '$0.00';
      case 'type': return 'Fuel, Maintenance, or Other';
      case 'vehicle': return 'Vehicle ID or description';
      case 'vendorName': return 'Business name';
      case 'location': return 'Address';
      default: return `Enter ${formatFieldName(field)}`;
    }
  };
  
  return (
    <Animated.View 
      style={[
        styles.container,
        { opacity: fadeAnim }
      ]} 
    >
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }} 
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('verifyDetails', 'Verify Details')}</Text>
          <View style={{ width: 40 }} /> {/* Placeholder for balance */}
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentContainer}>
            {/* Top info card */}
            <View style={styles.infoCard}>
              <MaterialIcons name="info-outline" size={20} color={Colors.primary.main} />
              <Text style={styles.infoText}>
                {t('verifyInstructions', 'Review and correct any information below before continuing.')}
              </Text>
            </View>
            
            {/* Receipt Image Preview */}
            <TouchableOpacity 
              onPress={handleImagePress} 
              style={styles.imageContainer}
              activeOpacity={0.8}
            >
              <Image 
                source={{ uri: imageUri }} 
                style={styles.imagePreview} 
                resizeMode="cover" 
              />
              <View style={styles.imageOverlay}>
                <MaterialIcons name="zoom-in" size={20} color={Colors.white} />
                <Text style={styles.imageOverlayText}>{t('tapToEnlarge', 'Tap to enlarge')}</Text>
              </View>
            </TouchableOpacity>
            
            {/* Editable Fields */}
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>{t('receiptDetails', 'Receipt Details')}</Text>
              <Animated.View 
                style={[
                  styles.formFieldsContainer,
                  { transform: [{ translateX: shakeAnimation }] }
                ]}
              >
                {getEditableFields().map((field) => (
                  <View key={field} style={[
                    styles.formField,
                    activeField === field && styles.formFieldActive
                  ]}>
                    <View style={styles.fieldIconContainer}>
                      <MaterialIcons 
                        name={getFieldIcon(field)} 
                        size={20} 
                        color={activeField === field ? Colors.primary.main : Colors.text.secondary} 
                      />
                    </View>
                    <View style={styles.fieldContent}>
                      <Text style={styles.fieldLabel}>
                        {formatFieldName(field as string)}
                      </Text>
                      <TextInput
                        style={styles.fieldInput}
                        value={receiptData[field]?.toString() || ''}
                        onChangeText={(text) => handleInputChange(field, text)}
                        placeholder={getFieldPlaceholder(field as string)}
                        placeholderTextColor={Colors.text.secondary}
                        onFocus={() => startEditing(field as string)}
                        onBlur={stopEditing}
                        keyboardType={field === 'amount' ? 'decimal-pad' : 'default'}
                      />
                    </View>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => startEditing(field as string)}
                    >
                      <Feather 
                        name="edit-2" 
                        size={16} 
                        color={activeField === field ? Colors.primary.main : Colors.text.secondary} 
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </Animated.View>
            </View>
            
            {/* Show Raw OCR */}
            <TouchableOpacity 
              style={styles.extractedTextButton}
              onPress={() => {
                Alert.alert(
                  t('extractedText', 'Extracted Text'),
                  receiptData.extractedText || t('noTextFound', 'No text found'),
                  [{ text: t('close', 'Close') }]
                );
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Feather name="file-text" size={16} color={Colors.text.secondary} />
              <Text style={styles.extractedTextButtonText}>
                {t('viewRawText', 'View Raw OCR Text')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Footer with Action Button */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.footerButton, isSaving && styles.footerButtonDisabled]} 
            onPress={handleSaveAndContinue}
            disabled={isSaving}
            activeOpacity={0.7}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={Colors.text.primary} />
            ) : (
              <>
                <Text style={styles.footerButtonText}>
                  {t('saveAndContinue', 'Save and Continue')}
                </Text>
                <MaterialIcons name="check-circle" size={20} color={Colors.text.primary} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      
      {/* Image Modal */}
      <Modal 
        visible={isModalVisible} 
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={closeModal}
            activeOpacity={0.7}
          >
            <MaterialIcons name="close" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Image 
            source={{ uri: imageUri }} 
            style={styles.fullScreenImage} 
            resizeMode="contain" 
          />
          <View style={styles.modalControls}>
            <TouchableOpacity style={styles.modalButton}>
              <Feather name="download" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton}>
              <Feather name="share" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Animated.View>
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
  backButton: {
    padding: Spacing.s,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.background.card,
  },
  headerTitle: {
    color: Colors.text.primary,
    fontSize: Typography.header.small.fontSize,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.m,
    paddingBottom: verticalScale(100),
  },
  infoCard: {
    backgroundColor: Colors.background.elevated,
    borderRadius: BorderRadius.medium,
    padding: Spacing.m,
    marginBottom: Spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.small,
  },
  infoText: {
    color: Colors.text.primary,
    fontSize: Typography.body.medium.fontSize,
    marginLeft: Spacing.s,
    flex: 1,
  },
  imageContainer: {
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.m,
    overflow: 'hidden',
    ...Shadow.small,
  },
  imagePreview: {
    width: '100%',
    height: verticalScale(140),
    borderRadius: BorderRadius.medium,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.s,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageOverlayText: {
    color: Colors.white,
    marginLeft: Spacing.xs,
    fontSize: Typography.body.small.fontSize,
  },
  formContainer: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.medium,
    padding: Spacing.m,
    ...Shadow.small,
  },
  formTitle: {
    color: Colors.text.primary,
    fontSize: Typography.body.large.fontSize,
    fontWeight: 'bold',
    marginBottom: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.elevated,
    paddingBottom: Spacing.xs,
  },
  formFieldsContainer: {
    gap: Spacing.m,
  },
  formField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.elevated,
    borderRadius: BorderRadius.medium,
    padding: Spacing.m,
    ...Shadow.small,
  },
  formFieldActive: {
    borderColor: Colors.primary.main,
    borderWidth: 1,
    backgroundColor: Colors.background.main,
  },
  fieldIconContainer: {
    marginRight: Spacing.s,
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    color: Colors.text.secondary,
    fontSize: Typography.body.small.fontSize,
    marginBottom: Spacing.xs/2,
  },
  fieldInput: {
    color: Colors.text.primary,
    fontSize: Typography.body.medium.fontSize,
    fontWeight: '500',
    padding: 0,
  },
  editButton: {
    padding: Spacing.xs,
  },
  extractedTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.m,
    padding: Spacing.m,
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.medium,
    ...Shadow.small,
  },
  extractedTextButtonText: {
    color: Colors.text.secondary,
    marginLeft: Spacing.xs,
    fontSize: Typography.body.medium.fontSize,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.m,
    backgroundColor: Colors.background.main,
    borderTopWidth: 1,
    borderTopColor: Colors.background.card,
    ...Shadow.large,
  },
  footerButton: {
    backgroundColor: Colors.primary.main,
    padding: Spacing.m,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...Shadow.medium,
  },
  footerButtonDisabled: {
    opacity: 0.6,
  },
  footerButtonText: {
    color: Colors.text.primary,
    fontSize: Typography.button.fontSize,
    fontWeight: 'bold',
    marginRight: Spacing.xs,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: verticalScale(50),
    right: horizontalScale(20),
    zIndex: 10,
    backgroundColor: Colors.background.card,
    padding: Spacing.s,
    borderRadius: BorderRadius.circle(30),
  },
  fullScreenImage: {
    width: width * 0.9,
    height: height * 0.6,
    borderRadius: BorderRadius.medium,
  },
  modalControls: {
    flexDirection: 'row',
    marginTop: Spacing.m,
    gap: Spacing.m,
  },
  modalButton: {
    backgroundColor: Colors.background.card,
    padding: Spacing.m,
    borderRadius: BorderRadius.circle(40),
  },
});