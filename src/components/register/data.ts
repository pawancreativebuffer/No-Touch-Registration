// Static content for the No-Touch signup steps (from "No touch.pdf")

/* ---------- Step 2: Print process and sizes ---------- */

export type PrintMethod = 'mono' | 'colour';

export const PRINT_METHODS: { id: PrintMethod; text: string }[] = [
  { id: 'mono', text: 'Print your content onto pre-printed, perforated stock using a black and white laser printer' },
  { id: 'colour', text: 'Print your tickets to a full colour printer on to blank perforated stock' },
];

export interface SheetSize {
  id: string;
  /** Big label in each cell, e.g. "A4" (empty for 9UP/12UP style sizes) */
  name: string;
  up: string;
  /** Dimensions label as printed on the ticket, in mm */
  dims: string;
  cols: number;
  rows: number;
  /** One ticket's width and height in mm, used for the diagram's aspect ratio */
  cellW: number;
  cellH: number;
  dashed?: boolean;
}

export interface SizeGroup {
  id: string;
  title: string;
  sizes: SheetSize[];
}

export const SIZE_GROUPS: SizeGroup[] = [
  {
    id: 'portrait',
    title: 'Portrait Tickets',
    sizes: [
      { id: 'p-a4', name: 'A4', up: '1UP', dims: '297 x 210', cols: 1, rows: 1, cellW: 210, cellH: 297 },
      { id: 'p-a5', name: 'A5', up: '2UP', dims: '148.5 x 210', cols: 2, rows: 1, cellW: 148.5, cellH: 210 },
      { id: 'p-a6', name: 'A6', up: '4UP', dims: '148.5 x 105', cols: 2, rows: 2, cellW: 105, cellH: 148.5 },
      { id: 'p-a7', name: 'A7', up: '8UP', dims: '74.25 x 105', cols: 4, rows: 2, cellW: 74.25, cellH: 105 },
      { id: 'p-a8', name: 'A8', up: '16UP', dims: '74.25 x 52.5', cols: 4, rows: 4, cellW: 52.5, cellH: 74.25 },
      { id: 'p-9up', name: '', up: '9UP', dims: '99 x 70', cols: 3, rows: 3, cellW: 70, cellH: 99 },
      { id: 'p-12up', name: '', up: '12UP', dims: '74.25 x 70', cols: 3, rows: 4, cellW: 70, cellH: 74.25 },
    ],
  },
  {
    id: 'landscape',
    title: 'Landscape Tickets',
    sizes: [
      { id: 'l-a4', name: 'A4', up: '1UP', dims: '297 x 210', cols: 1, rows: 1, cellW: 297, cellH: 210 },
      { id: 'l-a5', name: 'A5', up: '2UP', dims: '148.5 x 210', cols: 1, rows: 2, cellW: 210, cellH: 148.5 },
      { id: 'l-a6', name: 'A6', up: '4UP', dims: '148.5 x 105', cols: 2, rows: 2, cellW: 148.5, cellH: 105 },
      { id: 'l-a7', name: 'A7', up: '8UP', dims: '74.25 x 105', cols: 2, rows: 4, cellW: 105, cellH: 74.25 },
    ],
  },
  {
    id: 'talker',
    title: 'Shelf Talker Tickets',
    sizes: [
      { id: 't-3up', name: '', up: '3UP Shelf Talker', dims: '99 x 210', cols: 1, rows: 3, cellW: 210, cellH: 99 },
      { id: 't-4up', name: '', up: '4UP Shelf Talker', dims: '74.25 x 210', cols: 1, rows: 4, cellW: 210, cellH: 74.25 },
      { id: 't-6up', name: '', up: '6UP Shelf Talker', dims: '49.5 x 210', cols: 1, rows: 6, cellW: 210, cellH: 49.5 },
    ],
  },
  {
    id: 'edge',
    title: 'Shelf Edge Tickets',
    sizes: [
      { id: 'e-20up', name: '', up: '20UP', dims: '74.25 x 42', cols: 4, rows: 5, cellW: 74.25, cellH: 42, dashed: true },
      { id: 'e-33up', name: '', up: '33UP', dims: '70 x 27', cols: 3, rows: 11, cellW: 70, cellH: 27, dashed: true },
    ],
  },
];

export const findSize = (id: string) =>
  SIZE_GROUPS.flatMap((g) => g.sizes).find((s) => s.id === id);

/* ---------- Steps 3 & 4: ticket backgrounds ---------- */

export const RETAIL_CATEGORIES = [
  'Sports and Outdoor',
  'Grocery',
  'Liquor',
  'Pharmacy',
  'Hardware',
  'Fashion',
  'Electronics',
  'Home and Garden',
];

export const EVERYDAY_HEADERS = ['Everyday Value', 'Save Everyday', 'Core Range', 'Great Price'];
export const PROMO_HEADERS = ['Special', 'Promotion', 'Save', 'New', 'Super Sale'];

export type PromoTypeId = 'special' | 'sale' | 'clearout' | 'multibuy' | 'new' | 'members';

/** Kinds of promotion; each gets its own ticket design. `style` is the recommended PROMO_STYLES index. */
export const PROMO_TYPES: { id: PromoTypeId; name: string; header: string; description: string; style: number }[] = [
  { id: 'special', name: 'Special Price', header: 'Special', description: 'A lower price for a limited time, with the saving.', style: 0 },
  { id: 'sale', name: 'Sale', header: 'Sale', description: 'A sale event, such as a seasonal or store-wide sale.', style: 4 },
  { id: 'clearout', name: 'Clear Out', header: 'Clear Out', description: 'Clearance price with the was price, to move old stock.', style: 3 },
  { id: 'multibuy', name: 'Buy More & Save', header: 'Buy More & Save', description: 'A multi-buy offer, such as 2 for $6.98.', style: 0 },
  { id: 'new', name: 'New', header: 'New', description: 'A new product launch, with or without a discount.', style: 2 },
  { id: 'members', name: 'Members Deal', header: 'Members Deal', description: 'A member price and a non-member price.', style: 1 },
];

/** Textures for the Everyday (core) backgrounds */
export const CORE_TEXTURES = [1, 2, 3, 4, 5, 6].map((i) => `/images/backgrounds/core-bg${i}.png`);

export const PROMO_STYLES = ['classic', 'gold', 'slant', 'frame', 'sale'] as const;

/** Foodvilla artwork supplied by the client, offered as sample uploads */
export const FOODVILLA_ART = {
  paper: { name: 'Foodvilla A5 ticket template.jpg', url: '/images/foodvilla/paper-a5.jpg' },
  /** Foodvilla's paper templates are all portrait, so the landscape sample is their landscape screen artwork */
  paperLandscape: { name: 'Foodvilla landscape ticket artwork.jpg', url: '/images/foodvilla/screen-landscape.jpg' },
  /** Foodvilla artwork for each promotion type, at /images/foodvilla/promo/<type>-<orientation>.jpg */
  promo: (type: string, orientation: 'portrait' | 'landscape') => ({
    name: `Foodvilla ${type} ${orientation}.jpg`,
    url: `/images/foodvilla/promo/${type}-${orientation}.jpg`,
  }),
  screen: {
    name: 'Foodvilla digital screen artwork.jpg',
    landscape: '/images/foodvilla/screen-landscape.jpg',
    portrait: '/images/foodvilla/screen-portrait.jpg',
  },
};
export type PromoStyle = (typeof PROMO_STYLES)[number];

/** Names of the background designs, in carousel order */
export const STYLE_NAMES = {
  everyday: ['Damask', 'Pink stripes', 'Plain', 'Concrete', 'White brick', 'Kraft paper'],
  promo: ['Classic', 'Gold', 'Slant', 'Frame', 'Super sale'],
};

/** Words in the AI prompt that point to each background design */
export const STYLE_KEYWORDS = {
  everyday: [
    ['damask', 'pattern', 'elegant', 'floral'],
    ['stripe', 'pink', 'candy', 'fun'],
    ['plain', 'clean', 'simple', 'minimal', 'white'],
    ['concrete', 'stone', 'grey', 'gray', 'industrial', 'marble'],
    ['brick', 'wall', 'rustic', 'urban'],
    ['kraft', 'paper', 'natural', 'organic', 'eco', 'brown', 'farm'],
  ],
  promo: [
    ['classic', 'simple', 'clean', 'bright'],
    ['gold', 'premium', 'luxury', 'black', 'elegant'],
    ['slant', 'modern', 'dynamic', 'fresh', 'angle'],
    ['frame', 'border', 'bold'],
    ['sunburst', 'super', 'big'],
  ],
};

/** Words in the AI prompt that point to each promotion type */
export const TYPE_KEYWORDS: Record<PromoTypeId, string[]> = {
  special: ['special'],
  sale: ['sale'],
  clearout: ['clear', 'clearance'],
  multibuy: ['multi', 'buy more', '2 for', 'bundle'],
  new: ['new', 'launch'],
  members: ['member', 'loyalty', 'club'],
};

/* ---------- Step 5: font, layout and test ticket ---------- */

export const TEXT_LAYOUTS = ['variable', 'percent', 'multibuy', 'wasnow', 'variableWhite'] as const;
export type TextLayout = (typeof TEXT_LAYOUTS)[number];

export interface TestTicket {
  offer: string;
  description: string;
  deal: string;
  price: string;
  /** Regular price, used for savings, was prices and member deals */
  was: string;
  unit: string;
  startDate: string;
  endDate: string;
}

export const SAMPLE_TICKET: TestTicket = {
  offer: 'Special',
  description: 'Kosciuszko Pale Ale Stubbies 330mL',
  deal: '3 for',
  price: '36',
  was: '45',
  unit: 'x 24 Pack',
  startDate: '',
  endDate: '',
};

/** Text layouts: how the product, price and offer sit on a ticket background */
export type TicketLayoutId = 'standard' | 'feature' | 'multibuy' | 'save' | 'percent' | 'wasnow' | 'members' | 'new';

export const TICKET_LAYOUTS: Record<TicketLayoutId, { name: string; description: string }> = {
  standard: { name: 'Price focus', description: 'Product name, big price and unit price.' },
  feature: { name: 'Product details', description: 'Product name, three detail lines and price.' },
  multibuy: { name: 'Multi-buy', description: 'Deal such as 3 for $36, with the price.' },
  save: { name: 'Price and saving', description: 'Offer price with the saving underneath.' },
  percent: { name: 'Percent off', description: 'Percentage off above the offer price.' },
  wasnow: { name: 'Was and now', description: 'Offer price with the was price.' },
  members: { name: 'Member price', description: 'Member price and non-member price.' },
  new: { name: 'New product', description: 'New badge above the price.' },
};

export const EVERYDAY_LAYOUTS: TicketLayoutId[] = ['standard', 'feature', 'multibuy'];
export const PROMO_LAYOUTS: TicketLayoutId[] = ['save', 'percent', 'wasnow', 'multibuy', 'members', 'new', 'standard'];

/** Layout recommended for each promotion type */
export const PROMO_TYPE_LAYOUT: Record<PromoTypeId, TicketLayoutId> = {
  special: 'save',
  sale: 'percent',
  clearout: 'wasnow',
  multibuy: 'multibuy',
  new: 'new',
  members: 'members',
};

export const DOWNLOADS = [
  { id: 'price-template', icon: 'cloud', text: 'Download your Ticket-IT Excel template to make your price tickets a breeze.', action: 'download' },
  { id: 'store-template', icon: 'users', text: 'Download your Ticket-IT Excel template to upload your store network list.', action: 'download' },
  { id: 'bg-template', icon: 'share', text: 'Download the ticket background template so you can make your own ticket backgrounds.', action: 'download' },
  { id: 'blank-stock', icon: 'truck', text: 'Order your blank background shell stock for delivery in two days.', action: 'order' },
  { id: 'shell-stock', icon: 'truck', text: 'Order your background shell stock for delivery in two days.', action: 'order' },
] as const;

/* ---------- Step 6: printers and paper ---------- */

export interface EquipmentLine {
  id: string;
  name: string;
  monthly: number;
}

export interface Printer {
  id: string;
  name: string;
  kind: 'mono' | 'colour';
  description: string;
  equipment: EquipmentLine[];
  rates: { label: string; rate: string }[];
}

export const PRINTERS: Printer[] = [
  {
    id: 'hl-l6415dw',
    name: 'Brother HL-L6415DW',
    kind: 'mono',
    description:
      'The HL-L6415DW mono laser printer delivers enterprise-level performance and advanced security for mid to large-sized workgroups. With a fast print speed of up to 50ppm and Triple Layer Security, it ensures productivity and document safety. Expandable paper capacity and flexible connectivity cater to growing business needs, including built-in Gigabit Ethernet and dual-band wireless networking, as well as mobile device printing.',
    equipment: [{ id: 'hl-l6415dw', name: 'Brother HLL6415DW A4 mono printer', monthly: 13.12 }],
    rates: [{ label: 'Mono', rate: '$0.012 (1.2 cents)' }],
  },
  {
    id: 'mfc-l9670cdn',
    name: 'Brother MFC-L9670CDN',
    kind: 'colour',
    description:
      'Designed to deliver the professional performance your business needs, the MFC-L9670CDN offers high-speed colour printing you can rely on alongside professional-grade security features. With optional lower paper trays, less time can be spent replenishing paper, maximising device up-time.',
    equipment: [
      { id: 'mfc-l9670cdn', name: 'Brother MFCL9670CDN A4 colour multifunctional', monthly: 32.78 },
      { id: 'tower-tray', name: 'Tower tray for MFCL9670CDN (a total of 5 trays for the device)', monthly: 23.01 },
      { id: 'tray-connector', name: 'Tower tray connector for MFCL9670CDN', monthly: 1.28 },
    ],
    rates: [
      { label: 'Mono', rate: '$0.012 (1.2 cents)' },
      { label: 'Colour', rate: '$0.12 (12 cents)' },
    ],
  },
];

export const PAPER_PRODUCTS = ['p-a4', 'p-a5', 'p-9up', 't-4up', 'e-20up'];

/** Demonstration price per box of 500 perforated sheets */
export const PAPER_BOX_PRICE: Record<string, number> = {
  'p-a4': 39.9,
  'p-a5': 42.9,
  'p-9up': 54.9,
  't-4up': 49.9,
  'e-20up': 59.9,
};

export const PAPER_COLOURS = [
  '#f7ef8a', '#f2b56b', '#f6eda0', '#dc3238', '#f7f1d8', '#f7f13a', '#f7901e', '#f9d84a', '#c3f0ae',
  '#139fd2', '#78c22c', '#8f6bb4', '#e366a5', '#c21e45', '#bff59f', '#93b8ef', '#e3cde9', '#f7b98a',
  '#e9ecdd', '#f6d6dc', '#5ab3e8', '#f8d6a8', '#ade8ef', '#fdd935', '#ffffff',
];

export const money = (n: number) => `$${n.toFixed(2)}`;
