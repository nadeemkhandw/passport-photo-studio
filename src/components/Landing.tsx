import React from 'react';
import { ShieldCheck, Upload, Crop, Printer, Check, Camera } from 'lucide-react';
import { formatPrice } from '../lib/payments';

interface LandingProps {
  onStart: () => void;
  /** Compact mode: skip the hero and how-it-works, keep country
   *  sections, pricing and FAQ (used below the studio). */
  compact?: boolean;
}

const COUNTRY_SECTIONS = [
  {
    id: 'us-passport-photo',
    title: 'US passport photo — 2 × 2 in (50.8 × 50.8 mm)',
    body: 'Format-only for US passports: crop and resize only, no edits. Since January 2026 the US Department of State rejects AI-edited, retouched or background-replaced photos, so this preset disables brightness and contrast controls entirely.',
  },
  {
    id: 'uk-passport-photo',
    title: 'UK passport photo — 35 × 45 mm',
    body: 'The standard UK / EU / Schengen size. Head and shoulders, plain light background, no shadows. Print a full sheet on A4 and cut along the guides, or download the single digital file for an online application.',
  },
  {
    id: 'pakistan-passport-photo',
    title: 'Pakistan passport photo — 35 × 45 mm',
    body: 'The DGIP size for online passport renewal, plus NADRA visa photos (35 × 45 mm, max 350 KB for the online portal). Also covers NICOP and visa photos for Pakistanis applying from abroad — US, UK, Canada and Schengen sizes included.',
  },
  {
    id: 'canada-passport-photo',
    title: 'Canada passport photo — 50 × 70 mm',
    body: 'The larger Canadian format, with the same print-sheet layout and cut guides as every other preset.',
  },
  {
    id: 'china-passport-photo',
    title: 'China passport photo — 33 × 48 mm',
    body: 'Chinese passport and visa size, plus a 20 × 25 mm stamp-photo preset for forms and ID cards.',
  },
];

const FAQS = [
  {
    q: 'Are my photos uploaded anywhere?',
    a: 'No. Everything — upload, crop, layout and export — runs in your browser. Your photos never leave your device, and there is no account or server copy.',
  },
  {
    q: 'What do I get for free, and what costs money?',
    a: 'The preview is free and watermarked so you can check the layout. One payment unlocks the clean, watermark-free 300 DPI PDF and PNG. There is no subscription.',
  },
  {
    q: 'Will my photo be accepted?',
    a: 'The tool sizes and lays out your photo to the official dimensions for your country, but acceptance is always decided by the issuing authority. Always check the latest official photo rules before you apply — and for US passports, use the format-only mode: no edits of any kind.',
  },
  {
    q: 'How accurate is the print size?',
    a: 'Exports are rendered at 300 DPI from millimetre measurements (for example, a 50.8 mm US photo is exactly 600 px wide). Print at 100% scale / “Actual size” with no “fit to page” scaling, and measure the first print with a ruler.',
  },
  {
    q: 'Which sizes are supported?',
    a: 'US 2 × 2 in, UK / EU / Schengen 35 × 45 mm, Pakistan 35 × 45 mm, China 33 × 48 mm, Canada 50 × 70 mm, India 51 × 51 mm, Japan 35 × 45 mm, and 20 × 25 mm stamp photos — on A4, Letter, Legal, 4 × 6 in, 5 × 7 in and 8 × 10 in paper.',
  },
  {
    q: 'Can I use it on my phone?',
    a: 'Yes. Upload a photo from your phone, drag to position it and pinch to zoom in the crop view. For the most precise head alignment, a larger screen helps.',
  },
];

export const Landing: React.FC<LandingProps> = ({ onStart, compact = false }) => {
  return (
    <div className="flex flex-col gap-10 no-print">
      {!compact && (
        <>
          {/* Hero */}
          <section className="text-center flex flex-col items-center gap-4 py-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/50">
          <Camera className="w-3.5 h-3.5" />
          Free preview · Private by design · 300 DPI export
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 m-0 max-w-2xl">
          Passport &amp; visa photos, sized exactly right — in under a minute
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 m-0 max-w-xl">
          Upload a photo, crop it with the biometric head guide, pick your country, and
          print a full sheet or download the digital file. Your photos never leave your
          device.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onStart}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer"
          >
            Make my passport photo — free preview
          </button>
          <a
            href="#pricing"
            className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-semibold transition-colors no-underline"
          >
            See pricing — {formatPrice()}
          </a>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 m-0 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          No upload, no account, no subscription. Pay once, only if you want the clean download.
        </p>
      </section>

      {/* How it works */}
      <section aria-label="How it works">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">How it works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <Upload className="w-5 h-5 text-indigo-500" />,
              title: '1. Upload',
              body: 'Drag in one photo or a batch. JPG, PNG and WebP supported, straight from your phone or computer.',
            },
            {
              icon: <Crop className="w-5 h-5 text-indigo-500" />,
              title: '2. Crop & align',
              body: 'Position your head inside the biometric oval and eye line, pick your country preset, and set how many copies you need.',
            },
            {
              icon: <Printer className="w-5 h-5 text-indigo-500" />,
              title: '3. Print or download',
              body: 'Preview the sheet on A4, Letter or 4 × 6 in paper, then print it or download the clean 300 DPI PDF / PNG.',
            },
          ].map((step) => (
            <div
              key={step.title}
              className="p-4 rounded-2xl bg-white/70 dark:bg-gray-900/70 border border-gray-200/80 dark:border-gray-800/80 shadow-sm"
            >
              <div className="mb-2">{step.icon}</div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 m-0 mb-1">
                {step.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 m-0">{step.body}</p>
            </div>
          ))}
        </div>
      </section>
        </>
      )}

      {/* Country presets */}
      <section aria-label="Country photo sizes">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          Official sizes, by country
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COUNTRY_SECTIONS.map((c) => (
            <article
              key={c.id}
              id={c.id}
              className="p-4 rounded-2xl bg-white/70 dark:bg-gray-900/70 border border-gray-200/80 dark:border-gray-800/80 shadow-sm scroll-mt-24"
            >
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 m-0 mb-1">
                {c.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 m-0">{c.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" aria-label="Pricing" className="scroll-mt-24">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Pricing</h3>
        <div className="p-5 rounded-2xl bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40 border border-indigo-200/50 dark:border-indigo-800/50">
          <p className="text-sm text-gray-700 dark:text-gray-200 m-0 mb-3">
            <strong className="text-base">One payment: {formatPrice()}</strong> — no
            subscription, no account.
          </p>
          <ul className="m-0 p-0 list-none flex flex-col gap-1.5 text-sm text-gray-700 dark:text-gray-300">
            {[
              'Clean 300 DPI PDF print sheet, no watermark',
              'Clean 300 DPI PNG of the sheet',
              'Every country preset and paper size included',
              'Free watermarked preview before you pay',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 dark:text-gray-400 m-0 mt-3">
            A photo studio typically charges PKR 500–1,500 for a set in Pakistan, and
            around $15–17 for two photos at a US pharmacy. One sheet printed at home
            costs a few rupees / cents in paper and ink.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section aria-label="Frequently asked questions">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          Frequently asked questions
        </h3>
        <div className="flex flex-col gap-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="p-4 rounded-2xl bg-white/70 dark:bg-gray-900/70 border border-gray-200/80 dark:border-gray-800/80 shadow-sm"
            >
              <summary className="text-sm font-bold text-gray-900 dark:text-gray-100 cursor-pointer">
                {f.q}
              </summary>
              <p className="text-xs text-gray-600 dark:text-gray-400 m-0 mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
};
