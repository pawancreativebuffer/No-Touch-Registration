// ESL and Digital Screen catalogue for the demo. All prices are demonstration pricing.

/* ---------- Electronic Shelf Labels (Zkong) ---------- */

/** The four colours every ESL model can show */
export const ESL_PALETTE = {
  black: '#141414',
  white: '#f7f7f2',
  red: '#d0202e',
  yellow: '#f5c400',
};

export type EslFixtureId = 'rail' | 'clip' | 'peg' | 'pole' | 'stand' | 'wall';

export interface EslModel {
  id: string;
  model: string;
  size: string;
  inches: number;
  /** Resolution as written in the supplied material */
  resolution: string;
  /** Canvas in pixels, oriented like the device (width x height) */
  width: number;
  height: number;
  price: number;
  /** Quantity added when the model is first selected, and the +/- step */
  defaultQty: number;
  qtyStep: number;
  /** Fixture recommended by default */
  fixture: EslFixtureId;
}

export const ESL_MODELS: EslModel[] = [
  { id: 'zkc23q', model: 'ZKC23Q', size: '2.3"', inches: 2.3, resolution: '122 × 250', width: 122, height: 250, price: 12.9, defaultQty: 200, qtyStep: 10, fixture: 'rail' },
  { id: 'zkc31q', model: 'ZKC31Q', size: '3.1"', inches: 3.1, resolution: '300 × 300', width: 300, height: 300, price: 19.9, defaultQty: 100, qtyStep: 10, fixture: 'rail' },
  { id: 'zkc42q', model: 'ZKC42Q', size: '4.2"', inches: 4.2, resolution: '300 × 400', width: 300, height: 400, price: 29.9, defaultQty: 50, qtyStep: 10, fixture: 'clip' },
  { id: 'zkc97b', model: 'ZKC97B', size: '9.7"', inches: 9.7, resolution: '960 × 672', width: 960, height: 672, price: 119, defaultQty: 10, qtyStep: 1, fixture: 'stand' },
  { id: 'zkc102b', model: 'ZKC102B', size: '10.2"', inches: 10.2, resolution: '960 × 640', width: 960, height: 640, price: 139, defaultQty: 10, qtyStep: 1, fixture: 'stand' },
];

export const findEsl = (id: string) => ESL_MODELS.find((m) => m.id === id);

/** Text layouts on an ESL: where the product, price and offer sit */
export type EslLayoutId = 'price' | 'product' | 'save' | 'percent' | 'wasnow' | 'multibuy' | 'members' | 'new';

export const ESL_LAYOUTS: Record<EslLayoutId, { name: string; description: string }> = {
  price: { name: 'Price focus', description: 'Product name, big price and unit price.' },
  product: { name: 'Product focus', description: 'Bigger product name, smaller price.' },
  save: { name: 'Price and saving', description: 'Offer price with the saving underneath.' },
  percent: { name: 'Percent off', description: 'Percentage off above the offer price.' },
  wasnow: { name: 'Was and now', description: 'Offer price with the was price.' },
  multibuy: { name: 'Multi-buy', description: 'Deal such as 2 for $6.98.' },
  members: { name: 'Member price', description: 'Member price and the price for everyone else.' },
  new: { name: 'New product', description: 'New badge above the price.' },
};

export const ESL_EVERYDAY_LAYOUTS: EslLayoutId[] = ['price', 'product'];
export const ESL_PROMO_LAYOUTS: EslLayoutId[] = ['save', 'percent', 'wasnow', 'multibuy', 'members', 'new', 'price'];

/** Recommended ESL design (promo style index) and layout for each promotion type */
export const ESL_PROMO_DEFAULTS: Record<string, { style: number; layout: EslLayoutId }> = {
  special: { style: 0, layout: 'save' },
  sale: { style: 4, layout: 'percent' },
  clearout: { style: 3, layout: 'wasnow' },
  multibuy: { style: 0, layout: 'multibuy' },
  new: { style: 2, layout: 'new' },
  members: { style: 1, layout: 'members' },
};

export interface EslFixture {
  id: EslFixtureId;
  name: string;
  description: string;
  /** Model ids this fixture fits */
  fits: string[];
  /** Labels held by one fixture */
  perUnit: number;
  price: number;
}

export const ESL_FIXTURES: EslFixture[] = [
  { id: 'rail', name: 'Shelf-edge rail, 1 m', description: 'Clips to the shelf front and holds up to 6 small labels.', fits: ['zkc23q', 'zkc31q', 'zkc42q'], perUnit: 6, price: 8.5 },
  { id: 'clip', name: 'Clip-on shelf holder', description: 'One holder per label, for shelves without a rail.', fits: ['zkc23q', 'zkc31q', 'zkc42q'], perUnit: 1, price: 0.95 },
  { id: 'peg', name: 'Peg hook holder', description: 'Hangs a label on the end of a peg hook.', fits: ['zkc23q', 'zkc31q'], perUnit: 1, price: 1.2 },
  { id: 'pole', name: 'Pole stand', description: 'Raises a label above freezers, bins and displays.', fits: ['zkc42q', 'zkc97b', 'zkc102b'], perUnit: 1, price: 9.9 },
  { id: 'stand', name: 'Counter stand', description: 'Stands a large label on a counter or end of aisle.', fits: ['zkc97b', 'zkc102b'], perUnit: 1, price: 24 },
  { id: 'wall', name: 'Wall mount', description: 'Fixes a large label flat to a wall or pillar.', fits: ['zkc97b', 'zkc102b'], perUnit: 1, price: 19 },
];

export const ESL_ACCESS_POINT = {
  name: 'ESL access point',
  description: 'Connects your labels to Ticket-IT. One access point covers up to 1,000 labels in a typical store.',
  labelsPerUnit: 1000,
  price: 349,
};

export const ESL_SUBSCRIPTION = { perLabelMonthly: 0.35, months: 3 };

/* ---------- Digital Screens (Zkong Legendary) ---------- */

export type ScreenShape = 'bar' | 'wide' | 'portrait';

export interface ScreenModel {
  id: string;
  model: string;
  size: string;
  /** Resolution as written in the brochure */
  resolution: string;
  /** Canvas in pixels, oriented like the device (width x height) */
  width: number;
  height: number;
  shape: ScreenShape;
  /** Comes with its own floor stand, so no bracket is needed */
  integratedStand: boolean;
  price: number;
}

export const SCREEN_SHAPES: Record<ScreenShape, { title: string; description: string }> = {
  bar: { title: 'Shelf-edge bars', description: 'Narrow screens that run along the shelf edge.' },
  wide: { title: 'Wide promotional displays', description: 'Wide screens for aisle ends, gondolas and above counters.' },
  portrait: {
    title: 'Portrait floor-standing screens',
    description: 'Tall screens on their own stand. Content is shown in a 1080 × 1920 canvas; final playback orientation to be confirmed.',
  },
};

export const SCREEN_MODELS: ScreenModel[] = [
  { id: 'zkl231', model: 'ZKL231', size: '23.1"', resolution: '1920 × 158', width: 1920, height: 158, shape: 'bar', integratedStand: false, price: 690 },
  { id: 'zkl350', model: 'ZKL350', size: '35"', resolution: '2638 × 158', width: 2638, height: 158, shape: 'bar', integratedStand: false, price: 990 },
  { id: 'zkl470', model: 'ZKL470', size: '47"', resolution: '3840 × 160', width: 3840, height: 160, shape: 'bar', integratedStand: false, price: 1590 },
  { id: 'zkl290', model: 'ZKL290', size: '29"', resolution: '1920 × 540', width: 1920, height: 540, shape: 'wide', integratedStand: false, price: 1190 },
  { id: 'zkl356', model: 'ZKL356', size: '35.6"', resolution: '1920 × 540', width: 1920, height: 540, shape: 'wide', integratedStand: false, price: 1490 },
  { id: 'zkl500', model: 'ZKL500', size: '50"', resolution: '1920 × 1080', width: 1080, height: 1920, shape: 'portrait', integratedStand: true, price: 2490 },
  { id: 'zkl550', model: 'ZKL550', size: '55"', resolution: '1920 × 1080', width: 1080, height: 1920, shape: 'portrait', integratedStand: true, price: 2790 },
  { id: 'zkl650', model: 'ZKL650', size: '65"', resolution: '1920 × 1080', width: 1080, height: 1920, shape: 'portrait', integratedStand: true, price: 3490 },
];

export const findScreen = (id: string) => SCREEN_MODELS.find((m) => m.id === id);

export type ScreenMountId = 'clamp' | 'wall' | 'ceiling';

export const SCREEN_MOUNTS: Record<ScreenMountId, { name: string; description: string; price: number }> = {
  clamp: { name: 'Shelf-edge bar clamp kit', description: 'Fixes a bar screen to the shelf front.', price: 45 },
  wall: { name: 'Wall bracket', description: 'Mounts a wide display flat to a wall or gondola end.', price: 89 },
  ceiling: { name: 'Ceiling hanging kit', description: 'Hangs a wide display above an aisle or counter.', price: 129 },
};

export interface NetworkItem {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Screens covered by one unit; 0 means optional (none recommended) */
  screensPerUnit: number;
}

export const SCREEN_NETWORK: NetworkItem[] = [
  { id: 'screen-ap', name: 'Screen Wi-Fi access point', description: 'For Digital Screens. Streams content to up to 8 screens.', price: 299, screensPerUnit: 8 },
  { id: 'poe-switch', name: 'Network switch, 8-port', description: 'For Digital Screens. Optional, for screens on a wired network.', price: 189, screensPerUnit: 0 },
];

export const SCREEN_SUBSCRIPTION = { perScreenMonthly: 19, months: 3 };

/** Number of units needed to cover `count` items at `perUnit` each */
export const unitsFor = (count: number, perUnit: number) => (count > 0 && perUnit > 0 ? Math.ceil(count / perUnit) : 0);
