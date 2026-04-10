import ReactNative from 'react-native';

/**
 * @deprecated use IS_ANDROID
 */

export const android = ReactNative.Platform.OS === 'android';
export const IS_ANDROID = android;
/**
 * @deprecated use IS_IOS
 */
export const ios = ReactNative.Platform.OS === 'ios';
export const IS_IOS = ios;
/**
 * @deprecated use IS_WEB
 */
export const web = ReactNative.Platform.OS === 'web';
export const IS_WEB = web;

export const IS_DEV = (typeof __DEV__ === 'boolean' && __DEV__);
export const IS_TEST = false;
export const IS_PROD = !IS_DEV && !IS_TEST;