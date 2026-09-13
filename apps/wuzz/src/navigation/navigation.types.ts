import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {RootStackParamList} from './root/root.types';

export interface Routes {
  name: keyof RootStackParamList;
  auth: boolean;
  options?: NativeStackNavigationOptions;
  components: any | Routes[];
}
