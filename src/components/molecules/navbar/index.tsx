import React, { useMemo } from 'react';
import { Flex, HStackAnimated, Pressable, Text, theme } from '@components/atoms';
import { PROFILE_NAVIGATION_ROUTES } from '@navigation/profile-navigation/_routes';
import { useNavigation } from '@react-navigation/native';
import { Setting, Setting2 } from 'iconsax-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconChevronDown } from 'tabler-icons-react-native';
import { NativeStackNavigationProp, NativeStackHeaderProps } from '@react-navigation/native-stack';
import { ProfileNavigationParamList } from '@navigation/profile-navigation/profile-navigation.types';
import { getNavbarConfig } from './_config';

type ProfileNavigationProps = NativeStackNavigationProp<ProfileNavigationParamList>;

const DefaultNavbarContent = React.memo((_props: NativeStackHeaderProps) => {
  const navigation = useNavigation<ProfileNavigationProps>();
  const {top} = useSafeAreaInsets();
 
  return (
    <HStackAnimated
      padding={{
        paddingTop: top + theme.spacing.standard,
        paddingHorizontal: theme.spacing.large,
      }}
      items="center"
      spacing={theme.spacing.standard}
    >
      <Pressable onPress={() => navigation.navigate(PROFILE_NAVIGATION_ROUTES.CHOOSE_USER_PROFILE)} items="center" spacing={theme.spacing.small}>
        <Text weight="bold" color={theme.pallate.neutral['01']}>janfalih_</Text>
        <IconChevronDown color={theme.pallate.neutral['01']} size={20} />
      </Pressable>
      <Flex fill />
      <Pressable height={50} padding={{
        paddingHorizontal: theme.spacing.medium,
        paddingVertical: theme.spacing.standard,
      }} items="center" spacing={theme.spacing.tiny} style={{
        ...theme.elevations[5],
      }} backgroundColor={theme.pallate.neutral['05']} borderRadius={999}>
        <Setting size={24} color={theme.pallate.neutral['01']} />
        <Text type="l1" weight="bold" color={theme.pallate.neutral['01']}>Avatar</Text>
      </Pressable>
      <Pressable  height={50} width={50} padding={{
        paddingHorizontal: theme.spacing.medium,
        paddingVertical: theme.spacing.standard,
      }} items="center" justify="center" spacing={theme.spacing.tiny} style={{
        ...theme.elevations[5],
      }} backgroundColor={theme.pallate.neutral['05']} borderRadius={999}>
        <Setting2 variant="Bulk" size={24} color={theme.pallate.neutral['01']} />
      </Pressable>
    </HStackAnimated>
  );
});

DefaultNavbarContent.displayName = 'DefaultNavbarContent';

/**
 * Optimized Navbar component with memoization
 * Only re-renders when route name changes
 */
const Navbar = React.memo((props: NativeStackHeaderProps) => {
  const routeName = props.route.name;
  
  // Memoize config lookup
  const config = useMemo(() => getNavbarConfig(routeName), [routeName]);
  
  if (!config.visible) {
    return null;
  }

  if (config.renderContent) {
    return config.renderContent(props);
  }

  return <DefaultNavbarContent {...props} />;
}, (prevProps, nextProps) => {
  // Only re-render if route name changes
  return prevProps.route.name === nextProps.route.name;
});

Navbar.displayName = 'Navbar';

export default Navbar;
