// The Digital Screen content a retailer has designed: Everyday plus each promotion, using the Paper designs

import { PROMO_TYPES, PromoTypeId } from './data';
import { ESL_EVERYDAY_LAYOUTS, ESL_PROMO_DEFAULTS, ESL_PROMO_LAYOUTS, EslLayoutId, SCREEN_MODELS } from './devices';
import { addedPromoTypes, EVERYDAY_HEADER } from './paperTickets';
import { BackgroundSetup, FontSetup, PromoUpload, ScreenSetup } from './state';

export interface ScreenTicketDef {
  /** 'everyday' or a promotion type id */
  key: string;
  name: string;
  mode: 'everyday' | 'promo';
  style: number;
  header: string;
  /** Uploaded artwork, when the Upload tab is used */
  upload?: PromoUpload;
  layouts: EslLayoutId[];
  recommended: EslLayoutId;
}

/** Which artwork shapes the chosen screens need: portrait for floor-standing, landscape for bars and wide displays */
export const screenArtNeeds = (screens: ScreenSetup) => {
  const models = SCREEN_MODELS.filter((m) => screens.selected.includes(m.id));
  return {
    portrait: models.length === 0 || models.some((m) => m.shape === 'portrait'),
    landscape: models.length === 0 || models.some((m) => m.shape !== 'portrait'),
  };
};

export const uploadComplete = (screens: ScreenSetup, u: PromoUpload | undefined) => {
  const need = screenArtNeeds(screens);
  return !!u && (!need.portrait || !!u.portraitUrl) && (!need.landscape || !!u.landscapeUrl);
};

export const screenStyleOf = (screens: ScreenSetup, id: PromoTypeId) => screens.typeStyles?.[id] ?? PROMO_TYPES.find((t) => t.id === id)!.style;

/** Promotions that count for the open tab */
export const screenPromoTypes = (screens: ScreenSetup) => {
  if (screens.mode === 'upload') return PROMO_TYPES.filter((t) => uploadComplete(screens, screens.typeUploads?.[t.id]));
  if (screens.mode === 'ai') return PROMO_TYPES.filter((t) => screens.aiTypes?.includes(t.id) && screens.promoTypes?.includes(t.id));
  return PROMO_TYPES.filter((t) => screens.promoTypes?.includes(t.id));
};

export const screenTickets = (screens: ScreenSetup): ScreenTicketDef[] => {
  const upload = screens.mode === 'upload';
  return [
    {
      key: 'everyday',
      name: 'Everyday',
      mode: 'everyday',
      style: screens.everydayStyle,
      header: EVERYDAY_HEADER,
      upload: upload ? screens.everydayUpload : undefined,
      layouts: ESL_EVERYDAY_LAYOUTS,
      recommended: 'price' as EslLayoutId,
    },
    ...screenPromoTypes(screens).map((t) => ({
      key: t.id,
      name: t.name,
      mode: 'promo' as const,
      style: screenStyleOf(screens, t.id),
      header: t.header,
      upload: upload ? screens.typeUploads?.[t.id] : undefined,
      layouts: ESL_PROMO_LAYOUTS,
      recommended: ESL_PROMO_DEFAULTS[t.id].layout,
    })),
  ];
};

/** Paper text layouts and the matching screen layout */
const FROM_PAPER_LAYOUT: Record<string, EslLayoutId> = { standard: 'price', feature: 'product' };

/** Screen designs copied from the Paper steps: the same Everyday texture, promotions, designs, font and text layouts */
export const screensFromPaper = (screens: ScreenSetup, everyday: BackgroundSetup, promo: BackgroundSetup, font: FontSetup): ScreenSetup => {
  const types = addedPromoTypes(promo);
  return {
    ...screens,
    mode: 'select',
    everydayStyle: everyday.portraitIndex,
    everydayChosen: true,
    promoTypes: types.map((t) => t.id),
    typeStyles: Object.fromEntries(types.map((t) => [t.id, promo.typeStyles?.[t.id] ?? t.style])),
    fontIndex: font.fontIndex,
    layouts: Object.fromEntries(
      Object.entries(font.layouts ?? {}).map(([key, l]) => [key, (l && FROM_PAPER_LAYOUT[l]) ?? (l as EslLayoutId)]),
    ),
    fromPaper: true,
  };
};
