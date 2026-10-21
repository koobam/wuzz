import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { OutletListItem } from '@features/(outlet)/outlet-list/types';

interface SelectedOutletValue {
  /** Outlet yang dipilih user (data lengkap). Null sampai user memilih sendiri —
   *  tidak pernah dipilihkan otomatis. Id-nya diambil via `selectedOutlet?.id`. */
  selectedOutlet: OutletListItem | null;
  /** Pilih outlet secara eksplisit (dari daftar outlet). */
  setSelectedOutlet: (outlet: OutletListItem) => void;
}

const SelectedOutletContext = createContext<SelectedOutletValue>({
  selectedOutlet: null,
  setSelectedOutlet: () => {},
});

export function SelectedOutletProvider({ children }: { children: ReactNode }) {
  const [selectedOutlet, setSelectedOutletState] =
    useState<OutletListItem | null>(null);

  const setSelectedOutlet = useCallback((outlet: OutletListItem) => {
    setSelectedOutletState(outlet);
  }, []);

  const value = useMemo<SelectedOutletValue>(
    () => ({ selectedOutlet, setSelectedOutlet }),
    [selectedOutlet, setSelectedOutlet],
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
