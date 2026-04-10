import {
  Box,
  Divider,
  Flex,
  HStack,
  Pressable,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import { useTheme } from '@react-navigation/native';
import { Fragment, memo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  IconChevronLeft,
  IconDots,
} from 'tabler-icons-react-native';
import { ClipDetailType } from './clip-detail.types';
import { FlashList } from '@shopify/flash-list';
import Image from '@components/atoms/image';
import { ScrollView } from 'react-native';
import {
  Heart,
  Maximize,
  Maximize1,
  Maximize4,
  Notification,
  Repeat,
  Send2,
} from 'iconsax-react-native';

const ClipDetail = memo(({ route, navigation }: ClipDetailType) => {
  const navigationTheme = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const { id } = route.params || {};
  const POST_WIDTH = 300;
  const POST_HEIGHT = (POST_WIDTH * 4) / 3;
  return (
    <Fragment>
      <VStack
        as={
          <ScrollView
            contentContainerStyle={{ paddingBottom: theme.spacing.large * 2 }}
            showsVerticalScrollIndicator={false}
          />
        }
        fill
      >
        <HStack
          items="center"
          spacing={theme.spacing.standard}
          padding={{
            paddingHorizontal: theme.spacing.large,
            paddingVertical: theme.spacing.standard,
          }}
        >
          <Box
            width={45}
            height={45}
            backgroundColor={theme.pallate.neutral['05']}
            borderRadius={999}
          />
          <HStack items="baseline" spacing={theme.spacing.small}>
          <Text weight="medium" color={navigationTheme.colors.text}>
            loremipsum
          </Text>
          <Text weight="regular" type="l1" color={theme.pallate.neutral['03']}>
            21 Oct 2025
          </Text>
          </HStack>
        </HStack>
        <Text type="b2" margin={{
          marginHorizontal: theme.spacing.large,
          marginBottom: theme.spacing.standard,
        }} color={navigationTheme.colors.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel elit mauris. at vel elit mauris.
        </Text>
        <FlashList
          horizontal
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.large,
          }}
          pagingEnabled
          data={[
            {
              image: `https://picsum.photos/seed/${
                id || 'unique-default'
              }/400/300`,
            },
            {
              image: `https://picsum.photos/seed/${
                id || 'unique-default'
              }/500/300`,
            },
          ]}
          ItemSeparatorComponent={() => (
            <Divider thickness={theme.spacing.tiny} />
          )}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.goBack()}
              width={POST_WIDTH}
              height={POST_HEIGHT}
              borderRadius={30}
              style={{
                overflow: 'hidden',
              }}
            >
              <Image
                uri={item.image}
                resizeMode="cover"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </Pressable>
          )}
        />
        {/* Action Buttons Love, Repost, Reply, Share */}
        <HStack
          items="center"
          borderWidth={{
            borderBottomWidth: 1,
          }}
          borderColor={theme.pallate.neutral['05']}
          spacing={theme.spacing.medium}
          padding={{
            paddingHorizontal: theme.spacing.large,
            paddingTop: theme.spacing.standard,
            paddingBottom: theme.spacing.large,
          }}
        >
          <Pressable items="center" spacing={theme.spacing.tiny}>
            <Heart
              size={26}
              fill={theme.pallate.neutral['01']}
              color={navigationTheme.colors.text}
            />
            <Text type="b2" color={navigationTheme.colors.text}>
              12
            </Text>
          </Pressable>
          <Pressable items="center" spacing={theme.spacing.tiny}>
            <Repeat
              size={26}
              fill={theme.pallate.neutral['01']}
              color={navigationTheme.colors.text}
            />
            <Text type="b2" color={navigationTheme.colors.text}>
              12
            </Text>
          </Pressable>
          <Pressable items="center" spacing={theme.spacing.tiny}>
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
        {/* Comments */}
        <FlashList
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          data={[
            {
              id: 1,
              comment:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel elit mauris.',
              user: {
                id: 1,
                name: 'janfalih',
                profile: 'https://picsum.photos/200/300',
              },
            },
            {
              id: 2,
              comment:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel elit mauris.',
              user: {
                id: 2,
                name: 'jane',
                profile: 'https://picsum.photos/200/300',
              },
            },
            {
              id: 3,
              comment:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel elit mauris.',
              user: {
                id: 3,
                name: 'john',
                profile: 'https://picsum.photos/200/300',
              },
            },
            {
              id: 4,
              comment:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel elit mauris.',
              user: {
                id: 4,
                name: 'jane',
                profile: 'https://picsum.photos/200/300',
              },
            },
          ]}
          renderItem={({ item }) => (
            <HStack
              borderWidth={{
                borderBottomWidth: 1,
              }}
              borderColor={theme.pallate.neutral['05']}
              padding={{
                paddingVertical: theme.spacing.medium,
                paddingHorizontal: theme.spacing.large,
              }}
              items="center"
              spacing={theme.spacing.standard}
            >
              <Box
                width={40}
                height={40}
                backgroundColor={theme.pallate.neutral['05']}
                borderRadius={999}
                style={{
                  overflow: 'hidden',
                }}
              >
                <Image
                  uri={item.user.profile}
                  resizeMode="fill"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </Box>
              <VStack fill>
                <HStack items="baseline" spacing={theme.spacing.small}>
                <Text
                  weight="medium"
                  type="b2"
                  color={navigationTheme.colors.text}
                >
                  {item.user.name}
                </Text>
                <Text type="l1" color={theme.pallate.neutral['03']}>3 hours ago</Text>
                </HStack>
                <Text type="l1" color={navigationTheme.colors.text}>
                  {item.comment}
                </Text>
                {/*  */}
              </VStack>
            </HStack>
          )}
        />
      </VStack>
      <VStack padding={{
        paddingHorizontal: theme.spacing.large,
        paddingVertical: theme.spacing.standard,
      }} borderWidth={{
        borderTopWidth: 1,
      }} borderColor={theme.pallate.neutral['05']} backgroundColor={theme.pallate.neutral['06']}>
        {/* Input Reply */}

      </VStack> 
    </Fragment>
  );
});

export default ClipDetail;
