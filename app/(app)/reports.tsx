// app/(app)/reports.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert
} from "react-native";
import { Feather } from '@expo/vector-icons';
import { Colors, horizontalScale, verticalScale, moderateScale } from '../../src/themes';
import { useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';
import { DocumentStorage } from '@/src/services/DocumentStorage';
import { Receipt } from '@/src/types/ReceiptInterfaces';

export default function Reports() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load receipts on initial render
  useEffect(() => {
    loadReceipts();
  }, []);

  // Function to load receipts from storage
  const loadReceipts = async () => {
    try {
      const docs = await DocumentStorage.getAllReceipts();
      setReceipts(docs);
    } catch (error) {
      console.error('Error loading receipts:', error);
      Alert.alert(
        getTranslation('error', 'Error'),
        getTranslation('errorLoadingReceipts', 'Failed to load receipts')
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadReceipts();
    setRefreshing(false);
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // Get appropriate icon for receipt type
  const getReceiptTypeIcon = (type: string) => {
    switch (type) {
      case 'Fuel':
        return 'droplet';
      case 'Maintenance':
        return 'tool';
      default:
        return 'file-text';
    }
  };

  // Safe translation helper with fallback
  const getTranslation = (key: string, defaultValue: string): string => {
    const result = t(key, defaultValue);
    return result || defaultValue; // Fallback if t() returns null/undefined
  };

  // Safely get translation for a nested property
  const safeTranslate = (text: string | undefined, fallback: string): string => {
    if (!text) return fallback;
    
    try {
      return getTranslation(text.toLowerCase(), text);
    } catch (e) {
      return text;
    }
  };

  // Render a receipt card
  const renderReceiptCard = ({ item }: { item: Receipt }) => (
    <TouchableOpacity 
      style={styles.receiptCard}
      onPress={() => handleReceiptPress(item)}
    >
      <View style={styles.receiptHeader}>
        <View style={styles.receiptType}>
          <Feather 
            name={getReceiptTypeIcon(item.type)} 
            size={moderateScale(20)} 
            color={Colors.white} 
          />
          <Text style={styles.receiptTypeText}>
            {safeTranslate(item.type, item.type)}
          </Text>
        </View>
        <Text style={[
          styles.receiptStatus,
          { color: item.status === 'Approved' ? '#4CAF50' : '#FFC107' }
        ]}>
          {safeTranslate(item.status, item.status)}
        </Text>
      </View>

      <View style={styles.receiptDetails}>
        <Text style={styles.receiptAmount}>{item.amount}</Text>
        <Text style={styles.receiptVehicle}>{item.vehicle}</Text>
        {item.vendorName && <Text style={styles.receiptVendor}>{item.vendorName}</Text>}
        
        {/* Preview of extracted text */}
        {item.extractedText && (
          <Text style={styles.extractedTextPreview} numberOfLines={2}>
            {item.extractedText.substring(0, 100)}{item.extractedText.length > 100 ? '...' : ''}
          </Text>
        )}
      </View>

      <View style={styles.receiptFooter}>
        <Text style={styles.receiptDate}>
          {formatDate(item.date)}
        </Text>
        <Feather name="chevron-right" size={moderateScale(20)} color={Colors.grey} />
      </View>
    </TouchableOpacity>
  );

  // Handle receipt press - open report screen
  const handleReceiptPress = (receipt: Receipt) => {
    router.push({
      pathname: '/camera/report',
      params: { receipt: JSON.stringify(receipt) }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{getTranslation('receipts', 'Receipts')}</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push("/camera")}
        >
          <Feather name="plus" size={moderateScale(24)} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchButton}>
          <Feather name="search" size={moderateScale(20)} color={Colors.grey} />
          <Text style={styles.searchText}>
            {getTranslation('searchReceipts', 'Search receipts...')}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.greenThemeColor} />
        </View>
      ) : receipts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="file-text" size={moderateScale(60)} color={Colors.grey} />
          <Text style={styles.emptyText}>
            {getTranslation('noReceipts', 'No receipts found')}
          </Text>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => router.push("/camera")}
          >
            <Text style={styles.scanButtonText}>
              {getTranslation('scanReceipt', 'Scan Receipt')}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={receipts}
          renderItem={renderReceiptCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.receiptsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={[Colors.greenThemeColor]}
              tintColor={Colors.greenThemeColor}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black_grey,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(24),
  },
  headerTitle: {
    fontSize: moderateScale(34),
    fontWeight: '700',
    color: Colors.white,
  },
  addButton: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: Colors.greenThemeColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: horizontalScale(24),
    marginBottom: verticalScale(16),
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkGrey,
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
  },
  searchText: {
    color: Colors.grey,
    marginLeft: horizontalScale(8),
    fontSize: moderateScale(16),
  },
  receiptsList: {
    padding: moderateScale(24),
    paddingBottom: verticalScale(100), // Extra padding for the tab bar
  },
  receiptCard: {
    backgroundColor: Colors.darkGrey,
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginBottom: verticalScale(16),
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  receiptType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiptTypeText: {
    color: Colors.white,
    fontSize: moderateScale(16),
    fontWeight: '500',
    marginLeft: horizontalScale(8),
  },
  receiptStatus: {
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  receiptDetails: {
    marginBottom: verticalScale(12),
  },
  receiptAmount: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: Colors.white,
    marginBottom: verticalScale(4),
  },
  receiptVehicle: {
    fontSize: moderateScale(14),
    color: Colors.grey,
    marginBottom: verticalScale(2),
  },
  receiptVendor: {
    fontSize: moderateScale(14),
    color: Colors.grey,
    marginBottom: verticalScale(4),
  },
  extractedTextPreview: {
    fontSize: moderateScale(12),
    color: Colors.grey,
    fontStyle: 'italic',
    marginTop: verticalScale(4),
  },
  receiptFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptDate: {
    fontSize: moderateScale(14),
    color: Colors.grey,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(24),
  },
  emptyText: {
    marginTop: verticalScale(16),
    fontSize: moderateScale(18),
    color: Colors.grey,
    textAlign: 'center',
  },
  scanButton: {
    marginTop: verticalScale(24),
    backgroundColor: Colors.greenThemeColor,
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(24),
    borderRadius: moderateScale(12),
  },
  scanButtonText: {
    color: Colors.white,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});