import React from 'react';
import { Text, TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';
import { Colors, horizontalScale, verticalScale, moderateScale } from '../themes';

interface FormButtonProps extends TouchableOpacityProps {
  buttonTitle: string;
  backgroundColor?: string;
}

const FormButton: React.FC<FormButtonProps> = ({ 
  buttonTitle, 
  backgroundColor, 
  ...rest 
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.buttonContainer, 
        backgroundColor && { backgroundColor }
      ]} 
      {...rest}
    >
      <Text style={styles.buttonText}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: verticalScale(10),
    width: '100%',
    height: verticalScale(50),
    backgroundColor: Colors.greenThemeColor,
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: Colors.white,
    letterSpacing: 0.5,
  },
});

export default FormButton;