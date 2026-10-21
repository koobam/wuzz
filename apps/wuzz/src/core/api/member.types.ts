import { ApiResponse } from '@http/response';

export interface MemberLevel {
  /** e.g. "Silver" */
  name: string;
  /** Absent at the top level. */
  next_level?: string;
  /** Xp needed to reach next_level; absent at the top level. */
  next_level_xp?: number;
}

export interface MemberSummary {
  name: string;
  /** Null when no levels are configured. */
  level: MemberLevel | null;
  points: number;
  xp: number;
  /** Vouchers that are unused and not yet expired. */
  voucher_count: number;
  /** Rupiah, whole. */
  wallet_balance: number;
  /** Customers this one referred ("Teman"). */
  friend_count: number;
}

export type MemberSummaryResponse = ApiResponse<MemberSummary>;
