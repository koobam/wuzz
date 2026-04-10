import React, { memo, useCallback, useMemo, useEffect, useRef } from 'react';
import { Box, HStack, Pressable, Text, theme, VStack } from '@components/atoms';
import { IconDots, IconShare2 } from 'tabler-icons-react-native';
import { UserDetailType } from './user-detail.type';
import { useTheme, useNavigation } from '@react-navigation/native';
import { Flex } from '@components/atoms';
import { Heart, Repeat, Send2 } from 'iconsax-react-native';
import { Edit } from 'iconsax-react-native';
import { Tabs } from 'react-native-collapsible-tab-view';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { View } from 'react-native';

// Smart Pressable that works with scroll gestures
// The hack: Use a LongPress with very short duration to detect taps
// This allows the gesture to fail quickly if user starts scrolling
const SmartPressable = ({ 
  children, 
  onPress, 
  ...props 
}: any) => {
  const scale = useSharedValue(1);
  const isPressed = useSharedValue(false);

  const handlePress = useCallback(() => {
    console.log('🎯 SmartPressable: Triggering onPress');
    onPress?.();
  }, [onPress]);

  // Use LongPress with minDuration of 0 - this creates a "tap detector"
  // that fails immediately if finger moves
  const longPress = Gesture.LongPress()
    .minDuration(0) // Trigger immediately
    .maxDistance(10) // Cancel if moved > 10px
    .onStart(() => {
      console.log('✋ LongPress: Started');
      isPressed.value = true;
      scale.value = withTiming(0.95, { duration: 100 });
    })
    .onEnd((event) => {
      console.log('✋ LongPress: End', event);
      isPressed.value = false;
      scale.value = withTiming(1, { duration: 100 });
      // Only fire if gesture succeeded (not cancelled)
      runOnJS(handlePress)();
    })
    .onFinalize((event, success) => {
      console.log('✋ LongPress: Finalize - success:', success);
      isPressed.value = false;
      scale.value = withTiming(1, { duration: 100 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={longPress}>
      <Animated.View style={animatedStyle}>
        <View style={{ pointerEvents: 'box-none' }}>
          <Pressable {...props}>
            {children}
          </Pressable>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const Header = () => {
  const navigationTheme = useTheme();

  return (
      <VStack
        spacing={theme.spacing.large}
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingTop: theme.spacing.large,
          paddingBottom: theme.spacing.large,
        }}
        pointerEvents="box-none"
        style={{
          ...theme.elevations['10'],
        }}
      >
        <VStack
          padding={{
            paddingHorizontal: theme.spacing.large,
            paddingVertical: theme.spacing.medium,
          }}
          borderRadius={18}
          borderColor={theme.pallate.neutral['01']}
          spacing={theme.spacing.standard}
          backgroundColor={theme.pallate.neutral['05']}
          pointerEvents="none"
        >
          <Text
            numberOfLines={2}
            type="b2"
            italic
            color={theme.pallate.neutral['01']}
          >
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua."
          </Text>
          {/* Dash */}
          {/* <Dash
          dashGap={4}
          dashColor={theme.pallate.neutral['01']}
          dashLength={6}
          dashThickness={0.5}
          style={{ width: '100%' }}
        />
        <HStack justify="center" items="center" spacing={theme.spacing.small}>
          <Box width={25} height={25} backgroundColor={theme.pallate.neutral['01']} borderRadius={999} />
          <Text
            type="b2"
            color={theme.pallate.neutral['01']}
            weight="medium"
          >
            Bronze
          </Text>
          <VStack
            fill
            height={5}
            borderRadius={5}
            backgroundColor={theme.pallate.neutral['01']}
          />
        </HStack> */}
        </VStack>
        {/* <VStackAnimated
        entering={FadeIn.duration(1500).easing(Easing.inOut(Easing.ease))}
        padding={{
          paddingBottom: theme.spacing.standard,
        }}
        margin={{
          marginTop: -120,
        }}
        borderRadius={18}
        borderWidth={1}
        borderColor={theme.pallate.neutral['06']}
        backgroundColor={theme.pallate.neutral['06']}
      >
      </VStackAnimated> */}
        <VStack
          spacing={theme.spacing.standard}
          pointerEvents="box-none"
        >
          <HStack
            items="center"
            spacing={theme.spacing.standard}
            pointerEvents="box-none"
          >
            <Flex
              pointerEvents="none"
              width={50}
              height={50}
              backgroundColor={theme.pallate.neutral['01']}
              borderRadius={999}
            />
            <VStack pointerEvents="none" fill>
              <Text color={theme.pallate.neutral['01']} weight="bold" type="s3">
                Jan Falih Fadhillah
              </Text>
              <Text type="l1" color={theme.pallate.neutral['01']}>
                @janfalih
              </Text>
            </VStack>
            <SmartPressable
              height={50}
              width={50}
              padding={{
                paddingHorizontal: theme.spacing.medium,
                paddingVertical: theme.spacing.standard,
              }}
              borderRadius={20}
              borderColor={theme.pallate.neutral['01']}
              backgroundColor={theme.pallate.neutral['05']}
              items="center"
              justify="center"
              onPress={() => {
                console.log('✅ Send button PRESSED');
                // Your actual action
              }}
            >
              <Send2
              color={theme.pallate.neutral['01']}
              variant="Bulk"
              size={24}
            />
          </SmartPressable>
          </HStack>
          <HStack
            items="center"
            spacing={theme.spacing.standard}
            pointerEvents="box-none"
          >
            <SmartPressable 
              items="baseline" 
              spacing={theme.spacing.small}
              onPress={() => console.log('✅ Followers PRESSED')}
            >
              <Text weight="bold" color={navigationTheme.colors.text}>
                10
              </Text>
              <Text type="l1" color={navigationTheme.colors.text}>
                Followers
              </Text>
            </SmartPressable>
            <SmartPressable 
              items="baseline" 
              spacing={theme.spacing.small}
              onPress={() => console.log('✅ Following PRESSED')}
            >
              <Text weight="bold" color={navigationTheme.colors.text}>
                2
              </Text>
              <Text type="l1" color={navigationTheme.colors.text}>
                Following
              </Text>
            </SmartPressable>
            <SmartPressable 
              items="baseline" 
              spacing={theme.spacing.small}
              onPress={() => console.log('✅ Moments PRESSED')}
            >
              <Text weight="bold" color={navigationTheme.colors.text}>
                3
              </Text>
              <Text type="l1" color={navigationTheme.colors.text}>
                Moments
              </Text>
            </SmartPressable>
          </HStack>

          <HStack
            spacing={theme.spacing.standard}
            pointerEvents="box-none"
          >
            <SmartPressable
              items="center"
              spacing={theme.spacing.small}
              padding={{
                paddingHorizontal: theme.spacing.medium,
                paddingVertical: theme.spacing.standard,
              }}
              fill
              borderRadius={15}
              borderColor={theme.pallate.neutral['01']}
              backgroundColor={theme.pallate.neutral['05']}
              justify="center"
              onPress={() => console.log('✅ Edit Profile PRESSED')}
            >
              <Edit
                color={theme.pallate.neutral['01']}
                variant="Bulk"
                size={20}
              />
              <Text
                type="l1"
                weight="medium"
                color={theme.pallate.neutral['01']}
              >
                Edit Profile
              </Text>
            </SmartPressable>
            <SmartPressable
              fill
              items="center"
              spacing={theme.spacing.small}
              padding={{
                paddingHorizontal: theme.spacing.medium,
                paddingVertical: theme.spacing.standard,
              }}
              borderRadius={15}
              borderColor={theme.pallate.neutral['01']}
              backgroundColor={theme.pallate.neutral['05']}
              justify="center"
              onPress={() => console.log('✅ Share Profile PRESSED')}
            >
              <IconShare2 color={theme.pallate.neutral['01']} size={20} />
              <Text
                type="l1"
                weight="medium"
                color={theme.pallate.neutral['01']}
              >
              Share Profile
            </Text>
          </SmartPressable>
        </HStack>
      </VStack>
    </VStack>
  );
};

const UserDetail: React.FC<UserDetailType> = memo(() => {
  const navigationTheme = useTheme();
  const navigation = useNavigation();

  // Configure navigation options for proper gesture handling
  useEffect(() => {
    navigation.setOptions({
      // Remove custom header to avoid gesture conflicts
      headerShown: false,
      // Enable gesture handling for the collapsible tab view
      gestureEnabled: true,
      // This is critical for allowing header scroll
      headerMode: 'screen',
    });
  }, [navigation]);

  const renderPostItem = useCallback(({ item }: { item: any }) => {
    const POST_WIDTH = 250;
    const POST_HEIGHT = (POST_WIDTH * 4) / 3;
    
    return (
      <VStack spacing={theme.spacing.standard}>
        <HStack
          items="center"
          justify="center"
          padding={{ paddingHorizontal: theme.spacing.large }}
        >
          <Pressable
            onPress={() => {}}
            fill
            items="center"
            spacing={theme.spacing.small}
          >
            <Box
              borderRadius={999}
              width={40}
              height={40}
              backgroundColor={item.color}
            />
            <Text weight="medium" color={theme.pallate.neutral['01']}>
              {item.type}
            </Text>
          </Pressable>
          <Pressable onPress={() => {}}>
            <IconDots size={24} color={theme.pallate.neutral['01']} />
          </Pressable>
        </HStack>

        {/* Post Image Placeholder */}
        <Box
          margin={{ marginHorizontal: theme.spacing.large }}
          width={POST_WIDTH}
          height={POST_HEIGHT}
          backgroundColor={item.color}
          borderRadius={30}
        />

        {/* Action Buttons */}
        <HStack
          items="center"
          spacing={theme.spacing.medium}
          padding={{ paddingHorizontal: theme.spacing.large }}
        >
          <Pressable items="center" spacing={theme.spacing.small}>
            <Heart
              size={26}
              fill={theme.pallate.neutral['01']}
              color={theme.pallate.neutral['01']}
            />
            <Text type="b2" color={theme.pallate.neutral['01']}>
              12
            </Text>
          </Pressable>
          <Pressable items="center" spacing={theme.spacing.small}>
            <Repeat
              size={26}
              fill={theme.pallate.neutral['01']}
              color={theme.pallate.neutral['01']}
            />
            <Text type="b2" color={theme.pallate.neutral['01']}>
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
  }, [navigationTheme]);

  // Generate mock data for each tab
  const postsData = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: `post-${i}`,
      type: 'posts',
      color: theme.pallate.neutral['05'],
    }))
  , []);

  const reelsData = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: `reel-${i}`,
      type: 'reels',
      color: theme.pallate.neutral['04'],
    }))
  , []);

  const taggedData = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: `tagged-${i}`,
      type: 'tagged',
      color: theme.pallate.neutral['03'],
    }))
  , []);

  return (
    <Tabs.Container
      renderHeader={Header}
      headerContainerStyle={{
        shadowOpacity: 0,
        elevation: 0,
      }}
      containerStyle={{
        flex: 1,
      }}
      // Important: Allow simultaneous gesture handlers
      allowHeaderOverscroll={true}
      snapThreshold={0.5}
    >
      <Tabs.Tab name="Posts" label="Posts">
        <Tabs.FlashList
          data={postsData}
          renderItem={renderPostItem}
        />
      </Tabs.Tab>
      <Tabs.Tab name="Reels" label="Reels">
        <Tabs.FlashList
          data={reelsData}
          renderItem={renderPostItem}
        />
      </Tabs.Tab>
      <Tabs.Tab name="Tagged" label="Tagged">
        <Tabs.FlashList
          data={taggedData}
          renderItem={renderPostItem}
        />
      </Tabs.Tab>
    </Tabs.Container>
  );
});

export default UserDetail;
