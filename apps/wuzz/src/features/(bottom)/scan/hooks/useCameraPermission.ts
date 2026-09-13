import { useCameraPermission as useVisionCameraPermission } from 'react-native-vision-camera';

/**
 * Wraps Vision Camera's useCameraPermission.
 * Returns permission status and request function for the scan screen.
 */
export const useCameraPermission = () => {
  const { hasPermission, requestPermission } = useVisionCameraPermission();
  return { hasPermission, requestPermission };
};
