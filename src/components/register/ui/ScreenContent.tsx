"use client";

import React, { useEffect, useState } from 'react';
import Scaled from './Scaled';
import ProductArt from './ProductArt';
import { EslLayoutId, ScreenModel } from '../devices';
import { HEADER_FONT } from '../fonts';
import { CORE_TEXTURES, money, STYLE_NAMES } from '../data';
import { Product, splitPrice } from '../products';
import { PromoUpload, ScreenLayout, ScreenMotion } from '../state';
import styles from './ScreenContent.module.css';

/** The same designs as Paper: Everyday textures and the five promotional designs */
export const SCREEN_STYLES = STYLE_NAMES;

const PROMO_CLASS = ['classic', 'gold', 'slant', 'frame', 'sale'] as const;

const ROTATE_MS = 4500;

const frameOf = (m: ScreenModel) => {
  const bezel = Math.round(Math.min(m.width, m.height) * 0.035) + 6;
  const stand = m.integratedStand ? Math.round(m.height * 0.07) : 0;
  return { bezel, stand, width: m.width + bezel * 2, height: m.height + bezel * 2 + stand };
};

/** Width of the framed screen when drawn `height` px tall */
export const screenWidthAt = (m: ScreenModel, height: number) => {
  const f = frameOf(m);
  return (height * f.width) / f.height;
};

export interface ScreenContentProps {
  model: ScreenModel;
  mode: 'everyday' | 'promo';
  style: number;
  colour1: string;
  colour2: string;
  header: string;
  logoUrl?: string;
  /** Finished artwork, shown as it is instead of the branded layout */
  upload?: PromoUpload;
  /** Background only: header and logo, no products or prices */
  blank?: boolean;
  motion?: ScreenMotion;
  layout?: ScreenLayout;
  /** Text layout of single-product content (same layouts as ESL) */
  textLayout?: EslLayoutId;
  /** Font for product names and prices */
  fontFamily?: string;
  products?: Product[];
  /** Changing this replays the price change */
  priceTick?: number;
  maxHeight: number;
  maxWidth?: number;
}

const Price: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
  const { dollars, cents } = splitPrice(value);
  return (
    <span className={`${styles.price} ${className ?? ''}`}>
      <sup>$</sup>
      {dollars}
      <sup>{cents}</sup>
    </span>
  );
};

/** Regular price that drops away and is replaced by the offer price */
const PriceChange: React.FC<{ product: Product; animate: boolean }> = ({ product, animate }) => (
  <span className={`${styles.priceChange} ${animate ? styles.animatePrice : ''}`}>
    <Price value={product.price} className={styles.oldPrice} />
    <Price value={product.offer} className={styles.newPrice} />
  </span>
);

/** Price area of single-product content in each text layout */
const PriceBlock: React.FC<{ layout: EslLayoutId; product: Product; promo: boolean; animate: boolean }> = ({ layout, product, promo, animate }) => {
  const price = promo ? product.offer : product.price;
  const saving = Math.max(0, product.price - product.offer);
  switch (layout) {
    case 'save':
      return (
        <>
          <PriceChange product={product} animate={animate} />
          <span className={`${styles.badge} ${animate ? styles.badgeIn : ''}`}>Save {money(saving)}</span>
        </>
      );
    case 'wasnow':
      return (
        <>
          <PriceChange product={product} animate={animate} />
          <span className={`${styles.badge} ${animate ? styles.badgeIn : ''}`}>Was {money(product.price)}</span>
        </>
      );
    case 'percent':
      return (
        <>
          <span className={styles.tag}>{Math.round((saving / product.price) * 100)}% off</span>
          <Price value={price} />
        </>
      );
    case 'multibuy':
      return (
        <>
          <span className={styles.tag}>2 for</span>
          <Price value={price * 2} />
        </>
      );
    case 'members':
      return (
        <span className={styles.members}>
          <span>
            <small>Members</small>
            <Price value={product.offer} />
          </span>
          <span>
            <small>Others</small>
            <Price value={product.price} className={styles.otherPrice} />
          </span>
        </span>
      );
    case 'new':
      return (
        <>
          <span className={styles.newBadge}>New</span>
          <Price value={price} />
        </>
      );
    default:
      return (
        <>
          <Price value={price} />
          <span className={styles.unit}>{product.unitPrice}</span>
        </>
      );
  }
};

/** Branded screen content drawn at the model's real resolution inside its screen frame */
const ScreenContent: React.FC<ScreenContentProps> = ({
  model,
  mode,
  style,
  colour1,
  colour2,
  header,
  logoUrl,
  upload,
  blank,
  motion = 'static',
  layout = 'single',
  textLayout,
  fontFamily,
  products = [],
  priceTick = 0,
  maxHeight,
  maxWidth,
}) => {
  const animated = motion === 'animated';
  const rotate = animated && layout === 'single' && products.length > 1;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!rotate) return;
    const timer = setInterval(() => setIndex((i) => i + 1), ROTATE_MS);
    return () => clearInterval(timer);
  }, [rotate]);

  const W = model.width;
  const H = model.height;
  const { bezel, stand } = frameOf(model);
  const promo = mode === 'promo';
  const styleClass = promo ? PROMO_CLASS[style % PROMO_CLASS.length] : 'core';
  const product = products.length ? products[(rotate ? index : 0) % products.length] : undefined;
  const tiles = products.slice(0, model.shape === 'wide' ? 3 : 4);
  const text = textLayout ?? (promo ? 'save' : 'price');
  // Only layouts that show an old price animate the price change
  const animatePrice = promo && (text === 'save' || text === 'wasnow') && (animated || priceTick > 0);
  const portraitArt = model.shape === 'portrait';
  const artwork = portraitArt ? upload?.portraitUrl : upload?.landscapeUrl;
  const artworkIsVideo = portraitArt ? upload?.portraitVideo : upload?.landscapeVideo;

  const vars = {
    width: W,
    height: H,
    '--c1': colour1,
    '--c2': colour2,
    '--header-font': HEADER_FONT,
    '--chars': Math.max(header.length, 4),
    '--texture': promo ? 'none' : `url(${CORE_TEXTURES[style % CORE_TEXTURES.length]})`,
    // Frame borders in the screen's own pixels
    '--frame': `${Math.round(Math.min(W, H) * 0.035)}px`,
  } as React.CSSProperties;

  const brand = (
    <div className={styles.brand}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {logoUrl && <img src={logoUrl} alt="" className={styles.logo} />}
      <span className={styles.header}>{header}</span>
    </div>
  );

  return (
    <Scaled width={W + bezel * 2} height={H + bezel * 2 + stand} maxHeight={maxHeight} maxWidth={maxWidth}>
      <div className={styles.device}>
        <div className={styles.bezel} style={{ padding: bezel, borderRadius: bezel * 0.6 }}>
          <div
            className={`${styles.canvas} ${styles[model.shape]} ${styles[styleClass]} ${animated ? styles.animated : ''} ${text === 'product' ? styles.lProduct : ''}`}
            style={vars}
          >
            <div className={styles.bg} />

            {artwork ? (
              <div className={styles.artwork}>
                {artworkIsVideo ? (
                  <video src={artwork} autoPlay muted loop playsInline className={styles.media} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={artwork} alt="" className={styles.media} />
                )}
              </div>
            ) : (
              brand
            )}

            {artwork || blank || !product ? null : layout === 'single' ? (
              <div key={`${product.sku}-${priceTick}-${mode}-${text}`} className={styles.single} style={{ fontFamily }}>
                <div className={styles.artWrap}>
                  <ProductArt art={product.art} className={styles.art} />
                </div>
                <div className={styles.text}>
                  <p className={styles.name}>{product.name}</p>
                  <p className={styles.size}>{product.size}</p>
                </div>
                <div className={styles.priceArea}>
                  <PriceBlock layout={text} product={product} promo={promo} animate={animatePrice} />
                </div>
              </div>
            ) : (
              <div key={`multi-${priceTick}-${mode}`} className={styles.tiles} style={{ fontFamily }}>
                {tiles.map((p, i) => (
                  <div key={p.sku} className={styles.tile} style={{ animationDelay: `${i * 0.25}s` }}>
                    <ProductArt art={p.art} className={styles.tileArt} />
                    <div className={styles.tileText}>
                      <p className={styles.tileName}>{p.name}</p>
                      {promo ? <PriceChange product={p} animate={animatePrice} /> : <Price value={p.price} />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {stand > 0 && (
          <div className={styles.stand} style={{ height: stand }}>
            <span className={styles.pole} />
            <span className={styles.base} />
          </div>
        )}
      </div>
    </Scaled>
  );
};

export default ScreenContent;
