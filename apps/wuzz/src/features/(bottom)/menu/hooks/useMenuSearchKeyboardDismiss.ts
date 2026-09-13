import { useEffect } from 'react';
import { Keyboard } from 'react-native';

export interface UseMenuSearchKeyboardDismissParams {
  hasQuery: boolean;
  onClose: () => void;
}

/**
 * Subscribes to keyboard dismiss. When the keyboard is hidden and the search
 * query is empty, calls onClose (e.g. to go back from menu search).
 */
export function useMenuSearchKeyboardDismiss(
  params: UseMenuSearchKeyboardDismissParams,
): void {
  const { hasQuery, onClose } = params;

  useEffect(() => {
    const subscription = Keyboard.addListener('keyboardDidHide', () => {
      if (!hasQuery) {
        onClose();
      }
    });
    return () => subscription.remove();
  }, [hasQuery, onClose]);
}
