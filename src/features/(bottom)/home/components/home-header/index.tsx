import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { HStack, Pressable, Text, theme } from '@components/atoms';
import { Coin1, Login, Sms } from 'iconsax-react-native';
import type { HomeHeaderProps } from './home-header.types';

const CoinButton = memo(() => (
  <Pressable style={styles.coinPressable} removeClippedSubviews>
    <Coin1 color="#FF9500" size={24} variant="Bulk" />
    <Text type="b2" weight="bold" text="10" />
  </Pressable>
));
CoinButton.displayName = 'CoinButton';

const MessageButton = memo(() => (
  <Pressable style={styles.iconPressable} removeClippedSubviews>
    <Sms color={theme.pallate.neutral['04']} size={24} variant="Bulk" />
  </Pressable>
));
MessageButton.displayName = 'MessageButton';

const AuthenticatedButtons = memo(() => (
  <>
    <CoinButton />
    <MessageButton />
  </>
));
AuthenticatedButtons.displayName = 'AuthenticatedButtons';

type LoginButtonProps = { onPress: () => void };
const LoginButton = memo(({ onPress }: LoginButtonProps) => (
  <Pressable style={styles.loginPressable} onPress={onPress} removeClippedSubviews>
    <Login size={20} color={theme.pallate.neutral['05']} />
    <Text type="l1" weight="semibold" color={theme.pallate.neutral['05']}>
      Masuk / Daftar
    </Text>
  </Pressable>
));
LoginButton.displayName = 'LoginButton';

export const HomeHeader = memo(({ topInset, isAuthenticated, onLoginPress }: HomeHeaderProps) => {

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
      gap={theme.spacing.small}
    >
        <Text fill type="h2" weight="extrabold" italic color={theme.pallate.neutral['01']}>
          Wuzz
        </Text>
      {isAuthenticated ? (
        <AuthenticatedButtons />
      ) : (
        <LoginButton onPress={onLoginPress} />
      )}
    </HStack>
  );
});

HomeHeader.displayName = 'HomeHeader';

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.large,
    gap: theme.spacing.small,
  },
  titleContainer: {
    flex: 1,
  },
  coinPressable: {
    flexDirection: 'row',
    borderRadius: 999,
    backgroundColor: theme.pallate.neutral['01'],
    alignItems: 'center',
    height: 45,
    paddingHorizontal: theme.spacing.medium,
    gap: theme.spacing.tiny,
  },
  iconPressable: {
    borderRadius: 999,
    backgroundColor: theme.pallate.neutral['01'],
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    width: 45,
  },
  loginPressable: {
    flexDirection: 'row',
    borderRadius: 999,
    backgroundColor: theme.pallate.neutral['01'],
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    paddingHorizontal: theme.spacing.medium,
    gap: theme.spacing.tiny,
  },
});
