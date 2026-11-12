import { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Terms of Service — Vectroy",
  description:
    "Terms and conditions governing your use of Vectroy's AI-powered vector conversion platform.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
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
                Terms of Service
              </h1>
              <p className="text-muted-foreground">
                Last updated: November 13, 2026
              </p>
            </header>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
              {/* ── 1. Agreement ───────────────────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
                <p>
                  By accessing or using Vectroy (&quot;Service&quot;, &quot;Platform&quot;), operated by Vectroy
                  (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), you agree to be bound by these Terms of Service
                  (&quot;Terms&quot;). If you do not agree to these Terms, you may not use the Service.
                </p>
                <p>
                  We reserve the right to modify these Terms at any time. Changes become effective
                  immediately upon posting. Continued use of the Service after changes constitutes
                  acceptance of the modified Terms.
                </p>
              </section>

              {/* ── 2. Service Description ────────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
                <p>
                  Vectroy provides AI-powered raster-to-vector image conversion services, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Single and batch image vectorization</li>
                  <li>AI upscaling and background removal</li>
                  <li>SVG generation, editing, and optimization</li>
                  <li>Logo and pattern generation via AI</li>
                  <li>API access for developers</li>
                  <li>Done-for-you conversion services</li>
                </ul>
                <p>
                  Features, availability, and service levels vary by subscription tier. We reserve
                  the right to modify, suspend, or discontinue any feature without notice.
                </p>
              </section>

              {/* ── 3. Account Registration ───────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Account Registration & Security</h2>
                <p>
                  To use certain features, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Accept responsibility for all activity under your account</li>
                  <li>Not share your account with others</li>
                </ul>
                <p>
                  We reserve the right to suspend or terminate accounts that violate these Terms or
                  engage in fraudulent activity.
                </p>
              </section>

              {/* ── 4. Credits & Billing ──────────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Credits, Subscriptions & Billing</h2>
                
                <h3 className="text-xl font-medium mt-6 mb-3">4.1 Credit System</h3>
                <p>
                  Vectroy uses a credit-based system. Operations consume credits based on their
                  computational cost (1–10 credits per operation). Credit costs are displayed before
                  each operation. Credits are non-refundable once consumed.
                </p>

                <h3 className="text-xl font-medium mt-6 mb-3">4.2 Subscriptions</h3>
                <p>
                  Paid plans include monthly credit allocations that reset each billing cycle.
                  Unused credits expire and do not roll over unless explicitly stated. Subscriptions
                  renew automatically until canceled.
                </p>

                <h3 className="text-xl font-medium mt-6 mb-3">4.3 One-Time Credit Packs</h3>
                <p>
                  Credit packs are one-time purchases that never expire. They supplement subscription
                  credits and are consumed after monthly allocations.
                </p>

                <h3 className="text-xl font-medium mt-6 mb-3">4.4 Payment Processing</h3>
                <p>
                  Payments are processed securely through Polar. By subscribing, you authorize
                  recurring charges. Pricing is in USD. Taxes may apply based on your location.
                </p>

                <h3 className="text-xl font-medium mt-6 mb-3">4.5 Cancellations & Refunds</h3>
                <p>
                  You may cancel your subscription at any time. Cancellations take effect at the end
                  of the current billing period—no prorated refunds. Credit packs are final sale.
                  Refunds are issued only for billing errors or service unavailability exceeding 48
                  consecutive hours.
                </p>
              </section>

              {/* ── 5. Acceptable Use ─────────────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Acceptable Use Policy</h2>
                <p>You agree NOT to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Upload illegal, infringing, defamatory, or obscene content</li>
                  <li>Violate intellectual property rights of others</li>
                  <li>
                    Abuse, overload, or disrupt the Service (e.g., denial-of-service attacks)
                  </li>
                  <li>
                    Reverse-engineer, decompile, or extract proprietary algorithms from the Platform
                  </li>
                  <li>
                    Resell or redistribute Service outputs as a competing vector conversion service
                  </li>
                  <li>Use automated scripts to exceed reasonable usage limits</li>
                  <li>Impersonate others or misrepresent your affiliation</li>
                </ul>
                <p>
                  Violation of this policy may result in immediate account suspension or termination
                  without refund.
                </p>
              </section>

              {/* ── 6. Intellectual Property ──────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property Rights</h2>
                
                <h3 className="text-xl font-medium mt-6 mb-3">6.1 Your Content</h3>
                <p>
                  You retain all ownership rights to images you upload (&quot;Your Content&quot;). By
                  uploading, you grant us a worldwide, non-exclusive license to process, store, and
                  display Your Content solely to provide the Service. We do not claim ownership of
                  Your Content.
                </p>

                <h3 className="text-xl font-medium mt-6 mb-3">6.2 Generated Outputs</h3>
                <p>
                  Vector files generated from your uploads are yours to use commercially, subject to
                  any third-party rights in the original images. AI-generated logos and patterns are
                  provided royalty-free for your use, but we cannot guarantee they are free from
                  third-party claims.
                </p>

                <h3 className="text-xl font-medium mt-6 mb-3">6.3 Platform Rights</h3>
                <p>
                  Vectroy, its logo, algorithms, and interface are protected by copyright, trademark,
                  and trade secret laws. You may not copy, modify, or create derivative works without
                  written permission.
                </p>
              </section>

              {/* ── 7. Privacy ────────────────────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Privacy & Data Protection</h2>
                <p>
                  Your use of the Service is governed by our{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  , which describes how we collect, use, and protect your data. By using Vectroy, you
                  consent to our data practices.
                </p>
              </section>

              {/* ── 8. Disclaimers ────────────────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Disclaimers & Limitations</h2>
                
                <h3 className="text-xl font-medium mt-6 mb-3">8.1 &quot;As-Is&quot; Service</h3>
                <p className="uppercase font-semibold">
                  THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY
                  KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR
                  A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </p>

                <h3 className="text-xl font-medium mt-6 mb-3">8.2 Output Quality</h3>
                <p>
                  We do not guarantee that vector outputs will be error-free, accurate, or meet your
                  specific requirements. Conversion quality depends on input image characteristics.
                  Review outputs before commercial use.
                </p>

                <h3 className="text-xl font-medium mt-6 mb-3">8.3 Service Availability</h3>
                <p>
                  We strive for high uptime but do not guarantee uninterrupted access. Maintenance,
                  updates, or technical issues may cause temporary disruptions. We are not liable for
                  losses arising from service downtime.
                </p>
              </section>

              {/* ── 9. Liability Limits ───────────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
                <p className="uppercase font-semibold">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, VECTROY SHALL NOT BE LIABLE FOR ANY
                  INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
                  PROFITS, REVENUE, DATA, OR BUSINESS OPPORTUNITIES ARISING FROM YOUR USE OF THE
                  SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </p>
                <p className="mt-4">
                  Our total liability for any claims related to the Service is limited to the amount
                  you paid us in the 12 months preceding the claim, or $100 USD, whichever is
                  greater.
                </p>
              </section>

              {/* ── 10. Indemnification ───────────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
                <p>
                  You agree to indemnify and hold harmless Vectroy, its affiliates, officers, and
                  employees from any claims, damages, losses, or expenses (including legal fees)
                  arising from:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any law or third-party rights</li>
                  <li>Your Content or use of Service outputs</li>
                  <li>Unauthorized use of your account</li>
                </ul>
              </section>

              {/* ── 11. Termination ───────────────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
                <p>
                  We may suspend or terminate your account immediately, without notice, if you
                  violate these Terms or engage in fraudulent or abusive behavior. Upon termination:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your access to the Service ends immediately</li>
                  <li>Unused credits are forfeited</li>
                  <li>We may delete Your Content after 30 days</li>
                  <li>Outstanding payments remain due</li>
                </ul>
                <p>
                  Sections 6 (Intellectual Property), 8 (Disclaimers), 9 (Liability), 10
                  (Indemnification), and 12 (Governing Law) survive termination.
                </p>
              </section>

              {/* ── 12. Governing Law ─────────────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">12. Governing Law & Disputes</h2>
                <p>
                  These Terms are governed by the laws of [Your Jurisdiction], without regard to
                  conflict of law principles. Any disputes shall be resolved through binding
                  arbitration in [Your City/State], except where prohibited by law. You waive any
                  right to a jury trial or class action.
                </p>
              </section>

              {/* ── 13. Miscellaneous ─────────────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">13. General Provisions</h2>
                
                <h3 className="text-xl font-medium mt-6 mb-3">13.1 Entire Agreement</h3>
                <p>
                  These Terms, together with our Privacy Policy, constitute the entire agreement
                  between you and Vectroy regarding the Service.
                </p>

                <h3 className="text-xl font-medium mt-6 mb-3">13.2 Severability</h3>
                <p>
                  If any provision is found unenforceable, the remaining provisions remain in full
                  force.
                </p>

                <h3 className="text-xl font-medium mt-6 mb-3">13.3 No Waiver</h3>
                <p>
                  Our failure to enforce any right or provision does not constitute a waiver of that
                  right.
                </p>

                <h3 className="text-xl font-medium mt-6 mb-3">13.4 Assignment</h3>
                <p>
                  You may not assign these Terms without our consent. We may assign them freely.
                </p>

                <h3 className="text-xl font-medium mt-6 mb-3">13.5 Force Majeure</h3>
                <p>
                  We are not liable for delays or failures caused by circumstances beyond our
                  reasonable control (e.g., natural disasters, war, pandemics, internet outages).
                </p>
              </section>

              {/* ── 14. Contact ───────────────────────────────────── */}
              <section>
                <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
                <p>
                  For questions about these Terms, contact us at:{" "}
                  <a
                    href="mailto:legal@vectroy.com"
                    className="text-primary hover:underline"
                  >
                    legal@vectroy.com
                  </a>
                </p>
                <p className="mt-4">
                  <Link href="/privacy" className="text-primary hover:underline">
                    View Privacy Policy →
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
