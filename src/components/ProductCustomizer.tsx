import React from 'react';
import { ProductType } from '../types/mockup';
import { PRODUCT_CONFIGS } from '../utils/productConfigs';
import { Palette, Sun, Sparkles, Check, Info } from 'lucide-react';

interface ProductCustomizerProps {
  product: ProductType;
  currentColor: string;
  onSelectColor: (color: string) => void;
  showTexture: boolean;
  onToggleTexture: () => void;
  showLighting: boolean;
  onToggleLighting: () => void;
}

export const ProductCustomizer: React.FC<ProductCustomizerProps> = ({
  product,
  currentColor,
  onSelectColor,
  showTexture,
  onToggleTexture,
  showLighting,
  onToggleLighting,
}) => {
  const config = PRODUCT_CONFIGS[product];

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Color Palette Swatches */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5 text-gray-400" />
            <span>Product Color:</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {config.colors.map((c) => {
              const isSelected = currentColor.toLowerCase() === c.hex.toLowerCase();
              return (
                <button
                  key={c.hex}
                  onClick={() => onSelectColor(c.hex)}
                  className={`w-7 h-7 rounded-full transition-transform border flex items-center justify-center cursor-pointer shadow-xs ${
                    isSelected
                      ? 'scale-115 ring-2 ring-offset-2 ring-indigo-500 border-gray-400'
                      : 'hover:scale-105 border-gray-300'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={`${c.name} (${c.hex})`}
                >
                  {isSelected && (
                    <Check
                      className="w-3.5 h-3.5"
                      style={{ color: c.textColor || '#FFFFFF' }}
                    />
                  )}
                </button>
              );
            })}

            {/* Custom Color Input */}
            <div className="relative flex items-center ml-1">
              <input
                type="color"
                value={currentColor}
                onChange={(e) => onSelectColor(e.target.value)}
                className="w-7 h-7 rounded-full border border-gray-300 cursor-pointer overflow-hidden p-0"
                title="Choose custom hex color"
              />
            </div>
          </div>
        </div>

        {/* Realism Toggles */}
        <div className="flex items-center gap-3">
          {/* Surface Texture */}
          <button
            onClick={onToggleTexture}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              showTexture
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fabric / Surface Folds</span>
          </button>

          {/* Studio Lighting */}
          <button
            onClick={onToggleLighting}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              showLighting
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Studio Lighting &amp; Reflections</span>
          </button>
        </div>
      </div>
    </div>
  );
};
