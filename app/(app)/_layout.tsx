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
              style={({ pressed }) => [
                styles.customTabButton,
                pressed && styles.customTabButtonPressed
              ]}
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
    backgroundColor: Colors.background.main,
    height: verticalScale(90),
    paddingTop: Spacing.xs,
    paddingBottom: verticalScale(22),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 2,
    borderTopColor: Colors.background.card,
    ...Shadow.medium,
  },
  customTabButton: {
    top: verticalScale(-30),
    justifyContent: 'center',
    alignItems: 'center',
    height: moderateScale(80),
    width: moderateScale(80),
  },
  customTabButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  customTabButtonInner: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: BorderRadius.circle(64),
    backgroundColor: Colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10, // Android shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  cameraIcon: {
    width: moderateScale(32),
    height: moderateScale(32),
    tintColor: Colors.text.primary
  }
});