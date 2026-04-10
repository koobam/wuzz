import { Flex, HStack, Pressable, VStack } from '@components/atoms';
import { LinearGradient } from 'react-native-linear-gradient';
import {
  ArrowDown2,
  ArrowLeft,
  CalendarEdit,
  Edit,
  Send2,
} from 'iconsax-react-native';
import { Text } from '@components/atoms';
import { theme } from '@components/atoms/theme';
import { IconShare2 } from 'tabler-icons-react-native';
import { useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react'

export const Header = (): React.ReactElement => {
  const navigationTheme = useTheme();
  const { top } = useSafeAreaInsets();

  return (
    <VStack>
      <LinearGradient colors={['#C942FF', '#782899']}>
        <VStack
          padding={{
            paddingTop: theme.spacing.large + top,
            paddingHorizontal: theme.spacing.large,
            paddingBottom: theme.spacing.large + 80,
          }}
          height={200}
        />
      </LinearGradient>
      <HStack
        width="100%"
        padding={{
          paddingHorizontal: theme.spacing.large,
        }}
        justify="space-between"
        position={{
          top: top,
        }}
      >
        <Pressable
          onPress={() => {}}
          spacing={theme.spacing.small}
          backgroundColor={theme.pallate.neutral['05']}
          padding={{
            paddingHorizontal: theme.spacing.medium,
            paddingVertical: theme.spacing.standard,
          }}
          borderRadius={999}
          items="center"
          borderWidth={1}
          style={{
            ...theme.elevations['10'],
          }}
          borderColor={theme.pallate.neutral['01']}
          justify="center"
        >
          <ArrowLeft color={theme.pallate.neutral['01']} size={20} />
          <Text type="l1" weight="medium" color={theme.pallate.neutral['01']}>
            Back
          </Text>
        </Pressable>
        <Pressable
          spacing={theme.spacing.small}
          backgroundColor={theme.pallate.neutral['05']}
          padding={{
            paddingHorizontal: theme.spacing.medium,
            paddingVertical: theme.spacing.standard,
          }}
          borderRadius={999}
          borderWidth={1}
          style={{
            ...theme.elevations['10'],
          }}
          items="center"
          borderColor={theme.pallate.neutral['01']}
          justify="center"
        >
          <CalendarEdit
            color={theme.pallate.neutral['01']}
            variant="Bulk"
            size={20}
          />
          <Text type="l1" weight="bold" color={theme.pallate.neutral['01']}>
            2025
          </Text>
          <ArrowDown2 color={theme.pallate.neutral['01']} size={14} />
        </Pressable>
      </HStack>
      <VStack
        spacing={theme.spacing.extraLarge}
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingTop: theme.spacing.extraLarge * 2,
          paddingBottom: theme.spacing.large,
        }}
        style={{
          ...theme.elevations['10'],
        }}
      >
        <VStack
          padding={{
            paddingHorizontal: theme.spacing.large,
            paddingVertical: theme.spacing.medium,
          }}
          margin={{
            marginHorizontal: -1,
            marginTop: -120,
          }}
          borderRadius={18}
          borderWidth={1}
          borderColor={theme.pallate.neutral['01']}
          fill
          spacing={theme.spacing.standard}
          backgroundColor={theme.pallate.neutral['05']}
        >
          <Text type="b2" italic color={theme.pallate.neutral['01']}>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vel
            elit mauris.""
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
        <VStack spacing={theme.spacing.standard}>
          <HStack items="center" spacing={theme.spacing.standard}>
            <Flex
              width={50}
              height={50}
              backgroundColor={theme.pallate.neutral['01']}
              borderRadius={999}
            />
            <VStack fill>
              <Text color={theme.pallate.neutral['01']} weight="bold" type="s3">
                Jan Falih Fadhillah
              </Text>
              <Text type="l1" color={theme.pallate.neutral['01']}>
                @janfalih
              </Text>
            </VStack>
            <Pressable
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
            >
              <Send2
                color={theme.pallate.neutral['01']}
                variant="Bulk"
                size={24}
              />
            </Pressable>
          </HStack>
          <HStack>
            <VStack fill>
              <Text type="l1" color={navigationTheme.colors.text}>
                Followers
              </Text>
              <Text type="s3" weight="bold" color={navigationTheme.colors.text}>
                10
              </Text>
            </VStack>
            <VStack fill>
              <Text type="l1" color={navigationTheme.colors.text}>
                Following
              </Text>
              <Text type="s3" weight="bold" color={navigationTheme.colors.text}>
                2
              </Text>
            </VStack>
            <VStack fill>
              <Text type="l1" color={navigationTheme.colors.text}>
                Moments
              </Text>
              <Text type="s3" weight="bold" color={navigationTheme.colors.text}>
                3
              </Text>
            </VStack>
          </HStack>
          <HStack spacing={theme.spacing.small}>
            <Pressable
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
            </Pressable>
            <Pressable
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
            >
              <IconShare2 color={theme.pallate.neutral['01']} size={20} />
              <Text
                type="l1"
                weight="medium"
                color={theme.pallate.neutral['01']}
              >
                Share Profile
              </Text>
            </Pressable>
          </HStack>
        </VStack>
      </VStack>
    </VStack>
  );
};
