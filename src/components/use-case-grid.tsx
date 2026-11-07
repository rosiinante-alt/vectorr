import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'error';

interface UseCase {
  title: string;
  body: string;
  formats: string[];
  href: string;
  icon: React.ReactNode;
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const useCases: UseCase[] = [
  {
    title: 'Logos and brand archives',
    body: 'Turn a low-res logo export back into clean geometry, then ship every size without re-drawing it.',
    formats: ['SVG', 'EPS', 'PDF'],
    href: '/for-designers/logo-redesign-workflow',
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" {...stroke} />
        <path d="M12 8.2 14.6 12 12 15.8 9.4 12z" {...stroke} />
      </>
    ),
  },
  {
    title: 'Cricut, vinyl and screen printing',
    body: 'Get cut-ready paths with no stray nodes or gaps, so the blade follows the line you meant.',
    formats: ['SVG', 'DXF'],
    href: '/for-crafters/cricut-design-space',
    icon: (
      <>
        <path d="M4.5 18.5 15 8" {...stroke} />
        <path d="M15 8l3.5-3.5a2.4 2.4 0 0 1 3.4 3.4L18.5 11z" {...stroke} />
        <path d="M4.5 18.5 7 18l-1-2z" {...stroke} />
      </>
    ),
  },
  {
    title: 'Laser, CNC and engraving',
    body: 'Export toolpaths for production machines, with clean contours on every part of the job.',
    formats: ['DXF', 'G-code'],
    href: '/for-shops/cnc-router-toolpath-generation',
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2.5" {...stroke} />
        <path d="M8 16v-5M12 16V8M16 16v-7" {...stroke} />
      </>
    ),
  },
  {
    title: 'Illustrations and line art',
    body: 'Keep the hand-drawn character while collapsing thousands of stray points into editable paths.',
    formats: ['SVG', 'PDF'],
    href: '/for-designers/sketch-to-production-workflow',
    icon: (
      <>
        <path d="M4 17c3-1 4-6 7-6s4 5 7 4" {...stroke} />
        <circle cx="6.5" cy="8.5" r="2.4" {...stroke} />
        <path d="M14 5.5h5M14 9h3.5" {...stroke} />
      </>
    ),
  },
  {
    title: 'Embroidery digitizing',
    body: 'Hand off clean outlines to digitizing software, so stitch paths come out predictable.',
    formats: ['SVG', 'DST'],
    href: '/for-shops/embroidery-digitizing-workflow',
    icon: (
      <>
        <path d="M6 20c0-6 3-12 8-14 3 4 3 9-1 12-3 2-7 2-7 2z" {...stroke} />
        <path d="M9 16c1.5-3 3-5 5-6.5" {...stroke} />
      </>
    ),
  },
  {
    title: 'Developers and pipelines',
    body: 'Drive conversions from your own build with the API, and get identical output on every run.',
    formats: ['API', 'SVG'],
    href: '/tools/batch-converter',
    icon: (
      <>
        <path d="M9 7 4.5 12 9 17" {...stroke} />
        <path d="M15 7l4.5 5-4.5 5" {...stroke} />
      </>
    ),
  },
];

function formatTone(format: string): BadgeTone {
  if (format === 'API') return 'accent';
  return 'neutral';
}

export function UseCaseGrid() {
  return (
    <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {useCases.map((useCase) => (
        <li key={useCase.title}>
          <Link
            href={useCase.href}
            className="group flex h-full flex-col rounded-[var(--radius-xl)] bg-white p-7 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_0_0_0.5px_var(--border-strong),0_6px_20px_rgba(0,0,0,0.07)]"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius-md)] bg-accent-wash text-accent"
              >
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]">
                  {useCase.icon}
                </svg>
              </span>
              <h3 className="text-[19px] font-semibold tracking-[-0.02em]">
                {useCase.title}
              </h3>
            </div>

            <p className="mt-4 flex-1 text-[15.5px] leading-relaxed text-text-secondary">
              {useCase.body}
            </p>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
              <div className="flex flex-wrap gap-1.5">
                {useCase.formats.map((format) => (
                  <Badge key={format} tone={formatTone(format)}>
                    {format}
                  </Badge>
                ))}
              </div>
              <span className="shrink-0 font-mono text-[12px] text-accent-ink group-hover:underline group-hover:underline-offset-[3px]">
                Learn more
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}