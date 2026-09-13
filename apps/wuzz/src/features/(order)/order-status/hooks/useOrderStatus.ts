import { useMemo, useState } from 'react';
import { DEFAULT_ORDER, MOCK_ORDERS } from '../mocks';

export const useOrderStatus = (orderId: string | undefined) => {
  const [loading] = useState(false);
  const [error] = useState<Error | null>(null);

  const order = useMemo(() => {
    if (!orderId) return undefined;
    return MOCK_ORDERS[orderId] ?? { ...DEFAULT_ORDER, orderId, id: orderId };
  }, [orderId]);

  return { order, loading, error };
};
