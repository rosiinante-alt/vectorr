"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeAlt?: string;
  afterAlt?: string;
  initialPosition?: number;
  className?: string;
  width?: string | number;
  height?: string | number;
  // Invert mode: when true, dragging right shows raster (before), left shows vector (after)
  inverted?: boolean;
}

export function ImageComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Raster",
  afterLabel = "Vector",
  beforeAlt = "Original raster image",
  afterAlt = "Vectorized image",
  initialPosition = 50,
  className = "",
  width = "100%",
  height = "auto",
  inverted = true,
}: ImageComparisonSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isFocused, setIsFocused] = useState(false);

  // Use sliderPosition directly as the physical divider position (0-100)
  // At p=0, divider at left edge → all clean (after) visible
  // At p=100, divider at right edge → all raster (before) visible
  const physicalPosition = sliderPosition;

  const getPositionFromX = useCallback(
    (clientX: number): number => {
      if (!containerRef.current) return sliderPosition;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
      return pos;
    },
    [sliderPosition, inverted]
  );

  // Mouse handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      isDraggingRef.current = true;
      setSliderPosition(getPositionFromX(e.clientX));
    },
    [getPositionFromX]
  );

  // Touch handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      isDraggingRef.current = true;
      const touch = e.touches[0];
      if (touch) setSliderPosition(getPositionFromX(touch.clientX));
    },
    [getPositionFromX]
  );

  // Global move/up listeners
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      setSliderPosition(pct);
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      if (!touch) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
      setSliderPosition(pct);
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [inverted]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const step = e.shiftKey ? 10 : 1;
      let next: number | undefined;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowDown":
          next = Math.max(0, sliderPosition - step);
          break;
        case "ArrowRight":
        case "ArrowUp":
          next = Math.min(100, sliderPosition + step);
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = 100;
          break;
        default:
          return;
      }

      e.preventDefault();
      setSliderPosition(next);
    },
    [sliderPosition]
  );

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-col-resize select-none focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${className}`}
      style={{ width, height, touchAction: "none" }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-label="Image comparison slider: drag to reveal raster or vector artwork"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuetext={`${Math.round(sliderPosition)}% — ${beforeLabel} on right, ${afterLabel} on left`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {/* Before image (raster) — full canvas, visible RIGHT of divider */}
      <img
        src={beforeImage}
        alt={beforeAlt}
        className="absolute inset-0 w-full h-full object-contain"
        draggable={false}
      />

      {/* After image (clean) — clipped by the divider position, visible LEFT of divider */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          clipPath: `inset(0 ${100 - physicalPosition}% 0 0)`,
          willChange: "clip-path",
        }}
      >
        <img
          src={afterImage}
          alt={afterAlt}
          className="absolute inset-0 w-full h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white shadow-[0_0_6px_rgba(0,0,0,0.3)]"
        style={{
          left: `${physicalPosition}%`,
          transform: "translateX(-50%)",
        }}
        aria-hidden="true"
      />

      {/* Drag handle */}
      <div
        className="absolute top-1/2 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.2)] border border-border hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-shadow"
        style={{
          left: `${physicalPosition}%`,
          transform: "translate(-50%, -50%)",
          outline: isFocused ? "2px solid var(--accent)" : "none",
          outlineOffset: "2px",
        }}
        aria-hidden="true"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M7 5L3 10L7 15"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-secondary"
          />
          <path
            d="M13 5L17 10L13 15"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-secondary"
          />
        </svg>
      </div>

      {/* Keyboard hint */}
      {isFocused && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1.5 rounded-md text-xs whitespace-nowrap pointer-events-none"
          role="status"
          aria-live="polite"
        >
          ← → to move · Shift for ×10 · Home / End
        </div>
      )}

      {/* Labels */}
      <div
        className="absolute top-3 left-3 px-3 py-2 rounded bg-black/50 text-white text-xs font-medium pointer-events-none tracking-wide flex items-center gap-1"
        aria-hidden="true"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-75">
          <rect width="14" height="14" fill="currentColor" opacity="0.3" />
        </svg>
        {beforeLabel}
      </div>
      <div
        className="absolute top-3 right-3 px-3 py-2 rounded bg-black/50 text-white text-xs font-medium pointer-events-none tracking-wide flex items-center gap-1"
        aria-hidden="true"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-75">
          <circle cx="7" cy="7" r="3" fill="currentColor" opacity="0.5" />
          <path d="M7 1V3M7 11V13M1 7H3M11 7H13" stroke="currentColor" opacity="0.5" strokeWidth="1" />
        </svg>
        {afterLabel}
      </div>
    </div>
  );
}
