import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ProductType, LogoTransform } from '../types/mockup';
import { PRODUCT_CONFIGS } from '../utils/productConfigs';
import { renderMockupToCanvas } from '../utils/canvasRenderer';
import { ZoomIn, ZoomOut, RotateCcw, Move, Eye, Sparkles, Layers, Sliders } from 'lucide-react';

interface MockupCanvasProps {
  product: ProductType;
  color: string;
  logoImage: HTMLImageElement | null;
  transform: LogoTransform;
  onUpdateTransform: (partial: Partial<LogoTransform>) => void;
  isBackView: boolean;
  onToggleBackView: () => void;
  showTexture: boolean;
  onToggleTexture: () => void;
  showLighting: boolean;
  onToggleLighting: () => void;
}

export const MockupCanvas: React.FC<MockupCanvasProps> = ({
  product,
  color,
  logoImage,
  transform,
  onUpdateTransform,
  isBackView,
  onToggleBackView,
  showTexture,
  onToggleTexture,
  showLighting,
  onToggleLighting,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [zoom, setZoom] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [initialTransform, setInitialTransform] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showPrintGuide, setShowPrintGuide] = useState<boolean>(false);

  const productConfig = PRODUCT_CONFIGS[product];

  // Render canvas whenever dependencies change
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use high resolution for ultra-sharp rendering
    canvas.width = 1200;
    canvas.height = 1200;

    renderMockupToCanvas(canvas, {
      product,
      color,
      logoImage,
      transform,
      isBackView,
      showTexture,
      showLighting,
    });

    // Optional: Draw print area bounding guide
    if (showPrintGuide) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        const pa = productConfig.printArea;
        const gx = canvas.width * pa.x;
        const gy = canvas.height * pa.y;
        const gw = canvas.width * pa.width;
        const gh = canvas.height * pa.height;

        ctx.strokeStyle = '#6366F1';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 8]);
        ctx.strokeRect(gx, gy, gw, gh);

        ctx.fillStyle = '#6366F1';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('Recommended Print Area', gx + 10, gy + 26);
        ctx.restore();
      }
    }
  }, [product, color, logoImage, transform, isBackView, showTexture, showLighting, showPrintGuide, productConfig]);

  useEffect(() => {
    render();
  }, [render]);

  // Handle Dragging Logo directly on Canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    if (!logoImage) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialTransform({ x: transform.x, y: transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDragging || !containerRef.current) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    const rect = containerRef.current.getBoundingClientRect();

    // Map screen pixel movement to percentage offsets (-50 to +50)
    const scaleFactor = 100 / (rect.width * zoom);
    const newX = Math.max(-50, Math.min(50, initialTransform.x + dx * scaleFactor));
    const newY = Math.max(-50, Math.min(50, initialTransform.y + dy * scaleFactor));

    onUpdateTransform({ x: Math.round(newX * 10) / 10, y: Math.round(newY * 10) / 10 });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center p-4 bg-gray-100 select-none overflow-hidden min-h-[480px] lg:min-h-[580px]">
      {/* Floating Toolbar Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-gray-200/80 shadow-xs">
        {/* Zoom controls */}
        <button
          onClick={() => setZoom((prev) => Math.min(prev + 0.15, 2.2))}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="text-xs font-semibold text-gray-600 px-1 min-w-[42px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((prev) => Math.max(prev - 0.15, 0.6))}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(1)}
          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          title="Reset View (100%)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-gray-200 mx-1" />

        {/* Print guide toggle */}
        <button
          onClick={() => setShowPrintGuide(!showPrintGuide)}
          className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
            showPrintGuide
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Toggle Print Bounds"
        >
          <Layers className="w-4 h-4" />
          <span className="hidden sm:inline">Bounds</span>
        </button>
      </div>

      {/* View Angle Toggle (for apparel) */}
      {productConfig.hasBackView && (
        <div className="absolute top-4 right-4 z-10 flex items-center bg-white/90 backdrop-blur-md p-1 rounded-xl border border-gray-200/80 shadow-xs">
          <button
            onClick={() => isBackView && onToggleBackView()}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              !isBackView ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Front View
          </button>
          <button
            onClick={() => !isBackView && onToggleBackView()}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isBackView ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Back View
          </button>
        </div>
      )}

      {/* Main Interactive Canvas Display */}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
          className="relative max-w-[560px] max-h-[560px] w-full aspect-square flex items-center justify-center"
        >
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            className="w-full h-full object-contain rounded-2xl shadow-xl border border-gray-200/60 bg-white"
          />

          {/* Quick Helper Floating Tip */}
          {!logoImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white/40 backdrop-blur-xs rounded-2xl pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
                <Move className="w-6 h-6 animate-bounce" />
              </div>
              <p className="text-sm font-semibold text-gray-800">No Logo Loaded Yet</p>
              <p className="text-xs text-gray-500 max-w-xs mt-1">
                Upload your logo from the side panel, select a curated sample, or generate one with AI!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-3 text-center text-[11px] text-gray-500 font-medium bg-white/70 backdrop-blur-xs px-3 py-1 rounded-full border border-gray-200/50">
        Tip: Click and drag anywhere on the mockup to reposition your logo in real time
      </div>
    </div>
  );
};
