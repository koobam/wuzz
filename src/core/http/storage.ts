// storage.ts
import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV({
    id: 'session.storage',
    encryptionKey: 'janganteng',
});

export const ACCESS_TOKEN_STORAGE = 'user.accessToken';
export const REFRESH_TOKEN_STORAGE = 'user.refreshToken';
export const ONBOARDING_STORAGE = 'apps.onboarding';
export const VERIFICATION_COUNTDOWN_STORAGE = 'verification.countdown.endTime';
