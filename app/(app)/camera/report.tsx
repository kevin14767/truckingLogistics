// app/camera/report.tsx
import ReportScreen from '@/src/components/camera/ReportScreen';
import { CameraStackParamList } from '@/src/types/camera_navigation';

export default ReportScreen;

declare module 'expo-router' {
  interface RouteParams {
    report: CameraStackParamList['report'];
  }
}