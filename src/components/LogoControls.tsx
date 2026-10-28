import React, { useRef } from 'react';
import { LogoTransform, BlendMode } from '../types/mockup';
import { SAMPLE_LOGOS, SampleLogo } from '../utils/sampleLogos';
import {
  Upload,
  Sparkles,
  Scissors,
  Palette,
  Maximize2,
  RotateCw,
  Sliders,
  AlignHorizontalDistributeCenter,
  Layers,
  Trash2,
  Check,
} from 'lucide-react';

interface LogoControlsProps {
  logoImage: HTMLImageElement | null;
  logoDataUrl: string | null;
  logoName: string;
  transform: LogoTransform;
  onUpdateTransform: (partial: Partial<LogoTransform>) => void;
  onSelectLogo: (url: string, name: string) => void;
  onClearLogo: () => void;
  onOpenAiStudio: () => void;
}

export const LogoControls: React.FC<LogoControlsProps> = ({
  logoImage,
  logoDataUrl,
  logoName,
  transform,
  onUpdateTransform,
  onSelectLogo,
  onClearLogo,
  onOpenAiStudio,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onSelectLogo(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop zone handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        onSelectLogo(dataUrl, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Quick alignment positions
  const setPresetPosition = (type: 'center' | 'left-chest' | 'right-chest' | 'high' | 'low') => {
    switch (type) {
      case 'center':
        onUpdateTransform({ x: 0, y: 0 });
        break;
      case 'left-chest':
        onUpdateTransform({ x: -16, y: -12, scale: Math.min(transform.scale, 0.7) });
        break;
      case 'right-chest':
        onUpdateTransform({ x: 16, y: -12, scale: Math.min(transform.scale, 0.7) });
        break;
      case 'high':
        onUpdateTransform({ x: 0, y: -18 });
        break;
      case 'low':
        onUpdateTransform({ x: 0, y: 16 });
        break;
    }
  };

  return (
    <div className="flex flex-col gap-5 p-5 bg-white overflow-y-auto max-h-full">
      {/* 1. Upload or Change Logo Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Logo &amp; Graphic
          </label>
          {logoDataUrl && (
            <button
              onClick={onClearLogo}
              className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-medium cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              Remove
            </button>
          )}
        </div>

        {/* Upload Zone */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          className="hidden"
          onChange={handleFileUpload}
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 hover:border-indigo-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-gray-50/60 hover:bg-indigo-50/30 flex flex-col items-center justify-center gap-2 group"
        >
          {logoDataUrl ? (
            <div className="flex items-center gap-3 w-full">
              <div className="w-14 h-14 rounded-lg bg-gray-200/80 p-1 flex items-center justify-center border border-gray-300/80 overflow-hidden shrink-0">
                <img
                  src={logoDataUrl}
                  alt={logoName}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{logoName}</p>
                <p className="text-[11px] text-gray-500">Click or drop to replace</p>
                <span className="inline-block mt-1 text-[10px] bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-full">
                  Active On Product
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">
                  Click to upload or drag logo here
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">PNG, SVG, JPG, WebP supported</p>
              </div>
            </>
          )}
        </div>

        {/* AI Generator Shortcut */}
        <button
          onClick={onOpenAiStudio}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Generate or Remix with Gemini AI</span>
        </button>
      </div>

      {/* 2. Sample Logos Quick Select */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Or Try Ready-Made Sample Logos
        </label>
        <div className="grid grid-cols-5 gap-2">
          {SAMPLE_LOGOS.map((sample) => {
            const isSelected = logoName === sample.name;
            return (
              <button
                key={sample.id}
                onClick={() => onSelectLogo(sample.url, sample.name)}
                className={`aspect-square p-1.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-400/40 shadow-xs'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
                title={sample.name}
              >
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="w-full h-full object-contain"
                />
                {isSelected && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Smart Background Removal */}
      <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-semibold text-gray-800">Auto Background Remover</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={transform.removeBgTolerance > 0}
              onChange={(e) =>
                onUpdateTransform({ removeBgTolerance: e.target.checked ? 30 : 0 })
              }
            />
            <div className="w-8 h-4.5 bg-gray-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        {transform.removeBgTolerance > 0 && (
          <div className="mt-2 flex flex-col gap-1">
            <div className="flex justify-between text-[11px] text-gray-500">
              <span>Sensitivity / Tolerance</span>
              <span>{transform.removeBgTolerance}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="90"
              value={transform.removeBgTolerance}
              onChange={(e) =>
                onUpdateTransform({ removeBgTolerance: parseInt(e.target.value, 10) })
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* 4. Color Finish & Tints */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-gray-400" />
          Color &amp; Finish
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { id: 'original', label: 'Full Color' },
            { id: 'white', label: 'Pure White' },
            { id: 'black', label: 'Pure Black' },
            { id: 'gold', label: 'Gold Foil' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onUpdateTransform({ colorFilter: item.id as any })}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                transform.colorFilter === item.id
                  ? 'bg-gray-900 border-gray-900 text-white shadow-xs'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Placement & Alignment Presets */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
          <AlignHorizontalDistributeCenter className="w-3.5 h-3.5 text-gray-400" />
          Quick Placement
        </label>
        <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
          <button
            onClick={() => setPresetPosition('center')}
            className="py-1 px-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors cursor-pointer"
          >
            Center
          </button>
          <button
            onClick={() => setPresetPosition('left-chest')}
            className="py-1 px-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors cursor-pointer"
          >
            Pocket L
          </button>
          <button
            onClick={() => setPresetPosition('right-chest')}
            className="py-1 px-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors cursor-pointer"
          >
            Pocket R
          </button>
          <button
            onClick={() => setPresetPosition('high')}
            className="py-1 px-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors cursor-pointer"
          >
            Top
          </button>
          <button
            onClick={() => setPresetPosition('low')}
            className="py-1 px-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors cursor-pointer"
          >
            Bottom
          </button>
        </div>
      </div>

      {/* 6. Scale & Transform Sliders */}
      <div className="flex flex-col gap-4">
        {/* Scale */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-medium text-gray-700">
            <span className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
              Scale / Size
            </span>
            <span className="font-semibold text-gray-900">
              {Math.round(transform.scale * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.0"
            step="0.05"
            value={transform.scale}
            onChange={(e) => onUpdateTransform({ scale: parseFloat(e.target.value) })}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* Rotation */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-medium text-gray-700">
            <span className="flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5 text-gray-400" />
              Rotation
            </span>
            <span className="font-semibold text-gray-900">{transform.rotation}°</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="-180"
              max="180"
              step="5"
              value={transform.rotation}
              onChange={(e) => onUpdateTransform({ rotation: parseInt(e.target.value, 10) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            {transform.rotation !== 0 && (
              <button
                onClick={() => onUpdateTransform({ rotation: 0 })}
                className="text-[10px] text-indigo-600 hover:underline shrink-0"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Opacity */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-xs font-medium text-gray-700">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-gray-400" />
              Opacity
            </span>
            <span className="font-semibold text-gray-900">
              {Math.round(transform.opacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={transform.opacity}
            onChange={(e) => onUpdateTransform({ opacity: parseFloat(e.target.value) })}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>
      </div>

      {/* 7. Realistic Fabric Blend Mode */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-gray-400" />
          Print / Fabric Blend Mode
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { id: 'normal', name: 'Normal', desc: 'Direct opaque vinyl' },
            { id: 'multiply', name: 'Fabric Multiply', desc: 'Inks sink into folds' },
            { id: 'screen', name: 'Screen Print', desc: 'For dark apparel' },
            { id: 'emboss', name: 'Embossed', desc: 'Raised 3D relief' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => onUpdateTransform({ blendMode: mode.id as BlendMode })}
              className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                transform.blendMode === mode.id
                  ? 'bg-indigo-50 border-indigo-600 ring-1 ring-indigo-400/30'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <p
                className={`font-semibold ${
                  transform.blendMode === mode.id ? 'text-indigo-900' : 'text-gray-800'
                }`}
              >
                {mode.name}
              </p>
              <p className="text-[10px] text-gray-500">{mode.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
