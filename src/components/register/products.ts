// Sample products used in every preview, and the product sources offered after checkout

export type ProductArtId = 'banana' | 'milk' | 'bread' | 'eggs' | 'avocado' | 'beer';

export interface Product {
  sku: string;
  name: string;
  size: string;
  /** Regular price, used on Everyday content and shown as "was" on promotions */
  price: number;
  /** Offer price, used on Promotional content */
  offer: number;
  unitPrice: string;
  art: ProductArtId;
}

export const SAMPLE_PRODUCTS: Product[] = [
  { sku: '400112', name: 'Fresh Bananas', size: 'per kg', price: 4.2, offer: 3.49, unitPrice: '$4.20 / kg', art: 'banana' },
  { sku: '400287', name: 'Full Cream Milk', size: '2L', price: 3.6, offer: 3.1, unitPrice: '$1.80 / L', art: 'milk' },
  { sku: '401503', name: 'Sourdough Loaf', size: '750g', price: 6.5, offer: 5.5, unitPrice: '$0.87 / 100g', art: 'bread' },
  { sku: '402016', name: 'Free Range Eggs', size: '12 pack', price: 9.49, offer: 7.99, unitPrice: '$0.79 each', art: 'eggs' },
  { sku: '402344', name: 'Hass Avocados', size: 'each', price: 2.2, offer: 1.5, unitPrice: '$2.20 each', art: 'avocado' },
  { sku: '405871', name: 'Kosciuszko Pale Ale', size: '24 x 330mL', price: 45, offer: 36, unitPrice: '$5.68 / L', art: 'beer' },
];

/** "$3.49" split for big price displays */
export const splitPrice = (n: number) => {
  const cents = Math.round(n * 100);
  return { dollars: String(Math.floor(cents / 100)), cents: String(cents % 100).padStart(2, '0') };
};

export interface RetailSystem {
  id: string;
  name: string;
  initials: string;
  colour: string;
  field: string;
  placeholder: string;
}

export const RETAIL_SYSTEMS: RetailSystem[] = [
  { id: 'retail-express', name: 'Retail Express', initials: 'RE', colour: '#e4572e', field: 'Retail Express domain', placeholder: 'yourstore.retailexpress.com.au' },
  { id: 'shopify', name: 'Shopify', initials: 'S', colour: '#5e8e3e', field: 'Shopify store address', placeholder: 'yourstore.myshopify.com' },
  { id: 'lightspeed', name: 'Lightspeed', initials: 'L', colour: '#2b2b2b', field: 'Lightspeed account name', placeholder: 'yourstore' },
  { id: 'odoo', name: 'Odoo', initials: 'O', colour: '#714b67', field: 'Odoo database URL', placeholder: 'yourstore.odoo.com' },
];

export const PRODUCT_TEMPLATE_CSV =
  'SKU,Product Name,Size,Regular Price,Promotional Price,Unit Price\n' +
  SAMPLE_PRODUCTS.map((p) => [p.sku, p.name, p.size, p.price.toFixed(2), p.offer.toFixed(2), p.unitPrice].join(',')).join('\n') +
  '\n';
