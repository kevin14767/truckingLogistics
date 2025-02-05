import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CameraStackParamList } from '@/src/types/camera_navigation';
import { Colors, moderateScale, verticalScale, horizontalScale } from '../../../src/themes';

export default function ImageDetailsScreen() {
  // Type the params using the CameraStackParamList
  const { uri } = useLocalSearchParams<CameraStackParamList['imagedetails']>();
  const router = useRouter();

  const handleVerification = () => {
    const imageData = {
      uri,
      // Add any additional image data you want to pass
    };
    
    router.push({
      pathname: '/camera/verification',
      params: { imageData }
    });
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri }} 
        style={styles.image}
        resizeMode="contain"
      />
      <TouchableOpacity 
        style={styles.verifyButton}
        onPress={handleVerification}
      >
        <Text style={styles.buttonText}>Verify Image</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black_grey,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '60%',
    marginTop: verticalScale(50),
  },
  verifyButton: {
    position: 'absolute',
    bottom: verticalScale(140),
    backgroundColor: Colors.greenThemeColor,
    padding: moderateScale(15),
    borderRadius: moderateScale(10),
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  }
});