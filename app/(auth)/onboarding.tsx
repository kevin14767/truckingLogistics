import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import Onboarding from "react-native-onboarding-swiper";
import { useTranslation } from 'react-i18next';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { horizontalScale, verticalScale, moderateScale, Colors } from "../../src/themes";

interface DotsProps {
  selected: boolean;
}

const Dots: React.FC<DotsProps> = ({ selected }) => {
  return (
    <View
      style={[
        styles.dot,
        selected ? styles.selectedDot : styles.unselectedDot,
      ]}
    />
  );
};

const Skip = ({ ...props }) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity style={styles.button} {...props}>
      <Text style={styles.buttonText}>{t('skip', 'Skip')}</Text>
    </TouchableOpacity>
  );
};

const Next = ({ ...props }) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity style={styles.button} {...props}>
      <Text style={styles.buttonText}>{t('next', 'Next')}</Text>
    </TouchableOpacity>
  );
};

const Done = ({ ...props }) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity style={styles.button} {...props}>
      <Text style={styles.buttonText}>{t('getStarted', 'Get Started')}</Text>
    </TouchableOpacity>
  );
};

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleOnboardingComplete = async () => {
    try {
      // Set the onboarding flag in AsyncStorage
      await AsyncStorage.setItem("onboardingCompleted", "true");
      // Navigate to the login screen
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }
  };

  const pages = [
    {
      backgroundColor: Colors.black_grey,
      image: (
        <Image
          source={require("../../assets/icons/trucking_logistics.png")}
          style={styles.image}
        />
      ),
      title: t('onboardingTitle1'),
      subtitle: t('onboardingSubtitle1'),
      titleStyles: styles.title,
      subTitleStyles: styles.subtitle,
    },
    {
      backgroundColor: Colors.darkGrey,
      image: (
        <Image
          source={require("../../assets/icons/pngwing.com(1).png")}
          style={styles.image}
        />
      ),
      title: t('onboardingTitle2'),
      subtitle: t('onboardingSubtitle2'),
      titleStyles: styles.title,
      subTitleStyles: styles.subtitle,
    },
    {
      backgroundColor: Colors.greenThemeColor,
      image: (
        <Image
          source={require("../../assets/icons/pngwing.com(2).png")}
          style={styles.image}
        />
      ),
      title: t('onboardingTitle3'),
      subtitle: t('onboardingSubtitle3'),
      titleStyles: styles.title,
      subTitleStyles: styles.subtitle,
    },
  ];

  return (
    <Onboarding
      SkipButtonComponent={Skip}
      NextButtonComponent={Next}
      DoneButtonComponent={Done}
      DotComponent={Dots}
      onSkip={handleOnboardingComplete} // Call handleOnboardingComplete when skipped
      onDone={handleOnboardingComplete} // Call handleOnboardingComplete when finished
      pages={pages}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(16),
    borderRadius: moderateScale(8),
  },
  buttonText: {
    fontSize: moderateScale(15),
    color: "#ffffff",
    fontWeight: "600",
    letterSpacing: moderateScale(0.1),
  },
  dot: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    marginHorizontal: horizontalScale(5),
    marginBottom: verticalScale(16),
  },
  selectedDot: {
    backgroundColor: "#ffffff",
    transform: [{ scale: 1.2 }],
  },
  unselectedDot: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  image: {
    width: horizontalScale(350),
    height: verticalScale(350),
    resizeMode: "contain",
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: verticalScale(16),
    paddingHorizontal: horizontalScale(20),
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: moderateScale(24),
    paddingHorizontal: horizontalScale(40),
    marginBottom: verticalScale(24),
  },
});