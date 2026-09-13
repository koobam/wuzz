/**
 * True kalau error berasal dari kegagalan jaringan — tidak ada response dari
 * server: perangkat offline, DNS gagal, koneksi terputus, atau timeout.
 *
 * Catatan: request wrapper mengembalikan `error.response?.data || error`. Untuk
 * error server yang diterima adalah body API (punya `message`, tanpa `code`);
 * untuk network error yang diterima adalah error mentah (tanpa `response`).
 */
export const isNetworkError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false;
  const e = error as { response?: unknown; code?: string; message?: string };
  // Server sempat membalas → bukan network error.
  if ('response' in e && e.response) return false;
  if (e.code === 'ERR_NETWORK' || e.code === 'ECONNABORTED') return true;
  if (typeof e.message === 'string' && /network error|timeout/i.test(e.message)) {
    return true;
  }
  return false;
};
