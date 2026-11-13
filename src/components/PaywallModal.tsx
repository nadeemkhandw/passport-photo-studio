import React from 'react';
import { X, Lock, ShieldCheck, FileDown, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import {
  PAYMENT_CONFIG,
  formatPrice,
  isCheckoutConnected,
  getCheckoutUrl,
} from '../lib/payments';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when the user chooses the test unlock. Test only — see payments.ts. */
  onTestUnlock: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  onTestUnlock,
}) => {
  if (!isOpen) return null;

  const checkoutConnected = isCheckoutConnected();
  const checkoutUrl = getCheckoutUrl();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in no-print">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/80 dark:border-gray-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 m-0">
              Download the clean, print-ready files
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4 text-sm text-gray-700 dark:text-gray-300">
          <p className="m-0">
            Your preview is free and watermarked. Pay once —{' '}
            <strong className="text-gray-900 dark:text-gray-100">{formatPrice()}</strong> — to
            download the clean files with no watermark:
          </p>

          <ul className="m-0 p-0 list-none flex flex-col gap-2">
            <li className="flex items-center gap-2">
              <FileDown className="w-4 h-4 text-rose-500 shrink-0" />
              300 DPI PDF print sheet, sized exactly to your paper and photo preset
            </li>
            <li className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-500 shrink-0" />
              300 DPI PNG of the full sheet
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              No watermark, no account, no subscription
            </li>
          </ul>

          <p className="m-0 flex items-start gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 px-3 py-2 text-xs text-emerald-800 dark:text-emerald-200">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            Your photos never leave your device. Cropping, layout and export all
            run in your browser — nothing is uploaded to a server.
          </p>

          {checkoutConnected && checkoutUrl ? (
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all text-center no-underline"
            >
              Continue to secure checkout — {formatPrice()}
            </a>
          ) : (
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/50 px-3 py-2 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Checkout is not connected yet ({PAYMENT_CONFIG.provider === 'none'
                  ? 'no payment provider selected'
                  : `provider: ${PAYMENT_CONFIG.provider}, no checkout link set`}
                ). The owner still needs to connect Paddle, Lemon Squeezy or
                PayPal in <code>src/lib/payments.ts</code> before anyone can pay.
              </span>
            </div>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-semibold transition-colors cursor-pointer"
          >
            Keep using the free preview
          </button>

          <button
            onClick={onTestUnlock}
            className="text-[11px] text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 underline cursor-pointer bg-transparent border-0 p-0 self-center"
          >
            Demo only: unlock downloads for testing (remove before launch)
          </button>
        </div>
      </div>
    </div>
  );
};
