'use client';

import { Upload, Zap, FileJson, Download } from 'lucide-react';

const steps = [
  {
    number: '1',
    icon: Upload,
    title: 'Upload your image',
    description: 'Drop a PNG, JPG, or WebP. No account needed. Up to 50 MB.',
  },
  {
    number: '2',
    icon: Zap,
    title: 'AI traces in real time',
    description:
      'Our algorithm detects edges, removes backgrounds, and builds clean paths in seconds.',
  },
  {
    number: '3',
    icon: FileJson,
    title: 'Fine-tune if needed',
    description:
      'Adjust smoothing, threshold, and background removal. Preview updates instantly.',
  },
  {
    number: '4',
    icon: Download,
    title: 'Download your vector',
    description:
      'SVG, DXF, EPS, PDF, G-code, or DST. Ready for print, cut, or code.',
  },
];

export function HowItWorks() {
  return (
    <div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={step.number} className="relative">
              {/* Connector line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div
                  className="absolute left-[calc(50%+20px)] top-10 hidden h-0.5 w-[calc((100vw-20rem)/4-40px)] bg-[var(--border-strong)] lg:block"
                  aria-hidden="true"
                />
              )}

              <div className="flex flex-col items-center gap-4 text-center">
                {/* Step number circle */}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-lg font-semibold text-white shadow-[0_0_0_4px_var(--accent-wash)]">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="h-12 w-12 rounded-lg bg-accent-wash text-accent">
                  <Icon className="h-full w-full p-2.5" />
                </div>

                {/* Text */}
                <div>
                  <h3 className="font-semibold text-[17px] tracking-[-0.01em] text-text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom callout */}
      <div className="mt-16 rounded-[var(--radius-lg)] bg-accent-wash px-6 py-5 text-center">
        <p className="text-[15px] text-text-secondary">
          <span className="font-semibold text-accent-ink">No limits on batch size.</span> Convert 1 file
          or 1,000. Same price, same speed.
        </p>
      </div>
    </div>
  );
}