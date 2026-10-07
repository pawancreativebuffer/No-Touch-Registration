import React from 'react';
import Scaled from './Scaled';
import { ESL_PALETTE, EslLayoutId, EslModel } from '../devices';
import { HEADER_FONT } from '../fonts';
import { money } from '../data';
import { Product, splitPrice } from '../products';
import styles from './EslLabel.module.css';

/** Everyday labels are black and white; promotions use the Paper designs in red and yellow */
export const ESL_STYLES = {
  everyday: ['Black band', 'Black line', 'Black frame'],
  promo: ['Classic', 'Gold', 'Slant', 'Frame', 'Super sale'],
} as const;

const STYLE_CLASS = {
  everyday: ['bwBand', 'bwLine', 'bwFrame'],
  promo: ['classic', 'gold', 'slant', 'frame', 'sale'],
} as const;

export interface EslLabelProps {
  model: EslModel;
  mode: 'everyday' | 'promo';
  style: number;
  header: string;
  fontFamily: string;
  /** Text layout; ignored when `blank` */
  layout?: EslLayoutId;
  logoUrl?: string;
  product: Product;
  /** When set, draws a Multi Product ticket with up to four products */
  products?: Product[];
  /** Background only: header and logo, no product or price */
  blank?: boolean;
  maxHeight: number;
  maxWidth?: number;
}

const bezelOf = (m: EslModel) => Math.round(Math.min(m.width, m.height) * 0.06) + 4;

/** Width of the framed label when drawn `height` px tall */
export const eslWidthAt = (m: EslModel, height: number) => {
  const b = bezelOf(m);
  return (height * (m.width + b * 2)) / (m.height + b * 2);
};

const shapeOf = (m: EslModel) => {
  const r = m.width / m.height;
  return r < 0.9 ? 'portrait' : r > 1.2 ? 'landscape' : 'square';
};

const Price: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
  const { dollars, cents } = splitPrice(value);
  return (
    <span className={`${styles.price} ${className ?? ''}`} style={{ '--pw': dollars.length * 0.58 + 0.8 } as React.CSSProperties}>
      <sup>$</sup>
      {dollars}
      <sup>{cents}</sup>
    </span>
  );
};

/** Price area of a single-product label in each text layout */
const PriceBlock: React.FC<{ layout: EslLayoutId; product: Product; promo: boolean }> = ({ layout, product, promo }) => {
  const price = promo ? product.offer : product.price;
  const saving = Math.max(0, product.price - product.offer);
  switch (layout) {
    case 'save':
      return (
        <>
          <Price value={price} />
          <p className={styles.strip}>Save {money(saving)}</p>
        </>
      );
    case 'percent':
      return (
        <>
          <p className={styles.percent}>{Math.round((saving / product.price) * 100)}% off</p>
          <Price value={price} />
        </>
      );
    case 'wasnow':
      return (
        <>
          <Price value={price} />
          <p className={`${styles.strip} ${styles.wasStrip}`}>Was {money(product.price)}</p>
        </>
      );
    case 'multibuy':
      return (
        <>
          <p className={styles.deal}>2 for</p>
          <Price value={price * 2} />
        </>
      );
    case 'members':
      return (
        <div className={styles.members}>
          <div>
            <small>Members</small>
            <Price value={product.offer} className={styles.memberPrice} />
          </div>
          <div>
            <small>Others</small>
            <Price value={product.price} className={styles.otherPrice} />
          </div>
        </div>
      );
    case 'new':
      return (
        <>
          <span className={styles.badge}>New</span>
          <Price value={price} />
        </>
      );
    default:
      return (
        <>
          <Price value={price} />
          <p className={styles.unit}>{product.unitPrice}</p>
        </>
      );
  }
};

/** An e-paper label in black, white, red and yellow, drawn at the model's real pixel size inside its frame */
const EslLabel: React.FC<EslLabelProps> = ({
  model,
  mode,
  style,
  header,
  fontFamily,
  layout = 'price',
  logoUrl,
  product,
  products,
  blank,
  maxHeight,
  maxWidth,
}) => {
  const W = model.width;
  const H = model.height;
  const bezel = bezelOf(model);
  const promo = mode === 'promo';
  const styleClass = STYLE_CLASS[mode][style % STYLE_CLASS[mode].length];
  const vars = {
    width: W,
    height: H,
    '--black': ESL_PALETTE.black,
    '--white': ESL_PALETTE.white,
    '--red': ESL_PALETTE.red,
    '--yellow': ESL_PALETTE.yellow,
    '--font': fontFamily,
    '--header-font': HEADER_FONT,
    '--chars': Math.max(header.length, 4),
    // Frame borders in the label's own pixels (container units can't size the container's own border)
    '--frame': `${Math.max(2, Math.round(Math.min(W, H) * 0.035))}px`,
  } as React.CSSProperties;

  const head = (
    <div className={styles.head}>
      <span className={styles.headText}>{header}</span>
    </div>
  );

  // Logo sits in the footer, like the logo corner on Paper tickets
  const foot = (
    <div className={styles.foot}>
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoUrl} alt="" className={styles.logo} />
      ) : (
        <span>{blank ? '' : products ? 'Multi buy range' : product.sku}</span>
      )}
      {!blank && <span className={styles.barcode} />}
    </div>
  );

  let body: React.ReactNode;
  if (blank) {
    body = <div className={styles.body} />;
  } else if (products) {
    body = (
      <div className={styles.grid}>
        {products.slice(0, 4).map((p) => (
          <div key={p.sku} className={styles.cell}>
            <p className={styles.cellName}>{p.name}</p>
            <p className={styles.cellSize}>{p.size}</p>
            <Price value={promo ? p.offer : p.price} />
            {promo && <p className={styles.strip}>Save {money(p.price - p.offer)}</p>}
          </div>
        ))}
      </div>
    );
  } else {
    body = (
      <div className={styles.body}>
        <div className={styles.info}>
          <p className={styles.name}>{product.name}</p>
          <p className={styles.size}>{product.size}</p>
        </div>
        <div className={styles.priceBlock}>
          <PriceBlock layout={layout} product={product} promo={promo} />
        </div>
      </div>
    );
  }

  const shape = products ? styles.multi : styles[shapeOf(model)];
  const layoutClass = !blank && !products ? styles[`l-${layout}`] : '';

  return (
    <Scaled width={W + bezel * 2} height={H + bezel * 2} maxHeight={maxHeight} maxWidth={maxWidth}>
      <div className={styles.device} style={{ padding: bezel, borderRadius: bezel }}>
        <div className={`${styles.canvas} ${shape} ${styles[styleClass]} ${layoutClass}`} style={vars}>
          {head}
          {body}
          {foot}
        </div>
      </div>
    </Scaled>
  );
};

export default EslLabel;
