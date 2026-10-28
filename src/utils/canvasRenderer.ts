import { ProductType, LogoTransform, BlendMode } from '../types/mockup';
import { PRODUCT_CONFIGS } from './productConfigs';

export interface RenderOptions {
  product: ProductType;
  color: string;
  logoImage: HTMLImageElement | null;
  transform: LogoTransform;
  isBackView?: boolean;
  showTexture?: boolean;
  showLighting?: boolean;
  showWireframe?: boolean;
}

/**
 * Smart background remover: samples background color and clears matching pixels
 */
export function removeImageBackground(
  img: HTMLImageElement,
  tolerance: number = 20
): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = img.naturalWidth || img.width;
  c.height = img.naturalHeight || img.height;
  const ctx = c.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, c.width, c.height);
  const data = imgData.data;

  // Sample the 4 corners to detect dominant background color
  const corners = [
    0, // top-left
    (c.width - 1) * 4, // top-right
    (c.height - 1) * c.width * 4, // bottom-left
    ((c.height - 1) * c.width + c.width - 1) * 4, // bottom-right
  ];

  let bgR = 0, bgG = 0, bgB = 0;
  for (const idx of corners) {
    bgR += data[idx];
    bgG += data[idx + 1];
    bgB += data[idx + 2];
  }
  bgR = Math.round(bgR / 4);
  bgG = Math.round(bgG / 4);
  bgB = Math.round(bgB / 4);

  const tolSq = (tolerance * 2.55) ** 2 * 3;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a === 0) continue;

    const diff = (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2;
    if (diff < tolSq) {
      // Soft alpha falloff near boundary
      const factor = diff / tolSq;
      if (factor < 0.6) {
        data[i + 3] = 0;
      } else {
        data[i + 3] = Math.round(a * (factor - 0.6) / 0.4);
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return c;
}

/**
 * Filter image to pure white, pure black, gold, or custom tint
 */
export function applyLogoFilter(
  source: HTMLCanvasElement | HTMLImageElement,
  filterType: 'original' | 'white' | 'black' | 'gold' | 'custom',
  customHex?: string
): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = source instanceof HTMLImageElement ? (source.naturalWidth || source.width) : source.width;
  c.height = source instanceof HTMLImageElement ? (source.naturalHeight || source.height) : source.height;
  const ctx = c.getContext('2d')!;

  ctx.drawImage(source, 0, 0);
  if (filterType === 'original') return c;

  const imgData = ctx.getImageData(0, 0, c.width, c.height);
  const data = imgData.data;

  let targetR = 255, targetG = 255, targetB = 255;
  if (filterType === 'black') {
    targetR = 25; targetG = 25; targetB = 25;
  } else if (filterType === 'gold') {
    targetR = 212; targetG = 175; targetB = 55;
  } else if (filterType === 'custom' && customHex) {
    const hex = customHex.replace('#', '');
    targetR = parseInt(hex.substring(0, 2), 16) || 255;
    targetG = parseInt(hex.substring(2, 4), 16) || 255;
    targetB = parseInt(hex.substring(4, 6), 16) || 255;
  }

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha > 0) {
      data[i] = targetR;
      data[i + 1] = targetG;
      data[i + 2] = targetB;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return c;
}

/**
 * Master render function that draws the entire photorealistic mockup
 */
export function renderMockupToCanvas(
  canvas: HTMLCanvasElement,
  options: RenderOptions
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, w, h);

  // 1. Draw subtle studio environment & lighting
  drawStudioBackdrop(ctx, w, h);

  // 2. Draw ground contact shadow
  drawContactShadow(ctx, w, h, options.product);

  // 3. Render specific product base
  ctx.save();
  switch (options.product) {
    case 'mug':
      renderCeramicMug(ctx, w, h, options);
      break;
    case 'tshirt':
      renderTShirt(ctx, w, h, options);
      break;
    case 'hoodie':
      renderHoodie(ctx, w, h, options);
      break;
    case 'tote':
      renderToteBag(ctx, w, h, options);
      break;
    case 'waterbottle':
      renderWaterBottle(ctx, w, h, options);
      break;
    case 'cap':
      renderCap(ctx, w, h, options);
      break;
    case 'notebook':
      renderNotebook(ctx, w, h, options);
      break;
    case 'phonecase':
      renderPhoneCase(ctx, w, h, options);
      break;
    case 'sticker':
      renderSticker(ctx, w, h, options);
      break;
  }
  ctx.restore();
}

/**
 * Studio backdrop with gentle radial lighting gradient
 */
function drawStudioBackdrop(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const grad = ctx.createRadialGradient(w * 0.5, h * 0.45, w * 0.1, w * 0.5, h * 0.5, w * 0.75);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.5, '#F8F9FA');
  grad.addColorStop(1, '#E9ECEF');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Subtle clean grid floor horizon line
  ctx.strokeStyle = 'rgba(0,0,0,0.03)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, h * 0.78);
  ctx.lineTo(w, h * 0.78);
  ctx.stroke();
}

/**
 * Realistic soft contact shadow beneath product
 */
function drawContactShadow(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  product: ProductType
) {
  ctx.save();
  let shadowY = h * 0.78;
  let shadowW = w * 0.38;
  let shadowH = h * 0.05;

  if (product === 'tshirt' || product === 'hoodie') {
    shadowY = h * 0.82;
    shadowW = w * 0.48;
    shadowH = h * 0.06;
  } else if (product === 'waterbottle') {
    shadowY = h * 0.81;
    shadowW = w * 0.24;
    shadowH = h * 0.04;
  } else if (product === 'phonecase' || product === 'notebook') {
    shadowY = h * 0.77;
    shadowW = w * 0.34;
    shadowH = h * 0.07;
  } else if (product === 'sticker') {
    shadowY = h * 0.72;
    shadowW = w * 0.42;
    shadowH = h * 0.08;
  }

  const grad = ctx.createRadialGradient(w * 0.5, shadowY, 0, w * 0.5, shadowY, shadowW * 0.5);
  grad.addColorStop(0, 'rgba(15, 23, 42, 0.22)');
  grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.08)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(w * 0.5, shadowY, shadowW * 0.5, shadowH * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * CERAMIC MUG RENDERER
 */
function renderCeramicMug(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  options: RenderOptions
) {
  const cx = w * 0.48;
  const cy = h * 0.50;
  const mugW = w * 0.36;
  const mugH = h * 0.40;
  const left = cx - mugW / 2;
  const right = cx + mugW / 2;
  const top = cy - mugH / 2;
  const bottom = cy + mugH / 2;
  const rimH = mugH * 0.12;

  // 1. Draw Mug Handle (behind and to the right)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(right - mugW * 0.08, top + mugH * 0.22);
  ctx.bezierCurveTo(
    right + mugW * 0.44, top + mugH * 0.20,
    right + mugW * 0.44, bottom - mugH * 0.22,
    right - mugW * 0.08, bottom - mugH * 0.24
  );
  ctx.lineWidth = mugW * 0.15;
  ctx.lineCap = 'round';
  ctx.strokeStyle = options.color;
  ctx.stroke();

  // Handle inner shadow & rim highlight
  ctx.lineWidth = mugW * 0.14;
  ctx.strokeStyle = 'rgba(0,0,0,0.14)';
  ctx.stroke();

  // Highlight on handle curve
  ctx.beginPath();
  ctx.moveTo(right - mugW * 0.08, top + mugH * 0.22);
  ctx.bezierCurveTo(
    right + mugW * 0.42, top + mugH * 0.20,
    right + mugW * 0.42, bottom - mugH * 0.22,
    right - mugW * 0.08, bottom - mugH * 0.24
  );
  ctx.lineWidth = mugW * 0.04;
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.stroke();
  ctx.restore();

  // 2. Draw Mug Body Path
  ctx.save();
  ctx.beginPath();
  // Start top-left
  ctx.moveTo(left, top + rimH / 2);
  // Bottom-left
  ctx.lineTo(left + mugW * 0.03, bottom - rimH / 2);
  // Bottom curved ellipse
  ctx.ellipse(cx, bottom - rimH / 2, mugW * 0.47, rimH * 0.5, 0, Math.PI, 0, true);
  // Bottom-right to top-right
  ctx.lineTo(right, top + rimH / 2);
  // Top rim outer ellipse
  ctx.ellipse(cx, top + rimH / 2, mugW * 0.5, rimH * 0.5, 0, 0, Math.PI, true);
  ctx.closePath();

  // Mug Body Base Fill
  ctx.fillStyle = options.color;
  ctx.fill();

  // Clip to mug body for textures and logo placement!
  ctx.clip();

  // Shading gradient (ambient occlusion on sides, highlight in center-left)
  const bodyGrad = ctx.createLinearGradient(left, 0, right, 0);
  bodyGrad.addColorStop(0.0, 'rgba(0,0,0,0.35)');
  bodyGrad.addColorStop(0.12, 'rgba(0,0,0,0.08)');
  bodyGrad.addColorStop(0.35, 'rgba(255,255,255,0.4)');
  bodyGrad.addColorStop(0.65, 'rgba(255,255,255,0.0)');
  bodyGrad.addColorStop(0.9, 'rgba(0,0,0,0.18)');
  bodyGrad.addColorStop(1.0, 'rgba(0,0,0,0.42)');
  ctx.fillStyle = bodyGrad;
  ctx.fillRect(left - 20, top - 20, mugW + 40, mugH + 40);

  // 3. Draw Logo with Cylindrical Warp
  if (options.logoImage) {
    const printConfig = PRODUCT_CONFIGS.mug.printArea;
    const printCenterX = left + mugW * 0.5 + (options.transform.x / 100) * mugW;
    const printCenterY = top + mugH * 0.5 + (options.transform.y / 100) * mugH;
    const printWidth = mugW * 0.55 * options.transform.scale;
    const printHeight = mugW * 0.55 * options.transform.scale;

    renderWarpedLogo(
      ctx,
      options.logoImage,
      printCenterX,
      printCenterY,
      printWidth,
      printHeight,
      options.transform,
      'cylinder',
      0.35
    );
  }

  // Glossy reflection stripe on ceramic
  if (options.showLighting) {
    const gloss = ctx.createLinearGradient(left, 0, right, 0);
    gloss.addColorStop(0.24, 'rgba(255,255,255,0)');
    gloss.addColorStop(0.28, 'rgba(255,255,255,0.35)');
    gloss.addColorStop(0.33, 'rgba(255,255,255,0)');
    ctx.fillStyle = gloss;
    ctx.fillRect(left, top, mugW, mugH);
  }
  ctx.restore();

  // 4. Mug Top Rim & Interior
  ctx.save();
  // Interior cup cavity
  ctx.beginPath();
  ctx.ellipse(cx, top + rimH / 2, mugW * 0.48, rimH * 0.44, 0, 0, Math.PI * 2);
  const intGrad = ctx.createLinearGradient(0, top, 0, top + rimH);
  intGrad.addColorStop(0, 'rgba(0,0,0,0.4)');
  intGrad.addColorStop(0.5, 'rgba(0,0,0,0.18)');
  intGrad.addColorStop(1, options.color);
  ctx.fillStyle = intGrad;
  ctx.fill();

  // Rim lip edge highlight
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.stroke();
  ctx.restore();
}

/**
 * COTTON T-SHIRT RENDERER
 */
function renderTShirt(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  options: RenderOptions
) {
  const cx = w * 0.5;
  const cy = h * 0.48;
  const shirtW = w * 0.56;
  const shirtH = h * 0.62;
  const left = cx - shirtW / 2;
  const right = cx + shirtW / 2;
  const top = cy - shirtH / 2;
  const bottom = cy + shirtH / 2;

  ctx.save();

  // Draw T-Shirt Outline
  ctx.beginPath();
  // Collar Left
  ctx.moveTo(cx - shirtW * 0.16, top + shirtH * 0.05);
  // Left Shoulder
  ctx.lineTo(left + shirtW * 0.08, top + shirtH * 0.12);
  // Left Sleeve Outer Edge
  ctx.lineTo(left, top + shirtH * 0.32);
  // Left Sleeve Cuff Opening
  ctx.lineTo(left + shirtW * 0.13, top + shirtH * 0.38);
  // Left Armpit
  ctx.lineTo(cx - shirtW * 0.28, top + shirtH * 0.32);
  // Left Torso Side Seam (subtle taper)
  ctx.bezierCurveTo(
    cx - shirtW * 0.27, top + shirtH * 0.55,
    cx - shirtW * 0.29, top + shirtH * 0.85,
    cx - shirtW * 0.29, bottom
  );
  // Bottom Hem
  ctx.bezierCurveTo(
    cx - shirtW * 0.15, bottom + shirtH * 0.02,
    cx + shirtW * 0.15, bottom + shirtH * 0.02,
    cx + shirtW * 0.29, bottom
  );
  // Right Torso Side Seam
  ctx.bezierCurveTo(
    cx + shirtW * 0.29, top + shirtH * 0.85,
    cx + shirtW * 0.27, top + shirtH * 0.55,
    cx + shirtW * 0.28, top + shirtH * 0.32
  );
  // Right Sleeve Inner Armpit to Cuff
  ctx.lineTo(right - shirtW * 0.13, top + shirtH * 0.38);
  // Right Sleeve Outer Edge
  ctx.lineTo(right, top + shirtH * 0.32);
  // Right Shoulder
  ctx.lineTo(cx + shirtW * 0.16, top + shirtH * 0.05);
  // Collar Dip (front neckline)
  if (!options.isBackView) {
    ctx.bezierCurveTo(
      cx + shirtW * 0.11, top + shirtH * 0.14,
      cx - shirtW * 0.11, top + shirtH * 0.14,
      cx - shirtW * 0.16, top + shirtH * 0.05
    );
  } else {
    // Back Collar Dip (shallower)
    ctx.bezierCurveTo(
      cx + shirtW * 0.10, top + shirtH * 0.07,
      cx - shirtW * 0.10, top + shirtH * 0.07,
      cx - shirtW * 0.16, top + shirtH * 0.05
    );
  }
  ctx.closePath();

  // Base Garment Fill
  ctx.fillStyle = options.color;
  ctx.fill();

  // Garment Texture & Fold Clip
  ctx.clip();

  // Natural fabric lighting gradient
  const fabricLight = ctx.createRadialGradient(cx, top + shirtH * 0.35, 10, cx, top + shirtH * 0.45, shirtW * 0.65);
  fabricLight.addColorStop(0, 'rgba(255,255,255,0.18)');
  fabricLight.addColorStop(0.6, 'rgba(0,0,0,0.04)');
  fabricLight.addColorStop(1, 'rgba(0,0,0,0.22)');
  ctx.fillStyle = fabricLight;
  ctx.fillRect(left - 20, top - 20, shirtW + 40, shirtH + 60);

  // Fabric creases & drape shadows
  if (options.showTexture) {
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 3;
    // Left armpit crease
    ctx.beginPath();
    ctx.moveTo(cx - shirtW * 0.28, top + shirtH * 0.32);
    ctx.quadraticCurveTo(cx - shirtW * 0.20, top + shirtH * 0.38, cx - shirtW * 0.24, top + shirtH * 0.52);
    ctx.stroke();

    // Right armpit crease
    ctx.beginPath();
    ctx.moveTo(cx + shirtW * 0.28, top + shirtH * 0.32);
    ctx.quadraticCurveTo(cx + shirtW * 0.20, top + shirtH * 0.38, cx + shirtW * 0.24, top + shirtH * 0.52);
    ctx.stroke();

    // Side drape subtle folds
    ctx.beginPath();
    ctx.moveTo(cx - shirtW * 0.22, top + shirtH * 0.65);
    ctx.quadraticCurveTo(cx - shirtW * 0.18, top + shirtH * 0.78, cx - shirtW * 0.20, bottom - 10);
    ctx.stroke();
  }

  // 3. Render Logo onto chest / back area
  if (options.logoImage) {
    const printCenterX = cx + (options.transform.x / 100) * shirtW * 0.6;
    const printCenterY = top + shirtH * 0.42 + (options.transform.y / 100) * shirtH * 0.5;
    const printWidth = shirtW * 0.45 * options.transform.scale;
    const printHeight = shirtW * 0.45 * options.transform.scale;

    renderWarpedLogo(
      ctx,
      options.logoImage,
      printCenterX,
      printCenterY,
      printWidth,
      printHeight,
      options.transform,
      'fabric',
      0
    );
  }

  ctx.restore();

  // 4. Collar Ribbing detail
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - shirtW * 0.16, top + shirtH * 0.05);
  ctx.bezierCurveTo(
    cx - shirtW * 0.11, top + shirtH * 0.14,
    cx + shirtW * 0.11, top + shirtH * 0.14,
    cx + shirtW * 0.16, top + shirtH * 0.05
  );
  ctx.lineWidth = shirtH * 0.032;
  ctx.strokeStyle = options.color;
  ctx.stroke();

  // Collar shadow/ribbing line
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Interior neck label view
  if (!options.isBackView) {
    ctx.beginPath();
    ctx.ellipse(cx, top + shirtH * 0.065, shirtW * 0.06, shirtH * 0.02, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fill();
  }
  ctx.restore();
}

/**
 * HOODIE RENDERER
 */
function renderHoodie(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  options: RenderOptions
) {
  const cx = w * 0.5;
  const cy = h * 0.50;
  const hoodieW = w * 0.60;
  const hoodieH = h * 0.64;
  const left = cx - hoodieW / 2;
  const right = cx + hoodieW / 2;
  const top = cy - hoodieH / 2;
  const bottom = cy + hoodieH / 2;

  ctx.save();

  // 1. Hood Shape (top)
  ctx.beginPath();
  ctx.moveTo(cx - hoodieW * 0.18, top + hoodieH * 0.18);
  ctx.bezierCurveTo(
    cx - hoodieW * 0.22, top - hoodieH * 0.02,
    cx + hoodieW * 0.22, top - hoodieH * 0.02,
    cx + hoodieW * 0.18, top + hoodieH * 0.18
  );
  ctx.fillStyle = options.color;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Hood Interior Depth
  ctx.beginPath();
  ctx.ellipse(cx, top + hoodieH * 0.14, hoodieW * 0.12, hoodieH * 0.08, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fill();

  // 2. Hoodie Torso & Sleeves
  ctx.beginPath();
  ctx.moveTo(cx - hoodieW * 0.18, top + hoodieH * 0.18);
  ctx.lineTo(left + hoodieW * 0.10, top + hoodieH * 0.22);
  ctx.lineTo(left, top + hoodieH * 0.56);
  ctx.lineTo(left + hoodieW * 0.11, top + hoodieH * 0.60);
  ctx.lineTo(cx - hoodieW * 0.30, top + hoodieH * 0.45);
  ctx.lineTo(cx - hoodieW * 0.31, bottom);
  // Ribbed Waistband
  ctx.lineTo(cx + hoodieW * 0.31, bottom);
  ctx.lineTo(cx + hoodieW * 0.30, top + hoodieH * 0.45);
  ctx.lineTo(right - hoodieW * 0.11, top + hoodieH * 0.60);
  ctx.lineTo(right, top + hoodieH * 0.56);
  ctx.lineTo(cx + hoodieW * 0.18, top + hoodieH * 0.18);
  ctx.closePath();

  ctx.fillStyle = options.color;
  ctx.fill();
  ctx.clip();

  // Lighting & fabric gradient
  const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, hoodieW * 0.6);
  grad.addColorStop(0, 'rgba(255,255,255,0.15)');
  grad.addColorStop(0.7, 'rgba(0,0,0,0.08)');
  grad.addColorStop(1, 'rgba(0,0,0,0.28)');
  ctx.fillStyle = grad;
  ctx.fillRect(left - 20, top - 20, hoodieW + 40, hoodieH + 40);

  // Kangaroo Pocket (front view)
  if (!options.isBackView) {
    const pocketY = bottom - hoodieH * 0.30;
    const pocketW = hoodieW * 0.40;
    const pocketH = hoodieH * 0.20;
    ctx.beginPath();
    ctx.moveTo(cx - pocketW / 2 + pocketW * 0.15, pocketY);
    ctx.lineTo(cx + pocketW / 2 - pocketW * 0.15, pocketY);
    ctx.lineTo(cx + pocketW / 2, pocketY + pocketH);
    ctx.lineTo(cx - pocketW / 2, pocketY + pocketH);
    ctx.closePath();

    ctx.fillStyle = options.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.16)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Pocket Stitching Line
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 3. Draw Logo
  if (options.logoImage) {
    const printCenterX = cx + (options.transform.x / 100) * hoodieW * 0.5;
    const printCenterY = top + hoodieH * 0.38 + (options.transform.y / 100) * hoodieH * 0.4;
    const printWidth = hoodieW * 0.42 * options.transform.scale;
    const printHeight = hoodieW * 0.42 * options.transform.scale;

    renderWarpedLogo(
      ctx,
      options.logoImage,
      printCenterX,
      printCenterY,
      printWidth,
      printHeight,
      options.transform,
      'fabric',
      0
    );
  }

  ctx.restore();

  // Draw Drawstrings hanging from hood
  if (!options.isBackView) {
    ctx.save();
    ctx.strokeStyle = '#F3F4F6';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    // Left string
    ctx.beginPath();
    ctx.moveTo(cx - hoodieW * 0.06, top + hoodieH * 0.20);
    ctx.quadraticCurveTo(cx - hoodieW * 0.08, top + hoodieH * 0.30, cx - hoodieW * 0.05, top + hoodieH * 0.36);
    ctx.stroke();
    // Metal aglet
    ctx.fillStyle = '#9CA3AF';
    ctx.fillRect(cx - hoodieW * 0.058, top + hoodieH * 0.355, 6, 12);

    // Right string
    ctx.beginPath();
    ctx.moveTo(cx + hoodieW * 0.06, top + hoodieH * 0.20);
    ctx.quadraticCurveTo(cx + hoodieW * 0.08, top + hoodieH * 0.28, cx + hoodieW * 0.06, top + hoodieH * 0.37);
    ctx.stroke();
    ctx.fillRect(cx + hoodieW * 0.052, top + hoodieH * 0.365, 6, 12);
    ctx.restore();
  }
}

/**
 * CANVAS TOTE BAG RENDERER
 */
function renderToteBag(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  options: RenderOptions
) {
  const cx = w * 0.5;
  const cy = h * 0.54;
  const toteW = w * 0.48;
  const toteH = h * 0.50;
  const left = cx - toteW / 2;
  const right = cx + toteW / 2;
  const top = cy - toteH / 2;
  const bottom = cy + toteH / 2;

  // 1. Straps
  ctx.save();
  ctx.lineWidth = toteW * 0.07;
  ctx.lineCap = 'round';
  ctx.strokeStyle = options.color;

  // Draw twin handle loops
  ctx.beginPath();
  ctx.moveTo(cx - toteW * 0.24, top + toteH * 0.08);
  ctx.bezierCurveTo(cx - toteW * 0.26, top - toteH * 0.52, cx + toteW * 0.26, top - toteH * 0.52, cx + toteW * 0.24, top + toteH * 0.08);
  ctx.stroke();

  // Strap edge stitching detail
  ctx.lineWidth = toteW * 0.065;
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.stroke();
  ctx.restore();

  // 2. Tote Bag Body
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left + toteW * 0.02, bottom);
  ctx.lineTo(right - toteW * 0.02, bottom);
  ctx.lineTo(right, top);
  ctx.closePath();

  ctx.fillStyle = options.color;
  ctx.fill();
  ctx.clip();

  // Textured canvas cross-weave and shading
  const grad = ctx.createLinearGradient(left, top, right, bottom);
  grad.addColorStop(0, 'rgba(255,255,255,0.15)');
  grad.addColorStop(0.5, 'rgba(0,0,0,0.02)');
  grad.addColorStop(1, 'rgba(0,0,0,0.16)');
  ctx.fillStyle = grad;
  ctx.fillRect(left - 10, top - 10, toteW + 20, toteH + 20);

  // Soft vertical canvas crease folds
  if (options.showTexture) {
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - toteW * 0.16, top);
    ctx.lineTo(cx - toteW * 0.14, bottom);
    ctx.moveTo(cx + toteW * 0.16, top);
    ctx.lineTo(cx + toteW * 0.14, bottom);
    ctx.stroke();
  }

  // 3. Render Logo
  if (options.logoImage) {
    const printCenterX = cx + (options.transform.x / 100) * toteW * 0.6;
    const printCenterY = cy + (options.transform.y / 100) * toteH * 0.6;
    const printWidth = toteW * 0.55 * options.transform.scale;
    const printHeight = toteW * 0.55 * options.transform.scale;

    renderWarpedLogo(
      ctx,
      options.logoImage,
      printCenterX,
      printCenterY,
      printWidth,
      printHeight,
      options.transform,
      'fabric',
      0
    );
  }

  ctx.restore();

  // Hem hemline top stitch
  ctx.save();
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(left, top + toteH * 0.06);
  ctx.lineTo(right, top + toteH * 0.06);
  ctx.stroke();
  ctx.restore();
}

/**
 * INSULATED WATER BOTTLE RENDERER
 */
function renderWaterBottle(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  options: RenderOptions
) {
  const cx = w * 0.5;
  const cy = h * 0.50;
  const bottleW = w * 0.26;
  const bottleH = h * 0.60;
  const left = cx - bottleW / 2;
  const right = cx + bottleW / 2;
  const top = cy - bottleH / 2;
  const bottom = cy + bottleH / 2;

  // 1. Stainless Steel Cap & Loop Handle
  ctx.save();
  // Loop handle
  ctx.beginPath();
  ctx.arc(cx, top - bottleH * 0.06, bottleW * 0.22, Math.PI, 0, false);
  ctx.lineWidth = bottleW * 0.12;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#94A3B8';
  ctx.stroke();

  // Cap screw base
  ctx.fillStyle = '#CBD5E1';
  ctx.beginPath();
  ctx.roundRect(cx - bottleW * 0.32, top - bottleH * 0.04, bottleW * 0.64, bottleH * 0.08, 6);
  ctx.fill();
  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // 2. Bottle Body
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(left, top + bottleH * 0.06);
  ctx.quadraticCurveTo(left, top + bottleH * 0.02, cx - bottleW * 0.36, top + bottleH * 0.02);
  ctx.lineTo(cx + bottleW * 0.36, top + bottleH * 0.02);
  ctx.quadraticCurveTo(right, top + bottleH * 0.02, right, top + bottleH * 0.06);
  ctx.lineTo(right, bottom - bottleH * 0.04);
  ctx.quadraticCurveTo(right, bottom, cx, bottom);
  ctx.quadraticCurveTo(left, bottom, left, bottom - bottleH * 0.04);
  ctx.closePath();

  ctx.fillStyle = options.color;
  ctx.fill();
  ctx.clip();

  // Cylindrical metallic reflections
  const metalGrad = ctx.createLinearGradient(left, 0, right, 0);
  metalGrad.addColorStop(0, 'rgba(0,0,0,0.38)');
  metalGrad.addColorStop(0.18, 'rgba(0,0,0,0.08)');
  metalGrad.addColorStop(0.32, 'rgba(255,255,255,0.45)');
  metalGrad.addColorStop(0.60, 'rgba(255,255,255,0.0)');
  metalGrad.addColorStop(0.85, 'rgba(0,0,0,0.22)');
  metalGrad.addColorStop(1, 'rgba(0,0,0,0.45)');
  ctx.fillStyle = metalGrad;
  ctx.fillRect(left - 10, top - 10, bottleW + 20, bottleH + 20);

  // 3. Render Logo with cylinder curvature
  if (options.logoImage) {
    const printCenterX = cx + (options.transform.x / 100) * bottleW;
    const printCenterY = cy + (options.transform.y / 100) * bottleH * 0.6;
    const printWidth = bottleW * 0.68 * options.transform.scale;
    const printHeight = bottleW * 0.68 * options.transform.scale;

    renderWarpedLogo(
      ctx,
      options.logoImage,
      printCenterX,
      printCenterY,
      printWidth,
      printHeight,
      options.transform,
      'cylinder',
      0.45
    );
  }

  ctx.restore();
}

/**
 * BASEBALL CAP / DAD HAT RENDERER
 */
function renderCap(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  options: RenderOptions
) {
  const cx = w * 0.5;
  const cy = h * 0.48;
  const capW = w * 0.52;
  const capH = h * 0.42;

  ctx.save();

  // 1. Crown (6-panel dome)
  ctx.beginPath();
  ctx.moveTo(cx - capW * 0.38, cy + capH * 0.12);
  ctx.bezierCurveTo(
    cx - capW * 0.40, cy - capH * 0.42,
    cx + capW * 0.40, cy - capH * 0.42,
    cx + capW * 0.38, cy + capH * 0.12
  );
  ctx.closePath();

  ctx.fillStyle = options.color;
  ctx.fill();
  ctx.clip();

  // Crown shading & 3D curvature
  const crownGrad = ctx.createRadialGradient(cx, cy - capH * 0.15, 10, cx, cy - capH * 0.05, capW * 0.45);
  crownGrad.addColorStop(0, 'rgba(255,255,255,0.25)');
  crownGrad.addColorStop(0.7, 'rgba(0,0,0,0.12)');
  crownGrad.addColorStop(1, 'rgba(0,0,0,0.38)');
  ctx.fillStyle = crownGrad;
  ctx.fillRect(cx - capW * 0.5, cy - capH * 0.6, capW, capH);

  // Panel seams
  ctx.strokeStyle = 'rgba(0,0,0,0.16)';
  ctx.lineWidth = 2;
  // Center seam
  ctx.beginPath();
  ctx.moveTo(cx, cy - capH * 0.38);
  ctx.lineTo(cx, cy + capH * 0.12);
  ctx.stroke();

  // 2. Render Logo on front crown
  if (options.logoImage) {
    const printCenterX = cx + (options.transform.x / 100) * capW * 0.4;
    const printCenterY = cy - capH * 0.06 + (options.transform.y / 100) * capH * 0.3;
    const printWidth = capW * 0.34 * options.transform.scale;
    const printHeight = capW * 0.34 * options.transform.scale;

    renderWarpedLogo(
      ctx,
      options.logoImage,
      printCenterX,
      printCenterY,
      printWidth,
      printHeight,
      options.transform,
      'emboss',
      0.15
    );
  }

  ctx.restore();

  // 3. Top Button
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy - capH * 0.38, capW * 0.035, 0, Math.PI * 2);
  ctx.fillStyle = options.color;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // 4. Curved Visor / Brim
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - capW * 0.42, cy + capH * 0.08);
  ctx.quadraticCurveTo(cx, cy + capH * 0.36, cx + capW * 0.42, cy + capH * 0.08);
  ctx.quadraticCurveTo(cx, cy + capH * 0.26, cx - capW * 0.42, cy + capH * 0.08);
  ctx.closePath();

  ctx.fillStyle = options.color;
  ctx.fill();

  const brimGrad = ctx.createLinearGradient(0, cy + capH * 0.08, 0, cy + capH * 0.36);
  brimGrad.addColorStop(0, 'rgba(0,0,0,0.28)');
  brimGrad.addColorStop(0.7, 'rgba(255,255,255,0.1)');
  brimGrad.addColorStop(1, 'rgba(0,0,0,0.25)');
  ctx.fillStyle = brimGrad;
  ctx.fill();
  ctx.restore();
}

/**
 * HARDCOVER JOURNAL RENDERER
 */
function renderNotebook(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  options: RenderOptions
) {
  const cx = w * 0.5;
  const cy = h * 0.50;
  const bookW = w * 0.42;
  const bookH = h * 0.58;
  const left = cx - bookW / 2;
  const top = cy - bookH / 2;

  ctx.save();
  // Pages edge shadow
  ctx.fillStyle = '#E5E7EB';
  ctx.fillRect(left + bookW * 0.05, top + 6, bookW * 0.96, bookH - 2);

  // Book Cover
  ctx.beginPath();
  ctx.roundRect(left, top, bookW, bookH, [12, 6, 6, 12]);
  ctx.fillStyle = options.color;
  ctx.fill();
  ctx.clip();

  // Spine ridge groove
  const spineW = bookW * 0.08;
  const spineGrad = ctx.createLinearGradient(left, 0, left + spineW * 1.5, 0);
  spineGrad.addColorStop(0, 'rgba(0,0,0,0.35)');
  spineGrad.addColorStop(0.5, 'rgba(255,255,255,0.2)');
  spineGrad.addColorStop(1, 'rgba(0,0,0,0.12)');
  ctx.fillStyle = spineGrad;
  ctx.fillRect(left, top, spineW * 1.5, bookH);

  // Cover Linen Texture and Shading
  const coverGrad = ctx.createLinearGradient(left, top, left + bookW, top + bookH);
  coverGrad.addColorStop(0, 'rgba(255,255,255,0.15)');
  coverGrad.addColorStop(0.6, 'rgba(0,0,0,0.0)');
  coverGrad.addColorStop(1, 'rgba(0,0,0,0.2)');
  ctx.fillStyle = coverGrad;
  ctx.fillRect(left, top, bookW, bookH);

  // 3. Render Logo (gold foil or debossed look)
  if (options.logoImage) {
    const printCenterX = left + bookW * 0.56 + (options.transform.x / 100) * bookW * 0.6;
    const printCenterY = cy + (options.transform.y / 100) * bookH * 0.6;
    const printWidth = bookW * 0.50 * options.transform.scale;
    const printHeight = bookW * 0.50 * options.transform.scale;

    renderWarpedLogo(
      ctx,
      options.logoImage,
      printCenterX,
      printCenterY,
      printWidth,
      printHeight,
      options.transform,
      'emboss',
      0
    );
  }

  ctx.restore();

  // Silk ribbon bookmark
  ctx.save();
  ctx.fillStyle = '#EF4444';
  ctx.beginPath();
  ctx.moveTo(cx + bookW * 0.15, top - 8);
  ctx.lineTo(cx + bookW * 0.18, top - 8);
  ctx.lineTo(cx + bookW * 0.20, top + bookH + 18);
  ctx.lineTo(cx + bookW * 0.165, top + bookH + 12);
  ctx.lineTo(cx + bookW * 0.13, top + bookH + 18);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * PHONE CASE RENDERER
 */
function renderPhoneCase(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  options: RenderOptions
) {
  const cx = w * 0.5;
  const cy = h * 0.50;
  const caseW = w * 0.36;
  const caseH = h * 0.62;
  const left = cx - caseW / 2;
  const top = cy - caseH / 2;

  ctx.save();

  // Rounded outer bumper
  ctx.beginPath();
  ctx.roundRect(left, top, caseW, caseH, 36);
  ctx.fillStyle = options.color;
  ctx.fill();
  ctx.clip();

  // Matte case lighting gradient
  const caseGrad = ctx.createLinearGradient(left, top, left + caseW, top + caseH);
  caseGrad.addColorStop(0, 'rgba(255,255,255,0.25)');
  caseGrad.addColorStop(0.5, 'rgba(0,0,0,0.02)');
  caseGrad.addColorStop(1, 'rgba(0,0,0,0.35)');
  ctx.fillStyle = caseGrad;
  ctx.fillRect(left, top, caseW, caseH);

  // 1. Camera Bump (top-left)
  const camW = caseW * 0.40;
  const camH = caseH * 0.24;
  const camX = left + caseW * 0.10;
  const camY = top + caseH * 0.06;

  ctx.beginPath();
  ctx.roundRect(camX, camY, camW, camH, 18);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Camera lenses (triple lens system)
  const lensR = camW * 0.18;
  const lenses = [
    { x: camX + camW * 0.32, y: camY + camH * 0.30 },
    { x: camX + camW * 0.32, y: camY + camH * 0.70 },
    { x: camX + camW * 0.72, y: camY + camH * 0.50 },
  ];
  for (const lens of lenses) {
    ctx.beginPath();
    ctx.arc(lens.x, lens.y, lensR, 0, Math.PI * 2);
    ctx.fillStyle = '#0F172A';
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Specular reflection dot
    ctx.beginPath();
    ctx.arc(lens.x - lensR * 0.3, lens.y - lensR * 0.3, lensR * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fill();
  }

  // 2. Render Logo on bottom 2/3 of the case
  if (options.logoImage) {
    const printCenterX = cx + (options.transform.x / 100) * caseW * 0.6;
    const printCenterY = cy + caseH * 0.12 + (options.transform.y / 100) * caseH * 0.5;
    const printWidth = caseW * 0.60 * options.transform.scale;
    const printHeight = caseW * 0.60 * options.transform.scale;

    renderWarpedLogo(
      ctx,
      options.logoImage,
      printCenterX,
      printCenterY,
      printWidth,
      printHeight,
      options.transform,
      'flat',
      0
    );
  }

  ctx.restore();
}

/**
 * DIE-CUT VINYL STICKER RENDERER
 */
function renderSticker(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  options: RenderOptions
) {
  const cx = w * 0.5;
  const cy = h * 0.48;
  const stickerSize = w * 0.46;

  ctx.save();

  // Outer Die-cut white border backing
  ctx.beginPath();
  ctx.arc(cx, cy, stickerSize * 0.52, 0, Math.PI * 2);
  ctx.fillStyle = options.color;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Subtle gloss sheen
  const sheen = ctx.createLinearGradient(cx - stickerSize, cy - stickerSize, cx + stickerSize, cy + stickerSize);
  sheen.addColorStop(0.3, 'rgba(255,255,255,0.4)');
  sheen.addColorStop(0.5, 'rgba(255,255,255,0.0)');
  ctx.fillStyle = sheen;
  ctx.fill();

  // 2. Render Logo inside
  if (options.logoImage) {
    const printCenterX = cx + (options.transform.x / 100) * stickerSize * 0.5;
    const printCenterY = cy + (options.transform.y / 100) * stickerSize * 0.5;
    const printWidth = stickerSize * 0.82 * options.transform.scale;
    const printHeight = stickerSize * 0.82 * options.transform.scale;

    renderWarpedLogo(
      ctx,
      options.logoImage,
      printCenterX,
      printCenterY,
      printWidth,
      printHeight,
      options.transform,
      'flat',
      0
    );
  }

  // 3. Peel corner 3D effect in bottom right
  const peelX = cx + stickerSize * 0.38;
  const peelY = cy + stickerSize * 0.38;
  ctx.beginPath();
  ctx.moveTo(peelX - 30, peelY + 15);
  ctx.lineTo(peelX + 15, peelY - 30);
  ctx.lineTo(peelX - 10, peelY - 10);
  ctx.closePath();
  ctx.fillStyle = '#E2E8F0';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  ctx.stroke();

  ctx.restore();
}

/**
 * Warps and composites logo with blend modes, filters, opacity, rotation and cylinder warping!
 */
function renderWarpedLogo(
  ctx: CanvasRenderingContext2D,
  logoImg: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  transform: LogoTransform,
  warpType: 'flat' | 'cylinder' | 'fabric' | 'emboss',
  curvature: number = 0.3
) {
  ctx.save();

  // 1. Prepare filtered/processed logo
  let processedLogo: HTMLCanvasElement | HTMLImageElement = logoImg;

  if (transform.removeBgTolerance > 0) {
    processedLogo = removeImageBackground(logoImg, transform.removeBgTolerance);
  }

  if (transform.colorFilter !== 'original') {
    processedLogo = applyLogoFilter(processedLogo, transform.colorFilter, transform.customColor);
  }

  // Set global composite mode
  ctx.globalAlpha = transform.opacity;

  if (transform.blendMode === 'multiply') {
    ctx.globalCompositeOperation = 'multiply';
  } else if (transform.blendMode === 'screen') {
    ctx.globalCompositeOperation = 'screen';
  } else if (transform.blendMode === 'overlay') {
    ctx.globalCompositeOperation = 'overlay';
  } else {
    ctx.globalCompositeOperation = 'source-over';
  }

  // Transform coordinates
  ctx.translate(x, y);
  ctx.rotate((transform.rotation * Math.PI) / 180);

  if (warpType === 'cylinder') {
    // Realistic cylindrical perspective slicing:
    // We slice the logo into vertical strips and compress horizontal width with cosine curve
    const strips = 24;
    const stripW = width / strips;
    const srcW = (processedLogo instanceof HTMLImageElement ? (processedLogo.naturalWidth || processedLogo.width) : processedLogo.width) / strips;
    const srcH = processedLogo instanceof HTMLImageElement ? (processedLogo.naturalHeight || processedLogo.height) : processedLogo.height;

    for (let i = 0; i < strips; i++) {
      const u = (i + 0.5) / strips; // 0 to 1
      const angle = (u - 0.5) * Math.PI * curvature * 1.8;
      const cosVal = Math.cos(angle);
      const sinVal = Math.sin(angle);

      // Curve vertical offset
      const curveY = (1 - cosVal) * height * 0.15;
      const stripX = -width / 2 + i * stripW + sinVal * (width * 0.06);

      ctx.drawImage(
        processedLogo,
        i * srcW, 0, srcW, srcH,
        stripX, -height / 2 + curveY, stripW * cosVal, height
      );
    }
  } else {
    // Flat / standard draw
    ctx.drawImage(
      processedLogo,
      -width / 2,
      -height / 2,
      width,
      height
    );
  }

  // If emboss mode is active, draw subtle bevel shadow
  if (transform.blendMode === 'emboss') {
    ctx.globalCompositeOperation = 'overlay';
    ctx.shadowColor = 'rgba(255,255,255,0.7)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = -1;
    ctx.shadowOffsetY = -1;
    ctx.drawImage(processedLogo, -width / 2, -height / 2, width, height);
  }

  ctx.restore();
}
