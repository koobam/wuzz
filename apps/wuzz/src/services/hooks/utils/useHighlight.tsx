import { Highlight } from '@services/contexts/highlight/highlight.context';
import { useContext } from 'react';

export const useHighlight = () => {
    const context = useContext(Highlight.Context);
    if (!context) {
      throw new Error('useHighlight must be used within a HighlightProvider');
    }
    return context;
  };
