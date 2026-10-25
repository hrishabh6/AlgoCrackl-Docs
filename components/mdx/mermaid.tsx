'use client';

import { Expand, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.2;

export function Mermaid({ chart }: { chart: string }) {
  const reactId = useId().replace(/:/g, '');
  const { resolvedTheme } = useTheme();
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          fontFamily: 'inherit',
          theme: resolvedTheme === 'dark' ? 'dark' : 'default',
        });
        const rendered = await mermaid.render(`algo-mermaid-${reactId}`, chart);
        if (!cancelled) {
          setSvg(rendered.svg);
          setError(null);
        }
      } catch (cause) {
        if (!cancelled) {
          setSvg(null);
          setError(cause instanceof Error ? cause.message : 'Diagram failed to render.');
        }
      }
    }

    void renderChart();
    return () => {
      cancelled = true;
    };
  }, [chart, reactId, resolvedTheme]);

  if (error) {
    return (
      <pre className="overflow-x-auto rounded-lg border p-4 text-sm">
        <code>{chart}</code>
      </pre>
    );
  }

  if (!svg) {
    return <p className="text-sm text-neutral-500">Rendering diagram…</p>;
  }

  function openExpandedDiagram() {
    setZoom(1);
    dialogRef.current?.showModal();
  }

  function closeExpandedDiagram() {
    dialogRef.current?.close();
  }

  const canZoomIn = zoom < MAX_ZOOM;
  const canZoomOut = zoom > MIN_ZOOM;

  return (
    <>
      <figure className="my-6 rounded-xl border bg-fd-card p-3 shadow-sm sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <figcaption className="text-sm font-medium text-fd-foreground">Architecture diagram</figcaption>
          <button
            type="button"
            onClick={openExpandedDiagram}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-fd-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
            aria-label="Expand diagram"
          >
            <Expand className="size-3.5" aria-hidden="true" />
            Expand diagram
          </button>
        </div>
        <div
          className="overflow-x-auto pb-1 [&_svg]:mx-auto [&_svg]:min-w-[42rem] [&_svg]:max-w-none sm:[&_svg]:min-w-0 sm:[&_svg]:max-w-full"
          role="img"
          aria-label="Mermaid architecture diagram"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </figure>

      <dialog
        ref={dialogRef}
        onClose={() => setZoom(1)}
        className="h-[min(92dvh,70rem)] w-[min(96vw,100rem)] max-w-none rounded-xl border bg-fd-background p-0 text-fd-foreground shadow-2xl backdrop:bg-black/60"
        aria-label="Expanded architecture diagram"
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2 sm:px-4">
            <p className="text-sm font-medium">Expanded diagram</p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setZoom((current) => Math.max(MIN_ZOOM, Number((current - ZOOM_STEP).toFixed(1))))}
                disabled={!canZoomOut}
                className="inline-flex size-8 items-center justify-center rounded-md border transition-colors hover:bg-fd-accent disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
                aria-label="Zoom out"
              >
                <ZoomOut className="size-4" aria-hidden="true" />
              </button>
              <span className="min-w-12 text-center text-xs tabular-nums text-fd-muted-foreground" aria-live="polite">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((current) => Math.min(MAX_ZOOM, Number((current + ZOOM_STEP).toFixed(1))))}
                disabled={!canZoomIn}
                className="inline-flex size-8 items-center justify-center rounded-md border transition-colors hover:bg-fd-accent disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
                aria-label="Zoom in"
              >
                <ZoomIn className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(1)}
                disabled={zoom === 1}
                className="inline-flex size-8 items-center justify-center rounded-md border transition-colors hover:bg-fd-accent disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
                aria-label="Reset diagram zoom"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={closeExpandedDiagram}
                className="ml-1 inline-flex size-8 items-center justify-center rounded-md border transition-colors hover:bg-fd-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
                aria-label="Close expanded diagram"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-8" aria-label="Scrollable diagram canvas">
            <div
              className="origin-top-left"
              style={{
                transform: `scale(${zoom})`,
                width: `${100 * zoom}%`,
              }}
            >
              <div
                className="min-w-max [&_svg]:h-auto [&_svg]:max-w-none"
                role="img"
                aria-label="Mermaid architecture diagram"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
