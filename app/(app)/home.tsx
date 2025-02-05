import React from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, horizontalScale, verticalScale, moderateScale } from '../../src/themes';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';

const ActivityItem = ({ icon, text }: { icon: any; text: string }) => (
  <View style={styles.activityItem}>
    <MaterialCommunityIcons name={icon} size={20} color={Colors.greenThemeColor} />
    <Text style={styles.activityText}>{text}</Text>
  </View>
);

const QuickAccessButton = ({ 
  icon, 
  title, 
  onPress 
}: { 
  icon: any; 
  title: string; 
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.quickButton} onPress={onPress}>
    <MaterialCommunityIcons name={icon} size={30} color={Colors.greenThemeColor} />
    <Text style={styles.quickButtonText}>{title}</Text>
  </TouchableOpacity>
);

const StatItem = ({ 
  icon, 
  value, 
  label 
}: { 
  icon: any; 
  value: string; 
  label: string;
}) => (
  <View style={styles.statItem}>
    <MaterialCommunityIcons name={icon} size={24} color={Colors.greenThemeColor} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>{t('welcomeTitle')}</Text>
          <Text style={styles.subText}>{t('welcomeSubtitle')}</Text>
        </View>

        <Card style={styles.card}>
          <Card.Title 
            title={t('recentActivity')}
            titleStyle={styles.cardTitle}
            left={() => <MaterialCommunityIcons name="history" size={24} color={Colors.greenThemeColor} />}
          />
          <Card.Content>
            <ActivityItem icon="receipt" text={t('lastReceipt')} />
            <ActivityItem icon="wrench" text={t('maintenanceCheck')} />
            <ActivityItem icon="oil" text={t('oilChange')} />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title 
            title={t('quickAccess')}
            titleStyle={styles.cardTitle}
            left={() => <MaterialCommunityIcons name="star" size={24} color={Colors.greenThemeColor} />}
          />
          <Card.Content style={styles.buttonGrid}>
            <QuickAccessButton
              icon="file-document"
              title={t('viewReceipts')}
              onPress={() => router.push("/reports")}
            />
            <QuickAccessButton 
              icon="truck"
              title={t('manageFleet')}
              onPress={() => router.push("/stats")}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title 
            title={t('statistics')}
            titleStyle={styles.cardTitle}
            left={() => <MaterialCommunityIcons name="chart-bar" size={24} color={Colors.greenThemeColor} />}
          />
          <Card.Content style={styles.statsGrid}>
            <StatItem icon="truck" value="15" label={t('activeTrucks')} />
            <StatItem icon="cash" value="$50,000" label={t('income')} />
            <StatItem icon="clock" value="4.5h" label={t('avgDelivery')} />
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black_grey,
    paddingTop: verticalScale(14),
  },
  scrollContainer: {
    padding: horizontalScale(16),
  },
  header: {
    marginVertical: verticalScale(38),
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: verticalScale(8),
  },
  subText: {
    fontSize: moderateScale(16),
    color: Colors.grey,
  },
  card: {
   backgroundColor: Colors.darkGrey, // Or use Colors.darkGrey if you prefer
   marginBottom: verticalScale(16),
   elevation: 4,
 },
  cardTitle: {
    color: Colors.white,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
    gap: horizontalScale(8),
  },
  activityText: {
    fontSize: moderateScale(14),
    color: Colors.grey,
  },
  buttonGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: horizontalScale(12),
  },
  quickButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.darkGrey,
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
  },
  quickButtonText: {
    color: Colors.white,
    marginTop: verticalScale(8),
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: verticalScale(8),
  },
  statLabel: {
    fontSize: moderateScale(12),
    color: Colors.grey,
    marginTop: verticalScale(4),
  },
 });