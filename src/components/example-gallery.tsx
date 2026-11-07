'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface ExampleItem {
  id: string;
  filename: string;
  category: string;
  label: string;
  description: string;
}

interface ManifestData {
  examples: ExampleItem[];
  categories: Array<{
    id: string;
    label: string;
    description: string;
  }>;
}

interface ExampleGalleryProps {
  className?: string;
}

export function ExampleGallery({ className = '' }: ExampleGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('logo');
  const [manifest, setManifest] = useState<ManifestData | null>(null);
  const [filteredExamples, setFilteredExamples] = useState<ExampleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadManifest = async () => {
      try {
        const response = await fetch('/demo/examples/manifest.json');
        const data: ManifestData = await response.json();
        setManifest(data);
        filterExamples(data, 'logo');
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load manifest:', error);
        setIsLoading(false);
      }
    };

    loadManifest();
  }, []);

  const filterExamples = (data: ManifestData, category: string) => {
    const filtered = data.examples.filter((ex) => ex.category === category);
    setFilteredExamples(filtered);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (manifest) {
      filterExamples(manifest, category);
    }
  };

  if (isLoading || !manifest) {
    return (
      <div className={`${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Category Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {manifest.categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-text-secondary hover:bg-muted/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Examples Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredExamples.map((example) => (
          <div
            key={example.id}
            className="group relative aspect-square bg-muted rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Image
              src={`/demo/examples/${example.filename}`}
              alt={example.label}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />

            {/* Overlay with description */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <h4 className="text-white font-semibold text-sm">{example.label}</h4>
              <p className="text-white/80 text-xs mt-1 line-clamp-2">
                {example.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Category info */}
      <div className="mt-6 text-center text-text-tertiary text-sm">
        {manifest.categories.find((c) => c.id === activeCategory)?.description}
      </div>
    </div>
  );
}
