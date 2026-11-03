'use client';

import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { STYLE_CATEGORIES, STYLE_PRESETS, type StyleCategory } from '@/lib/ai/style-transfer-presets';
import { cn } from '@/lib/ui';

interface StyleTransferEditorProps {
  imageUrl: string;
  onApply?: (presetId: string) => void;
  isLoading?: boolean;
}

export function StyleTransferEditor({
  imageUrl,
  onApply,
  isLoading = false,
}: StyleTransferEditorProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<StyleCategory | 'all'>('all');

  const visiblePresets = useMemo(
    () =>
      activeCategory === 'all'
        ? STYLE_PRESETS
        : STYLE_PRESETS.filter((preset) => preset.category === activeCategory),
    [activeCategory],
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        {/* eslint-disable-next-line @next/next/no-img-element -- remote AI output, not a build-time asset */}
        <img
          src={imageUrl}
          alt="Source image"
          className="mx-auto max-w-md w-full rounded-[var(--radius-lg)]"
        />
      </Card>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter presets by category">
        {(['all', ...STYLE_CATEGORIES] as const).map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={activeCategory === category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              'rounded-[var(--radius-full)] px-3 py-1.5 text-[13.5px] font-medium capitalize transition-colors',
              activeCategory === category
                ? 'bg-accent text-white'
                : 'bg-white text-text-secondary shadow-[inset_0_0_0_1px_var(--border-strong)] hover:bg-bg-secondary',
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {visiblePresets.map((preset) => {
          const selected = selectedPreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setSelectedPreset(preset.id)}
              className={cn(
                'rounded-[var(--radius-lg)] p-4 text-left transition-colors',
                'shadow-[inset_0_0_0_1px_var(--border-strong)]',
                selected
                  ? 'bg-accent-wash shadow-[inset_0_0_0_2px_var(--accent)]'
                  : 'bg-white hover:bg-bg-secondary',
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[14.5px] font-semibold text-text-primary">{preset.name}</p>
                <Badge tone="neutral">{preset.category}</Badge>
              </div>
              <p className="mt-1 text-[13px] text-text-secondary">{preset.description}</p>
            </button>
          );
        })}
      </div>

      <Button
        onClick={() => selectedPreset && onApply?.(selectedPreset)}
        disabled={!selectedPreset || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Applying style…
          </>
        ) : (
          'Apply style transfer'
        )}
      </Button>
    </div>
  );
}