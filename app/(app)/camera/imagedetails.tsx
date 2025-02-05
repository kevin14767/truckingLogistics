import ImageDetailsScreen from "@/src/components/camera/ImageDetailsScreen";
import { CameraStackParamList } from "@/src/types/camera_navigation";

// Simply export the component as the default export
export default ImageDetailsScreen;

// Declare the screen params for type safety
declare module 'expo-router' {
    interface RouterParams {
      imagedetails: CameraStackParamList['imagedetails'];
    }
  }