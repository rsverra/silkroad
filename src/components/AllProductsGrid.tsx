import React, { useRef, useEffect } from 'react';
import { ProductType, LogoTransform } from '../types/mockup';
import { PRODUCT_CONFIGS } from '../utils/productConfigs';
import { renderMockupToCanvas } from '../utils/canvasRenderer';
import { X, ExternalLink, Download, Layers } from 'lucide-react';

interface AllProductsGridProps {
  isOpen: boolean;
  onClose: () => void;
  logoImage: HTMLImageElement | null;
  transform: LogoTransform;
  onSelectProduct: (product: ProductType) => void;
}

export const AllProductsGrid: React.FC<AllProductsGridProps> = ({
  isOpen,
  onClose,
  logoImage,
  transform,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const products = Object.values(PRODUCT_CONFIGS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Merchandise Lineup Showcase</h2>
              <p className="text-xs text-gray-500">
                Your logo rendered simultaneously across all 9 photorealistic products
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

        {/* 3x3 Grid of All Products */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <ProductGridCard
                key={product.id}
                productType={product.id}
                logoImage={logoImage}
                transform={transform}
                onSelect={() => {
                  onSelectProduct(product.id);
                  onClose();
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProductGridCardProps {
  productType: ProductType;
  logoImage: HTMLImageElement | null;
  transform: LogoTransform;
  onSelect: () => void;
}

const ProductGridCard: React.FC<ProductGridCardProps> = ({
  productType,
  logoImage,
  transform,
  onSelect,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const config = PRODUCT_CONFIGS[productType];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 600;
    canvas.height = 600;

    renderMockupToCanvas(canvas, {
      product: productType,
      color: config.defaultColor,
      logoImage,
      transform,
      showTexture: true,
      showLighting: true,
    });
  }, [productType, config.defaultColor, logoImage, transform]);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${productType}-mockup.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      onClick={onSelect}
      className="group bg-white rounded-2xl border border-gray-200 hover:border-indigo-400 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
    >
      <div className="relative aspect-square w-full bg-gray-50 flex items-center justify-center p-3 overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full object-contain" />
        <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="bg-white/95 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 backdrop-blur-xs">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Customize Product</span>
          </span>
        </div>
      </div>

      <div className="p-3.5 flex items-center justify-between border-t border-gray-100 bg-white">
        <div>
          <h3 className="text-xs font-bold text-gray-900">{config.name}</h3>
          <p className="text-[11px] text-gray-400">{config.category}</p>
        </div>
        <button
          onClick={handleDownload}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          title="Download PNG"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
