import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, TouchableOpacityProps } from 'react-native';
import { 
  windowHeight, 
  windowWidth,
  moderateScale,
  Spacing,
  Typography,
  BorderRadius
} from '@/src/themes';
import { FontAwesome } from '@expo/vector-icons';

interface SocialButtonProps extends TouchableOpacityProps {
  buttonTitle: string;
  btnType: keyof typeof FontAwesome.glyphMap; // Ensures only valid FontAwesome icons
  color: string;
  backgroundColor: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  buttonTitle,
  btnType,
  color,
  backgroundColor,
  ...rest
}) => {
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, {backgroundColor}]}
      {...rest}>
      <View style={styles.iconWrapper}>
        <FontAwesome name={btnType} style={styles.icon} size={22} color={color} />
      </View>
      <View style={styles.btnTxtWrapper}>
        <Text style={[styles.buttonText, {color}]}>{buttonTitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: Spacing.s,
    width: '100%',
    height: windowHeight / 15,
    padding: Spacing.s,
    flexDirection: 'row',
    borderRadius: BorderRadius.small,
  },
  iconWrapper: {
    width: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontWeight: 'bold',
  },
  btnTxtWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: Typography.button.fontSize,
    fontWeight: 'bold',
  },
});

export default SocialButton;