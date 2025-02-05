import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { Colors, horizontalScale, verticalScale, moderateScale } from '../../src/themes';
import { MaterialIcons } from '@expo/vector-icons';

export default function PostScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  const handleSelectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image selection error:", error);
    }
  };

  const handleOpenCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Camera error:", error);
    }
  };

  const handleProcess = () => {
    if (selectedImage) {
      router.push({ pathname: "/home", params: { uri: selectedImage }});
    }
  };

  return (
    <View style={styles.container}>
      {selectedImage ? (
        <>
          <Image
            source={{ uri: selectedImage }}
            style={styles.imagePreview}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={() => setSelectedImage(null)} style={styles.retakeButton}>
            <MaterialIcons name="refresh" size={24} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleProcess} style={styles.processImage}>
            <Text style={styles.buttonText}>Process Image</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity onPress={handleOpenCamera} style={styles.button}>
            <MaterialIcons name="camera-alt" size={24} color={Colors.white} />
            <Text style={styles.buttonText}>Open Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSelectImage} style={styles.button}>
            <MaterialIcons name="photo-library" size={24} color={Colors.white} />
            <Text style={styles.buttonText}>Open Photo Library</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black_grey,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.greenThemeColor,
    padding: moderateScale(15),
    borderRadius: moderateScale(10),
    marginHorizontal: horizontalScale(10),
    flex: 1,
  },
  imagePreview: {
    width: '100%',
    height: '65%', // Keep the original height
    
  },
  processImage: {
    backgroundColor: Colors.greenThemeColor,
    padding: moderateScale(15),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginTop: verticalScale(20),
  },
  retakeButton: {
    position: 'absolute',
    top: verticalScale(60),
    right: horizontalScale(20),
    backgroundColor: Colors.greenThemeColor,
    padding: moderateScale(10),
    borderRadius: moderateScale(20),
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
    marginLeft: horizontalScale(10),
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: verticalScale(130),
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: horizontalScale(10),
  },
});
