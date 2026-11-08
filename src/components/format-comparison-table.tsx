"use client";

import { Badge } from "./ui/badge";

interface FormatFeature {
  feature: string;
  svg: boolean | string;
  pdf: boolean | string;
  dxf: boolean | string;
  eps: boolean | string;
}

const features: FormatFeature[] = [
  { feature: "Web use", svg: true, pdf: false, dxf: false, eps: false },
  { feature: "Print ready", svg: true, pdf: true, dxf: false, eps: true },
  { feature: "CAD/CNC", svg: false, pdf: false, dxf: true, eps: false },
  { feature: "Laser cutting", svg: true, pdf: true, dxf: true, eps: true },
  { feature: "Scalable", svg: true, pdf: true, dxf: true, eps: true },
  { feature: "Editable paths", svg: true, pdf: "Limited", dxf: true, eps: true },
  { feature: "Color layers", svg: true, pdf: true, dxf: true, eps: true },
  { feature: "File size", svg: "Small", pdf: "Medium", dxf: "Small", eps: "Large" },
];

export function FormatComparisonTable() {
  return (
    <section className="py-20 sm:py-28 bg-bg-secondary" aria-labelledby="formats-heading">
      <div className="wrap">
        <div className="max-w-[760px] mb-12">
          <h2 id="formats-heading" className="display text-[clamp(30px,4.4vw,50px)]">
            Pick the right format for your machine.
          </h2>
          <p className="mt-5 text-[clamp(17px,1.7vw,20px)] leading-relaxed text-text-secondary">
            All formats included with every conversion. Choose based on your workflow.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left py-4 px-4 font-semibold text-text-primary">Feature</th>
                <th className="text-center py-4 px-4 font-semibold text-text-primary">
                  <Badge tone="accent" className="inline-block">SVG</Badge>
                </th>
                <th className="text-center py-4 px-4 font-semibold text-text-primary">
                  <Badge tone="success" className="inline-block">PDF</Badge>
                </th>
                <th className="text-center py-4 px-4 font-semibold text-text-primary">
                  <Badge tone="warning" className="inline-block">DXF</Badge>
                </th>
                <th className="text-center py-4 px-4 font-semibold text-text-primary">
                  <Badge tone="neutral" className="inline-block">EPS</Badge>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((row, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-bg-tertiary transition-colors">
                  <td className="py-4 px-4 text-text-primary font-medium">{row.feature}</td>
                  <td className="text-center py-4 px-4">
                    {row.svg === true ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto text-success">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : typeof row.svg === "string" ? (
                      <span className="text-sm text-text-secondary">{row.svg}</span>
                    ) : (
                      <span className="text-text-tertiary">—</span>
                    )}
                  </td>
                  <td className="text-center py-4 px-4">
                    {row.pdf === true ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto text-success">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : typeof row.pdf === "string" ? (
                      <span className="text-sm text-text-secondary">{row.pdf}</span>
                    ) : (
                      <span className="text-text-tertiary">—</span>
                    )}
                  </td>
                  <td className="text-center py-4 px-4">
                    {row.dxf === true ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto text-success">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : typeof row.dxf === "string" ? (
                      <span className="text-sm text-text-secondary">{row.dxf}</span>
                    ) : (
                      <span className="text-text-tertiary">—</span>
                    )}
                  </td>
                  <td className="text-center py-4 px-4">
                    {row.eps === true ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto text-success">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : typeof row.eps === "string" ? (
                      <span className="text-sm text-text-secondary">{row.eps}</span>
                    ) : (
                      <span className="text-text-tertiary">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
