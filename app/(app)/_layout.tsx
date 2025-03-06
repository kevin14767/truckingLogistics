// app/(app)/_layout.tsx
import { Tabs } from 'expo-router';
import { Image, View, Pressable, StyleSheet } from 'react-native';
import { 
  Colors, 
  Typography, 
  Spacing, 
  BorderRadius,
  Shadow,
  moderateScale, 
  verticalScale, 
  horizontalScale 
} from '@/src/themes';
import TabBarIcon from '@/src/components/TabBarIcon';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused}
              name={t('home')}
              iconSource={require('../../assets/icons/home.png')}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused}
              name={t('reports')}
              iconSource={require('../../assets/icons/document-signed.png')}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="camera"
        options={{
          tabBarIcon: () => (
            <Image
              source={require('../../assets/icons/camera.png')}
              style={styles.cameraIcon}
            />
          ),
          tabBarButton: (props) => (
            <Pressable
              style={styles.customTabButton}
              onPress={props.onPress}
            >
              <View style={styles.customTabButtonInner}>
                {props.children}
              </View>
            </Pressable>
          ),
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused}
              name={t('stats')}
              iconSource={require('../../assets/icons/stats.png')}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon 
              focused={focused}
              name={t('settings')}
              iconSource={require('../../assets/icons/settings-sliders.png')}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.background.main, // Updated from Colors.black_grey
    height: verticalScale(90),
    paddingTop: Spacing.xs, // Updated from verticalScale(4)
    paddingBottom: verticalScale(22),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 2,
    borderTopColor: Colors.background.card, // Updated from Colors.darkGrey
    ...Shadow.medium, // Using predefined shadow instead of custom values
  },
  customTabButton: {
    top: verticalScale(-30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  customTabButtonInner: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: BorderRadius.circle(64), // Using theme function instead of hardcoded value
    backgroundColor: Colors.primary.main, // Updated from Colors.greenThemeColor
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.large, // Using predefined shadow
  },
  cameraIcon: {
    width: moderateScale(32),
    height: moderateScale(32),
    tintColor: Colors.text.primary // Updated from Colors.white
  }
});