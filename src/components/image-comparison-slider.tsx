"use client";

import { useRef, useState, useEffect, type MouseEvent, type TouchEvent } from "react";

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
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    if (e.touches[0]) {
      updatePosition(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      updatePosition((e as any).clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      if (e.touches[0]) {
        updatePosition((e as any).touches[0].clientX);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove as any);
      document.addEventListener("touchmove", handleTouchMove as any);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove as any);
        document.removeEventListener("touchmove", handleTouchMove as any);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let newPosition = sliderPosition;
    const step = e.shiftKey ? 10 : 1;

    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        newPosition = Math.max(0, sliderPosition - step);
        e.preventDefault();
        break;
      case "ArrowRight":
      case "ArrowUp":
        newPosition = Math.min(100, sliderPosition + step);
        e.preventDefault();
        break;
      case "Home":
        newPosition = 0;
        e.preventDefault();
        break;
      case "End":
        newPosition = 100;
        e.preventDefault();
        break;
      default:
        return;
    }

    setSliderPosition(newPosition);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-col-resize select-none focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${className}`}
      style={{ width, height }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-label="Image comparison slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sliderPosition)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {/* Before image (bottom layer) */}
      <img
        src={beforeImage}
        alt={beforeAlt}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* After image (clipped with clip-path) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      >
        <img
          src={afterImage}
          alt={afterAlt}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg focus:ring-2 focus:ring-accent"
        style={{
          left: `${sliderPosition}%`,
          transform: "translateX(-50%)",
        }}
      >
        {/* Handle thumb */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg border-2 border-accent flex items-center justify-center focus:ring-2 focus:ring-accent"
          style={{
            outline: isFocused ? "2px solid var(--accent)" : "none",
            outlineOffset: isFocused ? "2px" : "0",
          }}
        >
          {/* Chevrons */}
          <div className="flex gap-0.5">
            <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Focus hint overlay */}
      {isFocused && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none">
          ← → to move · Shift for larger steps · Home/End for edges
        </div>
      )}

      {/* Labels */}
      <div className="absolute top-3 left-3 text-sm font-medium text-gray-700 bg-white bg-opacity-80 px-2 py-1 rounded pointer-events-none">
        Original
      </div>
      <div className="absolute top-3 right-3 text-sm font-medium text-gray-700 bg-white bg-opacity-80 px-2 py-1 rounded pointer-events-none">
        Vectorized
      </div>
    </div>
  );
}
