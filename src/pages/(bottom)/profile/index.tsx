import React, { memo, useCallback, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { theme, VStack } from '@components/atoms';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import {
  ProfileHeader,
  ProfileMenuSection,
  ProfileRankCard,
  ProfileUserRow,
  ShareProfileModal,
  useShareProfile,
  PROFILE_WEBVIEW_URLS,
} from '@features/(bottom)/profile';
import type {
  ProfileMenuItemId,
  ProfileType,
  ShareProfileTarget,
} from '@features/(bottom)/profile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/root/root.types';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import ViewShot from 'react-native-view-shot';
import { captureRef } from 'react-native-view-shot';
import Toast from 'react-native-toast-message';

const DEFAULT_STREAK = 7;
const DEFAULT_DISPLAY_NAME = 'Jan Falih Fadhillah';

const Profile: React.FC<ProfileType> = memo((_props: ProfileType) => {
  const { top } = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const shareModalRef = useRef<BottomSheetModal>(null);
  const profileCardRef = useRef<React.ComponentRef<typeof ViewShot> | null>(null);
  const [previewImageUri, setPreviewImageUri] = useState<string | null>(null);

  const {
    shareProfileLink,
    shareToContact,
    shareToInstagramStory,
    shareToFacebookStory,
    shareToWhatsApp,
  } = useShareProfile({
    displayName: DEFAULT_DISPLAY_NAME,
    onError: (target: ShareProfileTarget, err) => {
      if ((err as Error)?.message === 'User did not share') return;
      const errorMessage = (err as Error)?.message;
      const message =
        target === 'contact'
          ? errorMessage === 'Contact permission denied'
            ? 'Izin akses kontak ditolak. Aktifkan di Pengaturan.'
            : errorMessage === 'Nomor telepon tidak valid'
              ? 'Nomor telepon tidak valid.'
              : errorMessage?.includes('daftar kontak')
                ? 'Gagal membuka daftar kontak. Cek izin akses kontak di Pengaturan.'
                : 'Tidak dapat membuka aplikasi Pesan. Pastikan ada aplikasi SMS dan coba lagi.'
          : 'Gagal berbagi. Pastikan aplikasi terpasang.';
      Toast.show({ type: 'error', text1: message });
    },
  });

  const handleStreakPress = useCallback(() => {
    navigation.navigate('streak');
  }, [navigation]);

  const handleSharePress = useCallback(async () => {
    const viewRef = profileCardRef.current;
    if (viewRef) {
      try {
        const uri = await captureRef(viewRef, {
          format: 'jpg',
          quality: 0.9,
          result: 'tmpfile',
        });
        setPreviewImageUri(uri);
      } catch {
        setPreviewImageUri(null);
        Toast.show({ type: 'error', text1: 'Gagal mengambil gambar profil' });
      }
    } else {
      setPreviewImageUri(null);
    }
    shareModalRef.current?.present();
  }, []);

  const handleShareSelectTarget = useCallback(
    async (target: ShareProfileTarget) => {
      if (target === 'general') {
        await shareProfileLink();
        return;
      }
      if (target === 'contact') {
        await shareToContact();
        return;
      }
      if (target === 'whatsapp') {
        await shareToWhatsApp();
        return;
      }
      if (target === 'instagram-story' || target === 'facebook-story') {
        const uri = previewImageUri;
        if (!uri) {
          Toast.show({
            type: 'error',
            text1: 'Gagal mengambil gambar profil',
          });
          return;
        }
        try {
          if (target === 'instagram-story') {
            await shareToInstagramStory(uri);
          } else {
            await shareToFacebookStory(uri);
          }
        } catch {
          Toast.show({
            type: 'error',
            text1: 'Gagal berbagi ke story',
          });
        }
      }
    },
    [
      previewImageUri,
      shareProfileLink,
      shareToContact,
      shareToWhatsApp,
      shareToInstagramStory,
      shareToFacebookStory,
    ],
  );

  const handleDetailLevelPress = useCallback(() => {
    navigation.navigate('leaderboard');
  }, [navigation]);

  const handleMenuPress = useCallback((id: ProfileMenuItemId) => {
    switch (id) {
      case 'referral':
        navigation.navigate('shareProfileQr');
        break;
      case 'alamat':
        // TODO: navigate to Alamat / saved addresses
        break;
      case 'voucher':
        // TODO: navigate to Voucher
        break;
      case 'pesanan':
        // TODO: navigate to Pesanan
        break;
      case 'faq':
        navigation.navigate('webview', {
          uri: PROFILE_WEBVIEW_URLS.faq,
          title: 'FAQ',
        });
        break;
      case 'syarat-ketentuan':
        navigation.navigate('webview', {
          uri: PROFILE_WEBVIEW_URLS.syaratKetentuan,
          title: 'Syarat & Ketentuan',
        });
        break;
      case 'kebijakan-privasi':
        navigation.navigate('webview', {
          uri: PROFILE_WEBVIEW_URLS.kebijakanPrivasi,
          title: 'Kebijakan Privasi',
        });
        break;
      case 'bahasa':
        // TODO: open language picker
        break;
      case 'notifikasi':
        // TODO: navigate to Notifikasi settings
        break;
      case 'logout':
        // TODO: implement logout
        break;
    }
  }, [navigation]);

  return (
    <VStack fill>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        bounces
        style={styles.scrollFill}
      >
        <ProfileHeader topInset={top} scrollY={scrollY} />
        <VStack
          spacing={theme.spacing.large}
          padding={{
            paddingHorizontal: theme.spacing.large,
            paddingTop: theme.spacing.extraLarge,
            paddingBottom: theme.spacing.extraLarge * 2,
          }}
        >
          <VStack spacing={theme.spacing.large}>
            <ProfileRankCard
              onDetailPress={handleDetailLevelPress}
              progress={350}
              progressMax={1000}
            />
            <ProfileUserRow
              onSharePress={handleSharePress}
              onStatsSharePress={handleSharePress}
              onStreakPress={handleStreakPress}
              streak={DEFAULT_STREAK}
            />
          </VStack>
          <ProfileMenuSection onMenuPress={handleMenuPress} />
        </VStack>
      </Animated.ScrollView>
      <ShareProfileModal
        modalRef={shareModalRef}
        previewImageUri={previewImageUri}
        onSelectTarget={handleShareSelectTarget}
      />
    </VStack>
  );
});

const styles = StyleSheet.create({
  viewShot: { margin: 0 },
  scrollFill: { flex: 1 },
});

export default Profile;
