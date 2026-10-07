// Recommendations and order lines shared by the purchase steps and the order summary

import { findSize, PAPER_BOX_PRICE, Printer, PRINTERS } from './data';
import {
  ESL_ACCESS_POINT,
  ESL_FIXTURES,
  ESL_MODELS,
  ESL_SUBSCRIPTION,
  EslFixture,
  SCREEN_MODELS,
  SCREEN_MOUNTS,
  SCREEN_NETWORK,
  SCREEN_SUBSCRIPTION,
  ScreenModel,
  unitsFor,
} from './devices';
import { Solution } from './flow';
import { EslSetup, PurchaseSetup, ScreenSetup } from './state';

/* ---------- ESL ---------- */

export const selectedEsls = (esl: EslSetup) =>
  ESL_MODELS.filter((m) => esl.selected.includes(m.id)).map((model) => ({ model, qty: esl.qty[model.id] ?? model.defaultQty }));

export const eslLabelCount = (esl: EslSetup) => selectedEsls(esl).reduce((sum, l) => sum + l.qty, 0);

/** Fixtures that fit at least one selected model, with the recommended quantity */
export const eslFixtures = (esl: EslSetup) => {
  const lines = selectedEsls(esl);
  return ESL_FIXTURES.filter((f) => lines.some((l) => f.fits.includes(l.model.id))).map((fixture) => {
    const labels = lines.filter((l) => l.model.fixture === fixture.id).reduce((sum, l) => sum + l.qty, 0);
    const recommended = unitsFor(labels, fixture.perUnit);
    return { fixture, recommended, qty: esl.fixtureQty[fixture.id] ?? recommended };
  });
};

export const eslAccessPoints = (esl: EslSetup) => {
  const recommended = Math.max(1, unitsFor(eslLabelCount(esl), ESL_ACCESS_POINT.labelsPerUnit));
  return { recommended, qty: esl.apQty ?? recommended };
};

export const eslSubscriptionTotal = (esl: EslSetup) =>
  eslLabelCount(esl) * ESL_SUBSCRIPTION.perLabelMonthly * ESL_SUBSCRIPTION.months;

export const fitsLabel = (fixture: EslFixture) =>
  `Fits ${ESL_MODELS.filter((m) => fixture.fits.includes(m.id))
    .map((m) => m.size)
    .join(', ')}`;

/* ---------- Digital Screens ---------- */

export const selectedScreens = (screens: ScreenSetup) =>
  SCREEN_MODELS.filter((m) => screens.selected.includes(m.id)).map((model) => ({ model, qty: screens.qty[model.id] ?? 1 }));

export const screenCount = (screens: ScreenSetup) => selectedScreens(screens).reduce((sum, l) => sum + l.qty, 0);

/** Bracket for one screen model, or null when it stands on its own */
export const mountFor = (model: ScreenModel, screens: ScreenSetup) => {
  if (model.integratedStand) return null;
  if (model.shape === 'bar') return 'clamp' as const;
  return screens.wideMount[model.id] ?? 'wall';
};

export const screenNetwork = (screens: ScreenSetup) => {
  const count = screenCount(screens);
  return SCREEN_NETWORK.map((item) => {
    const recommended = unitsFor(count, item.screensPerUnit);
    return { item, recommended, qty: screens.networkQty[item.id] ?? recommended };
  });
};

export const screenSubscriptionTotal = (screens: ScreenSetup) =>
  screenCount(screens) * SCREEN_SUBSCRIPTION.perScreenMonthly * SCREEN_SUBSCRIPTION.months;

/* ---------- Paper ---------- */

export const printerMonthly = (p: Printer, purchase: PurchaseSetup) =>
  p.equipment.reduce((sum, l) => sum + l.monthly * (purchase.quantities[l.id] ?? 1), 0);

/* ---------- Consolidated order ---------- */

export interface OrderLine {
  name: string;
  detail?: string;
  qty: number;
  unit: number;
  total: number;
  /** Shown instead of a price, e.g. "Included" */
  note?: string;
  /** Charged monthly instead of today */
  monthly?: boolean;
}

export interface OrderSection {
  title: 'Equipment' | 'Accessories' | 'Software' | 'Supplies';
  lines: OrderLine[];
}

export interface OrderGroup {
  solution: Solution;
  sections: OrderSection[];
  today: number;
  monthly: number;
}

const line = (name: string, qty: number, unit: number, detail?: string): OrderLine => ({ name, qty, unit, total: qty * unit, detail });

const finishGroup = (solution: Solution, sections: OrderSection[]): OrderGroup => {
  const kept = sections.filter((s) => s.lines.length > 0);
  const all = kept.flatMap((s) => s.lines);
  return {
    solution,
    sections: kept,
    today: all.filter((l) => !l.monthly).reduce((sum, l) => sum + l.total, 0),
    monthly: all.filter((l) => l.monthly).reduce((sum, l) => sum + l.total, 0),
  };
};

export const paperOrder = (purchase: PurchaseSetup): OrderGroup =>
  finishGroup('paper', [
    {
      title: 'Equipment',
      lines: PRINTERS.filter((p) => purchase.printers.includes(p.id)).map((p) => ({
        ...line(`${p.name} lease`, 1, printerMonthly(p, purchase), '60 month interest free lease'),
        monthly: true,
      })),
    },
    {
      title: 'Supplies',
      lines: purchase.cart.map((l) => {
        const size = findSize(l.sizeId);
        const name = size ? `${[size.name, size.up].filter(Boolean).join(' ')} paper (${size.dims})` : l.sizeId;
        return line(name, l.qty, PAPER_BOX_PRICE[l.sizeId] ?? 0, 'Box of 500 sheets');
      }),
    },
  ]);

export const eslOrder = (esl: EslSetup): OrderGroup =>
  finishGroup('esl', [
    {
      title: 'Equipment',
      lines: [
        ...selectedEsls(esl).map((l) => line(`${l.model.size} ESL ${l.model.model}`, l.qty, l.model.price, `${l.model.resolution} px`)),
        ...(eslLabelCount(esl) > 0 ? [line(ESL_ACCESS_POINT.name, eslAccessPoints(esl).qty, ESL_ACCESS_POINT.price)] : []),
      ],
    },
    {
      title: 'Accessories',
      lines: eslFixtures(esl)
        .filter((f) => f.qty > 0)
        .map((f) => line(f.fixture.name, f.qty, f.fixture.price)),
    },
    {
      title: 'Software',
      lines:
        eslLabelCount(esl) > 0
          ? [
              line(
                'Ticket-IT ESL subscription, 3 months',
                eslLabelCount(esl),
                ESL_SUBSCRIPTION.perLabelMonthly * ESL_SUBSCRIPTION.months,
                `$${ESL_SUBSCRIPTION.perLabelMonthly.toFixed(2)} per label per month`,
              ),
            ]
          : [],
    },
  ]);

export const screenOrder = (screens: ScreenSetup): OrderGroup => {
  const lines = selectedScreens(screens);
  const mounts: OrderLine[] = lines.map(({ model, qty }) => {
    const mount = mountFor(model, screens);
    if (!mount) return { ...line(`Integrated floor stand for ${model.size} ${model.model}`, qty, 0), note: 'Included' };
    return line(`${SCREEN_MOUNTS[mount].name} for ${model.size} ${model.model}`, qty, SCREEN_MOUNTS[mount].price);
  });
  return finishGroup('screens', [
    {
      title: 'Equipment',
      lines: [
        ...lines.map((l) => line(`${l.model.size} screen ${l.model.model}`, l.qty, l.model.price, `${l.model.resolution} px`)),
        ...screenNetwork(screens)
          .filter((n) => n.qty > 0)
          .map((n) => line(`${n.item.name} (for Digital Screens)`, n.qty, n.item.price)),
      ],
    },
    { title: 'Accessories', lines: mounts },
    {
      title: 'Software',
      lines:
        screenCount(screens) > 0
          ? [
              line(
                'Ticket-IT Digital Screens subscription, 3 months',
                screenCount(screens),
                SCREEN_SUBSCRIPTION.perScreenMonthly * SCREEN_SUBSCRIPTION.months,
                `$${SCREEN_SUBSCRIPTION.perScreenMonthly.toFixed(2)} per screen per month`,
              ),
            ]
          : [],
    },
  ]);
};
