import {
  Box,
  HStack,
  Text,
  theme,
  VStack,
  GesturePressable,
} from '@components/atoms';
import { memo } from 'react';
import {
  CardProps,
  NewsCardProps,
  PostCardProps,
  VideosCardProps,
} from './card.types';
import Image from '@components/atoms/image';
import { Heart, Repeat, Send2, Play } from 'iconsax-react-native';
import { useTheme } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { IconDots } from 'tabler-icons-react-native';
import Animated from 'react-native-reanimated';

const NewsCard = memo((props: NewsCardProps) => {
  const { onPress, onLongPress, title, category, location, repostedBy } = props;

  return (
    <GesturePressable
      direction="column"
      onPress={onPress}
      onLongPress={onLongPress}
      spacing={theme.spacing.small}
      padding={theme.spacing.large}
      sharedTransitionTag="card"
      simultaneousWithExternalGesture
    >
      <HStack items="center" spacing={theme.spacing.small}>
        <Text type="l1" color={theme.pallate.neutral['02']}>
          {category}
        </Text>
        <Box
          width={1}
          height={1}
          backgroundColor={theme.pallate.neutral['02']}
        />
        <Text type="l1" color={theme.pallate.neutral['02']}>
          Media
        </Text>
        <Box
          width={1}
          height={1}
          backgroundColor={theme.pallate.neutral['02']}
        />
        <Text type="l1" color={theme.pallate.neutral['02']}>
          {location}
        </Text>
      </HStack>
      <Text type="l1" color={theme.pallate.neutral['01']}>
        {title}
      </Text>
      {repostedBy && repostedBy.length > 0 && (
        <HStack items="center" spacing={theme.spacing.small}>
          {repostedBy.slice(0, 3).map((user, i) => (
            <Box
              key={user.id}
              margin={{
                marginLeft: i !== 0 ? -10 : 0,
              }}
              borderWidth={1}
              borderColor={theme.pallate.neutral['06']}
              width={25}
              height={25}
              backgroundColor={theme.pallate.neutral['05']}
              borderRadius={15}
            />
          ))}
          <Text
            fill
            numberOfLines={1}
            type="l2"
            color={theme.pallate.neutral['01']}
          >
            {repostedBy.length === 1
              ? `${repostedBy[0].name} reposted this`
              : repostedBy.length === 2
              ? `${repostedBy[0].name} and ${repostedBy[1].name} reposted this`
              : `${repostedBy[0].name}, ${repostedBy[1].name}, and ${
                  repostedBy.length - 2
                } others reposted this`}
          </Text>
        </HStack>
      )}
    </GesturePressable>
  );
});
NewsCard.displayName = 'NewsCard';

// @index.tsx (189-290)
const PostCard = memo((props: PostCardProps) => {
  // Mimic @index.tsx (189-290)
  // See file_context_0: a VStack containing header with avatar/name, a horizontal scroll with posts, and action buttons

  const navigationTheme = useTheme();
  // Fallbacks for demo data if needed, but uses props input
  const { onPress, userName, title } = props;

  // Note: You can pass in likes, comments, reposts, image, but to match the referenced structure, these are replaced by placeholders

  const POST_WIDTH = 250;
  const POST_HEIGHT = (POST_WIDTH * 4) / 3;

  return (
    <VStack spacing={theme.spacing.standard}>
      <HStack
        items="center"
        justify="center"
        padding={{ paddingHorizontal: theme.spacing.large }}
      >
        <GesturePressable
          onPress={onPress}
          fill
          items="center"
          spacing={theme.spacing.small}
          requireExternalGestureToFail
        >
          <Box
            borderRadius={999}
            width={40}
            height={40}
            backgroundColor={
              theme.pallate.primary?.['03'] ?? theme.pallate.neutral['05']
            }
          />
          <Text weight="medium" color={navigationTheme.colors.text}>
            {userName ?? 'loremipsum'}
          </Text>
        </GesturePressable>
        <GesturePressable onPress={() => {}} requireExternalGestureToFail>
          <IconDots size={24} color={navigationTheme.colors.text} />
        </GesturePressable>
      </HStack>
      <Text type="s3" weight="bold" color={theme.pallate.neutral['01']}>
        {title}
      </Text>
      <FlashList
        horizontal
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.large,
        }}
        data={[
          { image: `https://picsum.photos/seed/post1/800/600` },
          { image: `https://picsum.photos/seed/post2/800/600` },
        ]}
        
        ItemSeparatorComponent={() => <Box width={theme.spacing.tiny} />}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <GesturePressable onPress={() => {}} simultaneousWithExternalGesture>
            <Box
              width={POST_WIDTH}
              height={POST_HEIGHT}
              backgroundColor={theme.pallate.neutral['05']}
              borderRadius={30}
              style={{ overflow: 'hidden' }}
            >
              {item.image && (
                <Image
                  uri={item.image}
                  resizeMode="cover"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 30,
                  }}
                />
              )}
            </Box>
          </GesturePressable>
        )}
      />
      {/* Action Buttons Love, Repost, Reply, Share */}
      <HStack
        items="center"
        spacing={theme.spacing.medium}
        padding={{ paddingHorizontal: theme.spacing.large }}
      >
        <GesturePressable
          items="center"
          spacing={theme.spacing.small}
          requireExternalGestureToFail
        >
          <Heart
            size={26}
            fill={theme.pallate.neutral['01']}
            color={navigationTheme.colors.text}
          />
          <Text type="b2" color={navigationTheme.colors.text}>
            12
          </Text>
        </GesturePressable>
        <GesturePressable
          items="center"
          spacing={theme.spacing.small}
          requireExternalGestureToFail
        >
          <Repeat
            size={26}
            fill={theme.pallate.neutral['01']}
            color={navigationTheme.colors.text}
          />
          <Text type="b2" color={navigationTheme.colors.text}>
            12
          </Text>
        </GesturePressable>
        <GesturePressable
          items="center"
          spacing={theme.spacing.small}
          requireExternalGestureToFail
        >
          <Send2
            size={26}
            fill={theme.pallate.neutral['01']}
            color={navigationTheme.colors.text}
          />
          <Text type="b2" color={navigationTheme.colors.text}>
            12
          </Text>
        </GesturePressable>
      </HStack>
    </VStack>
  );
});
PostCard.displayName = 'PostCard';

const VideosCard = memo((props: VideosCardProps) => {
  const navigationTheme = useTheme();
  const {
    onPress,
    title,
    description,
    thumbnail,
    duration,
    userName,
    userAvatar,
    views = 0,
    likes = 0,
  } = props;

  return (
    <GesturePressable
      direction="column"
      onPress={onPress}
      spacing={theme.spacing.medium}
      padding={theme.spacing.large}
      requireExternalGestureToFail
    >
      <HStack
        items="center"
        spacing={theme.spacing.standard}
        justify="space-between"
      >
        <HStack items="center" spacing={theme.spacing.standard}>
          {userAvatar && (
            <Box
              width={40}
              height={40}
              borderRadius={999}
              borderWidth={1}
              borderColor={theme.pallate.neutral['05']}
              style={{ overflow: 'hidden' }}
            >
              <Image
                uri={userAvatar}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </Box>
          )}
          {userName && (
            <Text weight="medium" color={navigationTheme.colors.text}>
              {userName}
            </Text>
          )}
        </HStack>
      </HStack>
      {title && (
        <Text type="l1" color={theme.pallate.neutral['01']}>
          {title}
        </Text>
      )}
      {description && (
        <Text type="b2" color={theme.pallate.neutral['02']}>
          {description}
        </Text>
      )}
      {thumbnail && (
        <Box
          borderRadius={theme.spacing.standard}
          style={{ overflow: 'hidden', position: 'relative' }}
        >
          <Image
            uri={thumbnail}
            style={{ width: '100%', aspectRatio: 16 / 9 }}
            resizeMode="cover"
          />
          <HStack
            position="absolute"
            items="center"
            justify="center"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <HStack
              width={60}
              height={60}
              borderRadius={30}
              backgroundColor={theme.pallate.neutral['06']}
              items="center"
              justify="center"
              style={{ opacity: 0.8 }}
            >
              <Play
                size={24}
                color={theme.pallate.neutral['01']}
                fill={theme.pallate.neutral['01']}
              />
            </HStack>
          </HStack>
          {duration && (
            <Box
              position="absolute"
              style={{
                bottom: theme.spacing.small,
                right: theme.spacing.small,
              }}
              backgroundColor={theme.pallate.neutral['06']}
              padding={{
                paddingHorizontal: theme.spacing.small,
                paddingVertical: 4,
              }}
              borderRadius={4}
            >
              <Text type="b2" color={theme.pallate.neutral['01']}>
                {duration}s
              </Text>
            </Box>
          )}
        </Box>
      )}
      <HStack
        items="center"
        spacing={theme.spacing.medium}
        justify="space-between"
      >
        <HStack items="center" spacing={theme.spacing.medium}>
          <GesturePressable
            items="center"
            spacing={theme.spacing.small}
            requireExternalGestureToFail
          >
            <Heart
              size={26}
              fill={theme.pallate.neutral['01']}
              color={navigationTheme.colors.text}
            />
            <Text type="b2" color={navigationTheme.colors.text}>
              {likes}
            </Text>
          </GesturePressable>
          {views > 0 && (
            <Text type="b2" color={theme.pallate.neutral['02']}>
              {views} views
            </Text>
          )}
        </HStack>
      </HStack>
    </GesturePressable>
  );
});
VideosCard.displayName = 'VideosCard';

export const Card = memo((props: CardProps) => {
  switch (props.type) {
    case 'news':
      return <NewsCard {...props} />;
    case 'post':
      return <PostCard {...props} />;
    case 'videos':
      return <VideosCard {...props} />;
    default:
      return null;
  }
});
Card.displayName = 'Card';

export default Card;
