import type { StyleProp, ViewStyle } from 'react-native';
import type { UseFloatingDragOptions } from '../../hooks/useFloatingDrag';

export interface FloatingDraggableProps extends UseFloatingDragOptions {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}
