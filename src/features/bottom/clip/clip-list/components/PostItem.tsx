import { memo, useRef } from 'react';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Pressable as GesturePressable } from 'react-native-gesture-handler';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import { IconDots } from 'tabler-icons-react-native';
import { Heart, Repeat, Send2 } from 'iconsax-react-native';
import {
  Box,
  HStack,
  Pressable,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import { PostItemProps } from '../types';
import { ClipListType } from '../types';
import { POST_CONSTANTS } from '../constants';
import { PostImageSeparator } from './PostImageSeparator';

export const PostItem = memo(
  ({ item }: PostItemProps) => {
    const navigation = useNavigation<ClipListType['navigation']>();
    const navigationTheme = useTheme();
    const userActionSheetRef = useRef<BottomSheetModal>(null);
    const POST_WIDTH = POST_CONSTANTS.WIDTH;
    const POST_HEIGHT = POST_WIDTH * POST_CONSTANTS.HEIGHT_RATIO;

    return (
      <VStack spacing={theme.spacing.standard}>
        <HStack
          items="center"
          justify="center"
          padding={{ paddingHorizontal: theme.spacing.large }}
        >
          <Pressable fill items="center" spacing={theme.spacing.small}>
            <Box
              borderRadius={999}
              width={40}
              height={40}
              backgroundColor={item.color}
            />
            <Text weight="medium" color={navigationTheme.colors.text}>
              loremipsum
            </Text>
          </Pressable>
          <Pressable onPress={() => userActionSheetRef.current?.present()}>
            <IconDots size={24} color={navigationTheme.colors.text} />
          </Pressable>
        </HStack>
        <FlashList
          horizontal
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.large,
          }}
          pagingEnabled
          data={[
            {
              image: `https://picsum.photos/seed/${'unique-default'}/200/300`,
            },
            {
              image: `https://picsum.photos/seed/${'unique-default'}/200/300`,
            },
          ]}
          ItemSeparatorComponent={PostImageSeparator}
          showsHorizontalScrollIndicator={false}
          renderItem={() => (
            <GesturePressable
              onPress={() => navigation.navigate('clip-detail' as never)}
            >
              <Box
                width={POST_WIDTH}
                height={POST_HEIGHT}
                backgroundColor={theme.pallate.neutral['05']}
                borderRadius={30}
              />
            </GesturePressable>
          )}
        />
        {/* Action Buttons Love, Repost, Reply, Share */}
        <HStack
          items="center"
          spacing={theme.spacing.medium}
          padding={{ paddingHorizontal: theme.spacing.large }}
        >
          <Pressable items="center" spacing={theme.spacing.small}>
            <Heart
              size={26}
              fill={theme.pallate.neutral['01']}
              color={navigationTheme.colors.text}
            />
            <Text type="b2" color={navigationTheme.colors.text}>
              12
            </Text>
          </Pressable>
          <Pressable items="center" spacing={theme.spacing.small}>
            <Repeat
              size={26}
              fill={theme.pallate.neutral['01']}
              color={navigationTheme.colors.text}
            />
            <Text type="b2" color={navigationTheme.colors.text}>
              12
            </Text>
          </Pressable>
          <Pressable items="center" spacing={theme.spacing.small}>
            <Send2
              size={26}
              fill={theme.pallate.neutral['01']}
              color={navigationTheme.colors.text}
            />
            <Text type="b2" color={navigationTheme.colors.text}>
              12
            </Text>
          </Pressable>
        </HStack>
      </VStack>
    );
  },
  (prevProps, nextProps) => prevProps.item.color === nextProps.item.color,
);

PostItem.displayName = 'PostItem';

