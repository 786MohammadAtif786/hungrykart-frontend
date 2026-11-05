// Cart me apply kiya hua coupon code checkout tak yaad rakhne ke liye (sirf code, discount server hi nikalta hai)
const KEY = "hk_coupon";

export function getSavedCoupon(): string | null {
  try {
    return sessionStorage.getItem(KEY) || null;
  } catch {
    return null;
  }
}

export function saveCoupon(code: string) {
  try {
    sessionStorage.setItem(KEY, code);
  } catch {
    /* storage blocked ho to bhi app chalega */
  }
}

export function clearCoupon() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}