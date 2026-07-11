import { memo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Flex, HStack, Pressable, Text, theme } from '@components/atoms';
import { Coin1, Login, Sms } from 'iconsax-react-native';
import { useAuthState } from '@hooks/utils/useAuth';
import type { HomeHeaderProps } from './home-header.types';

export const HomeHeader = memo(({ topInset }: HomeHeaderProps) => {
  const { isAuthenticated } = useAuthState();
  const navigation = useNavigation();

  const handleLoginPress = useCallback(() => {
    navigation.getParent()?.navigate('login' as never);
  }, [navigation]);

  return (
    <HStack
      zIndex={1}
      position={{
        top: 0,
        left: 0,
        right: 0,
      }}
      padding={{ paddingTop: topInset, paddingHorizontal: theme.spacing.large }}
      items="center"
      spacing={theme.spacing.small}
    >
        <Text fill type="h2" weight="extrabold" italic color={theme.pallate.neutral['01']}>
          Wuzz
        </Text>
      {isAuthenticated ? (
        <>
          <Pressable
            borderRadius={999}
            backgroundColor={theme.pallate.neutral['01']}
            items="center"
            removeClippedSubviews
            height={45}
            padding={{
              paddingHorizontal: theme.spacing.medium,
            }}
            spacing={theme.spacing.tiny}
          >
            <Coin1 color="#FF9500" size={24} variant="Bulk" />
            <Text type="b2" weight="bold" text="10" />
          </Pressable>
          <Pressable
            borderRadius={999}
            margin={{
              marginLeft: theme.spacing.standard
            }}
            backgroundColor={theme.pallate.neutral['01']}
            items="center"
            justify="center"
            removeClippedSubviews
            height={45}
            width={45}
          >
            <Sms color={theme.pallate.neutral['04']} size={24} variant="Bulk" />
          </Pressable>
        </>
      ) : (
        <Pressable
          borderRadius={999}
          backgroundColor={theme.pallate.neutral['01']}
          items="center"
          justify="center"
          removeClippedSubviews
          height={45}
          padding={{
            paddingHorizontal: theme.spacing.medium,
          }}
          spacing={theme.spacing.tiny}
          onPress={handleLoginPress}
        >
          <Login size={20} color={theme.pallate.neutral['05']} />
          <Text type="l1" weight="semibold" color={theme.pallate.neutral['05']}>
            Masuk / Daftar
          </Text>
        </Pressable>
      )}
    </HStack>
  );
});

HomeHeader.displayName = 'HomeHeader';
