import { ReactNode } from 'react';


export type SocialMediaType = {
    title: string;
    onPress: () => void;
    icon: ReactNode;
}
