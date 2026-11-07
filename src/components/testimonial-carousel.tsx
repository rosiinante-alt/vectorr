'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  initials: string;
  bg: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Vectroy has been a game-changer for our print shop. Clean paths mean fewer failed cuts and faster production. We've cut our scrap rate by a third.",
    author: 'Sarah Martinez',
    role: 'Production Manager',
    company: 'SignCraft Studios',
    initials: 'SM',
    bg: 'bg-blue-100',
  },
  {
    quote:
      "The API integration took 20 minutes. Now every logo export gets vectorized automatically as part of our asset pipeline. Saves us hours every week.",
    author: 'James Chen',
    role: 'CTO',
    company: 'Brandwave',
    initials: 'JC',
    bg: 'bg-purple-100',
  },
  {
    quote:
      "I was skeptical about tracing logos by algorithm, but Vectroy gets details right. The output is genuinely ready to use — no manual cleanup needed.",
    author: 'Elena Rossi',
    role: 'Creative Director',
    company: 'Momentum Design',
    initials: 'ER',
    bg: 'bg-green-100',
  },
  {
    quote:
      "Embroidery digitizing usually means starting from scratch on every design. With Vectroy, I can feed sketches straight into our software and ship patterns in minutes.",
    author: 'Marcus Thompson',
    role: 'Embroidery Specialist',
    company: 'Thread & Needle Co.',
    initials: 'MT',
    bg: 'bg-rose-100',
  },
  {
    quote:
      "For product photos that need to become stickers or decals, Vectroy is unbeatable. Fast, automatic, and the quality consistently impresses our customers.",
    author: 'Priya Patel',
    role: 'Product Manager',
    company: 'Creative Commerce',
    initials: 'PP',
    bg: 'bg-amber-100',
  },
];

export function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonial = testimonials[activeIndex];

  const handlePrev = () => {
    setActiveIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setActiveIndex((i) => (i + 1) % testimonials.length);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,420px)] lg:items-center lg:gap-12">
      {/* Quote */}
      <div className="order-2 lg:order-1">
        <blockquote className="text-[clamp(20px,2.4vw,28px)] font-semibold leading-relaxed tracking-[-0.02em] text-text-primary">
          "{testimonial.quote}"
        </blockquote>

        <div className="mt-8 flex items-center gap-4">
          <div
            className={`grid h-14 w-14 place-items-center rounded-full font-semibold text-white ${testimonial.bg}`}
            aria-hidden="true"
          >
            {testimonial.initials}
          </div>
          <div>
            <p className="font-semibold text-text-primary">{testimonial.author}</p>
            <p className="text-[14.5px] text-text-secondary">
              {testimonial.role} · {testimonial.company}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="inline-flex items-center justify-center rounded-full border border-[var(--border)] h-10 w-10 hover:bg-white transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-text-secondary" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next testimonial"
            className="inline-flex items-center justify-center rounded-full border border-[var(--border)] h-10 w-10 hover:bg-white transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-text-secondary" />
          </button>

          <div className="ml-auto font-mono text-[12px] text-text-tertiary">
            {String(activeIndex + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Dots (visual indicator) */}
      <div className="order-1 flex flex-col gap-3 lg:order-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-pressed={i === activeIndex}
            aria-label={`Show testimonial ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === activeIndex
                ? 'w-12 bg-accent'
                : 'w-6 bg-[var(--border-strong)] hover:bg-[var(--border)]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}