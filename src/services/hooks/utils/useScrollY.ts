import { ScrollY } from '@services/contexts';
import { useContext } from 'react';

export const useScrollY = () => {
  const context = useContext(ScrollY.Context);
  if (!context) {
    throw new Error('useScrollY must be used within a ScrollYProvider');
  }
  return context;
};

