"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

export interface VectorCanvasProps {
  /** SVG markup to render, read-only. */
  svgText: string;
  filename: string;
  /** Starts the download flow for the current SVG. */
  onExport?: () => void;
  exportLabel?: string;
  isExporting?: boolean;
}

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 8;
const STEP = 1.25;

/**
 * Read-only SVG preview with pan and zoom.
 *
 * The SVG is rendered inside a sandboxed iframe with `allow-same-origin` omitted,
 * so any script inside an uploaded file cannot run — a malformed or hostile SVG
 * cannot reach the page. Panning is direct manipulation on the stage; zoom is
 * driven by explicit buttons and the keyboard so every control is reachable
 * without a pointer gesture.
 */
export function VectorCanvas({
  svgText,
  filename,
  onExport,
  exportLabel = "Download SVG",
  isExporting,
}: VectorCanvasProps) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0, originX: 0, originY: 0 });

  const clampZoom = (value: number) =>
    Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));

  const reset = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  // Pan with the pointer.
  useEffect(() => {
    if (!dragging) return;

    const onMove = (event: PointerEvent) => {
      const { x, y, originX, originY } = dragStart.current;
      setOffset({ x: originX + (event.clientX - x), y: originY + (event.clientY - y) });
    };
    const onUp = () => setDragging(false);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging]);

  // Ctrl/Cmd + wheel zooms; a plain wheel is left to the page so scrolling works.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      setZoom((current) => clampZoom(current * (event.deltaY < 0 ? STEP : 1 / STEP)));
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, []);

  const step = (direction: 1 | -1) =>
    setZoom((current) => clampZoom(direction === 1 ? current * STEP : current / STEP));

  return (
    <section
      aria-label={`Preview of ${filename}`}
      className="overflow-hidden rounded-[var(--radius-xl)] bg-white shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-[14.5px] font-semibold" title={filename}>
            {filename}
          </p>
          <p className="text-[12.5px] text-text-tertiary">
            Read-only preview · drag to pan
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <div
            className="flex items-center overflow-hidden rounded-[var(--radius-md)] shadow-[inset_0_0_0_1px_var(--border-strong)]"
            role="group"
            aria-label="Zoom controls"
          >
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom out"
              className="h-9 w-9 text-[17px] leading-none text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary disabled:opacity-40"
            >
              −
            </button>
            <button
              type="button"
              onClick={reset}
              aria-label={`Reset zoom. Current zoom ${Math.round(zoom * 100)} percent`}
              className="tabular h-9 min-w-[62px] border-x border-[var(--border)] px-2 font-mono text-[12.5px] text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom in"
              className="h-9 w-9 text-[17px] leading-none text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary disabled:opacity-40"
            >
              +
            </button>
          </div>

          {onExport && (
            <Button onClick={onExport} disabled={isExporting}>
              {isExporting ? "Preparing…" : exportLabel}
            </Button>
          )}
        </div>
      </div>

      <div
        ref={stageRef}
        tabIndex={0}
        role="application"
        aria-label="Vector preview. Use plus and minus to zoom, reset to recentre."
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          dragStart.current = {
            x: event.clientX,
            y: event.clientY,
            originX: offset.x,
            originY: offset.y,
          };
          setDragging(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "+" || event.key === "=") {
            event.preventDefault();
            step(1);
          } else if (event.key === "-" || event.key === "_") {
            event.preventDefault();
            step(-1);
          } else if (event.key === "0") {
            event.preventDefault();
            reset();
          }
        }}
        className="relative h-[320px] touch-none overflow-hidden bg-[repeating-conic-gradient(#f0f0f3_0%_25%,#ffffff_0%_50%)] bg-[length:18px_18px] select-none sm:h-[440px]"
        style={{ cursor: dragging ? "grabbing" : "grab" }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-2/3 w-2/3"
          style={{
            transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transition: dragging ? "none" : "transform 0.18s var(--spring)",
          }}
        >
          {/* sandbox with no allow-scripts: uploaded SVG cannot execute */}
          <iframe
            title={`Rendered ${filename}`}
            srcDoc={svgText}
            sandbox=""
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </section>
  );
}
