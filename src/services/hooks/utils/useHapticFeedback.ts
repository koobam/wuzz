import { useCallback } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const HAPTIC_OPTIONS = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (type === 'light') {
      ReactNativeHapticFeedback.trigger('impactLight', HAPTIC_OPTIONS);
    } else if (type === 'medium') {
      ReactNativeHapticFeedback.trigger('impactMedium', HAPTIC_OPTIONS);
    } else {
      ReactNativeHapticFeedback.trigger('impactHeavy', HAPTIC_OPTIONS);
    }
  }, []);

  return { triggerHaptic };
};

