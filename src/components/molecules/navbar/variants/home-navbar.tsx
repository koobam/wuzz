import React from 'react';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { HStackAnimated, theme } from '@components/atoms';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Custom navbar component for Home route
 * This is an example of a custom navbar variant
 */
export const HomeNavbar = React.memo((_props: NativeStackHeaderProps) => {
  const { top } = useSafeAreaInsets();
  
  return (
    <HStackAnimated
      padding={{
        paddingTop: top + theme.spacing.standard,
        paddingHorizontal: theme.spacing.large,
        paddingBottom: theme.spacing.standard,
      }}
      items="center"
      spacing={theme.spacing.standard}
      backgroundColor={theme.pallate.neutral['05']}
    >
      {/* Add your custom navbar content here */}
    </HStackAnimated>
  );
});

HomeNavbar.displayName = 'HomeNavbar';

