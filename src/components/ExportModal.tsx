import React, { useState } from 'react';
import { ProductType, LogoTransform, ExportResolution } from '../types/mockup';
import { PRODUCT_CONFIGS } from '../utils/productConfigs';
import { renderMockupToCanvas } from '../utils/canvasRenderer';
import { X, Download, Check, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductType;
  color: string;
  logoImage: HTMLImageElement | null;
  transform: LogoTransform;
  isBackView: boolean;
  showTexture: boolean;
  showLighting: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  product,
  color,
  logoImage,
  transform,
  isBackView,
  showTexture,
  showLighting,
}) => {
  const [resolution, setResolution] = useState<ExportResolution>('2K');
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!isOpen) return null;

  const config = PRODUCT_CONFIGS[product];

  const handleDownload = () => {
    setIsExporting(true);

    setTimeout(() => {
      try {
        const dim = resolution === '1K' ? 1024 : resolution === '2K' ? 2048 : 4096;

        // Render to offscreen canvas at chosen resolution
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = dim;
        exportCanvas.height = dim;

        renderMockupToCanvas(exportCanvas, {
          product,
          color,
          logoImage,
          transform,
          isBackView,
          showTexture,
          showLighting,
        });

        const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
        const dataUrl = exportCanvas.toDataURL(mime, 0.95);

        const link = document.createElement('a');
        link.download = `${product}-mockup-${resolution.toLowerCase()}.${format}`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Export error:', err);
      } finally {
        setIsExporting(false);
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Export High-Resolution Mockup</h2>
              <p className="text-xs text-gray-500">{config.name} • Studio Render</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Resolution Options */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Resolution Quality
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: '1K', dim: '1024 × 1024', desc: 'Web & Social' },
                { id: '2K', dim: '2048 × 2048', desc: 'Portfolio HQ' },
                { id: '4K', dim: '4096 × 4096', desc: 'Ultra Print-Ready' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setResolution(item.id as ExportResolution)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    resolution === item.id
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-400/30'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-bold ${
                        resolution === item.id ? 'text-indigo-900' : 'text-gray-900'
                      }`}
                    >
                      {item.id}
                    </span>
                    {resolution === item.id && (
                      <Check className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-gray-600 mt-0.5">{item.dim}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Format Options */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              File Format
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setFormat('png')}
                className={`py-2 px-3 rounded-xl font-semibold border transition-all cursor-pointer ${
                  format === 'png'
                    ? 'bg-gray-900 border-gray-900 text-white'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                PNG (Lossless Quality)
              </button>
              <button
                type="button"
                onClick={() => setFormat('jpeg')}
                className={`py-2 px-3 rounded-xl font-semibold border transition-all cursor-pointer ${
                  format === 'jpeg'
                    ? 'bg-gray-900 border-gray-900 text-white'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                JPEG (Optimized File Size)
              </button>
            </div>
          </div>

          {/* Download Action */}
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Rendering {resolution} Master File...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download {resolution} Mockup ({format.toUpperCase()})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
