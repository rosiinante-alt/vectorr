"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/gallery-configs";

interface CategoryOption {
  id: string;
  label: string;
}

interface GalleryGridProps {
  items: GalleryItem[];
  categories: CategoryOption[];
}

export function GalleryGrid({ items, categories }: GalleryGridProps) {
  const [active, setActive] = useState("all");
  const [hovered, setHovered] = useState<string | null>(null);

  const filtered =
    active === "all" ? items : items.filter((i) => i.category === active);

  return (
    <div>
      {/* Filter tabs */}
      <div
        role="tablist"
        aria-label="Filter by category"
        className="flex flex-wrap gap-2 justify-center mb-10"
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={active === cat.id}
            onClick={() => setActive(cat.id)}
            className={[
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
              active === cat.id
                ? "bg-accent text-bg-primary border-accent"
                : "border-border text-text-secondary hover:border-accent hover:text-text-primary",
            ].join(" ")}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <ul
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        aria-live="polite"
        aria-label="Gallery items"
      >
        {filtered.map((item) => (
          <li key={item.id} className="list-none">
            <article
              className="rounded-[var(--radius-xl)] overflow-hidden bg-bg-secondary shadow-[var(--shadow-1)] hover:shadow-[var(--shadow-2)] transition-shadow"
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(item.id)}
              onBlur={() => setHovered(null)}
            >
              {/* Image pair */}
              <div
                className="relative aspect-[4/3] overflow-hidden bg-bg-tertiary"
                aria-label={`Before and after: ${item.title}`}
              >
                {/* Before */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{ opacity: hovered === item.id ? 0 : 1 }}
                >
                  <Image
                    src={item.beforeImage}
                    alt={`Before: ${item.title}`}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized={item.beforeImage.endsWith(".svg")}
                  />
                  <span className="absolute top-2 left-2 bg-bg-primary/80 text-text-secondary text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                    Before
                  </span>
                </div>

                {/* After */}
                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{ opacity: hovered === item.id ? 1 : 0 }}
                >
                  <Image
                    src={item.afterImage}
                    alt={`After: ${item.title}`}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized={item.afterImage.endsWith(".svg")}
                  />
                  <span className="absolute top-2 left-2 bg-accent/90 text-bg-primary text-xs px-2 py-0.5 rounded-full">
                    After
                  </span>
                </div>

                {/* Hover hint on mobile */}
                <span className="sr-only">Hover or focus to see the after result</span>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-text-primary mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-xs text-text-tertiary">
                  <span>{item.useCase}</span>
                  <span className="bg-bg-primary rounded px-1.5 py-0.5 font-mono">
                    {item.format}
                  </span>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="text-center text-text-secondary py-16">
          No examples in this category yet.
        </p>
      )}
    </div>
  );
}
