import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Loader2,
  X,
  Download,
  ArrowRight,
  Layers,
  Sliders,
} from 'lucide-react';
import { ExportResolution } from '../types/mockup';

interface AiImageStudioProps {
  isOpen: boolean;
  onClose: () => void;
  activeLogoUrl: string | null;
  onApplyGeneratedLogo: (dataUrl: string, name: string) => void;
}

export const AiImageStudio: React.FC<AiImageStudioProps> = ({
  isOpen,
  onClose,
  activeLogoUrl,
  onApplyGeneratedLogo,
}) => {
  const [activeTab, setActiveTab] = useState<'generate-hq' | 'create-edit'>('generate-hq');

  // State for Feature 1: gemini-3-pro-image-preview
  const [hqPrompt, setHqPrompt] = useState<string>('');
  const [hqImageSize, setHqImageSize] = useState<ExportResolution>('2K');
  const [hqAspectRatio, setHqAspectRatio] = useState<string>('1:1');
  const [hqLoading, setHqLoading] = useState<boolean>(false);
  const [hqResult, setHqResult] = useState<string | null>(null);
  const [hqError, setHqError] = useState<string | null>(null);

  // State for Feature 2: gemini-nano-banana-2.1
  const [nanoPrompt, setNanoPrompt] = useState<string>('');
  const [nanoUseReference, setNanoUseReference] = useState<boolean>(Boolean(activeLogoUrl));
  const [nanoImageSize, setNanoImageSize] = useState<ExportResolution>('1K');
  const [nanoLoading, setNanoLoading] = useState<boolean>(false);
  const [nanoResult, setNanoResult] = useState<string | null>(null);
  const [nanoError, setNanoError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Feature 1: Call gemini-3-pro-image-preview
  const handleGenerateHq = async () => {
    if (!hqPrompt.trim()) return;
    setHqLoading(true);
    setHqError(null);
    setHqResult(null);

    try {
      const res = await fetch('/api/gemini/generate-hq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: hqPrompt,
          imageSize: hqImageSize,
          aspectRatio: hqAspectRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setHqResult(data.imageUrl);
    } catch (err: any) {
      setHqError(err.message || 'Error occurred while calling gemini-3-pro-image-preview');
    } finally {
      setHqLoading(false);
    }
  };

  // Feature 2: Call gemini-nano-banana-2.1
  const handleCreateOrEditNano = async () => {
    if (!nanoPrompt.trim()) return;
    setNanoLoading(true);
    setNanoError(null);
    setNanoResult(null);

    try {
      const payload: any = {
        prompt: nanoPrompt,
        imageSize: nanoImageSize,
      };

      if (nanoUseReference && activeLogoUrl) {
        payload.imageBase64 = activeLogoUrl;
      }

      const res = await fetch('/api/gemini/create-or-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed with gemini-nano-banana-2.1');
      }

      setNanoResult(data.imageUrl);
    } catch (err: any) {
      setNanoError(err.message || 'Error occurred while calling gemini-nano-banana-2.1');
    } finally {
      setNanoLoading(false);
    }
  };

  // Prompt templates for quick inspiration
  const promptIdeasHq = [
    'Vintage circular badge for artisan roast coffee roasters, vector typography, gold and navy',
    'Minimalist geometric mountain apex logo, clean lines, luxury streetwear aesthetic',
    'Retro cyberpunk neon arcade logo, bright cyan and magenta with sun rays',
    'Botanical crest with blooming lavender and olive branches, modern organic cosmetics emblem',
    'Bold athletic tiger head mascot emblem, sharp vector lines, aggressive sport style',
  ];

  const promptIdeasNano = [
    'Turn this design into a gold metallic embroidered patch with visible stitching texture',
    'Add a vintage 1970s distressed sunburst background with retro typography',
    'Transform into vibrant neon synthwave illustration on black background',
    'Convert this artwork into a delicate hand-carved woodblock stamp print',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-indigo-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">AI Artwork &amp; Logo Studio</h2>
              <p className="text-xs text-gray-500">
                Generate high-resolution merchandise graphics or remix your active logos with Gemini
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50/80 px-6">
          <button
            onClick={() => setActiveTab('generate-hq')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'generate-hq'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Generate High-Quality (gemini-3-pro-image-preview)</span>
            <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-semibold">
              1K / 2K / 4K
            </span>
          </button>

          <button
            onClick={() => setActiveTab('create-edit')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'create-edit'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Create &amp; Edit Images (gemini-nano-banana-2.1)</span>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-semibold">
              Remix
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: High-Quality Image Generation (gemini-3-pro-image-preview) */}
          {activeTab === 'generate-hq' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Input Form */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Prompt Description
                  </label>
                  <textarea
                    rows={4}
                    value={hqPrompt}
                    onChange={(e) => setHqPrompt(e.target.value)}
                    placeholder="Describe your logo or graphic in detail (e.g., 'A vintage geometric circular emblem of a falcon with wings spread, retro vector aesthetic, clean lines on dark background')..."
                    className="w-full text-sm p-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all resize-none"
                  />
                </div>

                {/* Quick Prompts */}
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 block mb-1">
                    Try an inspiration prompt:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {promptIdeasHq.slice(0, 3).map((idea, idx) => (
                      <button
                        key={idx}
                        onClick={() => setHqPrompt(idea)}
                        className="text-left text-xs bg-gray-50 hover:bg-indigo-50/60 p-2 rounded-lg border border-gray-200 text-gray-700 transition-colors line-clamp-2 cursor-pointer"
                      >
                        "{idea}"
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Affordance: 1K, 2K, 4K (REQUIRED FEATURE) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Image Resolution (Affordance)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['1K', '2K', '4K'] as ExportResolution[]).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setHqImageSize(size)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          hqImageSize === size
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-sm">{size}</div>
                        <div
                          className={`text-[10px] ${
                            hqImageSize === size ? 'text-indigo-200' : 'text-gray-400'
                          }`}
                        >
                          {size === '1K'
                            ? '1024 × 1024'
                            : size === '2K'
                            ? '2048 × 2048'
                            : '4096 × 4096'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Aspect Ratio */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Aspect Ratio
                  </label>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    {['1:1', '3:4', '4:3', '16:9'].map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setHqAspectRatio(ratio)}
                        className={`py-1.5 rounded-lg font-semibold border transition-all cursor-pointer ${
                          hqAspectRatio === ratio
                            ? 'bg-gray-900 border-gray-900 text-white'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleGenerateHq}
                  disabled={hqLoading || !hqPrompt.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {hqLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating with gemini-3-pro-image-preview ({hqImageSize})...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate {hqImageSize} Artwork</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: Preview & Apply */}
              <div className="flex flex-col gap-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Artwork Output
                </label>
                <div className="flex-1 min-h-[300px] border border-gray-200 rounded-2xl bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                  {hqLoading && (
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                      <p className="text-xs font-semibold text-gray-700">
                        Synthesizing {hqImageSize} high-resolution image...
                      </p>
                      <p className="text-[11px] text-gray-400">Model: gemini-3-pro-image-preview</p>
                    </div>
                  )}

                  {!hqLoading && hqResult && (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                      <img
                        src={hqResult}
                        alt="Generated Artwork"
                        className="max-h-[280px] max-w-full object-contain rounded-xl shadow-md bg-white border border-gray-200"
                      />
                      <div className="flex items-center gap-2 w-full mt-2">
                        <button
                          onClick={() => {
                            onApplyGeneratedLogo(hqResult, `AI Logo (${hqImageSize})`);
                            onClose();
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Apply as Logo on Mockups</span>
                        </button>
                        <a
                          href={hqResult}
                          download={`ai-logo-${hqImageSize.toLowerCase()}.png`}
                          className="py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Save</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {!hqLoading && !hqResult && !hqError && (
                    <div className="text-center p-6 text-gray-400">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
                      <p className="text-xs font-semibold text-gray-600">No Image Generated Yet</p>
                      <p className="text-[11px] text-gray-400 max-w-xs mt-1">
                        Enter your prompt and choose resolution to create an asset with gemini-3-pro-image-preview.
                      </p>
                    </div>
                  )}

                  {hqError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex flex-col gap-2 max-w-md text-left">
                      <div className="flex items-center gap-2 font-bold text-red-800">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Generation Notice</span>
                      </div>
                      <p className="text-red-600 leading-relaxed">{hqError}</p>
                      <p className="text-[11px] text-red-500">
                        Tip: You can continue uploading custom logos or using the curated sample logos on the mockup canvas at any time!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Create & Edit Images (gemini-nano-banana-2.1) */}
          {activeTab === 'create-edit' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Prompt & Edit Controls */}
              <div className="flex flex-col gap-4">
                {/* Active Reference Logo attachment */}
                {activeLogoUrl && (
                  <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white p-1 border border-indigo-200 flex items-center justify-center shrink-0">
                        <img
                          src={activeLogoUrl}
                          alt="Current Logo"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-indigo-950">Active Mockup Logo</p>
                        <p className="text-[11px] text-indigo-700">Use this as visual reference to edit or remix</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={nanoUseReference}
                        onChange={(e) => setNanoUseReference(e.target.checked)}
                      />
                      <div className="w-8 h-4.5 bg-gray-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    {nanoUseReference ? 'Edit / Transformation Instructions' : 'Creation Prompt'}
                  </label>
                  <textarea
                    rows={4}
                    value={nanoPrompt}
                    onChange={(e) => setNanoPrompt(e.target.value)}
                    placeholder={
                      nanoUseReference
                        ? "e.g., 'Make this logo look like an embroidered tactical badge with golden stitching and dark fabric backing' or 'Apply retro 80s gradient airbrush texture'..."
                        : "e.g., 'Minimalist modern brand mark for an athletic brand, bold geometric lines, pure black and white'..."
                    }
                    className="w-full text-sm p-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all resize-none"
                  />
                </div>

                {/* Preset Prompt Inspirations */}
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 block mb-1">
                    Quick Edit Inspirations:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {promptIdeasNano.map((idea, idx) => (
                      <button
                        key={idx}
                        onClick={() => setNanoPrompt(idea)}
                        className="text-left text-xs bg-gray-50 hover:bg-indigo-50/60 p-2 rounded-lg border border-gray-200 text-gray-700 transition-colors line-clamp-1 cursor-pointer"
                      >
                        "{idea}"
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Size */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Resolution
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['1K', '2K', '4K'] as ExportResolution[]).map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setNanoImageSize(size)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          nanoImageSize === size
                            ? 'bg-gray-900 border-gray-900 text-white'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  onClick={handleCreateOrEditNano}
                  disabled={nanoLoading || !nanoPrompt.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {nanoLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing with gemini-nano-banana-2.1...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>{nanoUseReference ? 'Remix & Edit Logo' : 'Create Image'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Right Column: Output & Apply */}
              <div className="flex flex-col gap-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Result
                </label>
                <div className="flex-1 min-h-[300px] border border-gray-200 rounded-2xl bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                  {nanoLoading && (
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                      <p className="text-xs font-semibold text-gray-700">
                        Editing &amp; generating with gemini-nano-banana-2.1...
                      </p>
                    </div>
                  )}

                  {!nanoLoading && nanoResult && (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                      <img
                        src={nanoResult}
                        alt="Remixed Output"
                        className="max-h-[280px] max-w-full object-contain rounded-xl shadow-md bg-white border border-gray-200"
                      />
                      <div className="flex items-center gap-2 w-full mt-2">
                        <button
                          onClick={() => {
                            onApplyGeneratedLogo(nanoResult, 'Remixed AI Logo');
                            onClose();
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Apply as Logo on Mockups</span>
                        </button>
                        <a
                          href={nanoResult}
                          download="ai-remixed-logo.png"
                          className="py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs flex items-center justify-center gap-1 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Save</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {!nanoLoading && !nanoResult && !nanoError && (
                    <div className="text-center p-6 text-gray-400">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
                      <p className="text-xs font-semibold text-gray-600">No Image Generated Yet</p>
                      <p className="text-[11px] text-gray-400 max-w-xs mt-1">
                        Use prompts to create or edit imagery with gemini-nano-banana-2.1.
                      </p>
                    </div>
                  )}

                  {nanoError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex flex-col gap-2 max-w-md text-left">
                      <div className="flex items-center gap-2 font-bold text-red-800">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Generation Notice</span>
                      </div>
                      <p className="text-red-600 leading-relaxed">{nanoError}</p>
                      <p className="text-[11px] text-red-500">
                        You can continue using standard upload or sample logos on all products.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
