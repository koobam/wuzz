import { ReactNode } from 'react';

export type OTPMethodType = {
    title: string;
    description: string;
    onPress: () => void;
    icon: ReactNode;
}
