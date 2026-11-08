"use client";

import { ButtonLink } from "./ui/button";

interface CaseStudy {
  company: string;
  role: string;
  challenge: string;
  solution: string;
  result: string;
  metric: string;
}

const caseStudies: CaseStudy[] = [
  {
    company: "Precision Laser Works",
    role: "Production Facility",
    challenge: "Manual tracing of customer logos took 2-3 hours per design",
    solution: "Batch vectorization with Vectorr + direct DXF export to CNC",
    result: "Reduced turnaround from days to hours",
    metric: "80% faster production",
  },
  {
    company: "Creative Embroidery Co",
    role: "Embroidery Shop",
    challenge: "Converting raster artwork to embroidery stitch files was error-prone",
    solution: "Clean SVG output fed directly into digitizing software",
    result: "Zero stitch failures, predictable file quality",
    metric: "100% first-pass success",
  },
  {
    company: "Design Studio XYZ",
    role: "Design Agency",
    challenge: "Clients wanted editable vectors from their existing raster logos",
    solution: "Vectorr's editable paths replaced expensive manual tracing",
    result: "Added vectorization service to product line",
    metric: "New $5K/month revenue stream",
  },
];

export function CaseStudies() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="case-studies-heading">
      <div className="wrap">
        <div className="max-w-[760px] mb-16">
          <h2 id="case-studies-heading" className="display text-[clamp(30px,4.4vw,50px)]">
            How teams use Vectorr.
          </h2>
          <p className="mt-5 text-[clamp(17px,1.7vw,20px)] leading-relaxed text-text-secondary">
            From one-person shops to production facilities, here's how Vectorr fits into real workflows.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {caseStudies.map((study, idx) => (
            <div
              key={idx}
              className="rounded-[var(--radius-xl)] bg-white border border-border p-8 hover:shadow-[0_0_0_0.5px_var(--border-strong),0_12px_32px_rgba(0,0,0,0.08)] transition-shadow"
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-text-primary">{study.company}</h3>
                <p className="text-sm text-text-tertiary mt-1">{study.role}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Challenge</p>
                  <p className="text-sm text-text-primary mt-2">{study.challenge}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Solution</p>
                  <p className="text-sm text-text-primary mt-2">{study.solution}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs font-semibold text-success uppercase tracking-wide">Result</p>
                <p className="text-lg font-semibold text-text-primary mt-2">{study.metric}</p>
                <p className="text-sm text-text-secondary mt-1">{study.result}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
