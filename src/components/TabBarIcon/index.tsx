import { View, Image, Text, StyleSheet } from 'react-native';
import { Colors, moderateScale, verticalScale, horizontalScale } from '../../themes';

interface TabBarIconProps {
  focused: boolean;
  name: string;
  iconSource: any;
  size?: number;
}

export const TabBarIcon = ({
  focused,
  name,
  iconSource,
  size = moderateScale(26)  // Increased base size
}: TabBarIconProps) => (
  <View style={[
    styles.tabIconContainer,
    focused && styles.tabIconContainerActive
  ]}><Image
      source={iconSource}
      style={[
        styles.tabIcon,
        { width: size, height: size },
        focused && styles.tabIconActive
      ]}
    />
    <Text 
      style={[styles.tabLabel, focused && styles.tabLabelActive]}
      numberOfLines={1}
      ellipsizeMode="tail"
      maxFontSizeMultiplier={1} // Prevents text scaling from accessibility settings
    >{name}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: verticalScale(12),
    gap: verticalScale(6),
    width: horizontalScale(50), // Narrower width
    height: verticalScale(45), // Control total height
  },
  tabIconContainerActive: {
    transform: [{ scale: 1.1 }],
  },
  tabIcon: {
    tintColor: '#6c6c6e',
    opacity: 0.8,
  },
  tabIconActive: {
    tintColor: Colors.greenThemeColor,
    opacity: 1,
  },
  tabLabel: {
    fontSize: moderateScale(9),
    marginTop: verticalScale(2),
    color: Colors.grey,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: moderateScale(11), // Tight line height
    maxWidth: '100%',
  },
  tabLabelActive: {
    color: Colors.greenThemeColor,
  },
});

export default TabBarIcon;