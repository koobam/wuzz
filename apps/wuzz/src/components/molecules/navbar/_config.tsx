import React from 'react';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/root/root.types';

/**
 * Configuration for navbar behavior per route
 */
export type NavbarConfig = {
  /** Whether the navbar should be visible for this route */
  visible: boolean;
  /** Optional custom render function. If provided, this will be used instead of the default navbar content */
  renderContent?: (props: NativeStackHeaderProps) => React.ReactElement | null;
};

export type RouteName = keyof RootStackParamList | typeof PROFILE_NAVIGATION_ROUTES[keyof typeof PROFILE_NAVIGATION_ROUTES];

const defaultConfig: NavbarConfig = {
  visible: true,
};

/**
 * Route-to-configuration mapping for navbar behavior
 * 
 * Usage examples:
 * 
 * 1. Hide navbar for a specific route:
 *    'clip-detail': {
 *      visible: false,
 *    },
 * 
 * 2. Show navbar with custom content:
 *    'user-detail': {
 *      visible: true,
 *      renderContent: (props) => {
 *        return <CustomUserDetailNavbar {...props} />;
 *      },
 *    },
 * 
 * 3. Use default navbar (no config needed):
 *    Routes not listed here will use the default navbar content
 */
const navbarConfigs: Record<string, NavbarConfig> = {
  // Default configuration - visible with default content
  default: defaultConfig,
  // Example: Hide navbar for a specific route
  // 'clip-detail': {
  //   visible: false,
  // },
  
  // Example: Custom navbar for user detail route
  // 'user-detail': {
  //   visible: true,
  //   renderContent: (props) => <UserDetailNavbar {...props} />,
  // },
};

/**
 * Get navbar configuration for a specific route
 * @param routeName - The name of the route
 * @returns NavbarConfig for the route, or default config if not found
 */
export const getNavbarConfig = (routeName: string | undefined): NavbarConfig => {
  if (!routeName) {
    return defaultConfig;
  }
  
  return navbarConfigs[routeName] || defaultConfig;
};

export default navbarConfigs;

