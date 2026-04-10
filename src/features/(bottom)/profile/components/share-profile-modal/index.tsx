import React, { memo, useCallback, useMemo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HStack, Pressable, Text, theme, VStack } from '@components/atoms';
import { People, Send2 } from 'iconsax-react-native';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandWhatsapp,
} from 'tabler-icons-react-native';
import type { ShareProfileTarget } from '../../hooks/useShareProfile';
import type { ShareProfileModalProps, ShareProfileOption } from './share-profile-modal.types';

const ICON_SIZE = 24;

const SHARE_OPTIONS: ShareProfileOption[] = [
  {
    id: 'general',
    label: 'Bagikan profil',
    icon: <Send2 size={ICON_SIZE} color={theme.pallate.primary['03']} variant="Linear" />,
  },
  {
    id: 'contact',
    label: 'Kirim ke kontak',
    icon: <People size={ICON_SIZE} color={theme.pallate.neutral['05']} variant="Linear" />,
  },
  {
    id: 'instagram-story',
    label: 'Instagram Story',
    icon: (
      <IconBrandInstagram size={ICON_SIZE} color={theme.pallate.neutral['05']} />
    ),
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: (
      <IconBrandWhatsapp size={ICON_SIZE} color={theme.pallate.neutral['05']} />
    ),
  },
  {
    id: 'facebook-story',
    label: 'Facebook Story',
    icon: (
      <IconBrandFacebook size={ICON_SIZE} color={theme.pallate.neutral['05']} />
    ),
  },
];

const PREVIEW_ASPECT = 16 / 9;
const PREVIEW_MAX_HEIGHT = 180;
const PREVIEW_BORDER_RADIUS = 12;

const renderBackdrop = (
  props: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps,
) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />;

export const ShareProfileModal = memo(function ShareProfileModal({
  modalRef,
  previewImageUri,
  onSelectTarget,
}: ShareProfileModalProps) {
  const { bottom, top } = useSafeAreaInsets();

  const handleSelect = useCallback(
    (target: ShareProfileTarget) => {
      modalRef.current?.dismiss();
      onSelectTarget(target);
    },
    [modalRef, onSelectTarget],
  );

  const renderOption = useCallback(
    (item: ShareProfileOption) => (
      <Pressable
        key={item.id}
        onPress={() => handleSelect(item.id)}
        padding={{
          paddingVertical: theme.spacing.standard,
          paddingHorizontal: theme.spacing.large,
        }}
        borderRadius={12}
        backgroundColor={theme.pallate.neutral['02']}
        margin={{ marginBottom: theme.spacing.small }}
        accessibilityRole="button"
        accessibilityLabel={item.label}
      >
        <HStack items="center" spacing={theme.spacing.standard}>
          {item.icon}
          <Text type="b1" weight="medium" color={theme.pallate.neutral['05']}>
            {item.label}
          </Text>
        </HStack>
      </Pressable>
    ),
    [handleSelect],
  );

  const contentContainerStyle = useMemo(
    () => ({
      paddingBottom: bottom + theme.spacing.extraLarge,
      paddingHorizontal: theme.spacing.large,
    }),
    [bottom],
  );

  const previewSection = useMemo(() => {
    if (!previewImageUri) return null;
    const source = { uri: previewImageUri.startsWith('file') ? previewImageUri : `file://${previewImageUri}` };
    return (
      <View style={styles.previewWrap}>
        <Image
          source={source}
          resizeMode="cover"
          style={styles.previewImage}
        />
      </View>
    );
  }, [previewImageUri]);

  const listContent = useMemo(
    () => (
      <>
        {SHARE_OPTIONS.map(renderOption)}
      </>
    ),
    [renderOption],
  );

  return (
    <BottomSheetModal
      ref={modalRef}
      enableDynamicSizing
      enablePanDownToClose
      topInset={top + theme.spacing.standard}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetScrollView
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
      >
        <VStack spacing={theme.spacing.small} padding={{ paddingTop: theme.spacing.small }}>
          <Text
            type="s3"
            weight="bold"
            color={theme.pallate.neutral['05']}
            margin={{ marginBottom: theme.spacing.tiny }}
          >
            Bagikan profil
          </Text>
          <Text
            type="l2"
            color={theme.pallate.neutral['04']}
            margin={{ marginBottom: theme.spacing.standard }}
          >
            Pilih cara berbagi profil kamu
          </Text>
          {previewSection}
          <Text
            type="l2"
            color={theme.pallate.neutral['04']}
            margin={{ marginTop: theme.spacing.standard, marginBottom: theme.spacing.small }}
          >
            Bagikan ke
          </Text>
          {listContent}
        </VStack>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  background: {
    backgroundColor: theme.pallate.neutral['01'],
  },
  handle: {
    backgroundColor: theme.pallate.neutral['03'],
  },
  previewWrap: {
    width: '100%',
    aspectRatio: PREVIEW_ASPECT,
    maxHeight: PREVIEW_MAX_HEIGHT,
    borderRadius: PREVIEW_BORDER_RADIUS,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export type { ShareProfileModalProps, ShareProfileOption } from './share-profile-modal.types';
