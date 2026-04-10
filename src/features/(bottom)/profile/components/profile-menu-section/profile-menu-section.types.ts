export type ProfileMenuItemId =
  | 'referral'
  | 'alamat'
  | 'voucher'
  | 'pesanan'
  | 'faq'
  | 'syarat-ketentuan'
  | 'kebijakan-privasi'
  | 'bahasa'
  | 'notifikasi'
  | 'logout';

export type ProfileMenuItem = {
  id: ProfileMenuItemId;
  label: string;
  icon: React.ReactNode;
};

export type ProfileMenuGroup = {
  title: string;
  items: ProfileMenuItem[];
};

export type ProfileMenuSectionProps = {
  onMenuPress?: (id: ProfileMenuItemId) => void;
};
