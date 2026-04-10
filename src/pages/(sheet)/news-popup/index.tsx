import React, { memo, useCallback, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/root/root.types';
import { BlurView } from '@react-native-community/blur';
import { Platform, StyleSheet, View, Dimensions, Linking } from 'react-native';
import {
  Box,
  HStack,
  Text,
  VStack,
  Pressable,
  theme,
  VStackAnimated,
  Flex,
} from '@components/atoms';
import { Heart, Repeat, Send2 } from 'iconsax-react-native'; // For actions
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewsCardProps } from '@components/molecules/card/card.types';
import {
  FadeIn,
  FadeOut,
  SharedTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const { height: WINDOW_HEIGHT } = Dimensions.get('window');
const SWIPE_CLOSE_THRESHOLD = 100; // Minimum downward distance to close
const SWIPE_EXPAND_THRESHOLD = 60; // Upward distance to trigger expand

type NewsPopupRouteProps = NativeStackScreenProps<
  RootStackParamList,
  'news-popup'
>;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

const NewsPopup = memo(() => {
  const route = useRoute<NewsPopupRouteProps['route']>();
  const navigation = useNavigation();
  const { bottom } = useSafeAreaInsets();
  const newsItem = route.params?.item as NewsCardProps;

  // Like, repost states
  const [liked, setLiked] = useState<boolean>(false);
  const [reposted, setReposted] = useState<boolean>(false);

  // Description expand logic
  const [isExpanded, setIsExpanded] = useState(false);
  const DESCRIPTION_PREVIEW_LINES = 2;

  // shared value for vertical translation
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const expandPending = useSharedValue(false);

  // Measure if description is longer than preview lines
  const [descExceeds, setDescExceeds] = useState(false);

  // Used for preview/expansion
  const [descHeight, setDescHeight] = useState(0);
  const [descPreviewHeight, setDescPreviewHeight] = useState(0);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // ACTIONS
  const handleLike = useCallback(() => setLiked(l => !l), []);
  const handleRepost = useCallback(() => setReposted(r => !r), []);
  const handleShare = useCallback(() => {
    // Fallback share to copy link or open url if provided
    if (newsItem?.url) {
      Linking.openURL(newsItem.url);
    }
    // else do nothing (no alert to avoid lint error)
  }, [newsItem?.url]);

  // PANNING
  const panGesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      context.value = { y: translateY.value };
      expandPending.value = false;
    })
    .onUpdate(event => {
      'worklet';
      // Only allow downward for closing and upward for expand if can expand
      if (event.translationY < 0 && !expandPending.value && descExceeds && !isExpanded) {
        // User is panning up and we can expand
        if (Math.abs(event.translationY) > SWIPE_EXPAND_THRESHOLD) {
          expandPending.value = true;
          runOnJS(setIsExpanded)(true);
        }
      } else if (event.translationY > 0) {
        // Only allow downward swipe if not in expand mode
        translateY.value = context.value.y + event.translationY;
      }
    })
    .onEnd(event => {
      'worklet';
      // If swiped down past threshold or velocity is high, close
      if (translateY.value > SWIPE_CLOSE_THRESHOLD || event.velocityY > 1000) {
        translateY.value = withSpring(
          SCREEN_HEIGHT,
          {
            damping: 20,
            stiffness: 90,
          },
          () => {
            runOnJS(handleClose)();
          },
        );
      } else {
        // Spring back to original position
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 300,
        });
      }
    });

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => {
    // Fade out backdrop as user swipes down
    const opacity = 1 - translateY.value / SCREEN_HEIGHT;
    return { opacity: Math.max(0, opacity) };
  });

  if (!newsItem) {
    return null;
  }

  return (
    <VStack fill style={styles.container}>
      <VStackAnimated
        fill
        style={[StyleSheet.absoluteFill, animatedBackdropStyle]}
      >
        <Pressable
          shrink={false}
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
        >
          {Platform.OS === 'ios' ? (
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={1}
              reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.7)"
            />
          ) : (
            <Box
              style={StyleSheet.absoluteFill}
              backgroundColor="rgba(0, 0, 0, 0.7)"
            />
          )}
        </Pressable>
      </VStackAnimated>
      <GestureDetector gesture={panGesture}>
        <VStackAnimated
          fill
          justify="flex-end"
          padding={{
            paddingHorizontal: theme.spacing.large,
            paddingBottom: bottom + theme.spacing.extraLarge,
          }}
          style={animatedContentStyle}
        >
          <VStackAnimated
            sharedTransitionTag="card"
            sharedTransitionStyle={SharedTransition.duration(550).springify()}
            entering={FadeIn.duration(550).springify()}
            exiting={FadeOut.duration(550).springify()}
            backgroundColor={theme.pallate.neutral['06']}
            borderRadius={theme.spacing.extraLarge}
            padding={{
                paddingHorizontal: theme.spacing.extraLarge,
                paddingTop: theme.spacing.medium,
                paddingBottom: theme.spacing.extraLarge,
            }}
            spacing={theme.spacing.large}
            style={styles.modalContent}
          >
            <Flex self="center" width={40} height={5} backgroundColor={theme.pallate.neutral['05']} borderRadius={2.5} />

            <VStack spacing={theme.spacing.tiny}>
              {newsItem.category && (
                <Text
                  type="b2"
                  color={theme.pallate.neutral['02']}
                  weight="medium"
                >
                  {newsItem.category}
                </Text>
              )}
              {newsItem.location && (
                <Text type="l2" color={theme.pallate.neutral['03']}>
                  {newsItem.location}
                </Text>
              )}
            </VStack>

            <Text
              type="s2"
              color={theme.pallate.neutral['01']}
              weight="bold"
              style={styles.title}
            >
              {newsItem.title}
            </Text>

            {/* DESCRIPTION with expand/collapse */}
            {newsItem.description && (
              <View>
                <Text
                  type="b2"
                  color={theme.pallate.neutral['01']}
                  numberOfLines={isExpanded ? undefined : DESCRIPTION_PREVIEW_LINES}
                  onTextLayout={e => {
                    if (!descExceeds) {
                      const { lines } = e.nativeEvent;
                      if (lines.length > DESCRIPTION_PREVIEW_LINES) {
                        setDescExceeds(true);
                      }
                      setDescPreviewHeight(
                        lines.slice(0, DESCRIPTION_PREVIEW_LINES).reduce((acc, x) => acc + x.height, 0)
                      );
                      setDescHeight(
                        lines.reduce((acc, x) => acc + x.height, 0)
                      );
                    }
                  }}
                  style={{
                    marginTop: theme.spacing.standard,
                    marginBottom: !isExpanded && descExceeds ? 8 : 0,
                  }}
                >
                  {newsItem.description}
                </Text>
                {descExceeds && (
                  <Pressable
                    onPress={() => setIsExpanded(exp => !exp)}
                    style={{ alignSelf: 'flex-end', paddingVertical: 2, paddingHorizontal: 4 }}
                    accessibilityLabel={isExpanded ? 'Collapse description' : 'Expand description'}
                  >
                    <Text type="b2" color={theme.pallate.primary['03']} weight="bold">
                      {isExpanded ? 'Show less' : 'Read more'}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}

            {newsItem.repostedBy && newsItem.repostedBy.length > 0 && (
              <VStack
                spacing={theme.spacing.small}
                padding={{
                  paddingTop: theme.spacing.standard,
                  paddingBottom: theme.spacing.small,
                }}
              >
                <HStack items="center" spacing={theme.spacing.small}>
                  {newsItem.repostedBy.slice(0, 3).map((user, i) => (
                    <Box
                      key={user.id}
                      margin={{ marginLeft: i !== 0 ? -8 : 0 }}
                      borderWidth={2}
                      borderColor={theme.pallate.neutral['06']}
                      width={32}
                      height={32}
                      backgroundColor={theme.pallate.neutral['05']}
                      borderRadius={16}
                    />
                  ))}
                  {newsItem.repostedBy.length > 3 && (
                    <View
                      style={{
                        marginLeft: -8,
                        borderWidth: 2,
                        borderColor: theme.pallate.neutral['06'],
                        width: 32,
                        height: 32,
                        backgroundColor: theme.pallate.neutral['04'],
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        type="b2"
                        color={theme.pallate.neutral['02']}
                        weight="medium"
                      >
                        +{newsItem.repostedBy.length - 3}
                      </Text>
                    </View>
                  )}
                </HStack>
                <Text type="b2" color={theme.pallate.neutral['02']}>
                  {newsItem.repostedBy.length === 1
                    ? `${newsItem.repostedBy[0].name} reposted this`
                    : newsItem.repostedBy.length === 2
                    ? `${newsItem.repostedBy[0].name} and ${newsItem.repostedBy[1].name} reposted this`
                    : `${newsItem.repostedBy[0].name}, ${
                        newsItem.repostedBy[1].name
                      }, and ${
                        newsItem.repostedBy.length - 2
                      } others reposted this`}
                </Text>
              </VStack>
            )}

            {/* Action Buttons: Like, Repost, Share */}
            <HStack
              spacing={theme.spacing.large}
              justify="center"
              padding={{
                paddingTop: theme.spacing.standard,
              }}
            >
              {/* Like */}
              <Pressable
                onPress={handleLike}
                accessibilityLabel="Like"
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                    alignItems: 'center',
                  },
                ]}
              >
                <Heart
                  size={28}
                  color={liked ? theme.pallate.primary['03'] : theme.pallate.neutral['03']}
                  variant={liked ? 'Bold' : 'Linear'}
                />
                <Text
                  color={liked ? theme.pallate.primary['03'] : theme.pallate.neutral['03']}
                  type="b2"
                  weight={liked ? 'bold' : 'regular'}
                  style={{ marginTop: 4 }}
                >
                  Like
                </Text>
              </Pressable>

              {/* Repost */}
              <Pressable
                onPress={handleRepost}
                accessibilityLabel="Repost"
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                    alignItems: 'center',
                  },
                ]}
              >
                <Repeat
                  size={28}
                  color={reposted ? theme.pallate.primary['03'] : theme.pallate.neutral['03']}
                  variant={reposted ? 'Bold' : 'Linear'}
                />
                <Text
                  color={reposted ? theme.pallate.primary['03'] : theme.pallate.neutral['03']}
                  type="b2"
                  weight={reposted ? 'bold' : 'regular'}
                  style={{ marginTop: 4 }}
                >
                  Repost
                </Text>
              </Pressable>

              {/* Share */}
              <Pressable
                onPress={handleShare}
                accessibilityLabel="Share"
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                    alignItems: 'center',
                  },
                ]}
              >
                <Send2
                  size={28}
                  color={theme.pallate.neutral['03']}
                  variant="Linear"
                />
                <Text
                  color={theme.pallate.neutral['03']}
                  type="b2"
                  weight="regular"
                  style={{ marginTop: 4 }}
                >
                  Share
                </Text>
              </Pressable>
            </HStack>
          </VStackAnimated>
        </VStackAnimated>
      </GestureDetector>
    </VStack>
  );
});

NewsPopup.displayName = 'NewsPopup';

const styles = StyleSheet.create({
  container: {},
  modalContent: {
    ...theme.elevations[10],
  },
  title: {
    lineHeight: 28,
  },
});

export default NewsPopup;
