import React, { useState } from 'react';
import { ProductType } from '../types/mockup';
import { PRODUCT_CONFIGS } from '../utils/productConfigs';
import { Coffee, Shirt, ShoppingBag, Droplets, HardHat, BookOpen, Smartphone, Sparkles, Tag } from 'lucide-react';

interface ProductSelectorProps {
  currentProduct: ProductType;
  onSelectProduct: (product: ProductType) => void;
}

const PRODUCT_ICONS: Record<ProductType, React.ReactNode> = {
  mug: <Coffee className="w-4 h-4" />,
  tshirt: <Shirt className="w-4 h-4" />,
  hoodie: <Shirt className="w-4 h-4" />,
  tote: <ShoppingBag className="w-4 h-4" />,
  waterbottle: <Droplets className="w-4 h-4" />,
  cap: <HardHat className="w-4 h-4" />,
  notebook: <BookOpen className="w-4 h-4" />,
  phonecase: <Smartphone className="w-4 h-4" />,
  sticker: <Tag className="w-4 h-4" />,
};

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  currentProduct,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const products = Object.values(PRODUCT_CONFIGS);

  const categories = ['All', 'Apparel', 'Drinkware', 'Accessories', 'Stationery'];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-gray-400 font-medium px-1 mr-1">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filteredProducts.map((p) => {
            const isSelected = p.id === currentProduct;
            return (
              <button
                key={p.id}
                onClick={() => onSelectProduct(p.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-xs ring-1 ring-indigo-400/30'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span
                  className={`p-1.5 rounded-lg ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {PRODUCT_ICONS[p.id]}
                </span>
                <span>{p.name}</span>
                {p.id === 'mug' && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-sm ml-0.5">
                    3D Warp
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
