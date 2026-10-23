import { Solution } from '../register/flow';
import { PromoTypeId } from '../register/data';

export type WorkspaceArea = 'overview' | 'brand' | 'media' | 'shop' | 'data' | 'review';

export type BrandSubStep = 'hub' | 'logo' | 'colours' | 'font';
export type MediaSubStep =
  | 'hub'
  | 'paper-sizes-everyday'
  | 'paper-sizes-promo'
  | 'paper-bg-everyday'
  | 'paper-bg-promo'
  | 'paper-font'
  | 'esl-choose'
  | 'esl-design'
  | 'esl-font'
  | 'screen-choose'
  | 'screen-content'
  | 'screen-motion';

export type ShopSubStep = 'hub' | 'paper' | 'esl' | 'screens';
export type DataSubStep = 'hub' | 'spreadsheet' | 'system' | 'help';
export type ReviewSubStep = 'review' | 'golive';

export interface AreaProgress {
  brand: boolean;
  media: boolean;
  shop: boolean;
  data: boolean;
  review: boolean;
}

export interface OrbitalNode {
  id: string;
  label: string;
  subtitle: string;
  icon: 'brand' | 'media' | 'shop' | 'data' | 'upload' | 'palette' | 'font' | 'paper' | 'esl' | 'screens' | 'check';
  badge?: string;
  completed?: boolean;
}
