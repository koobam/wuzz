import React from 'react';
import Camera from './camera';
import { Box, HStack, Pressable, Text, theme, VStack } from '@components/atoms';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconBolt, IconSwipe, IconX } from 'tabler-icons-react-native';
import { Flash, Refresh2, RefreshCircle } from 'iconsax-react-native';
import { FlashList } from '@shopify/flash-list';

const CameraPage = (props) => {
  const { bottom, top } = useSafeAreaInsets();
  const { navigation } = props;
  return (
    <VStack
      padding={{
        paddingTop: top,
      }}
      fill
    >
      <HStack
        position={{
          top: top,
          left: 0,
          right: 0,
        }}
        justify="space-between"
        padding={theme.spacing.large}
        zIndex={1}
      >
        <Pressable width={40} height={40} onPress={() => navigation.goBack()}>
          <IconX size={40} color={theme.pallate.neutral['01']} />
        </Pressable>
        <Pressable width={40} height={40} onPress={() => navigation.goBack()}>
          <IconX size={40} color={theme.pallate.neutral['01']} />
        </Pressable>
        <Pressable width={40} height={40} onPress={() => navigation.goBack()}>
          <IconX size={40} color={theme.pallate.neutral['01']} />
        </Pressable>
      </HStack>
      <Camera />
      <HStack
        justify="space-between"
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingTop: theme.spacing.large,
          paddingBottom: bottom + theme.spacing.standard,
        }}
      >
        <Box
          width={50}
          height={50}
          borderRadius={15}
          backgroundColor={theme.pallate.neutral['01']}
        />
        {/* The FlashList below can scroll for post, story, video, and live options */}
        <Pressable width={50} height={50}>
          <RefreshCircle
            variant="Bulk"
            size={44}
            fill={theme.pallate.neutral['01']}
            color={theme.pallate.neutral['01']}
          />
        </Pressable>
      </HStack>
    </VStack>
  );
};

export default CameraPage;

