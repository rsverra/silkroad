/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ProductType, LogoTransform } from './types/mockup';
import { PRODUCT_CONFIGS } from './utils/productConfigs';
import { SAMPLE_LOGOS } from './utils/sampleLogos';
import { Header } from './components/Header';
import { ProductSelector } from './components/ProductSelector';
import { MockupCanvas } from './components/MockupCanvas';
import { LogoControls } from './components/LogoControls';
import { ProductCustomizer } from './components/ProductCustomizer';
import { AiImageStudio } from './components/AiImageStudio';
import { AllProductsGrid } from './components/AllProductsGrid';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [currentProduct, setCurrentProduct] = useState<ProductType>('mug');
  const [currentColor, setCurrentColor] = useState<string>(PRODUCT_CONFIGS.mug.defaultColor);

  // Pre-load with curated artisan logo so the mockup is gorgeous right away
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(SAMPLE_LOGOS[0].url);
  const [logoName, setLogoName] = useState<string>(SAMPLE_LOGOS[0].name);
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);

  // Transform parameters for placement, rotation, scale, blend mode, and color filter
  const [transform, setTransform] = useState<LogoTransform>({
    x: 0,
    y: 0,
    scale: 1.0,
    rotation: 0,
    opacity: 0.95,
    blendMode: 'multiply',
    colorFilter: 'original',
    removeBgTolerance: 0,
  });

  // Apparel view (front / back)
  const [isBackView, setIsBackView] = useState<boolean>(false);

  // Realism toggles
  const [showTexture, setShowTexture] = useState<boolean>(true);
  const [showLighting, setShowLighting] = useState<boolean>(true);

  // Modals
  const [isAiStudioOpen, setIsAiStudioOpen] = useState<boolean>(false);
  const [isAllProductsOpen, setIsAllProductsOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Load logoDataUrl into HTMLImageElement
  useEffect(() => {
    if (!logoDataUrl) {
      setLogoImage(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setLogoImage(img);
    };
    img.src = logoDataUrl;
  }, [logoDataUrl]);

  // Update product selection and adjust defaults if necessary
  const handleSelectProduct = (newProduct: ProductType) => {
    setCurrentProduct(newProduct);
    setCurrentColor(PRODUCT_CONFIGS[newProduct].defaultColor);
    setIsBackView(false);

    // If switching to mug or water bottle, default to cylinder warp friendly settings
    if (newProduct === 'mug' || newProduct === 'waterbottle') {
      setTransform((prev) => ({
        ...prev,
        x: 0,
        y: 0,
        scale: 1.0,
      }));
    }
  };

  const handleUpdateTransform = (partial: Partial<LogoTransform>) => {
    setTransform((prev) => ({ ...prev, ...partial }));
  };

  const handleSelectLogo = (url: string, name: string) => {
    setLogoDataUrl(url);
    setLogoName(name);
  };

  const handleClearLogo = () => {
    setLogoDataUrl(null);
    setLogoName('');
    setLogoImage(null);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100 font-sans text-gray-900">
      {/* 1. Header */}
      <Header
        onOpenAiStudio={() => setIsAiStudioOpen(true)}
        onOpenAllProducts={() => setIsAllProductsOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        activeLogoName={logoName}
        hasLogo={Boolean(logoDataUrl)}
      />

      {/* 2. Product Selector Carousel */}
      <ProductSelector
        currentProduct={currentProduct}
        onSelectProduct={handleSelectProduct}
      />

      {/* 3. Main Workspace: Canvas & Controls */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Interactive Canvas Center */}
        <MockupCanvas
          product={currentProduct}
          color={currentColor}
          logoImage={logoImage}
          transform={transform}
          onUpdateTransform={handleUpdateTransform}
          isBackView={isBackView}
          onToggleBackView={() => setIsBackView(!isBackView)}
          showTexture={showTexture}
          onToggleTexture={() => setShowTexture(!showTexture)}
          showLighting={showLighting}
          onToggleLighting={() => setShowLighting(!showLighting)}
        />

        {/* Right Sidebar: Logo Upload & Fine-tune Controls */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-gray-200 bg-white overflow-hidden flex flex-col shrink-0 shadow-xs">
          <LogoControls
            logoImage={logoImage}
            logoDataUrl={logoDataUrl}
            logoName={logoName}
            transform={transform}
            onUpdateTransform={handleUpdateTransform}
            onSelectLogo={handleSelectLogo}
            onClearLogo={handleClearLogo}
            onOpenAiStudio={() => setIsAiStudioOpen(true)}
          />
        </div>
      </div>

      {/* 4. Bottom Customizer: Colors & Realism */}
      <ProductCustomizer
        product={currentProduct}
        currentColor={currentColor}
        onSelectColor={setCurrentColor}
        showTexture={showTexture}
        onToggleTexture={() => setShowTexture(!showTexture)}
        showLighting={showLighting}
        onToggleLighting={() => setShowLighting(!showLighting)}
      />

      {/* Modal: AI Artwork Studio (gemini-3-pro-image-preview & gemini-nano-banana-2.1) */}
      <AiImageStudio
        isOpen={isAiStudioOpen}
        onClose={() => setIsAiStudioOpen(false)}
        activeLogoUrl={logoDataUrl}
        onApplyGeneratedLogo={(url, name) => {
          handleSelectLogo(url, name);
        }}
      />

      {/* Modal: Showcase Grid (View logo across all products) */}
      <AllProductsGrid
        isOpen={isAllProductsOpen}
        onClose={() => setIsAllProductsOpen(false)}
        logoImage={logoImage}
        transform={transform}
        onSelectProduct={handleSelectProduct}
      />

      {/* Modal: High-Res Export (1K, 2K, 4K) */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        product={currentProduct}
        color={currentColor}
        logoImage={logoImage}
        transform={transform}
        isBackView={isBackView}
        showTexture={showTexture}
        showLighting={showLighting}
      />
    </div>
  );
}
