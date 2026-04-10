import type { Wuzzer } from '../../../types';

export type WuzzerCardProps = {
  wuzzer: Wuzzer;
  onCallPress?: (phoneNumber: string) => void;
  onChatPress?: (wuzzerId: string) => void;
};
