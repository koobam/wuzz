import { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import Image from '@components/atoms/image';
import { HStack, Pressable, Text, theme, VStack } from '@components/atoms';
import { Send2, Setting2 } from 'iconsax-react-native';
import { ProfileStatsRow } from '../profile-stats-row';
import type { ProfileUserRowProps } from './profile-user-row.types';

const AVATAR_SIZE = 65;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const ProfileUserRow = memo(function ProfileUserRow({
  profilePhotoUri = null,
  displayName = 'Jan Falih Fadhillah',
  onAvatarPress,
  onSharePress,
  onEditPress,
  onStatsSharePress,
  onStreakPress,
  streak,
  pesananCount,
  poin,
  level,
}: ProfileUserRowProps) {
  const initials = getInitials(displayName);

  const handleAvatarPress = useCallback(() => {
    onAvatarPress?.();
  }, [onAvatarPress]);

  const handleSharePress = useCallback(() => {
    onSharePress?.();
  }, [onSharePress]);

  const handleEditPress = useCallback(() => {
    onEditPress?.();
  }, [onEditPress]);

  const avatarContent = profilePhotoUri ? (
    <Image
      uri={profilePhotoUri}
      resizeMode="cover"
      style={styles.avatarImage}
    />
  ) : (
    <Text type="s2" weight="semibold" color={theme.pallate.neutral['04']}>
      {initials}
    </Text>
  );

  const avatar = (
    <VStack
      width={AVATAR_SIZE}
      height={AVATAR_SIZE}
      borderRadius={AVATAR_SIZE / 2}
      backgroundColor={theme.pallate.neutral['02']}
      items="center"
      justify="center"
      style={styles.avatarWrap}
    >
      {avatarContent}
    </VStack>
  );

  return (
    <VStack
      borderColor={theme.pallate.neutral['03']}
      spacing={theme.spacing.standard}
    >
      <HStack items="center" spacing={theme.spacing.standard}>
        {onAvatarPress ? (
          <Pressable
            onPress={handleAvatarPress}
            accessibilityRole="button"
            accessibilityLabel="Ubah foto profil"
          >
            {avatar}
          </Pressable>
        ) : (
          avatar
        )}
        <VStack spacing={theme.spacing.small} fill>
          <Text
            color={theme.pallate.neutral['05']}
            weight="semibold"
            type="b1"
            numberOfLines={1}
          >
            {displayName}
          </Text>

          <ProfileStatsRow
            streak={streak}
            pesananCount={pesananCount}
            poin={poin}
            level={level}
            onSharePress={onStatsSharePress}
            onStreakPress={onStreakPress}
          />
        </VStack>
      </HStack>
      <HStack spacing={theme.spacing.small} items="center">
        <Pressable
          fill
          onPress={handleEditPress}
          padding={{
            paddingVertical: theme.spacing.standard,
            paddingHorizontal: theme.spacing.standard,
          }}
          borderRadius={15}
          backgroundColor={theme.pallate.neutral['02']}
          items="center"
          justify="center"
          accessibilityRole="button"
          accessibilityLabel="Edit profil"
        >
          <HStack items="center" spacing={theme.spacing.small}>
            <Setting2
              color={theme.pallate.neutral['05']}
              variant="Linear"
              size={18}
            />
            <Text type="l1" weight="medium" color={theme.pallate.neutral['05']}>
              Edit profil
            </Text>
          </HStack>
        </Pressable>
        <Pressable
          fill
          onPress={handleSharePress}
          padding={{
            paddingVertical: theme.spacing.standard,
            paddingHorizontal: theme.spacing.standard,
          }}
          borderRadius={15}
          backgroundColor={theme.pallate.primary['03']}
          items="center"
          justify="center"
          accessibilityRole="button"
          accessibilityLabel="Bagikan profil"
        >
          <HStack items="center" spacing={theme.spacing.small}>
            <Send2
              color={theme.pallate.neutral['01']}
              variant="Linear"
              size={20}
            />
            <Text type="l1" weight="medium" color={theme.pallate.neutral['01']}>
              Bagikan
            </Text>
          </HStack>
        </Pressable>
      </HStack>
    </VStack>
  );
});

const styles = StyleSheet.create({
  avatarWrap: {
    overflow: 'hidden',
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
});

export type { ProfileUserRowProps } from './profile-user-row.types';
