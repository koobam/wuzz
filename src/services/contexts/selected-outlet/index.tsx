import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { OutletListItem } from '@features/(outlet)/outlet-list/types';

interface SelectedOutletValue {
  /** Outlet terpilih (data lengkap) — ditampilkan konsisten di home & mana pun.
   *  Id-nya diambil via `selectedOutlet?.id`. */
  selectedOutlet: OutletListItem | null;
  /** Pilih outlet secara eksplisit (mis. dari daftar outlet). */
  setSelectedOutlet: (outlet: OutletListItem) => void;
  /**
   * Set default dari nearest outlet — HANYA sekali di awal, saat user belum
   * memilih. Aman dipanggil berkali-kali (idempotent).
   */
  initFromNearest: (outlet: OutletListItem) => void;
}

const SelectedOutletContext = createContext<SelectedOutletValue>({
  selectedOutlet: null,
  setSelectedOutlet: () => {},
  initFromNearest: () => {},
});

export function SelectedOutletProvider({ children }: { children: ReactNode }) {
  const [selectedOutlet, setSelectedOutletState] =
    useState<OutletListItem | null>(null);
  // true setelah pertama kali di-set (dari nearest atau pilihan user) → nearest
  // tidak lagi menimpa pilihan.
  const initializedRef = useRef(false);

  const setSelectedOutlet = useCallback((outlet: OutletListItem) => {
    initializedRef.current = true;
    setSelectedOutletState(outlet);
  }, []);

  const initFromNearest = useCallback((outlet: OutletListItem) => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    setSelectedOutletState(outlet);
  }, []);

  const value = useMemo<SelectedOutletValue>(
    () => ({
      selectedOutlet,
      setSelectedOutlet,
      initFromNearest,
    }),
    [selectedOutlet, setSelectedOutlet, initFromNearest],
  );

  return (
    <SelectedOutletContext.Provider value={value}>
      {children}
    </SelectedOutletContext.Provider>
  );
}

export function useSelectedOutlet(): SelectedOutletValue {
  return useContext(SelectedOutletContext);
}
