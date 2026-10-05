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

/** Textures for the Everyday (core) backgrounds */
export const CORE_TEXTURES = [1, 2, 3, 4, 5, 6].map((i) => `/images/backgrounds/core-bg${i}.png`);

export const PROMO_STYLES = ['classic', 'gold', 'slant', 'frame', 'sale'] as const;
export type PromoStyle = (typeof PROMO_STYLES)[number];

/* ---------- Step 5: font, layout and test ticket ---------- */

export const TEXT_LAYOUTS = ['variable', 'percent', 'multibuy', 'wasnow', 'variableWhite'] as const;
export type TextLayout = (typeof TEXT_LAYOUTS)[number];

export interface TestTicket {
  offer: string;
  description: string;
  deal: string;
  price: string;
  unit: string;
  startDate: string;
  endDate: string;
}

export const SAMPLE_TICKET: TestTicket = {
  offer: 'Special',
  description: 'Kosciuszko Pale Ale Stubbies 330mL',
  deal: '3 for',
  price: '36',
  unit: 'x 24 Pack',
  startDate: '',
  endDate: '',
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

export const PAPER_COLOURS = [
  '#f7ef8a', '#f2b56b', '#f6eda0', '#dc3238', '#f7f1d8', '#f7f13a', '#f7901e', '#f9d84a', '#c3f0ae',
  '#139fd2', '#78c22c', '#8f6bb4', '#e366a5', '#c21e45', '#bff59f', '#93b8ef', '#e3cde9', '#f7b98a',
  '#e9ecdd', '#f6d6dc', '#5ab3e8', '#f8d6a8', '#ade8ef', '#fdd935', '#ffffff',
];

export const money = (n: number) => `$${n.toFixed(2)}`;
