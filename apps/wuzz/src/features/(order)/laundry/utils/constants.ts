import type {
  AddOnOption,
  ChecklistOption,
  LaundryChecklistSection,
  ServiceTypeOptionData,
  WashAddOnId,
} from '../types';

/** Weight estimate slider range and layout */
export const MIN_KG = 3;
export const MAX_KG = 15;
export const THUMB_SIZE = 20;
export const TRACK_HEIGHT = 8;
export const TOOLTIP_WIDTH = 48;

/**
 * About how many garments a kilo holds, as a range: the usual laundry rule of
 * thumb (a tee, a shirt and a pair of trousers average out near 200-250 g). An
 * estimate to give a feel for the weight, not a count the order depends on.
 */
export const PIECES_PER_KG_MIN = 4;
export const PIECES_PER_KG_MAX = 5;

/** Base price per kg untuk multiple (kiloan) saja. Single = selected options + service extra saja. Rupiah. */
export const BASE_PRICE_PER_KG = 5_000;

/** Default price label in laundry footer */
export const DEFAULT_PRICE_LABEL = 'Rp 0';

/** Fallback error copy when laundry service detail fails (no API error data). */
export const LAUNDRY_ERROR_TITLE_DEFAULT = 'Gagal memuat layanan';
export const LAUNDRY_ERROR_DESCRIPTION_DEFAULT =
  'Silakan coba lagi atau pilih layanan lain.';

/** Add-on section copywriting (layanan tambahan). Overridable via AddOnChecklist props. */
export const ADD_ON_SECTION_TITLE = 'Layanan Tambahan';
export const ADD_ON_OPTIONAL_LABEL = 'Opsional';
/** Hint under the title: multi = "Bisa pilih lebih dari satu." / single = "Pilih salah satu." */
export const ADD_ON_SELECTION_HINT_MULTIPLE = 'Bisa pilih lebih dari satu.';
export const ADD_ON_SELECTION_HINT_SINGLE = 'Pilih salah satu.';

/** Selection behavior: multiple = checklist, single = only one paid add-on at a time. */
export type AddOnSelectionMode = 'multiple' | 'single';

/** Scroll offset (px) at which the laundry header background is fully visible */
export const HEADER_SCROLL_THRESHOLD = 80;

export const ADD_ON_OPTIONS: AddOnOption[] = [
  {
    id: 'lipat',
    icon: 'fold',
    label: 'Lipat',
    description: 'Layanan lipat rapi untuk pakaian.',
    free: true,
    extraPerKg: 0,
  },
  {
    id: 'setrika',
    icon: 'iron',
    label: 'Setrika / Iron',
    description: 'Setrika rapi untuk pakaian siap pakai.',
    extraPerKg: 3_000,
  },
  {
    id: 'white_clothes_treatment',
    icon: 'white',
    label: 'Pakaian putih',
    description: 'Perawatan khusus agar pakaian putih tetap cerah.',
    extraPerKg: 2_000,
  },
  {
    id: 'pewangi_premium',
    icon: 'pewangi_premium',
    label: 'Pewangi premium',
    description: 'Aroma segar tahan lama.',
    extraPerKg: 2_000,
  },
];

/** Options for laundry satuan (per item): Jas, Kemeja, etc. */
export const SATUAN_OPTIONS: ChecklistOption[] = [
  {
    id: 'jas',
    label: 'Jas',
    description: 'Cuci dan setrika jas.',
    priceSubtitle: 'Rp 25.000',
    price: 25000,
    icon: 'pewangi_premium',
  },
  {
    id: 'kemeja',
    label: 'Kemeja',
    description: 'Kemeja formal atau casual.',
    priceSubtitle: 'Rp 15.000',
    price: 15000,
    icon: 'pewangi_premium',
  },
  {
    id: 'celana',
    label: 'Celana',
    description: 'Celana panjang atau pendek.',
    priceSubtitle: 'Rp 12.000',
    price: 12000,
    icon: 'pewangi_premium',
  },
  {
    id: 'dress',
    label: 'Dress',
    description: 'Gaun dan dress.',
    priceSubtitle: 'Rp 20.000',
    price: 20000,
    icon: 'pewangi_premium',
  },
  {
    id: 'lainnya',
    label: 'Lainnya',
    description: 'Item lain (sweater, jaket, dll).',
    priceSubtitle: 'Rp 10.000',
    price: 10000,
    icon: 'pewangi_premium',
  },
];

export const WASH_ADD_ON_OPTIONS: { id: WashAddOnId; label: string }[] = [
  { id: 'cuci_lipat_only', label: 'Cuci & Lipat' },
  { id: 'setrika', label: 'Setrika' },
];

export const SERVICE_TYPE_OPTIONS: ChecklistOption[] = [
  {
    id: 'reguler',
    label: 'Reguler',
    description: 'Layanan ini selesai dalam 2-3 hari.',
    priceSubtitle: 'Rp 0',
    price: 0,
    icon: 'pewangi_premium',
  },
  {
    id: 'express',
    label: 'Express',
    description: 'Layanan ini selesai dalam 12 jam.',
    priceSubtitle: 'Rp 2.000',
    price: 2000,
    icon: 'pewangi_premium',
  },
  {
    id: 'kilat',
    label: 'Kilat',
    description: 'Layanan ini selesai dalam 6 jam.',
    priceSubtitle: 'Rp 6.000',
    price: 6000,
    icon: 'pewangi_premium',
  },
];
/** Daftar section checklist per laundry type. Bisa dikembangkan (lebih dari satu section). */
export function getLaundryChecklistSections(
  laundryType: 'single' | 'multiple' | undefined,
): LaundryChecklistSection[] {
  if (laundryType === 'single') {
    return [
      {
        id: 'satuan',
        title: 'Jenis Pakaian',
        options: SATUAN_OPTIONS,
        selectionMode: 'single',
        canOptOut: false,
      },
    ];
  }
  return [
    {
      id: 'addons',
      title: ADD_ON_SECTION_TITLE,
      options: ADD_ON_OPTIONS,
      selectionMode: 'multiple',
      canOptOut: true,
    },
  ];
}

export const SERVICE_TYPE_OPTIONS_DATA: ServiceTypeOptionData[] = [
  {
    id: 'reguler',
    title: 'Reguler',
    selectedCopy: 'Layanan ini selesai dalam 2-3 hari.',
    extraPerKg: 0,
    extraSatuan: 0,
  },
  {
    id: 'express',
    title: 'Express',
    duration: '6 jam',
    extraPerKg: 2_000,
    extraSatuan: 5_000,
    promo: 'Best Seller',
    selectedCopy: 'Layanan ini selesai dalam 12 jam.',
  },
  {
    id: 'kilat',
    title: 'Kilat',
    duration: '3 jam',
    extraPerKg: 6_000,
    extraSatuan: 15_000,
    selectedCopy: 'Layanan ini selesai dalam 6 jam.',
  },
];
