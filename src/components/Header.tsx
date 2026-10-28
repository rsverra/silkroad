import React from 'react';
import { Sparkles, Grid, Download, Layers, ShieldCheck } from 'lucide-react';
import { ExportResolution } from '../types/mockup';

interface HeaderProps {
  onOpenAiStudio: () => void;
  onOpenAllProducts: () => void;
  onOpenExport: () => void;
  activeLogoName?: string;
  hasLogo: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAiStudio,
  onOpenAllProducts,
  onOpenExport,
  activeLogoName,
  hasLogo,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 lg:px-6 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand & Badge */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">MockupStudio</h1>
                <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Pro 4K
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Photorealistic Product &amp; Merch Visualizer</p>
            </div>
          </div>

          {/* Active logo badge for mobile */}
          {hasLogo && (
            <div className="sm:hidden text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md truncate max-w-[140px]">
              {activeLogoName || 'Active Logo'}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* AI Generator & Editor Button */}
          <button
            onClick={onOpenAiStudio}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-sm transition-all hover:shadow-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
            <span>AI Artwork Studio</span>
          </button>

          {/* Grid Preview Button */}
          <button
            onClick={onOpenAllProducts}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors cursor-pointer"
            title="View logo across all products in a showcase grid"
          >
            <Grid className="w-4 h-4 text-gray-600" />
            <span className="hidden md:inline">Showcase Grid</span>
            <span className="md:hidden">Grid</span>
          </button>

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gray-900 hover:bg-black text-white transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
