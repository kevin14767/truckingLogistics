import React from 'react';
import { Text, TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';
import { 
  Colors, 
  verticalScale, 
  horizontalScale, 
  moderateScale, 
  Typography, 
  Spacing, 
  BorderRadius, 
  Shadow 
} from '@/src/themes';

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
    marginVertical: Spacing.m,
    width: '100%',
    height: verticalScale(50),
    backgroundColor: Colors.primary.main,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.medium,
  },
  buttonText: {
    fontSize: Typography.button.fontSize,
    fontWeight: '600',
    color: Colors.text.primary,
    letterSpacing: 0.5,
  },
});

export default FormButton;