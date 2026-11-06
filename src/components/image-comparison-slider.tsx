"use client";

import { useRef, useState, useCallback, useEffect } from "react";

interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  initialPosition?: number;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function ImageComparisonSlider({
  beforeImage,
  afterImage,
  beforeAlt = "Original image",
  afterAlt = "Vectorized image",
  initialPosition = 50,
  className = "",
  width = "100%",
  height = "auto",
}: ImageComparisonSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isFocused, setIsFocused] = useState(false);

  const getPositionFromX = useCallback((clientX: number): number => {
    if (!containerRef.current) return sliderPosition;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    return Math.max(0, Math.min(100, (x / rect.width) * 100));
  }, [sliderPosition]);

  // Mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDraggingRef.current = true;
    setSliderPosition(getPositionFromX(e.clientX));
  }, [getPositionFromX]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    const touch = e.touches[0];
    if (touch) setSliderPosition(getPositionFromX(touch.clientX));
  }, [getPositionFromX]);

  // Global move/up listeners — use refs so closures stay fresh
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
      // Prevent page scroll while dragging the slider
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
    // passive:false allows e.preventDefault() to suppress scroll
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, []); // mount-only: ref-based state means no deps needed

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
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
  }, [sliderPosition]);

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
      aria-label="Image comparison slider — use arrow keys to move"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuetext={`${Math.round(sliderPosition)}% — showing ${Math.round(sliderPosition)}% original, ${Math.round(100 - sliderPosition)}% vectorized`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {/* Before image — full width, bottom layer, visible on the left */}
      <img
        src={beforeImage}
        alt={beforeAlt}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* After image — clipped on the left at sliderPosition%, revealed on the right */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          clipPath: `inset(0 0 0 ${sliderPosition}%)`,
          willChange: "clip-path",
        }}
      >
        <img
          src={afterImage}
          alt={afterAlt}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white shadow-[0_0_6px_rgba(0,0,0,0.3)]"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        aria-hidden="true"
      />

      {/* Drag handle */}
      <div
        className="absolute top-1/2 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.2)] border border-border"
        style={{
          left: `${sliderPosition}%`,
          transform: "translate(-50%, -50%)",
          outline: isFocused ? "2px solid var(--accent)" : "none",
          outlineOffset: "2px",
        }}
        aria-hidden="true"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M7 5L3 10L7 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary"/>
          <path d="M13 5L17 10L13 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary"/>
        </svg>
      </div>

      {/* Keyboard hint — only shown while focused */}
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
        className="absolute top-3 left-3 px-2 py-1 rounded bg-black/50 text-white text-xs font-medium pointer-events-none tracking-wide"
        aria-hidden="true"
      >
        Original
      </div>
      <div
        className="absolute top-3 right-3 px-2 py-1 rounded bg-black/50 text-white text-xs font-medium pointer-events-none tracking-wide"
        aria-hidden="true"
      >
        Vectorized
      </div>
    </div>
  );
}
