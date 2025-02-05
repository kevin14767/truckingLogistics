// src/types/camera_navigation.ts
export type VerificationItem = {
  id: string;
  title: string;
  verified: boolean;
};

export type VerificationData = {
  verificationResults: VerificationItem[];
  imageData: any;
};

export type CameraStackParamList = {
  index: undefined;
  imagedetails: { uri: string };
  verification: { imageData: any };
  report: { verificationData: string }; // Serialized VerificationData
};