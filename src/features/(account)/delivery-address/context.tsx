import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { DeliveryAddress, DeliveryAddressDraft } from './types';

// Contoh awal — ganti dengan data dari API bila sudah tersedia.
const SEED_ADDRESSES: DeliveryAddress[] = [
  {
    id: 'addr-1',
    label: 'Rumah',
    labelType: 'home',
    address: 'Jl. Melati No. 12, Serpong, Tangerang Selatan',
    detail: 'Pagar hijau, sebelah warung Bu Sri',
    recipientName: 'Dimas',
    phone: '081234567890',
    notes: 'Titip ke satpam kalau tidak ada orang',
    lat: -6.301,
    lng: 106.652,
    distanceKm: 2.4,
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Kantor',
    labelType: 'office',
    address: 'Gedung Wuzz Tower Lt. 8, Jl. Sudirman Kav. 5, Jakarta Pusat',
    detail: 'Resepsionis lantai 8',
    recipientName: 'Dimas (kantor)',
    phone: '081298765432',
    lat: -6.2088,
    lng: 106.8456,
    distanceKm: 12.1,
  },
  {
    id: 'addr-3',
    label: 'Kos',
    labelType: 'other',
    address: 'Kos Melati Blok C No. 4, Jl. Kenanga Raya, Depok',
    detail: 'Kamar lantai 2, pintu paling ujung',
    recipientName: 'Dimas',
    phone: '081211223344',
    notes: 'WA dulu sebelum sampai',
    lat: -6.4025,
    lng: 106.7942,
    distanceKm: 5.8,
  },
  {
    id: 'addr-4',
    label: 'Rumah Ortu',
    labelType: 'home',
    address: 'Jl. Anggrek No. 27, Bekasi Barat, Kota Bekasi',
    detail: 'Rumah cat putih, ada pohon mangga',
    recipientName: 'Ibu Sari',
    phone: '081377889900',
    lat: -6.2349,
    lng: 106.9896,
    distanceKm: 18.3,
  },
  {
    id: 'addr-5',
    label: 'Toko',
    labelType: 'other',
    address: 'Ruko Sentra Niaga No. 11, Jl. Boulevard, Bintaro, Tangsel',
    detail: 'Sebelah minimarket',
    recipientName: 'Dimas (toko)',
    phone: '081255667788',
    lat: -6.2756,
    lng: 106.7124,
    distanceKm: 7.2,
  },
];

interface DeliveryAddressValue {
  addresses: DeliveryAddress[];
  defaultAddress: DeliveryAddress | null;
  addAddress: (draft: DeliveryAddressDraft) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const DeliveryAddressContext = createContext<DeliveryAddressValue>({
  addresses: [],
  defaultAddress: null,
  addAddress: () => {},
  removeAddress: () => {},
  setDefaultAddress: () => {},
});

export function DeliveryAddressProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(SEED_ADDRESSES);

  const addAddress = useCallback((draft: DeliveryAddressDraft) => {
    setAddresses((prev) => {
      const id = `addr-${Date.now()}`;
      const isFirst = prev.length === 0;
      // Kalau draft di-set default, cabut default lama.
      const makeDefault = draft.isDefault || isFirst;
      const next = makeDefault
        ? prev.map((a) => ({ ...a, isDefault: false }))
        : prev;
      return [...next, { ...draft, id, isDefault: makeDefault }];
    });
  }, []);

  const removeAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const setDefaultAddress = useCallback((id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id })),
    );
  }, []);

  const value = useMemo<DeliveryAddressValue>(
    () => ({
      addresses,
      defaultAddress: addresses.find((a) => a.isDefault) ?? null,
      addAddress,
      removeAddress,
      setDefaultAddress,
    }),
    [addresses, addAddress, removeAddress, setDefaultAddress],
  );

  return (
    <DeliveryAddressContext.Provider value={value}>
      {children}
    </DeliveryAddressContext.Provider>
  );
}

export function useDeliveryAddress(): DeliveryAddressValue {
  return useContext(DeliveryAddressContext);
}
