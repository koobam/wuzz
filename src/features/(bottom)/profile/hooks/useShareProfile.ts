import { useCallback } from 'react';
import { Platform, Share } from 'react-native';
import ShareModule from 'react-native-share';
import { PROFILE_SHARE_MESSAGE, PROFILE_SHARE_URL } from '../utils/constants';

const getFacebookAppId = (): string | undefined => {
  try {
    const Config = require('react-native-config').default;
    return (Config as { FACEBOOK_APP_ID?: string }).FACEBOOK_APP_ID;
  } catch {
    return undefined;
  }
};

export type ShareProfileTarget =
  | 'general'
  | 'instagram-story'
  | 'whatsapp'
  | 'facebook-story';

export interface UseShareProfileOptions {
  /** Optional display name for the share message. */
  displayName?: string;
  /** Called when share fails (e.g. user cancelled or app not installed). */
  onError?: (target: ShareProfileTarget, error: unknown) => void;
  /** Called when share succeeds. */
  onSuccess?: (target: ShareProfileTarget) => void;
}

export const useShareProfile = (options: UseShareProfileOptions = {}) => {
  const { displayName, onError, onSuccess } = options;

  const message = displayName
    ? `${displayName} mengundangmu ke Wuzz. ${PROFILE_SHARE_MESSAGE}`
    : PROFILE_SHARE_MESSAGE;
  const shareUrl = PROFILE_SHARE_URL;

  const shareProfileLink = useCallback(async () => {
    try {
      await Share.share({
        message: `${message}\n${shareUrl}`,
        url: Platform.OS === 'ios' ? shareUrl : undefined,
        title: 'Bagikan profil Wuzz',
      });
      onSuccess?.('general');
    } catch (err) {
      if ((err as { message?: string })?.message !== 'User did not share') {
        onError?.('general', err);
      }
    }
  }, [message, shareUrl, onError, onSuccess]);

  const shareToInstagramStory = useCallback(
    async (imageUri: string) => {
      const appId = getFacebookAppId();
      if (!appId) {
        onError?.('instagram-story', new Error('FACEBOOK_APP_ID not configured'));
        return;
      }
      try {
        await ShareModule.shareSingle({
          social: ShareModule.Social.INSTAGRAM_STORIES as any,
          backgroundImage: imageUri,
          appId,
          backgroundTopColor: '#906df4',
          backgroundBottomColor: '#837DF4',
        });
        onSuccess?.('instagram-story');
      } catch (err) {
        onError?.('instagram-story', err);
      }
    },
    [onError, onSuccess],
  );

  const shareToFacebookStory = useCallback(
    async (imageUri: string) => {
      const appId = getFacebookAppId();
      if (!appId) {
        onError?.('facebook-story', new Error('FACEBOOK_APP_ID not configured'));
        return;
      }
      try {
        await ShareModule.shareSingle({
          social: ShareModule.Social.FACEBOOK_STORIES as any,
          backgroundImage: imageUri,
          appId,
          backgroundTopColor: '#906df4',
          backgroundBottomColor: '#837DF4',
        });
        onSuccess?.('facebook-story');
      } catch (err) {
        onError?.('facebook-story', err);
      }
    },
    [onError, onSuccess],
  );

  const shareToWhatsApp = useCallback(async () => {
    try {
      await ShareModule.shareSingle({
        social: ShareModule.Social.WHATSAPP as any,
        message: `${message}\n${shareUrl}`,
        url: shareUrl,
        title: 'Bagikan profil Wuzz',
      });
      onSuccess?.('whatsapp');
    } catch (err) {
      onError?.('whatsapp', err);
    }
  }, [message, shareUrl, onError, onSuccess]);

  return {
    shareProfileLink,
    shareToInstagramStory,
    shareToFacebookStory,
    shareToWhatsApp,
  };
};
