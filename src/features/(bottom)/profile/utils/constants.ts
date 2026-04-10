import { theme } from '@components/atoms';
import type { StreakStatus } from '../types';

/** Profile share message and URL (replace with real deep link when available). */
export const PROFILE_SHARE_MESSAGE = 'Lihat profil saya di Wuzz!';
export const PROFILE_SHARE_URL = 'https://wuzz.app/profile'; // TODO: replace with app deep link

/** Placeholder referral code (ganti dengan data dari API/user). */
export const REFERRAL_CODE_PLACEHOLDER = 'WZZ7AB';

/** URLs for webview pages (FAQ, Syarat & Ketentuan, Kebijakan Privasi). */
export const PROFILE_WEBVIEW_URLS = {
  faq: 'https://koobam.com/faq',
  syaratKetentuan: 'https://koobam.com/terms-and-conditions',
  kebijakanPrivasi: 'https://koobam.com/privacy-policy',
} as const;

export const PROFILE_MENU_ICON_SIZE = 22;
export const PROFILE_MENU_ICON_VARIANT = 'Linear' as const;
export const PROFILE_MENU_ICON_COLOR = theme.pallate.neutral['05'];
export const PROFILE_MENU_SECTION_TITLE_COLOR = theme.pallate.neutral['05'];

export const STREAK_MODAL_TITLE = 'Current Streak';

export const STREAK_STATUS_CONFIG: Record<
  StreakStatus,
  { title: string; description: string; tip?: string }
> = {
  active: {
    title: 'Streak tetap!',
    description: 'Kamu tetap konsisten. Lanjutkan kebiasaan baikmu agar streak tidak putus.',
    tip: 'Lakukan minimal 1 pesanan hari ini untuk mempertahankan streak.',
  },
  broken: {
    title: 'Streak hancur',
    description: 'Streak kamu terputus karena tidak ada aktivitas di hari sebelumnya.',
    tip: 'Mulai lagi dari hari ini dan raih streak baru!',
  },
  increased: {
    title: 'Streak bertambah!',
    description: 'Keren! Streak kamu naik. Pertahankan konsistensimu.',
    tip: 'Lakukan aktivitas lagi besok untuk menambah streak.',
  },
};
