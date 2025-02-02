import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, TouchableOpacityProps } from 'react-native';
import { windowHeight, windowWidth } from '../themes/Dimensions';
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
    marginTop: 10,
    width: '100%',
    height: windowHeight / 15,
    padding: 10,
    flexDirection: 'row',
    borderRadius: 3,
  },
  iconWrapper: {
    width: 30,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SocialButton;