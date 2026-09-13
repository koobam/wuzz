import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/root/root.types';
import { MenuSearchContent } from '@features/(bottom)/menu';
import { memo, useCallback } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

export type MenuSearchScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'menusearch'
>;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});

export const MenuSearch = memo((props: MenuSearchScreenProps) => {
  const { navigation } = props;

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.fill}
    >
      <MenuSearchContent onClose={handleClose} />
    </KeyboardAvoidingView>
  );
});

MenuSearch.displayName = 'MenuSearch';
export default MenuSearch;
