'use client';

import { useState } from 'react';

interface AnnualToggleProps {
  value: boolean;
  onChange: (isAnnual: boolean) => void;
}

export function AnnualToggle({ value, onChange }: AnnualToggleProps) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full bg-bg-secondary p-1.5 shadow-sm">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`
          rounded-full px-6 py-2 text-[15px] font-medium transition-all
          ${!value 
            ? 'bg-white text-text-primary shadow-sm' 
            : 'text-text-secondary hover:text-text-primary'
          }
        `}
        aria-pressed={!value}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`
          rounded-full px-6 py-2 text-[15px] font-medium transition-all
          ${value 
            ? 'bg-white text-text-primary shadow-sm' 
            : 'text-text-secondary hover:text-text-primary'
          }
        `}
        aria-pressed={value}
      >
        Annual
        <span className="ml-2 text-[13px] text-success-text font-semibold">
          Save 25%
        </span>
      </button>
    </div>
  );
}
