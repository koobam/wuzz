import { MMKV } from 'react-native-mmkv';

// Shared by every app that talks to the same auth API — a single MMKV
// instance and the two token keys the refresh flow (in @wuzz/api) reads
// and writes.
export const storage = new MMKV({
  id: 'session.storage',
  encryptionKey: 'janganteng',
});

export const ACCESS_TOKEN_STORAGE = 'user.accessToken';
export const REFRESH_TOKEN_STORAGE = 'user.refreshToken';
