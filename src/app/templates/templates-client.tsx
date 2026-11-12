'use client';

import { useState, useMemo } from 'react';
import { Button, ButtonLink } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'cricut' | 'laser' | 'embroidery' | 'pod';
  tags: string[];
  complexity: 'beginner' | 'intermediate' | 'advanced';
  preview: string; // data URI or path
}

const TEMPLATES: Template[] = [
  {
    id: 'cricut-card-1',
    name: 'Birthday Card Template',
    description: 'Pop-up birthday card with customizable text and shapes',
    category: 'cricut',
    tags: ['card', 'birthday', 'popup'],
    complexity: 'beginner',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f0f0f0"/%3E%3Ctext x="100" y="100" text-anchor="middle" font-size="16" fill="%236366f1"%3ECard%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'cricut-sticker-1',
    name: 'Vinyl Sticker Pack',
    description: '10 kiss-cut sticker designs ready for Cricut',
    category: 'cricut',
    tags: ['sticker', 'vinyl', 'kiss-cut'],
    complexity: 'beginner',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Ccircle cx="100" cy="100" r="80" fill="%23fbbf24"/%3E%3Ctext x="100" y="110" text-anchor="middle" font-size="16" fill="white"%3ESticker%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'laser-box-1',
    name: 'Snap-Fit Box',
    description: 'Parametric box with snap-fit joints, laser-ready',
    category: 'laser',
    tags: ['box', 'storage', 'joinery'],
    complexity: 'intermediate',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect x="50" y="50" width="100" height="100" fill="none" stroke="%236366f1" stroke-width="2"/%3E%3Ctext x="100" y="110" text-anchor="middle" font-size="16" fill="%236366f1"%3EBox%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'laser-sign-1',
    name: 'Welcome Sign',
    description: 'Decorative welcome sign with multiple layers',
    category: 'laser',
    tags: ['sign', 'decor', 'layered'],
    complexity: 'beginner',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23fef3c7"/%3E%3Ctext x="100" y="100" text-anchor="middle" font-size="18" fill="%23854d0e" font-weight="bold"%3EWelcome%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'embroidery-monogram-1',
    name: 'Classic Monogram',
    description: 'Circle monogram with floral border, DST/PES ready',
    category: 'embroidery',
    tags: ['monogram', 'floral', 'circle'],
    complexity: 'intermediate',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Ccircle cx="100" cy="100" r="70" fill="none" stroke="%23dc2626" stroke-width="3"/%3E%3Ctext x="100" y="115" text-anchor="middle" font-size="48" fill="%23dc2626" font-family="serif"%3EM%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'embroidery-badge-1',
    name: 'Patch Badge Template',
    description: 'Iron-on badge with customizable text and icon',
    category: 'embroidery',
    tags: ['badge', 'patch', 'icon'],
    complexity: 'beginner',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect x="40" y="70" width="120" height="60" rx="10" fill="%2316a34a"/%3E%3Ctext x="100" y="110" text-anchor="middle" font-size="16" fill="white" font-weight="bold"%3EBADGE%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'pod-tshirt-1',
    name: 'Minimalist T-Shirt Design',
    description: 'Print-ready graphic for t-shirts and hoodies',
    category: 'pod',
    tags: ['tshirt', 'minimalist', 'print'],
    complexity: 'beginner',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f3f4f6"/%3E%3Ccircle cx="100" cy="100" r="50" fill="%23374151"/%3E%3C/svg%3E',
  },
  {
    id: 'pod-mug-1',
    name: 'Coffee Mug Wrap',
    description: '360° mug wrap design with bleed marks',
    category: 'pod',
    tags: ['mug', 'wrap', 'coffee'],
    complexity: 'intermediate',
    preview: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23fef3c7"/%3E%3Ctext x="100" y="100" text-anchor="middle" font-size="20" fill="%2392400e"%3E☕%3C/text%3E%3C/svg%3E',
  },
];

const CATEGORIES = [
  { value: 'all', label: 'All Templates' },
  { value: 'cricut', label: 'Cricut' },
  { value: 'laser', label: 'Laser Cutting' },
  { value: 'embroidery', label: 'Embroidery' },
  { value: 'pod', label: 'Print-on-Demand' },
] as const;

export function TemplatesClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((template) => {
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesSearch = searchQuery === '' ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section className="pb-20" aria-labelledby="templates-heading">
      <div className="wrap">
        <h2 id="templates-heading" className="visually-hidden">
          Template Library
        </h2>

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`
                  rounded-full px-4 py-2 text-[14px] font-medium transition-all
                  ${selectedCategory === cat.value
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <input
            type="search"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              rounded-[var(--radius-lg)] bg-white px-4 py-2 text-[15px]
              border border-[var(--border)] shadow-sm
              focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
              w-full sm:w-64
            "
          />
        </div>

        {/* Results count */}
        <p className="mb-6 text-[14px] text-text-tertiary">
          Showing {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'}
        </p>

        {/* Templates grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTemplates.map((template) => (
            <article
              key={template.id}
              className="group flex flex-col rounded-[var(--radius-xl)] bg-white shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_0_0_1px_var(--border),0_4px_12px_rgba(0,0,0,0.08)] transition-shadow"
            >
              {/* Preview */}
              <div className="aspect-square bg-bg-secondary flex items-center justify-center p-8">
                <img
                  src={template.preview}
                  alt={template.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-[16px] font-semibold leading-snug tracking-[-0.01em]">
                    {template.name}
                  </h3>
                  <Badge
                    tone={
                      template.complexity === 'beginner' ? 'success' :
                      template.complexity === 'intermediate' ? 'info' :
                      'accent'
                    }
                    className="flex-none text-[11px]"
                  >
                    {template.complexity}
                  </Badge>
                </div>

                <p className="text-[14px] text-text-secondary leading-relaxed mb-4">
                  {template.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {template.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-bg-secondary px-2 py-1 text-[12px] text-text-tertiary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-auto">
                  <ButtonLink
                    href="/convert"
                    size="sm"
                    variant="secondary"
                    className="w-full"
                  >
                    Download SVG
                  </ButtonLink>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-[16px] text-text-secondary">
              No templates found matching your search.
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              variant="secondary"
              size="md"
              className="mt-4"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
