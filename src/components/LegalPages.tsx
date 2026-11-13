import React from 'react';

/**
 * Legal pages for Passport Photo Studio, in en-GB.
 *
 * Rendered via lightweight hash routing (#/terms, #/privacy, #/refund)
 * so they work as a static Vite SPA with no server rewrites and no
 * router dependency.
 *
 * Placeholders: the business legal name, contact email, business
 * address and governing law are NOT invented here — they are marked
 * [TODO: ...] and must be filled in before launch / Paddle review.
 */

export type LegalPageId = 'terms' | 'privacy' | 'refund';

const CONTACT_EMAIL = '[TODO: contact email]';
const BUSINESS_NAME = '[TODO: business legal name]';
const BUSINESS_ADDRESS = '[TODO: business address]';
const GOVERNING_LAW = '[TODO: governing law]';

function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <article className="max-w-3xl mx-auto flex flex-col gap-6 py-2">
      <div>
        <a
          href="#/"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline no-underline"
        >
          ← Back to the studio
        </a>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 mt-3 mb-1">
          {title}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 m-0">
          Last updated: {updated} · Passport Photo Studio
        </p>
      </div>
      <div className="flex flex-col gap-5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="m-0">{children}</p>;
}

function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="13 November 2026">
      <Section title="1. Who we are">
        <P>
          Passport Photo Studio (“the Service”) is operated by {BUSINESS_NAME},{' '}
          {BUSINESS_ADDRESS}. Contact: {CONTACT_EMAIL}. These terms govern your use
          of the Service. By using the Service, you agree to these terms.
        </P>
      </Section>
      <Section title="2. What the Service does">
        <P>
          Passport Photo Studio is a client-side passport and visa photo maker. You
          upload a photo, crop it with the biometric head guide, pick a country
          preset, and print a sheet or download a digital file. All processing runs
          in your web browser — your photos are never uploaded to a server, and
          there is no account to create.
        </P>
        <P>
          The Service sizes and lays out photos to the official dimensions for the
          country you select. It does not check head size, background, glasses, or
          any other compliance rule automatically, and it does not remove
          backgrounds.
        </P>
      </Section>
      <Section title="3. Price and payment">
        <P>
          The on-screen preview is free and watermarked, so you can check the
          layout before you pay. One payment unlocks the clean, watermark-free
          300 DPI PDF and PNG download: €4.99 / $4.99 / PKR 400. There is no
          subscription and no recurring charge.
        </P>
        <P>
          Payment is handled by Paddle as merchant of record. Paddle is the seller
          on your receipt, collects and remits VAT and other applicable taxes, and
          processes the payment. Your card details never touch this website. Prices
          shown to customers in the EU are VAT-inclusive.
        </P>
      </Section>
      <Section title="4. No guarantee of acceptance">
        <P>
          Acceptance of a photo is always decided by the issuing authority (for
          example, the passport office or embassy). We do not guarantee that a photo
          made with this Service will be accepted. You are responsible for checking
          the latest official photo rules for your country and application before
          you apply, and for taking a suitable original photo: plain background,
          facing the camera, no glasses unless the authority allows them, and taken
          within the time limit the authority requires.
        </P>
        <P>
          For US passports, the Service runs in format-only mode: crop and resize
          only, with no brightness, contrast or other edits. Since January 2026 the
          US Department of State rejects photos that have been digitally altered,
          including AI-edited, retouched or background-replaced photos. Do not use
          edited photos for a US passport application.
        </P>
      </Section>
      <Section title="5. Licence and acceptable use">
        <P>
          Your payment buys a licence to use the downloaded files for your own
          personal passport, visa or ID applications. You may print them for that
          purpose. You may not resell, redistribute or publish the Service, its
          files, or photos made with it as a commercial service, and you may not
          use the Service for any unlawful purpose or to create misleading identity
          documents.
        </P>
      </Section>
      <Section title="6. Liability">
        <P>
          The Service is provided “as is”, without warranties of any kind. To the
          fullest extent allowed by law, we are not liable for a rejected
          application, a delayed application, or any loss arising from your use of
          the Service, including where a photo was rejected because it did not meet
          the issuing authority’s rules. Nothing in these terms limits liability
          that cannot be limited by law.
        </P>
      </Section>
      <Section title="7. Changes to these terms">
        <P>
          We may update these terms from time to time. The version on this page is
          the one that applies when you use the Service. If you do not agree with a
          change, stop using the Service.
        </P>
        <P>
          Governing law: {GOVERNING_LAW}. If you are a consumer in the EU, you also
          keep any mandatory protections of the law of your country of residence.
        </P>
      </Section>
    </LegalLayout>
  );
}

function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="13 November 2026">
      <Section title="1. Who we are">
        <P>
          Passport Photo Studio is operated by {BUSINESS_NAME}, {BUSINESS_ADDRESS}.
          Contact: {CONTACT_EMAIL}. This policy explains what data we collect, and
          what we deliberately do not collect.
        </P>
      </Section>
      <Section title="2. Your photos are never uploaded">
        <P>
          This is the most important point: your photos are processed entirely in
          your web browser. Upload, crop, layout and export all happen on your
          device. Your photos are never sent to our servers, never stored by us,
          and never shared with anyone. There is no account, so we hold no
          username, password or profile for you.
        </P>
      </Section>
      <Section title="3. Payments">
        <P>
          Payments are handled by Paddle as merchant of record. When you pay,
          Paddle collects your payment details and acts as the seller on your
          receipt, including collecting and remitting VAT. Your card details never
          touch this website, and we do not receive or store them. Paddle’s own
          privacy policy governs the data you give Paddle.
        </P>
      </Section>
      <Section title="4. Cookies and local storage">
        <P>
          We do not use advertising trackers or analytics cookies. The Service uses
          your browser’s local storage only for functional purposes: to remember
          whether a download has been paid for (a local test flag is used during
          development and is replaced by real payment verification before launch),
          and to keep the app working between visits. No photo data is stored in
          local storage.
        </P>
      </Section>
      <Section title="5. What we do collect">
        <P>
          We do not currently run analytics, so we do not collect browsing
          statistics about you. If you contact us by email, we will use your email
          address only to reply to you. We do not sell personal data to anyone.
        </P>
      </Section>
      <Section title="6. Your rights (GDPR, for EU users)">
        <P>
          If you are in the EU, under the General Data Protection Regulation (GDPR)
          you have the right to access, correct or delete personal data we hold
          about you, to restrict or object to its processing, and to lodge a
          complaint with your local data protection authority. Because we hold no
          account and no photo data, a request will usually confirm that we hold
          nothing about you beyond any email you sent us. To make a request, email{' '}
          {CONTACT_EMAIL}.
        </P>
      </Section>
      <Section title="7. Children">
        <P>
          The Service is not directed at children under 16. If you are under 16,
          please ask a parent or guardian to use it with you.
        </P>
      </Section>
      <Section title="8. Changes to this policy">
        <P>
          We may update this policy from time to time. The version on this page is
          the one that applies when you use the Service.
        </P>
      </Section>
    </LegalLayout>
  );
}

function RefundPage() {
  return (
    <LegalLayout title="Refund Policy" updated="13 November 2026">
      <Section title="1. What you are buying">
        <P>
          You are buying a one-time digital download: a clean, watermark-free
          300 DPI PDF and PNG of your passport photo sheet, for €4.99 / $4.99 /
          PKR 400. The free preview is watermarked and costs nothing. Payment is
          handled by Paddle as merchant of record, and Paddle is the seller on
          your receipt.
        </P>
      </Section>
      <Section title="2. EU cooling-off period">
        <P>
          If you are a consumer in the EU, you normally have a 14-day cooling-off
          period for online purchases. For digital content, that right is lost
          once you start the download with your consent and acknowledgement that
          you lose the right. By paying and downloading the clean files, you
          consent to immediate delivery and acknowledge that you lose the
          14-day cooling-off right for that download.
        </P>
      </Section>
      <Section title="3. When we will refund you">
        <P>We will refund you if any of these apply:</P>
        <ul className="m-0 pl-5 flex flex-col gap-1.5 list-disc">
          <li>The downloaded file is defective — for example, it will not open, or it is not the sheet you paid for — and we cannot fix it.</li>
          <li>You were charged twice for the same download.</li>
          <li>You were charged the wrong amount, or charged when the payment should not have gone through.</li>
        </ul>
      </Section>
      <Section title="4. When we will not refund you">
        <P>We cannot refund you where the problem is not our fault, including:</P>
        <ul className="m-0 pl-5 flex flex-col gap-1.5 list-disc">
          <li>Your photo was rejected by a passport office, embassy or other authority — acceptance is always decided by the issuing authority.</li>
          <li>You picked the wrong country preset or paper size.</li>
          <li>You edited the photo against the official rules (for example, using brightness, contrast or retouching for a US passport, where edits are banned).</li>
          <li>You changed your mind after downloading the clean files.</li>
        </ul>
        <P>
          If you are unsure which preset to use, check the official photo rules
          for your application before you pay, and use the free watermarked
          preview to check the layout first.
        </P>
      </Section>
      <Section title="5. How to request a refund">
        <P>
          Email {CONTACT_EMAIL} within 14 days of your payment, with your order
          details (date, amount, and the email used at checkout) and a short
          description of the problem. We aim to reply within 5 business days.
          Approved refunds are processed back to your original payment method
          through Paddle, and usually arrive within 5–10 business days depending
          on your bank.
        </P>
      </Section>
    </LegalLayout>
  );
}

export function LegalPage({ page }: { page: LegalPageId }) {
  if (page === 'privacy') return <PrivacyPage />;
  if (page === 'refund') return <RefundPage />;
  return <TermsPage />;
}

export const LEGAL_LINKS: { id: LegalPageId; label: string; href: string }[] = [
  { id: 'terms', label: 'Terms of Service', href: '#/terms' },
  { id: 'privacy', label: 'Privacy Policy', href: '#/privacy' },
  { id: 'refund', label: 'Refund Policy', href: '#/refund' },
];
