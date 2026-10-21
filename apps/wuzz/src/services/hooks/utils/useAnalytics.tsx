import { useCallback } from 'react';
import {
  getAnalytics,
  logEvent as firebaseLogEvent,
  setUserProperty as firebaseSetUserProperty,
} from '@react-native-firebase/analytics';

// Custom hook for Firebase Analytics. Failures are logged and swallowed: analytics
// must never break a screen.
export const useAnalytics = () => {
  // Log an event
  const logEvent = useCallback(
    async (eventName: string, params?: { [key: string]: any }) => {
      try {
        await firebaseLogEvent(getAnalytics(), eventName, params);
      } catch (error) {
        console.error(`Error logging event ${eventName}:`, error);
      }
    },
    [],
  );

  // Set user property
  const setUserProperty = useCallback(
    async (propertyName: string, value: string) => {
      try {
        await firebaseSetUserProperty(getAnalytics(), propertyName, value);
      } catch (error) {
        console.error(`Error setting user property ${propertyName}:`, error);
      }
    },
    [],
  );

  // Log screen view
  const logScreenView = useCallback(
    async (screenName: string, className: string) => {
      try {
        await firebaseLogEvent(getAnalytics(), 'screen_view', {
          screen_name: screenName,
          screen_class: className,
        });
      } catch (error) {
        console.error(`Error logging screen view: ${screenName}`, error);
      }
    },
    [],
  );

  // Log login event
  const logLogin = useCallback(async (method: string) => {
    try {
      await firebaseLogEvent(getAnalytics(), 'login', { method });
    } catch (error) {
      console.error(`Error logging login event with method: ${method}`, error);
    }
  }, []);

  return {
    logEvent,
    logScreenView,
    setUserProperty,
    logLogin,
  };
};
