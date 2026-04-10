import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';
import { HStack, Pressable, Text, theme, VStack } from '@components/atoms';
import { ArrowLeft2, Copy } from 'iconsax-react-native';
import {
  PROFILE_SHARE_URL,
  REFERRAL_CODE_PLACEHOLDER,
} from '@features/(bottom)/profile/utils';
import type { ReferralItem } from '@features/(bottom)/profile';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/root/root.types';
import Toast from 'react-native-toast-message';
import { ScrollView } from 'react-native';

type ShareProfileQRScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'shareProfileQr'
>;

const QR_SIZE = 220;
const PADDING = 24;
const REFERRAL_AVATAR_SIZE = 40;

/** Mock list – ganti dengan data dari API. */
const MOCK_REFERRAL_LIST: ReferralItem[] = [
  { id: '1', name: 'Budi Santoso', joinedAt: '2025-03-01', status: 'active' },
  { id: '2', name: 'Siti Aminah', joinedAt: '2025-02-28', status: 'active' },
  { id: '3', name: 'Ahmad Wijaya', joinedAt: '2025-02-25', status: 'pending' },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatJoinedAt(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

const ShareProfileQRScreen = memo(function ShareProfileQRScreen({
  navigation,
}: ShareProfileQRScreenProps) {
  const { top, bottom } = useSafeAreaInsets();

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const referralCode = REFERRAL_CODE_PLACEHOLDER;
  const shareUrlWithRef = useMemo(
    () => `${PROFILE_SHARE_URL}?ref=${referralCode}`,
    [referralCode],
  );

  const handleCopyCode = useCallback(() => {
    Clipboard.setString(referralCode);
    Toast.show({ type: 'success', text1: 'Kode referral disalin' });
  }, [referralCode]);

  const contentContainerStyle = useMemo(
    () => ({
      paddingBottom: bottom + theme.spacing.extraLarge * 2,
    }),
    [bottom],
  );

  return (
    <VStack fill backgroundColor={theme.pallate.neutral['01']}>
      <HStack
        padding={{
          paddingTop: top + theme.spacing.standard,
          paddingBottom: theme.spacing.standard,
          paddingHorizontal: theme.spacing.large,
        }}
        items="center"
        spacing={theme.spacing.standard}
      >
        <Pressable
          onPress={handleBackPress}
          padding={{
            paddingVertical: theme.spacing.small,
            paddingHorizontal: theme.spacing.small,
          }}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
        >
          <ArrowLeft2
            size={24}
            color={theme.pallate.neutral['05']}
            variant="Linear"
          />
        </Pressable>
        <Text
          type="s2"
          weight="bold"
          color={theme.pallate.neutral['05']}
        >
          Bagikan profil
        </Text>
      </HStack>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
      >
        <VStack
          items="center"
          padding={{ paddingHorizontal: theme.spacing.extraLarge }}
        >
          <VStack
            items="center"
            justify="center"
            padding={PADDING}
            borderRadius={20}
            backgroundColor={theme.pallate.neutral['01']}
            style={styles.qrWrap}
          >
            <QRCode
              value={shareUrlWithRef}
              size={QR_SIZE}
              color={theme.pallate.neutral['05']}
              backgroundColor={theme.pallate.neutral['01']}
            />
          </VStack>
          <Text
            type="b2"
            color={theme.pallate.neutral['04']}
            style={styles.hint}
          >
            Scan QR code untuk melihat profil saya
          </Text>

          {/* Referral code */}
          <VStack
            width="100%"
            margin={{ marginTop: theme.spacing.extraLarge }}
            spacing={theme.spacing.small}
          >
            <Text
              type="l2"
              color={theme.pallate.neutral['04']}
            >
              Kode referral kamu
            </Text>
            <HStack
              items="center"
              justify="space-between"
              padding={{
                paddingVertical: theme.spacing.standard,
                paddingHorizontal: theme.spacing.large,
              }}
              borderRadius={12}
              backgroundColor={theme.pallate.neutral['02']}
            >
              <Text
                type="s2"
                weight="bold"
                color={theme.pallate.primary['03']}
                style={styles.codeText}
              >
                {referralCode}
              </Text>
              <Pressable
                onPress={handleCopyCode}
                padding={{
                  paddingVertical: theme.spacing.small,
                  paddingHorizontal: theme.spacing.standard,
                }}
                borderRadius={8}
                backgroundColor={theme.pallate.primary['03']}
                accessibilityRole="button"
                accessibilityLabel="Salin kode referral"
              >
                <HStack items="center" spacing={theme.spacing.tiny}>
                  <Copy
                    size={18}
                    color={theme.pallate.neutral['01']}
                    variant="Linear"
                  />
                  <Text type="l2" weight="medium" color={theme.pallate.neutral['01']}>
                    Salin
                  </Text>
                </HStack>
              </Pressable>
            </HStack>
          </VStack>

          {/* Daftar referral */}
          <VStack
            width="100%"
            margin={{ marginTop: theme.spacing.extraLarge }}
            spacing={theme.spacing.standard}
          >
            <Text
              type="b1"
              weight="semibold"
              color={theme.pallate.neutral['05']}
            >
              Daftar referral
            </Text>
            <VStack
              borderRadius={12}
              backgroundColor={theme.pallate.neutral['02']}
              spacing={0}
              style={styles.referralListWrap}
            >
              {MOCK_REFERRAL_LIST.length === 0 ? (
                <VStack
                  padding={theme.spacing.extraLarge}
                  items="center"
                  justify="center"
                >
                  <Text
                    type="l2"
                    color={theme.pallate.neutral['04']}
                    align="center"
                  >
                    Belum ada yang mendaftar dengan kode kamu
                  </Text>
                </VStack>
              ) : (
                MOCK_REFERRAL_LIST.map((item, index) => (
                  <HStack
                    key={item.id}
                    items="center"
                    spacing={theme.spacing.standard}
                    padding={{
                      paddingVertical: theme.spacing.standard,
                      paddingHorizontal: theme.spacing.large,
                    }}
                    style={
                      index < MOCK_REFERRAL_LIST.length - 1
                        ? styles.referralRowBorder
                        : undefined
                    }
                  >
                    <VStack
                      width={REFERRAL_AVATAR_SIZE}
                      height={REFERRAL_AVATAR_SIZE}
                      borderRadius={REFERRAL_AVATAR_SIZE / 2}
                      backgroundColor={theme.pallate.primary['02']}
                      items="center"
                      justify="center"
                    >
                      <Text
                        type="b2"
                        weight="semibold"
                        color={theme.pallate.primary['03']}
                      >
                        {getInitials(item.name)}
                      </Text>
                    </VStack>
                    <VStack spacing={theme.spacing.tiny} fill>
                      <Text
                        type="b2"
                        weight="medium"
                        color={theme.pallate.neutral['05']}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <Text
                        type="l2"
                        color={theme.pallate.neutral['04']}
                      >
                        Bergabung {formatJoinedAt(item.joinedAt)}
                      </Text>
                    </VStack>
                  </HStack>
                ))
              )}
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
});

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  qrWrap: {
    borderWidth: 1,
    borderColor: theme.pallate.neutral['03'],
  },
  hint: {
    marginTop: theme.spacing.extraLarge,
    textAlign: 'center',
  },
  codeText: {
    letterSpacing: 2,
  },
  referralListWrap: {
    overflow: 'hidden' as const,
  },
  referralRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.pallate.neutral['03'],
  },
});

export default ShareProfileQRScreen;
