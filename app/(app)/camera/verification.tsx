// app/camera/verification.tsx
import VerificationScreen from '@/src/components/camera/VerificationScreen';
import { CameraStackParamList } from '@/src/types/camera_navigation';

export default VerificationScreen;

declare module 'expo-router' {
  interface RouteParams {
    verification: CameraStackParamList['verification'];
  }
}
