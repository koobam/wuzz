import { memo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import Animated from 'react-native-reanimated';
import { Additem, Heart } from 'iconsax-react-native';
import { HStack, Pressable, theme, VStack } from '@components/atoms';
import { DarkLogoSvg } from '@assets/index';
import { ListHeaderProps } from '../types';
import { ClipListType } from '../types';
import { MOCK_STORY_DATA } from '../constants';
import { StoryItem } from './StoryItem';
import { StoryItemSeparator } from './StoryItemSeparator';

export const ListHeader = memo(
  ({ top, logoAnimatedStyle }: ListHeaderProps) => {
    const navigation = useNavigation<ClipListType['navigation']>();

    const renderStoryItem = useCallback(
      ({ item, index }: { item: any; index: number }) => (
        <StoryItem item={item} index={index} />
      ),
      [],
    );

    return (
      <VStack padding={{ paddingBottom: theme.spacing.large }}>
        <HStack
          items="center"
          justify="space-between"
          spacing={theme.spacing.small}
          padding={{
            paddingHorizontal: theme.spacing.large,
            paddingTop: top,
            paddingBottom: theme.spacing.large,
          }}
        >
          <Additem size={32} color={theme.pallate.neutral['01']} />
          <Animated.View style={logoAnimatedStyle}>
            <DarkLogoSvg width={40} height={40} />
          </Animated.View>
          <Pressable
            onPress={() => navigation.navigate('notification' as never)}
          >
            <Heart size={32} color={theme.pallate.neutral['01']} />
          </Pressable>
        </HStack>
        <FlashList
          horizontal
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.large,
          }}
          data={MOCK_STORY_DATA}
          renderItem={renderStoryItem}
          ItemSeparatorComponent={StoryItemSeparator}
          showsHorizontalScrollIndicator={false}
        />
      </VStack>
    );
  },
);

ListHeader.displayName = 'ListHeader';

