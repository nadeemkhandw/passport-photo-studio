// Payment configuration for Passport Photo Studio.
//
// This is a CONFIGURATION STUB, not a live checkout. No real payment
// provider is connected yet, no checkout URL is hard-coded, and no money
// can be taken through this file.
//
// How it is meant to work once a provider is chosen:
//   1. Set PROVIDER to 'paddle' | 'lemonsqueezy' | 'paypal'.
//   2. Fill in the matching CHECKOUT_URL_* slot below with the real
//      checkout / payment link created in that provider's dashboard.
//   3. Replace the localStorage "paid" flag with real verification:
//      the provider's webhook / return URL must confirm the payment
//      server-side (or via the provider's client-side verification)
//      before the app treats a download as paid. A localStorage flag
//      on its own is NOT secure proof of payment and must not ship
//      as the final mechanism — it exists here only so the free /
//      paid flows can be tested locally.
//
// Recommended providers for a seller in Pakistan (Stripe is not
// available to sellers in Pakistan):
//   - Paddle — merchant of record, handles tax, supports PKR pricing.
//   - Lemon Squeezy — merchant of record, simple payment links.
//   - PayPal — widely recognised, but higher fees and no merchant-
//     of-record tax handling.

export type PaymentProvider = 'none' | 'paddle' | 'lemonsqueezy' | 'paypal';

export const PAYMENT_CONFIG = {
  /** Merchant-of-record / checkout provider. 'none' until one is connected. */
  provider: 'none' as PaymentProvider,

  /** One-time price for a clean 300 DPI PDF + PNG download (no subscription). */
  priceUsd: 4.99,
  priceEur: 4.99,
  pricePkr: 400,
  currencyUsd: 'USD',
  currencyEur: 'EUR',
  currencyPkr: 'PKR',

  // TODO: paste the real checkout / payment link here once a provider
  // account exists. Leave as null until then — the paywall UI disables
  // checkout while every slot is null.
  checkoutUrlPaddle: null as string | null,
  checkoutUrlLemonSqueezy: null as string | null,
  checkoutUrlPaypal: null as string | null,

  /** Free tier: watermarked on-screen preview, no clean download. */
  freePreviewNote:
    'Free preview is watermarked. Pay once to download the clean, print-ready 300 DPI PDF and PNG.',
} as const;

/** The checkout URL for the configured provider, or null if not connected. */
export function getCheckoutUrl(): string | null {
  switch (PAYMENT_CONFIG.provider) {
    case 'paddle':
      return PAYMENT_CONFIG.checkoutUrlPaddle;
    case 'lemonsqueezy':
      return PAYMENT_CONFIG.checkoutUrlLemonSqueezy;
    case 'paypal':
      return PAYMENT_CONFIG.checkoutUrlPaypal;
    case 'none':
    default:
      return null;
  }
}

export function isCheckoutConnected(): boolean {
  return PAYMENT_CONFIG.provider !== 'none' && getCheckoutUrl() !== null;
}

export function formatPrice(): string {
  return `$${PAYMENT_CONFIG.priceUsd.toFixed(2)} / PKR ${PAYMENT_CONFIG.pricePkr}`;
}

// ---------------------------------------------------------------------------
// Local "paid" flag — TEST STUB ONLY (see header). The paywall reads this
// so the export flow can be exercised locally. Replace with real provider
// verification before launch.
// ---------------------------------------------------------------------------
const PAID_STORAGE_KEY = 'pps_paid_v1';

export function hasPaid(): boolean {
  try {
    return localStorage.getItem(PAID_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/** Test-only unlock. Remove / disable before launch. */
export function setPaidForTesting(paid: boolean): void {
  try {
    if (paid) localStorage.setItem(PAID_STORAGE_KEY, '1');
    else localStorage.removeItem(PAID_STORAGE_KEY);
  } catch {
    // Storage unavailable — paid state stays false.
  }
}
