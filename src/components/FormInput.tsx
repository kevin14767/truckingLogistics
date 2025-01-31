import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors, horizontalScale, verticalScale, moderateScale } from '../themes';
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
        <AntDesign name={iconType} size={moderateScale(25)} color={Colors.grey}/>
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
    marginVertical: verticalScale(8),
    width: '100%',
    height: verticalScale(50),
    borderRadius: moderateScale(8),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconStyle: {
    padding: moderateScale(10),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: Colors.offWhite,
    borderRightWidth: 1,
    width: horizontalScale(50),
  },
  input: {
    flex: 1,
    paddingHorizontal: horizontalScale(15),
    fontSize: moderateScale(16),
    color: Colors.darkGrey,
  },
});

export default FormInput;