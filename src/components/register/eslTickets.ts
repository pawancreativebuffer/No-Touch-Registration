// The ESL tickets a retailer has designed: Everyday plus each promotion added for ESL

import { PROMO_TYPES, PromoTypeId } from './data';
import { ESL_EVERYDAY_LAYOUTS, ESL_PROMO_DEFAULTS, ESL_PROMO_LAYOUTS, EslLayoutId } from './devices';
import { addedPromoTypes, EVERYDAY_HEADER } from './paperTickets';
import { BackgroundSetup, EslSetup, FontSetup } from './state';

export interface EslTicketDef {
  /** 'everyday' or a promotion type id */
  key: string;
  name: string;
  mode: 'everyday' | 'promo';
  style: number;
  header: string;
  layouts: EslLayoutId[];
  recommended: EslLayoutId;
}

/** Design picked for a promotion, or its recommended ESL design */
export const eslStyleOf = (esl: EslSetup, id: PromoTypeId) => esl.typeStyles?.[id] ?? ESL_PROMO_DEFAULTS[id].style;

export const eslTickets = (esl: EslSetup): EslTicketDef[] => [
  {
    key: 'everyday',
    name: 'Everyday',
    mode: 'everyday',
    style: esl.everydayStyle,
    header: EVERYDAY_HEADER,
    layouts: ESL_EVERYDAY_LAYOUTS,
    recommended: 'price',
  },
  ...PROMO_TYPES.filter((t) => esl.promoTypes?.includes(t.id)).map((t) => ({
    key: t.id,
    name: t.name,
    mode: 'promo' as const,
    style: eslStyleOf(esl, t.id),
    header: t.header,
    layouts: ESL_PROMO_LAYOUTS,
    recommended: ESL_PROMO_DEFAULTS[t.id].layout,
  })),
];

/** ESL designs copied from the Paper steps: same promotions with the same design, same font.
 *  Paper Everyday textures cannot show on a 4-colour screen, so Everyday starts on the black band design. */
export const eslFromPaper = (esl: EslSetup, promo: BackgroundSetup, font: FontSetup): EslSetup => {
  const types = addedPromoTypes(promo);
  return {
    ...esl,
    everydayStyle: 0,
    everydayChosen: true,
    promoTypes: types.map((t) => t.id),
    typeStyles: Object.fromEntries(types.map((t) => [t.id, promo.typeStyles?.[t.id] ?? t.style])),
    fontIndex: font.fontIndex,
    fromPaper: true,
  };
};
