import {
  HStack,
  Pressable,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import { IconChevronLeft } from 'tabler-icons-react-native';
import { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/root/root.types';
import { WebView } from 'react-native-webview';

type WebViewScreenProps = NativeStackScreenProps<RootStackParamList, 'webview'>;

const WebViewScreen = memo(({ navigation, route }: WebViewScreenProps) => {
  const { uri, title } = route.params;
  const { top } = useSafeAreaInsets();
  const headerTitle = title ?? '';

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <VStack fill backgroundColor={theme.pallate.neutral['01']}>
      <HStack
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingTop: top + theme.spacing.small,
          paddingBottom: theme.spacing.standard,
        }}
        items="center"
        gap={theme.spacing.standard}
      >
        <Pressable
          onPress={handleBack}
          padding={{
            paddingVertical: theme.spacing.standard,
            paddingHorizontal: theme.spacing.medium,
          }}
          items="center"
          gap={theme.spacing.small}
          borderRadius={999}
          style={styles.backButton}
          backgroundColor={theme.pallate.neutral['01']}
        >
          <IconChevronLeft
            size={24}
            color={theme.pallate.neutral['05']}
          />
          <Text type="b2" weight="semibold" color={theme.pallate.neutral['05']}>
            {headerTitle ? headerTitle : 'Back'}
          </Text>
        </Pressable>
      </HStack>
      <VStack fill>
        <WebView
          source={{ uri }}
          style={styles.webView}
          startInLoadingState
          sharedCookiesEnabled
        />
      </VStack>
    </VStack>
  );
});

WebViewScreen.displayName = 'WebViewScreen';

const styles = StyleSheet.create({
  backButton: {
    ...theme.elevations[2],
  },
  title: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});

export default WebViewScreen;
