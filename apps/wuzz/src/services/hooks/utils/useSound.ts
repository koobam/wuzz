import { Sound } from '@services/contexts';
import { useContext } from 'react';

export const useSound = () => {
    const context = useContext(Sound.Context);
    if (!context) {
      throw new Error('useHighlight must be used within a HighlightProvider');
    }
    return context;
  };
