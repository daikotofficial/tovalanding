export const PAYOUT_CURRENCY = "NGN";
export const PAYOUT_MINIMUM_MINOR = 5_000_000;
export const PAYOUT_PROCESSING_DAYS = 2;

export function formatPayoutAmount(amountMinor) {
  return `₦${(amountMinor / 100).toLocaleString()}`;
}
