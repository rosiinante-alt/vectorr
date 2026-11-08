"use client";

import { useState, useCallback } from "react";
import { ImageComparisonSlider } from "./image-comparison-slider";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TransformationExample {
  id: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
}

const examples: TransformationExample[] = [
  {
    id: "pixel-heart",
    title: "Pixel Heart",
    description: "Pixel-grid artwork with preserved background grid and control points",
    beforeImage: "/demo/examples/image-01-before.png",
    afterImage: "/demo/examples/image-01-after.png",
    beforeLabel: "Raster",
    afterLabel: "Vector",
  },
  {
    id: "apple",
    title: "Apple",
    description: "Blurred bitmap to clean vector with visible anchor markers",
    beforeImage: "/demo/examples/image-02-before.png",
    afterImage: "/demo/examples/image-02-after.png",
    beforeLabel: "Raster",
    afterLabel: "Vector",
  },
  {
    id: "cityscape",
    title: "City Skyline",
    description: "Noisy gradient-filled illustration to clean architecture",
    beforeImage: "/demo/examples/image-03-before.png",
    afterImage: "/demo/examples/image-03-after.png",
    beforeLabel: "Raster",
    afterLabel: "Vector",
  },
  {
    id: "bird",
    title: "Bird Illustration",
    description: "Pixelated multicolor artwork to smooth vector forms",
    beforeImage: "/demo/examples/image-04-before.png",
    afterImage: "/demo/examples/image-04-after.png",
    beforeLabel: "Raster",
    afterLabel: "Vector",
  },
  {
    id: "apple-illustrator",
    title: "Apple — vector editor",
    description: "Pixelated render to production-ready vector with preserved editor artifacts",
    beforeImage: "/demo/examples/image-05-before.png",
    afterImage: "/demo/examples/image-05-after.png",
    beforeLabel: "Raster",
    afterLabel: "Vector",
  },
  {
    id: "deer-full",
    title: "Red Deer — full",
    description: "Low-resolution render to clean vector with baked cut-layer outline",
    beforeImage: "/demo/examples/image-06-before.png",
    afterImage: "/demo/examples/image-06-after.png",
    beforeLabel: "Raster",
    afterLabel: "Vector",
  },
  {
    id: "deer-detail",
    title: "Red Deer — antler detail",
    description: "Detail crop showing landmark-aligned antler registration",
    beforeImage: "/demo/examples/image-07-before.png",
    afterImage: "/demo/examples/image-07-after.png",
    beforeLabel: "Raster",
    afterLabel: "Vector",
  },
  {
    id: "cursor-full",
    title: "Cursor — full shape",
    description: "Full cursor with preserved magnification box overlay on raster half",
    beforeImage: "/demo/examples/image-08-before.png",
    afterImage: "/demo/examples/image-08-after.png",
    beforeLabel: "Raster",
    afterLabel: "Vector",
  },
  {
    id: "cursor-zoom",
    title: "Cursor — magnified detail",
    description: "8× detail crop showing pixel boundaries versus smooth curves",
    beforeImage: "/demo/examples/image-09-before.png",
    afterImage: "/demo/examples/image-09-after.png",
    beforeLabel: "Raster",
    afterLabel: "Vector",
  },
  {
    id: "eagle",
    title: "Eagle Logo",
    description: "Blurred bitmap logo to crisp vector with preserved control points",
    beforeImage: "/demo/examples/image-10-before.png",
    afterImage: "/demo/examples/image-10-after.png",
    beforeLabel: "Raster",
    afterLabel: "Vector",
  },
  {
    id: "s-letter",
    title: "Letter S",
    description: "Pixelated gradient illustration to smooth vector with preserved purple taper",
    beforeImage: "/demo/examples/image-11-before.png",
    afterImage: "/demo/examples/image-11-after.png",
    beforeLabel: "Raster",
    afterLabel: "Vector",
  },
];

export function HeroTransformationSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const current = examples[currentIndex];
  const hasMultiple = examples.length > 1;

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? examples.length - 1 : prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === examples.length - 1 ? 0 : prev + 1));
  }, []);

  const goToExample = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <div className="w-full space-y-8">
      {/* Main slider */}
      <div className="relative w-full rounded-lg overflow-hidden bg-surface-secondary">
        <div className="w-full bg-white" style={{ aspectRatio: "3 / 2" }}>
          <ImageComparisonSlider
            beforeImage={current.beforeImage}
            afterImage={current.afterImage}
            beforeLabel={current.beforeLabel}
            afterLabel={current.afterLabel}
            beforeAlt={`${current.title} - raster version`}
            afterAlt={`${current.title} - vector version`}
            initialPosition={50}
            width="100%"
            height="100%"
            className="h-full"
          />
        </div>
      </div>

      {/* Title and description */}
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl font-semibold text-text-primary">
          {current.title}
        </h3>
        <p className="mt-2 text-sm sm:text-base text-text-secondary">
          {current.description}
        </p>
      </div>

      {/* Navigation */}
      {hasMultiple && (
        <div className="flex flex-col items-center gap-6">
          {/* Previous/Next buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={goToPrevious}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border hover:bg-surface-secondary hover:border-border-strong transition-colors"
              aria-label="Previous example"
            >
              <ChevronLeft className="w-5 h-5 text-text-primary" />
            </button>
            <span className="text-sm text-text-tertiary font-medium min-w-[60px] text-center">
              {currentIndex + 1} / {examples.length}
            </span>
            <button
              onClick={goToNext}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-border hover:bg-surface-secondary hover:border-border-strong transition-colors"
              aria-label="Next example"
            >
              <ChevronRight className="w-5 h-5 text-text-primary" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {examples.map((_, index) => (
              <button
                key={index}
                onClick={() => goToExample(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-accent w-8"
                    : "bg-border hover:bg-border-strong"
                }`}
                aria-label={`Go to example ${index + 1}`}
                aria-current={index === currentIndex ? "true" : "false"}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
