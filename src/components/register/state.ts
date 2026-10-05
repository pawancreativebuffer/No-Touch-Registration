import { PrintMethod, SAMPLE_TICKET, TestTicket } from './data';

export interface PrintSetup {
  method: PrintMethod | null;
  sizes: string[];
}

export interface BackgroundSetup {
  uploadName: string;
  uploadUrl: string;
  category: string;
  colour1: string;
  colour2: string;
  logoName: string;
  logoUrl: string;
  headers: string[];
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

export const EMPTY_PRINT: PrintSetup = { method: null, sizes: [] };

export const everydayDefaults = (): BackgroundSetup => ({
  uploadName: '',
  uploadUrl: '',
  category: '',
  colour1: '#2b253e',
  colour2: '#f73582',
  logoName: '',
  logoUrl: '',
  headers: ['Everyday Value'],
  portraitIndex: 0,
  portraitChosen: false,
  landscapeIndex: 0,
  landscapeChosen: false,
});

export const promoDefaults = (): BackgroundSetup => ({
  ...everydayDefaults(),
  colour1: '#b31f2b',
  colour2: '#f9a51b',
  headers: ['Special'],
});

export const EMPTY_FONT: FontSetup = {
  fontIndex: 1,
  fontChosen: false,
  layoutIndex: 2,
  layoutChosen: false,
  ticket: SAMPLE_TICKET,
};

export const EMPTY_PURCHASE: PurchaseSetup = { printers: [], quantities: {}, cart: [] };
