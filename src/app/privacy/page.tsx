import { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Privacy Policy — Vectroy",
  description:
    "Learn how Vectroy collects, uses, and protects your personal information and uploaded content.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader
        authSlot={
          <Suspense fallback={null}>
            <AuthSlot />
          </Suspense>
        }
      />

      <main id="main" className="flex-1">
        <article className="py-16 sm:py-24">
          <div className="wrap max-w-3xl">
            <header className="mb-12">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground">
                Last updated: November 13, 2026
              </p>
            </header>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
              {/* ── 1. Introduction ────────────────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p>
                  Vectroy (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This Privacy
                  Policy explains how we collect, use, disclose, and safeguard your information when
                  you use our AI-powered vector conversion platform (&quot;Service&quot;).
                </p>
                <p>
                  By using Vectroy, you consent to the data practices described in this Policy. If
                  you do not agree, please do not use the Service.
                </p>
              </section>

              {/* ── 2. Information We Collect ─────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>

                <h3 className="text-xl font-medium mt-6 mb-3">2.1 Account Information</h3>
                <p>When you create an account, we collect:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email address (required for authentication and notifications)</li>
                  <li>Display name (optional)</li>
                  <li>Password (hashed and never stored in plain text)</li>
                  <li>Profile picture (optional, if you upload one)</li>
                  <li>Organization name (for Team and Enterprise plans)</li>
                </ul>

                <h3 className="text-xl font-medium mt-6 mb-3">2.2 Payment Information</h3>
                <p>
                  Subscription and credit pack purchases are processed through Polar, our payment
                  processor. We do NOT store your full credit card details. Polar collects:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Billing name and address</li>
                  <li>Credit card information (stored securely by Polar, not by us)</li>
                  <li>Transaction history and receipts</li>
                </ul>
                <p>
                  Polar's data practices are governed by{" "}
                  <a
                    href="https://polar.sh/legal/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Polar's Privacy Policy
                  </a>
                  .
                </p>

                <h3 className="text-xl font-medium mt-6 mb-3">2.3 Uploaded Content</h3>
                <p>
                  When you use our conversion services, we temporarily store your uploaded images:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Original raster images (PNG, JPG, WebP, etc.)</li>
                  <li>Generated vector files (SVG)</li>
                  <li>Processing metadata (file size, dimensions, operation type)</li>
                </ul>
                <p>
                  <strong>Retention:</strong> Uploaded images are deleted from our servers after 30
                  days, or immediately upon your request. Deleted files cannot be recovered.
                </p>

                <h3 className="text-xl font-medium mt-6 mb-3">2.4 Usage Data</h3>
                <p>We automatically collect technical and behavioral data:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP address and approximate geographic location</li>
                  <li>Browser type, device, and operating system</li>
                  <li>Pages visited, features used, and time spent on the platform</li>
                  <li>Conversion operations performed and credits consumed</li>
                  <li>Error logs and performance metrics</li>
                </ul>

                <h3 className="text-xl font-medium mt-6 mb-3">2.5 Cookies & Tracking</h3>
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Authenticate your session and keep you logged in</li>
                  <li>Remember your preferences (theme, language)</li>
                  <li>Analyze traffic and improve the Service (via analytics tools)</li>
                  <li>Serve targeted ads (if applicable)</li>
                </ul>
                <p>
                  You can control cookies through your browser settings, but disabling them may limit
                  functionality.
                </p>
              </section>

              {/* ── 3. How We Use Your Information ────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                <p>We use your data to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Provide the Service:</strong> Process conversions, manage credits, and
                    deliver outputs
                  </li>
                  <li>
                    <strong>Improve AI Models:</strong> Train and refine vectorization algorithms
                    (anonymized data only)
                  </li>
                  <li>
                    <strong>Billing & Payments:</strong> Process transactions, send receipts, and
                    manage subscriptions
                  </li>
                  <li>
                    <strong>Customer Support:</strong> Respond to inquiries, troubleshoot issues, and
                    resolve disputes
                  </li>
                  <li>
                    <strong>Security & Fraud Prevention:</strong> Detect abuse, unauthorized access,
                    and policy violations
                  </li>
                  <li>
                    <strong>Communications:</strong> Send transactional emails (receipts, password
                    resets, service updates)
                  </li>
                  <li>
                    <strong>Marketing (with consent):</strong> Share product updates, promotions, and
                    educational content (you can opt out anytime)
                  </li>
                  <li>
                    <strong>Legal Compliance:</strong> Fulfill legal obligations and enforce our Terms
                    of Service
                  </li>
                </ul>
              </section>

              {/* ── 4. Data Sharing & Disclosure ──────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Data Sharing & Disclosure</h2>
                <p>
                  We do NOT sell your personal information. We share data only in these limited
                  circumstances:
                </p>

                <h3 className="text-xl font-medium mt-6 mb-3">4.1 Service Providers</h3>
                <p>We share data with trusted third parties who help operate the Service:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Polar:</strong> Payment processing and subscription management
                  </li>
                  <li>
                    <strong>Cloud Hosting:</strong> Amazon Web Services (AWS), Google Cloud, or
                    DigitalOcean for infrastructure
                  </li>
                  <li>
                    <strong>AI Providers:</strong> OpenAI, Stability AI, or similar services for
                    vectorization processing
                  </li>
                  <li>
                    <strong>Email Service:</strong> SendGrid, Postmark, or similar for transactional
                    emails
                  </li>
                  <li>
                    <strong>Analytics:</strong> Google Analytics, Plausible, or similar for usage
                    insights
                  </li>
                </ul>
                <p>
                  These providers are contractually obligated to protect your data and use it only for
                  the services they provide to us.
                </p>

                <h3 className="text-xl font-medium mt-6 mb-3">4.2 Legal Requirements</h3>
                <p>We may disclose your information if required by law to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Comply with court orders, subpoenas, or legal processes</li>
                  <li>Protect our rights, property, or safety, or that of our users</li>
                  <li>Investigate fraud, security breaches, or Terms violations</li>
                </ul>

                <h3 className="text-xl font-medium mt-6 mb-3">4.3 Business Transfers</h3>
                <p>
                  If Vectroy is acquired, merged, or undergoes a business restructuring, your data may
                  be transferred to the new entity. You will be notified of such changes.
                </p>
              </section>

              {/* ── 5. Data Retention ─────────────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
                <p>We retain your data for as long as necessary to provide the Service:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Account Data:</strong> Stored until you delete your account
                  </li>
                  <li>
                    <strong>Uploaded Images:</strong> Deleted after 30 days, or immediately on request
                  </li>
                  <li>
                    <strong>Billing Records:</strong> Retained for 7 years (legal requirement for tax
                    purposes)
                  </li>
                  <li>
                    <strong>Usage Logs:</strong> Anonymized and aggregated after 90 days
                  </li>
                </ul>
                <p>
                  After deletion, some data may persist in backups for up to 30 days before permanent
                  removal.
                </p>
              </section>

              {/* ── 6. Your Privacy Rights ────────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Your Privacy Rights</h2>
                <p>
                  Depending on your location, you may have the following rights under GDPR, CCPA, or
                  similar laws:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Access:</strong> Request a copy of the personal data we hold about you
                  </li>
                  <li>
                    <strong>Correction:</strong> Update inaccurate or incomplete information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your account and data
                  </li>
                  <li>
                    <strong>Portability:</strong> Receive your data in a machine-readable format
                  </li>
                  <li>
                    <strong>Opt-Out:</strong> Unsubscribe from marketing emails (transactional emails
                    cannot be disabled)
                  </li>
                  <li>
                    <strong>Restrict Processing:</strong> Limit how we use your data
                  </li>
                  <li>
                    <strong>Object:</strong> Opt out of certain data uses (e.g., marketing)
                  </li>
                </ul>
                <p>
                  To exercise these rights, email{" "}
                  <a
                    href="mailto:privacy@vectroy.com"
                    className="text-primary hover:underline"
                  >
                    privacy@vectroy.com
                  </a>
                  . We will respond within 30 days.
                </p>
              </section>

              {/* ── 7. Data Security ──────────────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Data Security</h2>
                <p>We implement industry-standard security measures:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Encryption:</strong> All data in transit uses TLS/SSL. Sensitive data at
                    rest is encrypted.
                  </li>
                  <li>
                    <strong>Access Controls:</strong> Role-based permissions limit employee access to
                    personal data
                  </li>
                  <li>
                    <strong>Regular Audits:</strong> Periodic security reviews and vulnerability scans
                  </li>
                  <li>
                    <strong>Secure Infrastructure:</strong> Hosting on trusted cloud providers with
                    SOC 2 compliance
                  </li>
                </ul>
                <p>
                  However, no system is 100% secure. If a breach occurs, we will notify affected users
                  as required by law.
                </p>
              </section>

              {/* ── 8. International Transfers ────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers</h2>
                <p>
                  Vectroy operates globally. Your data may be transferred to and processed in
                  countries outside your residence, including the United States. By using the Service,
                  you consent to such transfers.
                </p>
                <p>
                  For EU users: We comply with GDPR and use Standard Contractual Clauses (SCCs) or
                  other approved mechanisms to protect your data during international transfers.
                </p>
              </section>

              {/* ── 9. Children's Privacy ─────────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Children&apos;s Privacy</h2>
                <p>
                  Vectroy is not intended for users under 16 years of age. We do not knowingly collect
                  data from children. If you believe a child has provided us with personal
                  information, contact us immediately at{" "}
                  <a
                    href="mailto:privacy@vectroy.com"
                    className="text-primary hover:underline"
                  >
                    privacy@vectroy.com
                  </a>
                  , and we will delete it promptly.
                </p>
              </section>

              {/* ── 10. Third-Party Links ─────────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Third-Party Links</h2>
                <p>
                  Our Service may contain links to external websites or integrations (e.g., Figma,
                  Polar). We are not responsible for the privacy practices of these third parties.
                  Review their policies before sharing information.
                </p>
              </section>

              {/* ── 11. California Privacy Rights ─────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  11. California Privacy Rights (CCPA)
                </h2>
                <p>California residents have additional rights:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Know:</strong> What personal information we collect and how it&apos;s used
                  </li>
                  <li>
                    <strong>Delete:</strong> Request deletion of your data (with exceptions for legal
                    obligations)
                  </li>
                  <li>
                    <strong>Opt-Out:</strong> We do not sell personal information, so no opt-out is
                    needed
                  </li>
                  <li>
                    <strong>Non-Discrimination:</strong> You will not be penalized for exercising your
                    rights
                  </li>
                </ul>
                <p>
                  To exercise these rights, email{" "}
                  <a
                    href="mailto:privacy@vectroy.com"
                    className="text-primary hover:underline"
                  >
                    privacy@vectroy.com
                  </a>
                  .
                </p>
              </section>

              {/* ── 12. EU/UK Privacy Rights (GDPR) ───────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  12. EU/UK Privacy Rights (GDPR)
                </h2>
                <p>EU and UK users have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Lodge a Complaint:</strong> File a complaint with your local data
                    protection authority
                  </li>
                  <li>
                    <strong>Withdraw Consent:</strong> Revoke consent for marketing or data processing
                    at any time
                  </li>
                  <li>
                    <strong>Data Portability:</strong> Receive your data in a structured format
                  </li>
                </ul>
                <p>
                  Our legal basis for processing: Contract performance, legitimate interests, and
                  legal compliance.
                </p>
              </section>

              {/* ── 13. Do Not Track ──────────────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">13. Do Not Track (DNT) Signals</h2>
                <p>
                  We do not currently respond to Do Not Track (DNT) browser signals. However, you can
                  disable cookies through your browser settings.
                </p>
              </section>

              {/* ── 14. Changes to This Policy ────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">14. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Policy periodically. Material changes will be announced via email
                  or an in-app notification. The &quot;Last updated&quot; date at the top reflects the most
                  recent revision.
                </p>
                <p>Continued use of the Service after changes constitutes acceptance.</p>
              </section>

              {/* ── 15. Contact Us ────────────────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">15. Contact Us</h2>
                <p>For privacy-related questions or requests, reach us at:</p>
                <ul className="list-none space-y-2 mt-4">
                  <li>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:privacy@vectroy.com"
                      className="text-primary hover:underline"
                    >
                      privacy@vectroy.com
                    </a>
                  </li>
                  <li>
                    <strong>Address:</strong> [Your Company Address]
                  </li>
                </ul>
                <p className="mt-6">
                  <Link href="/terms" className="text-primary hover:underline">
                    View Terms of Service →
                  </Link>
                </p>
              </section>
            </div>
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
