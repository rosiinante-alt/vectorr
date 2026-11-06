'use client';

import { useState } from 'react';
import Link from 'next/link';

const SHAPE_CATEGORIES = [
  { id: 'geometric', label: 'Geometric' },
  { id: 'arrows', label: 'Arrows' },
  { id: 'symbols', label: 'Symbols' },
  { id: 'decorative', label: 'Decorative' },
];

const SHAPES = [
  // Geometric
  { id: 'circle', name: 'Circle', category: 'geometric', path: 'M 50,50 m -40,0 a 40,40 0 1,0 80,0 a 40,40 0 1,0 -80,0' },
  { id: 'square', name: 'Square', category: 'geometric', path: 'M 10,10 L 90,10 L 90,90 L 10,90 Z' },
  { id: 'triangle', name: 'Triangle', category: 'geometric', path: 'M 50,10 L 90,90 L 10,90 Z' },
  { id: 'hexagon', name: 'Hexagon', category: 'geometric', path: 'M 50,10 L 85,30 L 85,70 L 50,90 L 15,70 L 15,30 Z' },
  { id: 'star', name: 'Star', category: 'geometric', path: 'M 50,15 L 58,38 L 82,38 L 63,53 L 71,76 L 50,61 L 29,76 L 37,53 L 18,38 L 42,38 Z' },
  // Arrows
  { id: 'arrow-right', name: 'Arrow Right', category: 'arrows', path: 'M 10,50 L 70,50 L 70,30 L 90,50 L 70,70 L 70,50 Z' },
  { id: 'arrow-up', name: 'Arrow Up', category: 'arrows', path: 'M 50,10 L 70,40 L 55,40 L 55,90 L 45,90 L 45,40 L 30,40 Z' },
  { id: 'arrow-curved', name: 'Curved Arrow', category: 'arrows', path: 'M 20,80 Q 50,20 80,50 L 70,55 L 85,60 L 75,70 Z' },
  // Symbols
  { id: 'heart', name: 'Heart', category: 'symbols', path: 'M 50,85 C 20,60 10,45 10,35 Q 10,15 25,15 Q 35,15 50,30 Q 65,15 75,15 Q 90,15 90,35 C 90,45 80,60 50,85 Z' },
  { id: 'check', name: 'Check Mark', category: 'symbols', path: 'M 20,50 L 40,70 L 80,20' },
  { id: 'x', name: 'X Mark', category: 'symbols', path: 'M 20,20 L 80,80 M 80,20 L 20,80' },
  // Decorative
  { id: 'wave', name: 'Wave', category: 'decorative', path: 'M 0,50 Q 25,20 50,50 T 100,50' },
  { id: 'leaf', name: 'Leaf', category: 'decorative', path: 'M 50,10 Q 80,30 70,70 Q 60,85 50,90 Q 40,85 30,70 Q 20,30 50,10 Z' },
];

export default function ShapeLibraryBrowserPage() {
  const [selectedCategory, setSelectedCategory] = useState('geometric');
  const [selectedShape, setSelectedShape] = useState(SHAPES[0]);

  const filteredShapes = SHAPES.filter((s) => s.category === selectedCategory);

  const downloadShape = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="${selectedShape.path}" fill="currentColor" stroke="none"/>
</svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedShape.id}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <nav aria-label="Breadcrumb" className="border-b border-[#E5E8EB] bg-white">
        <div className="wrap py-3 text-[13.5px] text-[#718096]">
          <Link href="/" className="hover:text-[#1A202C]">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/tools" className="hover:text-[#1A202C]">Tools</Link>
          <span aria-hidden="true"> / </span>
          <span className="text-[#4A5568]">Shape Library Browser</span>
        </div>
      </nav>

      <div className="wrap py-12">
        <header className="mb-8">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold mb-3 tracking-[-0.02em]">
            Shape Library Browser
          </h1>
          <p className="text-[1.0625rem] text-text-secondary max-w-2xl">
            Browse and download pre-made vector shapes, icons, and design elements. Free SVG library with
            geometric shapes, arrows, symbols, and decorative elements.
          </p>
        </header>

        <div className="grid lg:grid-cols-[250px_1fr] gap-6">
          {/* Sidebar */}
          <div className="p-6 rounded-xl bg-white border border-border-subtle h-fit">
            <h2 className="text-[1rem] font-semibold mb-4">Categories</h2>
            <div className="space-y-2">
              {SHAPE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full px-4 py-2 rounded-lg text-left text-[0.9375rem] transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-accent text-white font-medium'
                      : 'hover:bg-bg-secondary'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredShapes.map((shape) => (
                <button
                  key={shape.id}
                  onClick={() => setSelectedShape(shape)}
                  className={`p-6 rounded-xl bg-white border transition-colors ${
                    selectedShape.id === shape.id
                      ? 'border-accent'
                      : 'border-border-subtle hover:border-border-strong'
                  }`}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-auto mb-2">
                    <path d={shape.path} fill="currentColor" stroke="none" />
                  </svg>
                  <p className="text-[0.8125rem] font-medium text-center">{shape.name}</p>
                </button>
              ))}
            </div>

            {/* Preview & Download */}
            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-[1.25rem] font-semibold">{selectedShape.name}</h2>
                  <p className="text-[0.875rem] text-text-tertiary">
                    Category: {SHAPE_CATEGORIES.find((c) => c.id === selectedCategory)?.label}
                  </p>
                </div>
                <button
                  onClick={downloadShape}
                  className="px-6 h-10 rounded-full bg-accent text-white font-semibold hover:bg-accent-hover transition-colors"
                >
                  Download SVG
                </button>
              </div>

              <div className="aspect-square max-w-sm mx-auto bg-bg-secondary rounded-lg flex items-center justify-center p-12">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d={selectedShape.path} fill="currentColor" stroke="none" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
