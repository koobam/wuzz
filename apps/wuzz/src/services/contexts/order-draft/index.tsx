import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';

export interface OrderDraftItem {
  /** Unik per baris pesanan (layanan yang sama bisa ditambah dengan add-on berbeda). */
  id: string;
  serviceId: string;
  name: string;
  /** Nama tier terpilih (mis. "Express"), kalau layanan punya tier. */
  tierName?: string;
  addOns: string[];
  /** Harga satuan dari API (dasar + add-on), dalam rupiah. */
  price: number;
  unit?: string;
  /** The service's picture, shown on its line in the checkout. */
  imageUri?: string;
  /** The service's icon name, used when it has no picture. */
  icon?: string;
  /** How many units the price applies to: the estimated kilos for a kiloan
   *  service. Absent means one. */
  quantity?: number;
  /** Kode tier terpilih, supaya "Edit" bisa membuka layanan dengan pilihan yang sama. */
  tierCode?: string;
  /** Id add-on terpilih, untuk alasan yang sama. */
  addOnIds?: string[];
  /** Batas jumlah (kg) yang boleh diatur dari checkout. Default 1 sampai 99. */
  minQuantity?: number;
  maxQuantity?: number;
}

interface OrderDraftValue {
  items: OrderDraftItem[];
  /** Jumlah harga semua baris (harga kiloan masih estimasi). */
  total: number;
  addItem: (item: Omit<OrderDraftItem, 'id'>) => void;
  removeItem: (id: string) => void;
  /** Ganti satu baris di tempatnya (hasil "Edit"). */
  replaceItem: (id: string, item: Omit<OrderDraftItem, 'id'>) => void;
  /** Atur jumlah satu baris, dalam batasnya. */
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
}

const OrderDraftContext = createContext<OrderDraftValue>({
  items: [],
  total: 0,
  addItem: () => {},
  removeItem: () => {},
  replaceItem: () => {},
  setQuantity: () => {},
  clear: () => {},
});

let nextId = 0;

/**
 * Keranjang: layanan yang sudah ditambahkan pengguna, dibayar sekali di checkout.
 */
export function OrderDraftProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<OrderDraftItem[]>([]);

  const addItem = useCallback((item: Omit<OrderDraftItem, 'id'>) => {
    nextId += 1;
    setItems(prev => [...prev, { ...item, id: `${item.serviceId}-${nextId}` }]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const replaceItem = useCallback(
    (id: string, item: Omit<OrderDraftItem, 'id'>) => {
      setItems(prev =>
        prev.map(line => (line.id === id ? { ...item, id } : line)),
      );
    },
    [],
  );

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems(prev =>
      prev.map(line => {
        if (line.id !== id) {
          return line;
        }
        const min = line.minQuantity ?? 1;
        const max = line.maxQuantity ?? 99;
        return { ...line, quantity: Math.min(max, Math.max(min, quantity)) };
      }),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<OrderDraftValue>(
    () => ({
      items,
      total: items.reduce(
        (sum, item) => sum + item.price * (item.quantity ?? 1),
        0,
      ),
      addItem,
      removeItem,
      replaceItem,
      setQuantity,
      clear,
    }),
    [items, addItem, removeItem, replaceItem, setQuantity, clear],
  );

  return (
    <OrderDraftContext.Provider value={value}>
      {children}
    </OrderDraftContext.Provider>
  );
}

export function useOrderDraft(): OrderDraftValue {
  return useContext(OrderDraftContext);
}
