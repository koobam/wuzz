import { theme } from '@components/atoms';
import type { LeaderboardEntry } from '../types';

export const TIERS = ['bronze', 'silver', 'gold', 'diamond'] as const;
export type Tier = (typeof TIERS)[number];

/** Primary/front face color — theme.pallate.[tier]['03'] */
export const TIER_COLOR: Record<Tier, string> = {
  bronze:  theme.pallate.bronze['03'],
  silver:  theme.pallate.silver['03'],
  gold:    theme.pallate.gold['03'],
  diamond: theme.pallate.diamond['03'],
};

/** Darker shade — theme.pallate.[tier]['05'] */
export const TIER_COLOR_DARK: Record<Tier, string> = {
  bronze:  theme.pallate.bronze['05'],
  silver:  theme.pallate.silver['05'],
  gold:    theme.pallate.gold['05'],
  diamond: theme.pallate.diamond['05'],
};

/** Top-face / gem highlight — theme.pallate.[tier]['02'] */
export const TIER_COLOR_LIGHT: Record<Tier, string> = {
  bronze:  theme.pallate.bronze['02'],
  silver:  theme.pallate.silver['02'],
  gold:    theme.pallate.gold['02'],
  diamond: theme.pallate.diamond['02'],
};

/** Subtle background tint — theme.pallate.[tier]['01'] */
export const TIER_COLOR_BG: Record<Tier, string> = {
  bronze:  theme.pallate.bronze['01'],
  silver:  theme.pallate.silver['01'],
  gold:    theme.pallate.gold['01'],
  diamond: theme.pallate.diamond['01'],
};

/** Number of top entries that qualify for promotion to the next tier */
export const PROMOTION_ZONE_SIZE = 5;

/** Number of bottom entries at risk of demotion to the previous tier */
export const DEGRADATION_ZONE_SIZE = 5;

export const ZONES = ['promotion', 'safe', 'degradation'] as const;
export type Zone = (typeof ZONES)[number];

export const ZONE_LABEL: Record<Zone, string> = {
  promotion:   'Zona Promosi',
  safe:        'Zona Aman',
  degradation: 'Zona Degradasi',
};

export const ZONE_DESCRIPTION: Record<Zone, string> = {
  promotion:   '5 teratas naik ke tier berikutnya',
  safe:        'Posisi aman di tier ini',
  degradation: '5 terbawah turun ke tier sebelumnya',
};

/** Tiers the current user has not yet unlocked */
export const LOCKED_TIERS: Record<Tier, boolean> = {
  bronze:  false,
  silver:  false,
  gold:    true,
  diamond: true,
};

export const TIER_LABEL: Record<Tier, string> = {
  bronze:  'Bronze',
  silver:  'Silver',
  gold:    'Gold',
  diamond: 'Diamond',
};

export const TIER_BENEFIT: Record<Tier, string[]> = {
  bronze: [
    'Kumpulkan poin dari setiap transaksi laundry & coffee',
    'Akses ke program loyalty Wuzz',
  ],
  silver: [
    'Diskon 5% di setiap order',
    'Prioritas customer service',
    'Notifikasi promo eksklusif lebih awal',
  ],
  gold: [
    'Gratis ongkir untuk semua order',
    'Prioritas antrian di outlet',
    'Cashback 3% setiap transaksi',
  ],
  diamond: [
    'Semua benefit Gold',
    'Cashback 7% setiap transaksi',
    'Dukungan VIP 24/7',
    'Akses event & promo eksklusif Diamond',
  ],
};

export const TIER_XP_RANGE: Record<Tier, { min: number; max: number | null }> = {
  bronze:  { min: 0,     max: 1_999  },
  silver:  { min: 2_000, max: 4_999  },
  gold:    { min: 5_000, max: 9_999  },
  diamond: { min: 10_000, max: null  },
};

export const RANK_MEDAL: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

export const LEADERBOARD_BY_TIER: Record<Tier, LeaderboardEntry[]> = {
  bronze: [
    { rank:  1, userId: 'br1',  displayName: 'Hendra Wijaya',     xp: 1_950, tier: 'bronze' },
    { rank:  2, userId: 'br2',  displayName: 'Indah Permata',     xp: 1_820, tier: 'bronze' },
    { rank:  3, userId: 'br3',  displayName: 'Joko Susilo',       xp: 1_740, tier: 'bronze' },
    { rank:  4, userId: 'br4',  displayName: 'Kartika Sari',      xp: 1_650, tier: 'bronze' },
    { rank:  5, userId: 'br5',  displayName: 'Lukman Hakim',      xp: 1_580, tier: 'bronze' },
    { rank:  6, userId: 'br6',  displayName: 'Mira Santoso',      xp: 1_490, tier: 'bronze' },
    { rank:  7, userId: 'br7',  displayName: 'Nando Pratama',     xp: 1_400, tier: 'bronze' },
    { rank:  8, userId: 'br8',  displayName: 'Oca Kurniawan',     xp: 1_310, tier: 'bronze' },
    { rank:  9, userId: 'br9',  displayName: 'Putri Handayani',   xp: 1_220, tier: 'bronze' },
    { rank: 10, userId: 'br10', displayName: 'Qori Ramadhani',    xp: 1_130, tier: 'bronze' },
    { rank: 11, userId: 'br11', displayName: 'Rizal Fauzi',       xp: 1_020, tier: 'bronze' },
    { rank: 12, userId: 'br12', displayName: 'Sinta Wulandari',   xp:   940, tier: 'bronze' },
    { rank: 13, userId: 'br13', displayName: 'Tomy Setiawan',     xp:   860, tier: 'bronze' },
    { rank: 14, userId: 'br14', displayName: 'Ulfa Nurdiana',     xp:   780, tier: 'bronze' },
    { rank: 15, userId: 'br15', displayName: 'Vino Saputra',      xp:   700, tier: 'bronze' },
    { rank: 16, userId: 'br16', displayName: 'Winda Agustina',    xp:   610, tier: 'bronze' },
    { rank: 17, userId: 'br17', displayName: 'Xander Halim',      xp:   510, tier: 'bronze' },
    { rank: 18, userId: 'br18', displayName: 'Yesi Anggraeni',    xp:   420, tier: 'bronze' },
    { rank: 19, userId: 'br19', displayName: 'Zaki Maulana',      xp:   320, tier: 'bronze' },
    { rank: 20, userId: 'br20', displayName: 'Ayu Lestari',       xp:   210, tier: 'bronze' },
  ],
  silver: [
    { rank:  1, userId: 'si1',  displayName: 'Fajar Nugroho',     xp: 4_900, tier: 'silver' },
    { rank:  2, userId: 'si2',  displayName: 'Gita Rahayu',       xp: 4_720, tier: 'silver' },
    { rank:  3, userId: 'si3',  displayName: 'Mega Utami',        xp: 4_540, tier: 'silver' },
    { rank:  4, userId: 'si4',  displayName: 'Nanda Kusuma',      xp: 4_360, tier: 'silver' },
    { rank:  5, userId: 'si5',  displayName: 'Oka Wijaksono',     xp: 4_170, tier: 'silver' },
    { rank:  6, userId: 'me',   displayName: 'Jan Falih',         xp: 3_980, tier: 'silver', isCurrentUser: true },
    { rank:  7, userId: 'si7',  displayName: 'Pandu Wibowo',      xp: 3_790, tier: 'silver' },
    { rank:  8, userId: 'si8',  displayName: 'Ratna Dewi',        xp: 3_600, tier: 'silver' },
    { rank:  9, userId: 'si9',  displayName: 'Surya Dinata',      xp: 3_410, tier: 'silver' },
    { rank: 10, userId: 'si10', displayName: 'Tiara Anisa',       xp: 3_220, tier: 'silver' },
    { rank: 11, userId: 'si11', displayName: 'Umar Bakri',        xp: 3_030, tier: 'silver' },
    { rank: 12, userId: 'si12', displayName: 'Vera Susanti',      xp: 2_840, tier: 'silver' },
    { rank: 13, userId: 'si13', displayName: 'Wahyu Ningsih',     xp: 2_650, tier: 'silver' },
    { rank: 14, userId: 'si14', displayName: 'Xavier Putra',      xp: 2_460, tier: 'silver' },
    { rank: 15, userId: 'si15', displayName: 'Yanti Marlina',     xp: 2_270, tier: 'silver' },
    { rank: 16, userId: 'si16', displayName: 'Zulfa Rizki',       xp: 2_210, tier: 'silver' },
    { rank: 17, userId: 'si17', displayName: 'Agus Setiadi',      xp: 2_150, tier: 'silver' },
    { rank: 18, userId: 'si18', displayName: 'Bella Cahyani',     xp: 2_100, tier: 'silver' },
    { rank: 19, userId: 'si19', displayName: 'Candra Irawan',     xp: 2_060, tier: 'silver' },
    { rank: 20, userId: 'si20', displayName: 'Desi Ratnasari',    xp: 2_010, tier: 'silver' },
  ],
  gold: [
    { rank:  1, userId: 'go1',  displayName: 'Dimas Pratama',     xp: 9_800, tier: 'gold' },
    { rank:  2, userId: 'go2',  displayName: 'Eka Putri',         xp: 9_500, tier: 'gold' },
    { rank:  3, userId: 'go3',  displayName: 'Citra Maharani',    xp: 9_200, tier: 'gold' },
    { rank:  4, userId: 'go4',  displayName: 'Okta Firmansyah',   xp: 8_900, tier: 'gold' },
    { rank:  5, userId: 'go5',  displayName: 'Putri Anggraini',   xp: 8_600, tier: 'gold' },
    { rank:  6, userId: 'go6',  displayName: 'Qasim Abdillah',    xp: 8_300, tier: 'gold' },
    { rank:  7, userId: 'go7',  displayName: 'Rina Fitriani',     xp: 8_000, tier: 'gold' },
    { rank:  8, userId: 'go8',  displayName: 'Satria Nugraha',    xp: 7_700, tier: 'gold' },
    { rank:  9, userId: 'go9',  displayName: 'Tasya Kamila',      xp: 7_400, tier: 'gold' },
    { rank: 10, userId: 'go10', displayName: 'Udin Saefudin',     xp: 7_100, tier: 'gold' },
    { rank: 11, userId: 'go11', displayName: 'Vira Permatasari',  xp: 6_800, tier: 'gold' },
    { rank: 12, userId: 'go12', displayName: 'Wawan Hermawan',    xp: 6_500, tier: 'gold' },
    { rank: 13, userId: 'go13', displayName: 'Xeni Anggraini',    xp: 6_200, tier: 'gold' },
    { rank: 14, userId: 'go14', displayName: 'Yogi Prasetyo',     xp: 5_900, tier: 'gold' },
    { rank: 15, userId: 'go15', displayName: 'Zahra Maulida',     xp: 5_600, tier: 'gold' },
    { rank: 16, userId: 'go16', displayName: 'Angga Tri',         xp: 5_400, tier: 'gold' },
    { rank: 17, userId: 'go17', displayName: 'Bayu Andriano',     xp: 5_300, tier: 'gold' },
    { rank: 18, userId: 'go18', displayName: 'Cika Wulandari',    xp: 5_200, tier: 'gold' },
    { rank: 19, userId: 'go19', displayName: 'Doni Kusuma',       xp: 5_100, tier: 'gold' },
    { rank: 20, userId: 'go20', displayName: 'Elsa Rahmadhani',   xp: 5_010, tier: 'gold' },
  ],
  diamond: [
    { rank:  1, userId: 'di1',  displayName: 'Arya Wicaksono',    xp: 19_800, tier: 'diamond' },
    { rank:  2, userId: 'di2',  displayName: 'Budi Santoso',      xp: 18_600, tier: 'diamond' },
    { rank:  3, userId: 'di3',  displayName: 'Raka Aditya',       xp: 17_400, tier: 'diamond' },
    { rank:  4, userId: 'di4',  displayName: 'Sari Dewi',         xp: 16_200, tier: 'diamond' },
    { rank:  5, userId: 'di5',  displayName: 'Taufik Hidayat',    xp: 15_000, tier: 'diamond' },
    { rank:  6, userId: 'di6',  displayName: 'Ulfah Azzahra',     xp: 13_900, tier: 'diamond' },
    { rank:  7, userId: 'di7',  displayName: 'Valdi Ramadhan',    xp: 12_800, tier: 'diamond' },
    { rank:  8, userId: 'di8',  displayName: 'Wulan Sari',        xp: 11_900, tier: 'diamond' },
    { rank:  9, userId: 'di9',  displayName: 'Xandra Putri',      xp: 11_200, tier: 'diamond' },
    { rank: 10, userId: 'di10', displayName: 'Yudi Prasetia',     xp: 10_700, tier: 'diamond' },
    { rank: 11, userId: 'di11', displayName: 'Zaki Akbar',        xp: 10_500, tier: 'diamond' },
    { rank: 12, userId: 'di12', displayName: 'Alvin Setiawan',    xp: 10_400, tier: 'diamond' },
    { rank: 13, userId: 'di13', displayName: 'Bunga Citra',       xp: 10_350, tier: 'diamond' },
    { rank: 14, userId: 'di14', displayName: 'Catur Wibisono',    xp: 10_280, tier: 'diamond' },
    { rank: 15, userId: 'di15', displayName: 'Dara Permata',      xp: 10_200, tier: 'diamond' },
    { rank: 16, userId: 'di16', displayName: 'Evan Dharma',       xp: 10_150, tier: 'diamond' },
    { rank: 17, userId: 'di17', displayName: 'Fani Nurlita',      xp: 10_110, tier: 'diamond' },
    { rank: 18, userId: 'di18', displayName: 'Gilang Ramadhan',   xp: 10_080, tier: 'diamond' },
    { rank: 19, userId: 'di19', displayName: 'Hana Pertiwi',      xp: 10_040, tier: 'diamond' },
    { rank: 20, userId: 'di20', displayName: 'Ivan Gunawan',      xp: 10_010, tier: 'diamond' },
  ],
};

/** Kept for backwards-compat if anything still imports it */
export const LEADERBOARD_MOCK: LeaderboardEntry[] = Object.values(LEADERBOARD_BY_TIER).flat();
