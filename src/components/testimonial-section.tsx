"use client";

import { Badge } from "./ui/badge";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Vectroy cuts our production time in half. Crisp vectors every time, ready for the laser cutter immediately.",
    author: "Sarah Chen",
    role: "Production Manager",
    company: "LaserCraft Studio",
  },
  {
    quote: "The batch conversion saved us hours on logo work. We went from manually tracing to automated quality vectors.",
    author: "Marcus Rodriguez",
    role: "Design Lead",
    company: "Embark Design Co",
  },
  {
    quote: "Clean paths, predictable stitch counts. Our digitizing software works perfectly with Vectroy output.",
    author: "Jamie Palmer",
    role: "Embroidery Technician",
    company: "Thread & Needle",
  },
  {
    quote: "Finally, a vectorizer that understands DXF requirements for CNC routing. No more file cleanup.",
    author: "David Kim",
    role: "Shop Owner",
    company: "Precision CNC Works",
  },
];

export function TestimonialSection() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="testimonials-heading">
      <div className="wrap">
        <div className="max-w-[760px] mb-16">
          <h2 id="testimonials-heading" className="display text-[clamp(30px,4.4vw,50px)]">
            Used by makers, shops, and studios.
          </h2>
          <p className="mt-5 text-[clamp(17px,1.7vw,20px)] leading-relaxed text-text-secondary">
            From one-person design shops to production facilities, Vectroy handles every format and workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="rounded-[var(--radius-xl)] bg-bg-secondary p-8 border border-border"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-accent"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>

              <blockquote className="mb-6 text-[15.5px] leading-relaxed text-text-primary">
                "{testimonial.quote}"
              </blockquote>

              <div>
                <p className="font-semibold text-text-primary">{testimonial.author}</p>
                <p className="text-[13.5px] text-text-tertiary">
                  {testimonial.role} at {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
