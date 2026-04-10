import type { OrderSummaryItemDetail } from '../types';

/** Mock daftar item pembelian (ringkasan pesanan) – dipakai di OrderSummaryRow */
export const MOCK_ORDER_SUMMARY_ITEMS: OrderSummaryItemDetail[] = [
  {
    itemsSummary: 'Laundry Kiloan',
    description: ['Pewangi Premium', 'Baju Putih', 'Setrika'],
    total: 'Rp 25.000',
    laundryKg: 5,
    itemStatus: 'delivering',
    pricePerKg: 'Rp 5.000/kg',
    estimatedDuration: '6 - 12 Jam',
    note: 'Kemeja putih jangan disetrika terlalu panas.',
    whatWeDo: [
      {
        title: 'Cuci sesuai jenis kain',
        description:
          'Cuci dengan mesin khusus sesuai jenis kain. Pakaian kamu dipisahkan berdasarkan warna dan material agar hasil cucian tetap awet dan tidak rusak.',
      },
      {
        title: 'Pewangi & pelembut premium',
        description:
          'Kami gunakan pewangi premium dan pelembut pakaian pilihan agar cucian harum segar dan lembut saat dipakai seharian.',
      },
      {
        title: 'Setrika dan lipat rapi',
        description:
          'Setrika dan lipat rapi oleh tim kami. Pakaian siap pakai dan rapi saat sampai di tangan kamu.',
      },
      {
        title: 'Packing aman',
        description:
          'Packing aman dengan kemasan bersih. Cucian diantar dalam kondisi higienis dan siap disimpan di lemari.',
      },
    ],
    serviceTier: 'express',
    pakaianCount: 8,
    prices: [
      { label: 'Kiloan 5 kg (Rp 5.000/kg)', price: 'Rp 20.000' },
      { label: 'Pewangi Premium', price: 'Rp 2.500' },
      { label: 'Perawatan Baju Putih', price: 'Rp 2.000' },
      { label: 'Setrika', price: 'Rp 500' },
    ],
  },
  {
    itemsSummary: 'Laundry Satuan - Kemeja',
    description: ['Perawatan Baju Putih'],
    total: 'Rp 15.000',
    itemStatus: 'ongoing',
    estimatedDuration: '2 - 3 Hari',
    whatWeDo: [
      {
        title: 'Perawatan baju putih',
        description:
          'Perawatan khusus baju putih dengan formula anti kuning. Kemeja putih kamu dijaga agar tetap cerah dan bebas noda kuning.',
      },
      {
        title: 'Cuci dan setrika',
        description:
          'Cuci dengan suhu dan deterjen yang tepat, lalu setrika rapi. Hasil rapi dan siap dipakai untuk acara penting.',
      },
      {
        title: 'Packing rapi',
        description:
          'Packing rapi dengan hanger atau lipatan. Kemeja sampai di tangan kamu dalam kondisi prima.',
      },
    ],
    serviceTier: 'reguler',
    pakaianCount: 1,
    washerMachine: 'Mesin cuci khusus pakaian satuan',
    dryerMachine: 'Pengering standar outlet',
    setrikaInfo: 'Setrika termasuk. Kemeja disetrika dengan hanger.',
    prices: [{ label: 'Perawatan Baju Putih', price: 'Rp 15.000' }],
  },
  {
    itemsSummary: 'Cuci Sepatu',
    description: ['Tanpa pewangi'],
    total: 'Rp 20.000',
    itemStatus: 'completed',
    estimatedDuration: '3 - 6 Jam',
    whatWeDo: [
      {
        title: 'Pembersihan dalam & luar',
        description:
          'Pembersihan menyeluruh bagian dalam dan luar sepatu. Kami bersihkan noda, debu, dan kotoran tanpa merusak material.',
      },
      {
        title: 'Tanpa pewangi',
        description:
          'Tanpa pewangi sesuai permintaan kamu. Sepatu dibersihkan dengan produk yang aman untuk kulit dan bahan sepatu.',
      },
      {
        title: 'Kering & packing',
        description:
          'Kering alami dan packing aman. Sepatu dikeringkan dengan benar lalu dikemas rapi agar sampai dalam kondisi siap pakai.',
      },
    ],
    serviceTier: 'kilat',
    pakaianCount: 1,
    prices: [
      { label: 'Cuci Sepatu', price: 'Rp 18.000' },
      { label: 'Tanpa pewangi', price: 'Rp 2.000' },
    ],
  },
];
