export type ProductType = 
  | 'mug'
  | 'tshirt'
  | 'hoodie'
  | 'tote'
  | 'waterbottle'
  | 'cap'
  | 'notebook'
  | 'phonecase'
  | 'sticker';

export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'emboss';

export interface LogoTransform {
  x: number; // percentage (-50 to +50 relative to center)
  y: number; // percentage (-50 to +50 relative to center)
  scale: number; // 0.1 to 2.5
  rotation: number; // in degrees (-180 to 180)
  opacity: number; // 0.1 to 1.0
  blendMode: BlendMode;
  colorFilter: 'original' | 'white' | 'black' | 'gold' | 'custom';
  customColor?: string;
  removeBgTolerance: number; // 0 to 100
}

export interface ProductColor {
  name: string;
  hex: string;
  textColor?: string;
}

export interface ProductConfig {
  id: ProductType;
  name: string;
  category: 'Apparel' | 'Drinkware' | 'Accessories' | 'Stationery';
  defaultColor: string;
  colors: ProductColor[];
  printArea: {
    x: number; // 0-1 canvas coordinate
    y: number;
    width: number;
    height: number;
    shape?: 'rect' | 'cylinder' | 'curved';
    curvature?: number; // for mug/bottle wrap
  };
  hasBackView?: boolean;
}

export type ExportResolution = '1K' | '2K' | '4K';

export interface GeneratedImageResult {
  imageUrl: string;
  model: string;
  imageSize: string;
  prompt: string;
  timestamp: number;
}
