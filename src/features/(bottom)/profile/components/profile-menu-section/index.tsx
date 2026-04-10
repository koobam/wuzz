import { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import {
  HStack,
  Pressable,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import {
  PROFILE_MENU_ICON_COLOR,
  PROFILE_MENU_ICON_SIZE,
  PROFILE_MENU_ICON_VARIANT,
  PROFILE_MENU_SECTION_TITLE_COLOR,
} from '../../utils';
import {
  DocumentText,
  Global,
  Gift,
  Location,
  Lock,
  Logout,
  MessageQuestion,
  Notification,
  Receipt,
  TicketDiscount,
} from 'iconsax-react-native';
import type {
  ProfileMenuItem,
  ProfileMenuItemId,
  ProfileMenuGroup,
  ProfileMenuSectionProps,
} from './profile-menu-section.types';

const MENU_GROUPS: ProfileMenuGroup[] = [
  {
    title: 'Akun',
    items: [
      {
        id: 'referral',
        label: 'Referral',
        icon: (
          <Gift
            size={PROFILE_MENU_ICON_SIZE}
            variant={PROFILE_MENU_ICON_VARIANT}
            color={PROFILE_MENU_ICON_COLOR}
          />
        ),
      },
      {
        id: 'alamat',
        label: 'Alamat',
        icon: (
          <Location
            size={PROFILE_MENU_ICON_SIZE}
            variant={PROFILE_MENU_ICON_VARIANT}
            color={PROFILE_MENU_ICON_COLOR}
          />
        ),
      },
      {
        id: 'voucher',
        label: 'Voucher',
        icon: (
          <TicketDiscount
            size={PROFILE_MENU_ICON_SIZE}
            variant={PROFILE_MENU_ICON_VARIANT}
            color={PROFILE_MENU_ICON_COLOR}
          />
        ),
      },
      {
        id: 'pesanan',
        label: 'Pesanan',
        icon: (
          <Receipt
            size={PROFILE_MENU_ICON_SIZE}
            variant={PROFILE_MENU_ICON_VARIANT}
            color={PROFILE_MENU_ICON_COLOR}
          />
        ),
      },
    ],
  },
  {
    title: 'Bantuan & Kebijakan',
    items: [
      {
        id: 'faq',
        label: 'FAQ',
        icon: (
          <MessageQuestion
            size={PROFILE_MENU_ICON_SIZE}
            variant={PROFILE_MENU_ICON_VARIANT}
            color={PROFILE_MENU_ICON_COLOR}
          />
        ),
      },
      {
        id: 'syarat-ketentuan',
        label: 'Syarat & Ketentuan',
        icon: (
          <DocumentText
            size={PROFILE_MENU_ICON_SIZE}
            variant={PROFILE_MENU_ICON_VARIANT}
            color={PROFILE_MENU_ICON_COLOR}
          />
        ),
      },
      {
        id: 'kebijakan-privasi',
        label: 'Kebijakan Privasi',
        icon: (
          <Lock
            size={PROFILE_MENU_ICON_SIZE}
            variant={PROFILE_MENU_ICON_VARIANT}
            color={PROFILE_MENU_ICON_COLOR}
          />
        ),
      },
    ],
  },
  {
    title: 'Pengaturan',
    items: [
      {
        id: 'bahasa',
        label: 'Bahasa',
        icon: (
          <Global
            size={PROFILE_MENU_ICON_SIZE}
            variant={PROFILE_MENU_ICON_VARIANT}
            color={PROFILE_MENU_ICON_COLOR}
          />
        ),
      },
      {
        id: 'notifikasi',
        label: 'Notifikasi',
        icon: (
          <Notification
            size={PROFILE_MENU_ICON_SIZE}
            variant={PROFILE_MENU_ICON_VARIANT}
            color={PROFILE_MENU_ICON_COLOR}
          />
        ),
      },
      {
        id: 'logout',
        label: 'Logout',
        icon: (
          <Logout
            size={PROFILE_MENU_ICON_SIZE}
            variant={PROFILE_MENU_ICON_VARIANT}
            color={theme.pallate.danger['03']}
          />
        ),
      },
    ],
  },
];

const rowPadding = {
  paddingHorizontal: theme.spacing.large,
  paddingVertical: theme.spacing.standard + 2,
};

function MenuGroupCard({
  items,
  onPress,
}: {
  items: ProfileMenuItem[];
  onPress: (id: ProfileMenuItemId) => void;
}) {
  return (
    <VStack
      borderRadius={16}
      borderWidth={1}
      borderColor={theme.pallate.neutral['03']}
    >
      {items.map((item, index) => (
        <VStack key={item.id}>
          {index > 0 && <VStack style={styles.divider} />}
          <Pressable
            onPress={() => onPress(item.id)}
            padding={rowPadding}
            accessibilityRole="button"
            accessibilityLabel={item.label}
          >
            <HStack items="center" spacing={theme.spacing.standard}>
              {item.icon}
              <Text
                type="l1"
                weight="medium"
                color={theme.pallate.neutral['05']}
              >
                {item.label}
              </Text>
            </HStack>
          </Pressable>
        </VStack>
      ))}
    </VStack>
  );
}

export const ProfileMenuSection = memo(function ProfileMenuSection({
  onMenuPress,
}: ProfileMenuSectionProps) {
  const handlePress = useCallback(
    (id: ProfileMenuItemId) => {
      onMenuPress?.(id);
    },
    [onMenuPress],
  );

  return (
    <VStack spacing={theme.spacing.large}>
      {MENU_GROUPS.map((group) => (
        <VStack key={group.title} spacing={theme.spacing.standard}>
          <Text
            type="l1"
            weight="semibold"
            color={PROFILE_MENU_SECTION_TITLE_COLOR}
          >
            {group.title}
          </Text>
          <MenuGroupCard items={group.items} onPress={handlePress} />
        </VStack>
      ))}
    </VStack>
  );
});

const styles = StyleSheet.create({
  divider: {
    height: 1,
    marginHorizontal: theme.spacing.large,
    backgroundColor: theme.pallate.neutral['03'],
  },
});

export type {
  ProfileMenuItem,
  ProfileMenuItemId,
  ProfileMenuSectionProps,
} from './profile-menu-section.types';
