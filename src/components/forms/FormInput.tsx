import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { 
  Colors, 
  horizontalScale, 
  verticalScale, 
  moderateScale,
  Typography,
  Spacing,
  BorderRadius,
  Shadow
} from '@/src/themes';
import { AntDesign } from '@expo/vector-icons';

interface FormInputProps extends TextInputProps {
  labelValue?: string;
  placeholderText?: string;
  iconType: keyof typeof AntDesign.glyphMap; // Ensures only valid AntDesign icon names are used
}

const FormInput: React.FC<FormInputProps> = ({
  labelValue,
  placeholderText,
  iconType,
  ...rest
}) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.iconStyle}>
        <AntDesign name={iconType} size={moderateScale(25)} color={Colors.text.secondary}/>
      </View>
      <TextInput
        value={labelValue}
        style={styles.input}
        numberOfLines={1}
        placeholder={placeholderText}
        placeholderTextColor="#666"
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: Spacing.s,
    width: '100%',
    height: verticalScale(50),
    borderRadius: BorderRadius.medium,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    overflow: 'hidden',
    ...Shadow.small,
  },
  iconStyle: {
    padding: Spacing.s,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: Colors.offWhite,
    borderRightWidth: 1,
    width: horizontalScale(50),
  },
  input: {
    flex: 1,
    paddingHorizontal: Spacing.m,
    fontSize: Typography.body.large.fontSize,
    color: Colors.background.card,
  },
});

export default FormInput;