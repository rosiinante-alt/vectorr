"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/ui";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  containerClassName?: string;
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = "Original",
  afterLabel = "Vectorized",
  containerClassName,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const updateSliderPosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    updateSliderPosition(e.touches[0].clientX);
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    updateSliderPosition(e.clientX);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = 2;
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        setSliderPosition((prev) => Math.max(0, prev - step));
        break;
      case "ArrowRight":
        e.preventDefault();
        setSliderPosition((prev) => Math.min(100, prev + step));
        break;
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] bg-white",
        "shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]",
        containerClassName,
      )}
      ref={containerRef}
      onClick={handleContainerClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-label="Image comparison slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sliderPosition)}
    >
      {/* Before Image Container */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={beforeSrc}
          alt={beforeLabel}
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-[var(--radius-sm)] shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.08)]">
          <span className="text-xs font-semibold text-text-primary">{beforeLabel}</span>
        </div>
      </div>

      {/* After Image Container (clipped) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={afterSrc}
          alt={afterLabel}
          className="w-full h-full object-cover"
          style={{ width: containerRef.current ? `${100 / (sliderPosition || 0.1)}%` : "100%" }}
          draggable={false}
        />
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-[var(--radius-sm)] shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.08)]">
          <span className="text-xs font-semibold text-text-primary">{afterLabel}</span>
        </div>
      </div>

      {/* Slider Handle */}
      <div
        ref={sliderRef}
        className={cn(
          "absolute top-0 bottom-0 w-1 bg-accent hover:bg-accent-hover",
          "transition-[background-color] duration-200",
          isDragging ? "bg-accent-hover" : "",
        )}
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        role="presentation"
      >
        {/* Slider Thumb */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
            "w-12 h-12 rounded-full",
            "bg-white shadow-[0_0_0_0.5px_var(--border),0_2px_6px_rgba(0,0,0,0.08)]",
            "flex items-center justify-center gap-0.5",
            "cursor-col-resize select-none",
            "transition-transform duration-200",
            isDragging ? "scale-110" : "hover:scale-105",
          )}
        >
          {/* Arrow icons */}
          <ChevronLeft className="w-4 h-4 text-accent" />
          <ChevronRight className="w-4 h-4 text-accent" />
        </div>
      </div>
    </div>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}
