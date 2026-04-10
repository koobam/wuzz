export type OrderStatusType =
  | 'pending'
  | 'confirmed'
  | 'driver_pickup'
  | 'at_outlet'
  | 'delivery_to_customer'
  | 'completed';

export type WuzzerReview = {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  dateFormatted?: string;
};

export type Wuzzer = {
  id: string;
  name: string;
  photoUri?: string | null;
  vehicle: string;
  phoneNumber: string;
  rating?: number;
  /** Recent reviews for this wuzzer (e.g. for horizontal list on wuzzer card) */
  reviews?: WuzzerReview[];
};

/** Satu langkah di "Yang akan kami lakukan" */
export type WhatWeDoStep = {
  title: string;
  description: string;
};

/** Status per item – for laundry items only (shown in summary row) */
export type OrderSummaryItemStatus =
  | 'pending'
  | 'ongoing'
  | 'delivering'
  | 'completed';

/** Item row in order summary; used for detail sheet when user taps info icon */
export type OrderSummaryItemDetail = {
  itemsSummary: string;
  description: string[];
  total: string;
  laundryKg?: number;
  /** Item status for laundry items only (e.g. Delivering, Ongoing, Completed) */
  itemStatus?: OrderSummaryItemStatus;
  /** "Yang akan kami lakukan" – steps dengan title dan description */
  whatWeDo: WhatWeDoStep[];
  /** Estimasi waktu selesai (e.g. "2-3 hari", "± 24 jam") */
  estimatedDuration?: string;
  /** Catatan pelanggan atau outlet */
  note?: string;
  /** Harga per kg untuk kiloan (e.g. "Rp 5.000/kg"); tampilkan breakdown bila ada laundryKg */
  pricePerKg?: string;
  /** Rincian harga per layanan/add-on (e.g. Pewangi Premium, Perawatan Baju Putih); tampilkan di Ringkasan Harga */
  prices: { label: string; price: string }[];
  /** Tier layanan: Express (6-12 jam), Kilat (3-6 jam), Reguler (2-3 hari) */
  serviceTier?: 'express' | 'kilat' | 'reguler';
  /** Jumlah pakaian yang akan dicuci (untuk tampilan di detail) */
  pakaianCount?: number;
  /** Informasi mesin cuci (e.g. "Samsung 9kg, 1 mesin 1 customer") */
  washerMachine?: string;
  /** Informasi mesin pengering (e.g. "Dryer kapasitas 8kg") */
  dryerMachine?: string;
  /** Informasi setrika (e.g. "Setrika termasuk, suhu sesuai jenis kain") */
  setrikaInfo?: string;
};

export type OrderStatusDetail = {
  id: string;
  orderId: string;
  status: OrderStatusType;
  outletName: string;
  customerAddress: string;
  itemsSummary: string;
  totalFormatted: string;
  transactionId: string;
  dateFormatted: string;
  /** Subtotal sebelum voucher (e.g. "Rp 50.000"); untuk ringkasan pembayaran */
  subtotalFormatted?: string;
  /** Nama/kode voucher yang dipakai (e.g. "DISKON10") */
  voucherLabel?: string;
  /** Potongan voucher dalam angka (negatif, e.g. -10000); diformat di frontend */
  voucherDiscountAmount?: number;
  /** Potongan voucher sudah diformat dari BE (e.g. "-Rp 10.000"); fallback bila voucherDiscountAmount tidak ada */
  voucherDiscountFormatted?: string;
  /** Kg for laundry kiloan; show in ringkasan pesanan when present */
  laundryKg?: number;
  /** Metode pembayaran (e.g. "OVO", "GoPay", "Transfer Bank BCA") */
  paymentMethod?: string;
  /** Poin yang didapat dari pesanan ini */
  pointsEarned?: number;
  /** Tier loyalitas saat ini */
  currentTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  /** Tier berikutnya (untuk tampilan "Bronze → Silver: X XP") */
  nextTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  /** XP yang dibutuhkan untuk naik ke nextTier */
  xpToNextTier?: number;
  /** XP yang sudah dimiliki sebelum pesanan ini (dalam journey ke nextTier) */
  xpBeforeOrder?: number;
  /** XP yang didapat dari pesanan ini */
  xpEarnedFromOrder?: number;
  /** Benefit copy untuk next tier (dari API, e.g. "Free delivery") */
  nextTierBenefit?: string;
  driverLat?: number;
  driverLng?: number;
  customerLat?: number;
  customerLng?: number;
  outletLat?: number;
  outletLng?: number;
  wuzzer?: Wuzzer | null;
};
