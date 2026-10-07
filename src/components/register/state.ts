import { PrintMethod, PromoTypeId, SAMPLE_TICKET, TestTicket, TicketLayoutId } from './data';
import { EslLayoutId, ScreenMountId } from './devices';

export interface PrintSetup {
  method: PrintMethod | null;
  sizes: string[];
}

/** Store category, logo and colours: collected once and reused by Paper, ESL and Digital Screens */
export interface BrandSetup {
  category: string;
  logoName: string;
  logoUrl: string;
  /** Brand colours, used for Everyday content */
  colour1: string;
  colour2: string;
  /** Promotional colours, used for Promotional content */
  promo1: string;
  promo2: string;
}

export type BackgroundMode = 'select' | 'ai' | 'upload';

/** Artwork uploaded for one promotion type */
export interface PromoUpload {
  portraitName?: string;
  portraitUrl?: string;
  landscapeName?: string;
  landscapeUrl?: string;
  /** Screens only: the upload is a video */
  portraitVideo?: boolean;
  landscapeVideo?: boolean;
}

export interface BackgroundSetup {
  /** Which tab is open: pick a design, build with AI, or upload artwork */
  mode: BackgroundMode;
  /** Uploaded portrait background */
  uploadName: string;
  uploadUrl: string;
  /** Uploaded landscape background */
  landscapeName: string;
  landscapeUrl: string;
  aiPrompt: string;
  /** Build with AI has made the tickets */
  aiDone: boolean;
  headers: string[];
  /** Promotional only: the promotion types picked, and the design chosen for each */
  promoTypes: PromoTypeId[];
  typeStyles: Partial<Record<PromoTypeId, number>>;
  /** Promotional Build with AI tab: the prompt for each promotion, and the promotions AI has built */
  typePrompts: Partial<Record<PromoTypeId, string>>;
  aiTypes: PromoTypeId[];
  /** Promotional Upload tab: artwork per promotion type */
  typeUploads: Partial<Record<PromoTypeId, PromoUpload>>;
  portraitIndex: number;
  portraitChosen: boolean;
  landscapeIndex: number;
  landscapeChosen: boolean;
}

export interface FontSetup {
  fontIndex: number;
  fontChosen: boolean;
  layoutIndex: number;
  layoutChosen: boolean;
  ticket: TestTicket;
  /** Text layout picked for each ticket ('everyday' or a promotion type id), and which ones are ticked */
  layouts: Partial<Record<string, TicketLayoutId>>;
  layoutsChosen: string[];
}

export interface CartLine {
  sizeId: string;
  colour: string;
  qty: number;
}

export interface PurchaseSetup {
  printers: string[];
  /** Quantity per equipment line id */
  quantities: Record<string, number>;
  cart: CartLine[];
}

export interface EslSetup {
  selected: string[];
  qty: Record<string, number>;
  /** Everyday ESL design (one design) */
  everydayStyle: number;
  everydayChosen: boolean;
  /** Promotions added for ESL, and the design picked for each */
  promoTypes: PromoTypeId[];
  typeStyles: Partial<Record<PromoTypeId, number>>;
  /** Designs were copied from the Paper steps */
  fromPaper: boolean;
  fontIndex: number;
  fontChosen: boolean;
  /** Text layout for each ticket ('everyday' or a promotion type id), and which ones are ticked */
  layouts: Partial<Record<string, EslLayoutId>>;
  layoutsChosen: string[];
  /** Fixture quantities the user changed; others follow the recommendation */
  fixtureQty: Record<string, number>;
  apQty: number | null;
}

export type ScreenMotion = 'static' | 'animated';
export type ScreenLayout = 'single' | 'multi';

export interface ScreenSetup {
  selected: string[];
  qty: Record<string, number>;
  /** Which design tab is open: pick a design, build with AI, or upload artwork */
  mode: BackgroundMode;
  /** Everyday design (one of the Paper textures) */
  everydayStyle: number;
  everydayChosen: boolean;
  /** Promotions added, and the Paper design picked for each */
  promoTypes: PromoTypeId[];
  typeStyles: Partial<Record<PromoTypeId, number>>;
  /** Build with AI: the Everyday prompt, and a prompt per promotion */
  aiPrompt: string;
  aiDone: boolean;
  typePrompts: Partial<Record<PromoTypeId, string>>;
  aiTypes: PromoTypeId[];
  /** Upload: Everyday artwork and artwork per promotion */
  everydayUpload: PromoUpload;
  typeUploads: Partial<Record<PromoTypeId, PromoUpload>>;
  /** Designs were copied from the Paper steps */
  fromPaper: boolean;
  fontIndex: number;
  fontChosen: boolean;
  /** Text layout for each ticket ('everyday' or a promotion type id), and which ones are ticked */
  layouts: Partial<Record<string, EslLayoutId>>;
  layoutsChosen: string[];
  motion: ScreenMotion;
  layout: ScreenLayout;
  /** Wide displays: wall bracket or ceiling kit, per model */
  wideMount: Record<string, Extract<ScreenMountId, 'wall' | 'ceiling'>>;
  /** Network quantities the user changed; others follow the recommendation */
  networkQty: Record<string, number>;
}

export interface DataSetup {
  imported: boolean;
  /** Where the products came from, e.g. "Shopify" or a file name */
  source: string;
  helpRequested: boolean;
}

export interface GoLiveSetup {
  devicesConnected: boolean;
  published: boolean;
}

export const EMPTY_PRINT: PrintSetup = { method: null, sizes: [] };

export const BRAND_DEFAULTS: BrandSetup = {
  category: '',
  logoName: '',
  logoUrl: '',
  colour1: '#2b253e',
  colour2: '#f73582',
  promo1: '#b31f2b',
  promo2: '#f9a51b',
};

/** The two colours used for Everyday or Promotional content */
export const brandColours = (brand: BrandSetup, kind: 'everyday' | 'promo') =>
  kind === 'everyday' ? { colour1: brand.colour1, colour2: brand.colour2 } : { colour1: brand.promo1, colour2: brand.promo2 };

export const everydayDefaults = (): BackgroundSetup => ({
  mode: 'select',
  uploadName: '',
  uploadUrl: '',
  landscapeName: '',
  landscapeUrl: '',
  aiPrompt: '',
  aiDone: false,
  headers: ['Everyday Value'],
  promoTypes: [],
  typeStyles: {},
  typePrompts: {},
  aiTypes: [],
  typeUploads: {},
  portraitIndex: 0,
  portraitChosen: false,
  landscapeIndex: 0,
  landscapeChosen: false,
});

export const promoDefaults = (): BackgroundSetup => ({
  ...everydayDefaults(),
  headers: ['Special'],
  promoTypes: [],
});

export const EMPTY_FONT: FontSetup = {
  fontIndex: 1,
  fontChosen: false,
  layoutIndex: 2,
  layoutChosen: false,
  ticket: SAMPLE_TICKET,
  layouts: {},
  layoutsChosen: [],
};

export const EMPTY_PURCHASE: PurchaseSetup = { printers: [], quantities: {}, cart: [] };

export const ESL_DEFAULTS: EslSetup = {
  selected: [],
  qty: {},
  everydayStyle: 0,
  everydayChosen: false,
  promoTypes: [],
  typeStyles: {},
  fromPaper: false,
  fontIndex: 1,
  fontChosen: false,
  layouts: {},
  layoutsChosen: [],
  fixtureQty: {},
  apQty: null,
};

export const SCREEN_DEFAULTS: ScreenSetup = {
  selected: [],
  qty: {},
  mode: 'select',
  everydayStyle: 0,
  everydayChosen: false,
  promoTypes: [],
  typeStyles: {},
  aiPrompt: '',
  aiDone: false,
  typePrompts: {},
  aiTypes: [],
  everydayUpload: {},
  typeUploads: {},
  fromPaper: false,
  fontIndex: 1,
  fontChosen: false,
  layouts: {},
  layoutsChosen: [],
  motion: 'animated',
  layout: 'single',
  wideMount: {},
  networkQty: {},
};

export const DATA_DEFAULTS: DataSetup = { imported: false, source: '', helpRequested: false };

export const GOLIVE_DEFAULTS: GoLiveSetup = { devicesConnected: false, published: false };
