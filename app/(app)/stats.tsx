// app/(app)/stats.tsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Feather } from '@expo/vector-icons';
import { Colors, horizontalScale, verticalScale, moderateScale } from '../../src/themes';
import { useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';

interface StatData {
  title: string;
  value: string;
  change: string;
  icon: any;
  isPositive: boolean;
}

interface PerformanceData {
  label: string;
  value: string;
  color: string;
}

export default function StatsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Add your refresh logic here
      setError(null);
    } catch (err) {
      setError('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const statsData: StatData[] = [
    {
      title: t('totalTrips'),
      value: "328",
      change: "+12%",
      icon: "truck",
      isPositive: true
    },
    {
      title: t('activeVehicles'),
      value: "45",
      change: "-3",
      icon: "activity",
      isPositive: false
    },
    {
      title: t('avgDistance'),
      value: "142 km",
      change: "+5%",
      icon: "map",
      isPositive: true
    },
    {
      title: t('fuelUsage'),
      value: "2,450 L",
      change: "-8%",
      icon: "droplet",
      isPositive: true
    }
  ];

  const performanceData: PerformanceData[] = [
    {
      label: t('vehicleMaintenance'),
      value: "92%",
      color: "#4CAF50"
    },
    {
      label: t('routeEfficiency'),
      value: "87%",
      color: "#2196F3"
    },
    {
      label: t('onTimeDelivery'),
      value: "95%",
      color: "#FFC107"
    }
  ];

  const renderLoadingState = () => (
    <View style={styles.statsGrid}>
      {[1, 2, 3, 4].map((_, index) => (
        <View key={index} style={[styles.statCard, { opacity: 0.5 }]} />
      ))}
    </View>
  );

  const renderError = () => error && (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity onPress={onRefresh}>
        <Text style={styles.retryText}>{t('retry')}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStatCard = ({ title, value, change, icon, isPositive }: StatData) => (
    <Animated.View 
      entering={FadeIn.duration(400)}
      style={styles.statCard}
    >
      <View style={styles.statIconContainer}>
        <Feather name={icon} size={moderateScale(20)} color={Colors.white} />
      </View>
      <Text style={styles.statTitle}>
        {title.split(' ').map(word => `${word}\n`)}
      </Text>
      <Text style={styles.statValue}>{value}</Text>
      <View style={styles.statChangeContainer}>
        <Feather 
          name={isPositive ? "arrow-up" : "arrow-down"} 
          size={moderateScale(14)} 
          color={isPositive ? '#4CAF50' : '#F44336'} 
        />
        <Text style={[
          styles.statChange,
          {color: isPositive ? '#4CAF50' : '#F44336'}
        ]}>{change}</Text>
      </View>
    </Animated.View>
  );

  const renderPerformanceBar = ({ label, value, color }: PerformanceData) => (
    <Animated.View 
      entering={FadeIn.duration(600).delay(200)}
      style={styles.performanceItem}
    >
      <View style={styles.performanceHeader}>
        <Text style={styles.performanceLabel}>{label}</Text>
        <Text style={styles.performanceValue}>{value}</Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View style={[
          styles.progressBarFill,
          {
            width: `${parseFloat(value)}%`,
            backgroundColor: color
          }
        ]} />
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('statistics')}</Text>
        <Text style={styles.headerSubtitle}>{t('fleetOverview')}</Text>
      </View>

      <View style={styles.periodSelector}>
        <TouchableOpacity 
          style={[styles.periodTab, selectedPeriod === 'week' && styles.periodTabActive]}
          onPress={() => setSelectedPeriod('week')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'week' && styles.periodTextActive]}>
            {t('week')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.periodTab, selectedPeriod === 'month' && styles.periodTabActive]}
          onPress={() => setSelectedPeriod('month')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'month' && styles.periodTextActive]}>
            {t('month')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.periodTab, selectedPeriod === 'year' && styles.periodTabActive]}
          onPress={() => setSelectedPeriod('year')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'year' && styles.periodTextActive]}>
            {t('year')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderError()}
        {isLoading ? renderLoadingState() : (
          <>
            <View style={styles.statsGrid}>
              {statsData.map((stat, index) => (
                <TouchableOpacity 
                  key={index}
                  onPress={() => router.push({
                    pathname: "/home",
                    params: { type: stat.title }
                  })}
                >
                  {renderStatCard(stat)}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.performanceContainer}>
              <Text style={styles.sectionTitle}>{t('performanceMetrics')}</Text>
              {performanceData.map((item, index) => (
                <View key={index} style={styles.performanceWrapper}>
                  {renderPerformanceBar(item)}
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black_grey,
  },
  header: {
    padding: moderateScale(24),
  },
  headerTitle: {
    fontSize: moderateScale(34),
    fontWeight: '700',
    color: Colors.white,
    marginBottom: verticalScale(4),
  },
  headerSubtitle: {
    fontSize: moderateScale(16),
    color: Colors.grey,
    marginTop: verticalScale(4),
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(24),
    marginBottom: verticalScale(24),
    gap: horizontalScale(8),
  },
  periodTab: {
    flex: 1,
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    borderRadius: moderateScale(12),
    backgroundColor: Colors.darkGrey,
  },
  periodTabActive: {
    backgroundColor: Colors.greenThemeColor,
  },
  periodText: {
    color: Colors.grey,
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  periodTextActive: {
    color: Colors.white,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: horizontalScale(20),
    gap: horizontalScale(12),
  },
  statCard: {
    width: horizontalScale(155),
    backgroundColor: Colors.darkGrey,
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    paddingVertical: moderateScale(20),
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: Colors.greenThemeColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  statTitle: {
    color: Colors.grey,
    fontSize: moderateScale(14),
    lineHeight: moderateScale(16),
  },
  statValue: {
    color: Colors.white,
    fontSize: moderateScale(28),
    fontWeight: '700',
    marginVertical: verticalScale(8),
  },
  statChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(4),
  },
  statChange: {
    marginLeft: horizontalScale(4),
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  performanceContainer: {
    padding: moderateScale(24),
    marginTop: verticalScale(14),
    borderTopWidth: 1,
    borderTopColor: Colors.darkGrey,
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: Colors.white,
    marginBottom: verticalScale(16),
  },
  performanceWrapper: {
    marginBottom: verticalScale(16),
  },
  performanceItem: {
    marginBottom: verticalScale(12),
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },
  performanceLabel: {
    color: Colors.white,
    fontSize: moderateScale(14),
    
  },
  performanceValue: {
    color: Colors.grey,
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  progressBarBackground: {
    height: verticalScale(6),
    backgroundColor: Colors.darkGrey,
    borderRadius: moderateScale(3),
  },
  progressBarFill: {
    height: '100%',
    borderRadius: moderateScale(3),
    overflow: 'hidden',
  },
  errorContainer: {
    padding: moderateScale(20),
    alignItems: 'center',
  },
  errorText: {
    color: '#F44336',
    fontSize: moderateScale(14),
    marginBottom: verticalScale(8),
  },
  retryText: {
    color: Colors.greenThemeColor,
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
});