# Passport Photo Studio Web Application

High-precision Passport & Visa Photo Studio Web Application built with React, TypeScript, Tailwind CSS, HTML5 Canvas, and jsPDF. Everything runs in the browser — photos are never uploaded to a server.

## Features
- **Multi-Photo Batch Upload**: Upload multiple photos simultaneously with copy quantity counters.
- **Biometric Crop & Alignment Modal**: Aspect-ratio locked crop box with biometric head oval overlay, eye alignment line, 90° rotation, and brightness/contrast sliders.
- **Global Passport & Paper Presets**: US (2×2"), EU/UK (35×45mm), Pakistan (35×45mm), China (33×48mm), Canada (50×70mm), India (51×51mm), Japan (35×45mm), stamp photo (20×25mm); paper A4, Letter, Legal, 4×6", 5×7", 8×10", A5.
- **Cut Lines & Margin Controls**: Solid, dotted, corner crosshairs, row/column gap sliders, and page margin controls.
- **300 DPI PDF & PNG Export**: Real export via `src/utils/exportEngine.ts` (jsPDF + canvas at 300 DPI, i.e. 300/25.4 px per mm). Export PDF / Download PNG are behind the paywall; Print Sheet uses the browser print path.
- **Free preview / paywall**: The on-screen preview is watermarked until paid. One payment — €4.99 / $4.99 / PKR 400 — unlocks the clean 300 DPI PDF and PNG. See `src/lib/payments.ts`.
- **US format-only mode**: When the US preset is selected, brightness/contrast controls are disabled and exports ignore any earlier edits. Since January 2026 the US Department of State rejects digitally altered passport photos.
- **Landing page & SEO**: Hero, how it works, per-country sections (US, UK, Pakistan, Canada, China), pricing and FAQ, plus title / meta description / Open Graph / JSON-LD in `index.html`.
- **Legal pages**: Terms of Service, Privacy Policy and Refund Policy at `#/terms`, `#/privacy` and `#/refund` (lightweight hash routing, no router dependency), linked from the footer on every view. Written in en-GB for EU customers and Paddle review. Business legal name, contact email, business address and governing law are marked `[TODO: ...]` in `src/components/LegalPages.tsx` and must be filled in before launch.

## Running Locally
```bash
npm install
npm run dev
npm run build
```

## Payments — not connected yet
No payment provider is connected. `src/lib/payments.ts` holds the price (€4.99 / $4.99 / PKR 400) and clearly marked TODO slots for Paddle, Lemon Squeezy or PayPal checkout links. **Recommended for a seller in Pakistan: Paddle** (merchant of record; Stripe is not available to sellers in Pakistan). The current "paid" flag is a localStorage test stub only — replace it with real provider verification (webhook / return-URL check) before launch, and remove the demo unlock button in `PaywallModal`.

## Deployment
Recommended: Vercel (static Vite build, `npm run build`, output `dist/`). No backend is needed. Set the canonical / Open Graph URL in `index.html` once a domain is chosen.

## Print accuracy
Exports are rendered from millimetre measurements at 300 DPI (e.g. a 50.8 mm US photo is exactly 600 px). Print at 100% scale / "Actual size" with "fit to page" off, and measure the first print with a ruler — browser and printer scaling are outside the app's control.

## Known limitations
- No automated compliance check (head size, background, glasses) — sizing only.
- No background removal, by design (it would breach the US 2026 rule).
- No tests yet. Grid / DPI maths were verified with a standalone Node check (see below); the upload → crop → export flow has not yet been exercised end-to-end in a real browser.
- Photos edited with brightness/contrast before switching to the US preset may still carry those edits baked into their pixels — re-crop from the original in that case.
- `src/constants/presets.ts` is dead code (duplicates `src/types.ts` with different preset ids) and should be removed or reconciled in a tidy-up pass.
