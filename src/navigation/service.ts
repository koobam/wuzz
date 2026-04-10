// navigationService.ts
import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';
import { RootStackParamList } from './root/root.types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function reset(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name, params }],
      })
    );
  }
}
