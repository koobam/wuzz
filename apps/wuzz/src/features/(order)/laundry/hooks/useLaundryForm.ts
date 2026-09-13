import type { LaundryChecklistSection, ServiceTypeId } from '../types';
import {
  BASE_PRICE_PER_KG,
  SERVICE_TYPE_OPTIONS_DATA,
} from '../utils';
import { formatPriceRupiah } from '../utils/format';
import { useCallback, useEffect, useMemo, useState } from 'react';

function getDefaultSectionSelections(
  sections: LaundryChecklistSection[],
): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const section of sections) {
    if (!section.canOptOut && section.options.length > 0) {
      out[section.id] = [section.options[0].id];
    } else {
      const freeIds = section.options
        .filter(o => o.free === true)
        .map(o => o.id);
      out[section.id] = freeIds.length > 0 ? freeIds : [];
    }
  }
  return out;
}

export interface UseLaundryFormParams {
  initialWeightKg?: number;
  initialServiceId?: ServiceTypeId;
  /** Section yang dipakai untuk kalkulasi harga. */
  mainSectionId: string;
  /** Daftar section checklist (dinamis). */
  sections: LaundryChecklistSection[];
  laundryType?: 'single' | 'multiple';
}

export function useLaundryForm({
  initialWeightKg = 5,
  initialServiceId,
  mainSectionId,
  sections,
  laundryType,
}: UseLaundryFormParams) {
  const [weightKg, setWeightKg] = useState(initialWeightKg);
  const [selectedServiceId, setSelectedServiceId] =
    useState<ServiceTypeId | undefined>(initialServiceId);
  const [sectionSelections, setSectionSelections] = useState<
    Record<string, string[]>
  >(() => getDefaultSectionSelections(sections));

  useEffect(() => {
    setSectionSelections(getDefaultSectionSelections(sections));
  }, [sections]);

  const handleWeightChange = useCallback((kg: number) => {
    setWeightKg(kg);
  }, []);

  const handleServiceSelect = useCallback((id: ServiceTypeId) => {
    setSelectedServiceId(id);
  }, []);

  const handleSectionSelectionChange = useCallback(
    (sectionId: string, ids: string[]) => {
      setSectionSelections(prev => ({ ...prev, [sectionId]: ids }));
    },
    [],
  );

  const mainSection = useMemo(
    () => sections.find(s => s.id === mainSectionId),
    [sections, mainSectionId],
  );

  const priceLabel = useMemo(() => {
    if (!mainSection) return formatPriceRupiah(0);
    const mainSelectedIds = sectionSelections[mainSectionId] ?? [];
    if (laundryType === 'single') {
      const itemsTotal = mainSelectedIds.reduce(
        (sum, id) =>
          sum + (mainSection.options.find(o => o.id === id)?.price ?? 0),
        0,
      );
      const serviceExtra =
        SERVICE_TYPE_OPTIONS_DATA.find(o => o.id === selectedServiceId)
          ?.extraSatuan ?? 0;
      return formatPriceRupiah(itemsTotal + serviceExtra);
    }
    const serviceExtra =
      SERVICE_TYPE_OPTIONS_DATA.find(o => o.id === selectedServiceId)
        ?.extraPerKg ?? 0;
    const addOnExtra = mainSelectedIds.reduce(
      (sum, id) =>
        sum +
        (mainSection.options.find(o => o.id === id)?.extraPerKg ?? 0),
      0,
    );
    const pricePerKg = BASE_PRICE_PER_KG + serviceExtra + addOnExtra;
    return formatPriceRupiah(pricePerKg * weightKg);
  }, [
    laundryType,
    weightKg,
    selectedServiceId,
    mainSection,
    sectionSelections,
    mainSectionId,
  ]);

  return {
    weightKg,
    selectedServiceId,
    sectionSelections,
    handleWeightChange,
    handleServiceSelect,
    handleSectionSelectionChange,
    priceLabel,
  };
}
