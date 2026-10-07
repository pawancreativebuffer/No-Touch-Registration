// The Paper tickets a retailer has built: Everyday plus each promotion, with the background picked for each

import { EVERYDAY_LAYOUTS, PROMO_LAYOUTS, PROMO_TYPE_LAYOUT, PROMO_TYPES, PromoTypeId, TicketLayoutId } from './data';
import { BackgroundSetup, BrandSetup, brandColours } from './state';

export type Orientation = 'portrait' | 'landscape';

/** A ticket background: one of our designs, or an uploaded image */
export type TicketBg =
  | { type: 'design'; kind: 'everyday' | 'promo'; variant: number; header: string; colour1: string; colour2: string; logoUrl?: string }
  | { type: 'image'; url: string };

export interface PaperTicketDef {
  /** 'everyday' or a promotion type id */
  key: string;
  name: string;
  promoType?: PromoTypeId;
  bg: (orientation: Orientation) => TicketBg;
  layouts: TicketLayoutId[];
  recommended: TicketLayoutId;
}

export const EVERYDAY_HEADER = 'Everyday Value';

/** Promotions the retailer added, based on the tab they used on the Promotional background step */
export const addedPromoTypes = (promo: BackgroundSetup) => {
  if (promo.mode === 'upload') {
    return PROMO_TYPES.filter((t) => {
      const u = promo.typeUploads?.[t.id];
      return !!(u?.portraitUrl || u?.landscapeUrl);
    });
  }
  if (promo.mode === 'ai') return PROMO_TYPES.filter((t) => promo.aiTypes?.includes(t.id) && promo.promoTypes?.includes(t.id));
  return PROMO_TYPES.filter((t) => promo.promoTypes?.includes(t.id));
};

export const paperTickets = (brand: BrandSetup, everyday: BackgroundSetup, promo: BackgroundSetup): PaperTicketDef[] => {
  const ed = brandColours(brand, 'everyday');
  const pc = brandColours(brand, 'promo');

  const everydayTicket: PaperTicketDef = {
    key: 'everyday',
    name: 'Everyday',
    bg: (o) => {
      const url = o === 'portrait' ? everyday.uploadUrl : everyday.landscapeUrl;
      if (everyday.mode === 'upload' && url) return { type: 'image', url };
      return {
        type: 'design',
        kind: 'everyday',
        variant: o === 'portrait' ? everyday.portraitIndex : everyday.landscapeIndex,
        header: EVERYDAY_HEADER,
        ...ed,
        logoUrl: brand.logoUrl,
      };
    },
    layouts: EVERYDAY_LAYOUTS,
    recommended: 'standard',
  };

  const promoTickets: PaperTicketDef[] = addedPromoTypes(promo).map((t) => ({
    key: t.id,
    name: t.name,
    promoType: t.id,
    bg: (o) => {
      const u = promo.typeUploads?.[t.id];
      const url = o === 'portrait' ? u?.portraitUrl : u?.landscapeUrl;
      if (promo.mode === 'upload' && url) return { type: 'image', url };
      return { type: 'design', kind: 'promo', variant: promo.typeStyles?.[t.id] ?? t.style, header: t.header, ...pc, logoUrl: brand.logoUrl };
    },
    layouts: PROMO_LAYOUTS,
    recommended: PROMO_TYPE_LAYOUT[t.id],
  }));

  return [everydayTicket, ...promoTickets];
};
