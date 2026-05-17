import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Pressable, Text, theme } from '@components/atoms';
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
  const containerStyle = useMemo(
    () => [styles.container, { paddingTop: topInset }],
    [topInset],
  );

  return (
    <View style={containerStyle}>
      <View style={styles.titleContainer}>
        <Text type="h2" italic weight="bold" color={theme.pallate.neutral['01']}>
          Wuzz
        </Text>
      </View>
      {isAuthenticated ? (
        <AuthenticatedButtons />
      ) : (
        <LoginButton onPress={onLoginPress} />
      )}
    </View>
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
