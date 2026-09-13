// import {useCallback} from 'react';
// import analytics from '@react-native-firebase/analytics';

// // Custom hook for Firebase Analytics
// export const useAnalytics = () => {
//   // Log an event
//   const logEvent = useCallback(
//     async (eventName: string, params?: {[key: string]: any}) => {
//       try {
//         await analytics().logEvent(eventName, params);
//         console.log(`Event logged: ${eventName}`, params);
//       } catch (error) {
//         console.error(`Error logging event ${eventName}:`, error);
//       }
//     },
//     [],
//   );

//   // Set user property
//   const setUserProperty = useCallback(
//     async (propertyName: string, value: string) => {
//       try {
//         await analytics().setUserProperty(propertyName, value);
//         console.log(`User property set: ${propertyName} = ${value}`);
//       } catch (error) {
//         console.error(`Error setting user property ${propertyName}:`, error);
//       }
//     },
//     [],
//   );

//   // Log screen view
//   const logScreenView = useCallback(
//     async (screenName: string, className: string) => {
//       try {
//         await analytics().logEvent('screen_view', {
//           screen_name: screenName,
//           screen_class: className,
//         });
//         console.log(`Screen view logged: ${screenName}, ${className}`);
//       } catch (error) {
//         console.error(`Error logging screen view: ${screenName}`, error);
//       }
//     },
//     [],
//   );

//   // Log login event
//   const logLogin = useCallback(async (method: string) => {
//     try {
//       await analytics().logEvent('login', {method});
//       console.log(`Login event logged with method: ${method}`);
//     } catch (error) {
//       console.error(`Error logging login event with method: ${method}`, error);
//     }
//   }, []);

//   return {
//     logEvent,
//     logScreenView,
//     setUserProperty,
//     logLogin, // Expose logLogin function
//   };
// };
