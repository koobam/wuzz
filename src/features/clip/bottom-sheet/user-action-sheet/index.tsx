import React, { Fragment, memo, useCallback, useMemo } from 'react';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  VStack,
  Text,
  theme,
  BottomSheetBackdrop,
  Button,
  Divider,
  HStack,
  Pressable,
  Box,
} from '@components/atoms';
import { IconBookmark, IconSend, IconUserMinus } from 'tabler-icons-react-native';
import Dash from 'react-native-dash';
import { FlashList } from '@shopify/flash-list';

// Dummy user actions array
const USER_ACTIONS = [
  {
    key: 'title1',
    items: [
      {
        key: 'bookmark',
        title: 'Bookmark',
        description: 'Bookmark this clip to your list of saved clips.',
        icon: <IconBookmark color={theme.pallate.neutral['01']} />,
      },
      {
        key: 'message',
        icon: <IconSend color={theme.pallate.neutral['01']} />, // Replace with icon if desired.
        title: 'Send Message',
        description: undefined,
        danger: false,
        onPress: () => {},
      },
    ],
  },
  {
    key: 'title2',
    title: 'Block and Report', // Section title
    description:
      'You can block this user and report them for inappropriate content.',
    items: [
      {
        key: 'block',
        icon: <IconUserMinus color={theme.pallate.neutral['01']} />, // Replace with icon if desired.
        title: 'Block User',
        description: 'You will not see content from this user.',
        danger: true,
        onPress: () => {},
      },
      {
        key: 'report',
        icon: <IconUserMinus color={theme.pallate.neutral['01']} />, // Replace with icon if desired.
        title: 'Report User',
        description: 'Report this user for inappropriate content.',
        danger: true,
        onPress: () => {},
      },
    ],
  },
];

interface UserActionSheetProps {
  ref: React.ForwardedRef<BottomSheetModal>;
  actions?: typeof USER_ACTIONS;
}

export const UserActionSheet = memo((props: UserActionSheetProps) => {
  const { ref, actions = USER_ACTIONS } = props;
  const { bottom, top } = useSafeAreaInsets();

  const renderBackdrop = useCallback(
    (val: React.JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...val} />
    ),
    [],
  );

  const renderItem = useCallback(({ item }) => {
    return (
      <VStack
        padding={{
          paddingHorizontal: theme.spacing.large,
        }}
        spacing={theme.spacing.large}
      >
        {item.title && (
          <VStack>
            <Text
              type="b2"
              weight="bold"
              color={theme.pallate.neutral['01']}
              text={item.title}
            />
            {item.description && (
              <Text
                type="l2"
                color={theme.pallate.neutral['01']}
                text={item.description}
              />
            )}
          </VStack>
        )}
        <VStack
          backgroundColor={theme.pallate.neutral['05']}
          borderRadius={theme.spacing.large}
        >
          {item.items.map((val, index) => (
            <Fragment key={val.key}>
              <Pressable
                items="center"
                spacing={theme.spacing.large}
                padding={{
                  paddingHorizontal: theme.spacing.large,
                  paddingVertical: theme.spacing.large,
                }}
              >
                {val.icon}
                <VStack fill>
                  <Text
                    weight="semibold"
                    type="l1"
                    color={theme.pallate.neutral['01']}
                    text={val.title}
                  />
                  {val.description && (
                    <Text
                      type="l2"
                      color={theme.pallate.neutral['01']}
                      text={val.description}
                    />
                  )}
                </VStack>
              </Pressable>
              {index !== item.items.length - 1 && (
                <Box
                  width="100%"
                  height={1}
                  backgroundColor={theme.pallate.neutral['04']}
                />
              )}
            </Fragment>
          ))}
        </VStack>
      </VStack>
    );
  }, []);

  const ListHeaderComponent = useMemo(
    () => (
      <VStack
        backgroundColor={theme.pallate.neutral['06']}
        borderWidth={{
          borderBottomWidth: 1,
        }}
        borderColor={theme.pallate.neutral['04']}
        padding={theme.spacing.large}
      >
        <Text
          type="s3"
          weight="bold"
          color={theme.pallate.neutral['01']}
          text={'User Options'}
        />
        <Text
          type="l1"
          color={theme.pallate.neutral['01']}
          text="What do you want to do with this user?"
        />
      </VStack>
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      enablePanDownToClose
      topInset={top + theme.spacing.standard}
      keyboardBehavior="interactive"
      backgroundStyle={{ backgroundColor: theme.pallate.neutral['06'] }}
      handleIndicatorStyle={{ backgroundColor: theme.pallate.neutral['03'] }}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetFlatList
        contentContainerStyle={{
          paddingBottom: bottom + theme.spacing.standard,
        }}
        initialNumToRender={0}
        data={actions}
        stickyHeaderIndices={[0]}
        renderItem={renderItem}
        scrollEnabled={false}
        ItemSeparatorComponent={() => (
          <Divider thickness={theme.spacing.large} />
        )}
        keyExtractor={item => item.key}
      />
    </BottomSheetModal>
  );
});

UserActionSheet.displayName = 'features/clip/user-action-sheet';
export default UserActionSheet;
