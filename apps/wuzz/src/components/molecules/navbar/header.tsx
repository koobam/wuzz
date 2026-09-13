import React, { useMemo } from 'react';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { getNavbarConfig } from './_config';

/**
 * Optimized header component that only re-renders when route changes
 * This prevents unnecessary loads and re-renders
 */
const Header = React.memo((props: NativeStackHeaderProps) => {
  const routeName = props.route.name;
  
  // Memoize config lookup to prevent unnecessary recalculations
  const config = useMemo(() => getNavbarConfig(routeName), [routeName]);
  
  if (!config.visible) {
    return null;
  }

  if (config.renderContent) {
    return config.renderContent(props);
  }

  // Return null if no custom content - let screen handle its own header
  return null;
}, (prevProps, nextProps) => {
  // Only re-render if route name changes
  return prevProps.route.name === nextProps.route.name;
});

Header.displayName = 'NavbarHeader';

export default Header;

