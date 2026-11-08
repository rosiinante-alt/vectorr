"use client";

import { useState } from "react";
import { ImageComparisonSlider } from "./image-comparison-slider";
import { Badge } from "./ui/badge";

interface SliderStyle {
  id: string;
  label: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  category: "retro" | "realistic" | "lineart" | "photo" | "crafts" | "print" | "design";
  useCase?: string;
}

const sliderExamples: SliderStyle[] = [
  // Core examples
  {
    id: "retro-poster",
    label: "Retro Poster",
    description: "Bold, colorful retro design with limited palette",
    beforeImage: "/demo/retro-poster-raster.svg",
    afterImage: "/demo/retro-poster-vector.svg",
    category: "retro",
  },
  {
    id: "realistic-product",
    label: "Product Photography",
    description: "Detailed photo to clean line traced vector",
    beforeImage: "/demo/product-photo-raster.svg",
    afterImage: "/demo/product-photo-vector.svg",
    category: "realistic",
  },
  {
    id: "lineart-icon",
    label: "Line Art",
    description: "Minimalist single-line style design",
    beforeImage: "/demo/lineart-raster.svg",
    afterImage: "/demo/lineart-vector.svg",
    category: "lineart",
  },
  {
    id: "photo-landscape",
    label: "Landscape Photo",
    description: "Scenic photo converted to detailed vector illustration",
    beforeImage: "/demo/landscape-raster.svg",
    afterImage: "/demo/landscape-vector.svg",
    category: "photo",
  },

  // Specialized use cases - Crafts
  {
    id: "embroidery-pattern",
    label: "Embroidery Pattern",
    description: "Ready for embroidery machine conversion with DST/PES formats",
    beforeImage: "/demo/examples/embroidery-pattern-raster.svg",
    afterImage: "/demo/examples/embroidery-pattern-vector.svg",
    category: "crafts",
    useCase: "Embroidery",
  },
  {
    id: "tshirt-print",
    label: "T-Shirt Print Design",
    description: "Print-ready design optimized for screen printing and DTG",
    beforeImage: "/demo/examples/tshirt-print-raster.svg",
    afterImage: "/demo/examples/tshirt-print-vector.svg",
    category: "print",
    useCase: "Custom Apparel",
  },
  {
    id: "mug-design",
    label: "Mug/Drinkware Design",
    description: "Detailed design perfect for mug wraps and ceramic transfers",
    beforeImage: "/demo/examples/mug-design-raster.svg",
    afterImage: "/demo/examples/mug-design-vector.svg",
    category: "print",
    useCase: "Drinkware",
  },
  {
    id: "laser-cutting",
    label: "Laser Cutting Pattern",
    description: "Clean lines perfect for laser cutting wood, acrylic, leather",
    beforeImage: "/demo/examples/laser-cutting-raster.svg",
    afterImage: "/demo/examples/laser-cutting-vector.svg",
    category: "crafts",
    useCase: "Laser Cutting",
  },
  {
    id: "vinyl-sticker",
    label: "Vinyl Sticker Design",
    description: "Optimized for cutting and application on any surface",
    beforeImage: "/demo/examples/vinyl-sticker-raster.svg",
    afterImage: "/demo/examples/vinyl-sticker-vector.svg",
    category: "crafts",
    useCase: "Vinyl Cutting",
  },

  // Art & Design
  {
    id: "portrait-illustration",
    label: "Portrait Illustration",
    description: "Hand-drawn portrait converted to clean vector art",
    beforeImage: "/demo/examples/portrait-illustration-raster.svg",
    afterImage: "/demo/examples/portrait-illustration-vector.svg",
    category: "design",
  },
  {
    id: "geometric-abstract",
    label: "Geometric Abstract",
    description: "Modern geometric design with perfect clean shapes",
    beforeImage: "/demo/examples/geometric-abstract-raster.svg",
    afterImage: "/demo/examples/geometric-abstract-vector.svg",
    category: "design",
  },
  {
    id: "floral-ornament",
    label: "Floral Ornament",
    description: "Decorative floral design cleaned up for production",
    beforeImage: "/demo/examples/floral-ornament-raster.svg",
    afterImage: "/demo/examples/floral-ornament-vector.svg",
    category: "design",
  },
  {
    id: "brush-stroke",
    label: "Brush Stroke Art",
    description: "Artistic brush strokes simplified to vector lines",
    beforeImage: "/demo/examples/brush-stroke-raster.svg",
    afterImage: "/demo/examples/brush-stroke-vector.svg",
    category: "design",
  },
  {
    id: "calligraphy-text",
    label: "Calligraphy",
    description: "Elegant calligraphy text vectorized for any use",
    beforeImage: "/demo/examples/calligraphy-text-raster.svg",
    afterImage: "/demo/examples/calligraphy-text-vector.svg",
    category: "lineart",
  },
  {
    id: "icon-set",
    label: "Icon Set",
    description: "Collection of icons unified and perfectly traced",
    beforeImage: "/demo/examples/icon-set-raster.svg",
    afterImage: "/demo/examples/icon-set-vector.svg",
    category: "lineart",
  },
];

export function InteractiveSliderShowcase() {
  const [selectedStyle, setSelectedStyle] = useState<string>("retro-poster");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const currentExample = sliderExamples.find((ex) => ex.id === selectedStyle);
  const categories = ["all", ...Array.from(new Set(sliderExamples.map((ex) => ex.category)))];
  const filteredExamples =
    selectedCategory === "all"
      ? sliderExamples
      : sliderExamples.filter((ex) => ex.category === selectedCategory);

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      all: "All Examples",
      retro: "Retro Style",
      realistic: "Photography",
      lineart: "Line Art",
      photo: "Landscape",
      crafts: "Crafts & Making",
      print: "Print Design",
      design: "Digital Art",
    };
    return labels[cat] || cat;
  };

  return (
    <div className="w-full space-y-8">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat
                ? "bg-accent text-white"
                : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
            }`}
            aria-pressed={selectedCategory === cat}
          >
            {cat === "all"
              ? "All Styles"
              : cat === "retro"
                ? "Retro"
                : cat === "realistic"
                  ? "Realistic"
                  : cat === "lineart"
                    ? "Line Art"
                    : "Photo"}
          </button>
        ))}
      </div>

      {/* Main slider */}
      {currentExample && (
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-text-primary">{currentExample.label}</h3>
            <p className="mt-1 text-text-secondary">{currentExample.description}</p>
          </div>

          <div className="rounded-[var(--radius-xl)] shadow-[0_0_0_0.5px_var(--border),0_8px_24px_rgba(0,0,0,0.08)] overflow-hidden">
            <ImageComparisonSlider
              beforeImage={currentExample.beforeImage}
              afterImage={currentExample.afterImage}
              beforeLabel="Raster"
              afterLabel="Vector"
              beforeAlt={`Raster version of ${currentExample.label}`}
              afterAlt={`Vector version of ${currentExample.label}`}
              initialPosition={50}
              inverted={true}
              height={500}
            />
          </div>
          <p className="text-center text-sm text-text-tertiary">
            Drag left for vector, right for raster
          </p>
        </div>
      )}

      {/* Style selector grid */}
      <div>
        <p className="mb-4 text-sm font-medium text-text-secondary">Try other styles:</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {filteredExamples.map((example) => (
            <button
              key={example.id}
              onClick={() => setSelectedStyle(example.id)}
              className={`relative group overflow-hidden rounded-lg transition-all ${
                selectedStyle === example.id
                  ? "ring-2 ring-accent ring-offset-2 scale-95"
                  : "hover:shadow-md"
              }`}
            >
              {/* Thumbnail */}
              <div className="aspect-square bg-bg-secondary overflow-hidden">
                <img
                  src={example.afterImage}
                  alt={example.label}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Label overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-2">
                <div className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {example.label}
                </div>
              </div>

              {/* Category badge */}
              <div className="absolute top-2 right-2">
                <Badge
                  tone={
                    example.category === "retro"
                      ? "warning"
                      : example.category === "realistic"
                        ? "accent"
                        : example.category === "lineart"
                          ? "success"
                          : "neutral"
                  }
                  className="text-[10px] px-2 py-1"
                >
                  {example.category === "retro"
                    ? "Retro"
                    : example.category === "realistic"
                      ? "Realistic"
                      : example.category === "lineart"
                        ? "Line Art"
                        : "Photo"}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
