import { Box, HStack, Pressable, Text, theme, VStack } from '@components/atoms';
import { FlashList } from '@shopify/flash-list';
import { SearchNormal, SearchNormal1 } from 'iconsax-react-native';
import { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSearch } from 'tabler-icons-react-native';

const Message = () => {
  const { top } = useSafeAreaInsets();

  const renderStoryItem = useCallback(({ item }: { item: any }) => {
    const USER_SIZE = 80;
    return (
      <Pressable
        direction="column"
        width={USER_SIZE}
        spacing={theme.spacing.standard}
        items="center"
      >
        <Box
          width={USER_SIZE}
          height={USER_SIZE}
          borderWidth={1}
          borderColor={theme.pallate.neutral['04']}
          backgroundColor={theme.pallate.neutral['05']}
          borderRadius={USER_SIZE}
        />
        <Text type="l1" color={theme.pallate.neutral['01']} numberOfLines={1}>
          Testing
        </Text>
      </Pressable>
    );
  }, []);

  const ListHeaderComponent = () => {
    return (
      <VStack
        padding={{
          paddingBottom: theme.spacing.large,
        }}
        spacing={theme.spacing.large}
      >
        {/* Search Bar */}
        <Pressable borderRadius={30} shrink={false} items="center" padding={{
          paddingHorizontal: theme.spacing.large,
        }} spacing={theme.spacing.small} height={52} backgroundColor={theme.pallate.neutral['05']} margin={{ marginHorizontal: theme.spacing.large }}>
          <SearchNormal1 size={20} color={theme.pallate.neutral['03']} />
          <Text type="l1" color={theme.pallate.neutral['03']}>
            Search
          </Text>
        </Pressable>
        <FlashList
          data={[
            'Jakarta',
            'Bandung',
            'Surabaya',
            'Malang',
            'Semarang',
            'Denpasar',
            'Balikpapan',
            'Makassar',
            'Pontianak',
            'Manado',
          ]}
          horizontal
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.large,
          }}
          renderItem={renderStoryItem}
          ItemSeparatorComponent={() => <Box width={theme.spacing.standard} />}
        />
      </VStack>
    );
  };

  const renderItem = useCallback(({ item }: { item: any }) => {
    return (
      <HStack
        items="center"
        spacing={theme.spacing.standard}
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingVertical: theme.spacing.standard,
        }}
      >
        <Box
          width={65}
          height={65}
          borderRadius={35}
          backgroundColor={theme.pallate.neutral['05']}
        />
        <VStack fill>
          <Text weight="medium" type="b2" color={theme.pallate.neutral['01']}>
            John Doe
          </Text>
          <Text type="l1" color={theme.pallate.neutral['01']}>
            Item {item}
          </Text>
        </VStack>
      </HStack>
    );
  }, []);

  return (
    <FlashList
      contentContainerStyle={{
        paddingBottom: theme.spacing.large,
        paddingTop: theme.spacing.large + top,
      }}
      data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
};

export default Message;
