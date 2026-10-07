"use client";

import React, { useEffect, useState } from 'react';
import EslLabel, { eslWidthAt } from './EslLabel';
import ScreenContent from './ScreenContent';
import PaperTicket from './PaperTicket';
import { money } from '../data';
import { findEsl, findScreen } from '../devices';
import { Solution } from '../flow';
import { TICKET_FONTS } from '../fonts';
import { selectedEsls, selectedScreens } from '../pricing';
import { Product } from '../products';
import { paperTickets } from '../paperTickets';
import { eslTickets } from '../eslTickets';
import { screenTickets } from '../screenTickets';
import { BackgroundSetup, BrandSetup, EslSetup, FontSetup, ScreenSetup } from '../state';
import styles from './OutputShowcase.module.css';

interface OutputShowcaseProps {
  solutions: Solution[];
  brand: BrandSetup;
  font: FontSetup;
  /** Paper backgrounds, so the Paper ticket uses the retailer's own design */
  everyday: BackgroundSetup;
  promo: BackgroundSetup;
  esl: EslSetup;
  screens: ScreenSetup;
  products: Product[];
  /** Height of the tallest preview */
  height?: number;
}

const CYCLE_MS = 4000;

/** The same product and offer shown at once on every output the retailer chose, cycling through their products */
const OutputShowcase: React.FC<OutputShowcaseProps> = ({ solutions, brand, font, everyday, promo, esl, screens, products, height = 300 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (products.length < 2) return;
    const timer = setInterval(() => setIndex((i) => i + 1), CYCLE_MS);
    return () => clearInterval(timer);
  }, [products.length]);

  const product = products[index % products.length];
  // Paper shows the first promotion the retailer built (or Everyday), in the layout they picked for it
  const tickets = paperTickets(brand, everyday, promo);
  const paperTicket = tickets[1] ?? tickets[0];
  const paperLayout = font.layouts?.[paperTicket.key] ?? paperTicket.recommended;
  // Screens show the first promotion designed for screens (or Everyday)
  const screenList = screenTickets(screens);
  const screenTicket = screenList[1] ?? screenList[0];
  // ESL shows the first promotion designed for ESL (or Everyday)
  const eslList = eslTickets(esl);
  const eslTicket = eslList[1] ?? eslList[0];
  const eslModel = [...selectedEsls(esl)].reverse().find((l) => l.model.width >= 300)?.model ?? findEsl('zkc42q')!;
  const screenLines = selectedScreens(screens);
  const screenModel = screenLines.find((l) => l.model.shape !== 'bar')?.model ?? screenLines[0]?.model ?? findScreen('zkl550')!;
  const screenHeight = screenModel.shape === 'portrait' ? height + 60 : screenModel.shape === 'wide' ? height * 0.6 : 90;

  return (
    <div className={styles.showcase}>
      <div className={styles.outputs}>
        {solutions.includes('paper') && (
          <figure className={styles.output}>
            <div key={`paper-${index}`} className={styles.paper} style={{ height }}>
              <PaperTicket
                bg={paperTicket.bg('portrait')}
                orientation="portrait"
                layout={paperLayout}
                fontFamily={TICKET_FONTS[font.fontIndex].family}
                data={{
                  description: `${product.name} ${product.size}`,
                  unit: product.unitPrice,
                  price: paperTicket.promoType ? product.offer : product.price,
                  was: product.price,
                  qty: 2,
                  footer: 'Available while stocks last',
                }}
              />
            </div>
            <figcaption>Paper ticket</figcaption>
          </figure>
        )}

        {solutions.includes('esl') && (
          <figure className={styles.output}>
            <div key={`esl-${index}`} className={styles.fade} style={{ width: eslWidthAt(eslModel, height * 0.8), maxWidth: '100%' }}>
              <EslLabel
                model={eslModel}
                mode={eslTicket.mode}
                style={eslTicket.style}
                header={eslTicket.header}
                fontFamily={TICKET_FONTS[esl.fontIndex].family}
                layout={esl.layouts?.[eslTicket.key] ?? eslTicket.recommended}
                logoUrl={brand.logoUrl}
                product={product}
                maxHeight={height * 0.8}
              />
            </div>
            <figcaption>
              {eslModel.size} ESL {eslModel.model}
            </figcaption>
          </figure>
        )}

        {solutions.includes('screens') && (
          <figure className={`${styles.output} ${screenModel.shape !== 'portrait' ? styles.wideOutput : ''}`}>
            <ScreenContent
              model={screenModel}
              mode={screenTicket.mode}
              style={screenTicket.style}
              colour1={screenTicket.mode === 'promo' ? brand.promo1 : brand.colour1}
              colour2={screenTicket.mode === 'promo' ? brand.promo2 : brand.colour2}
              header={screenTicket.header}
              upload={screenTicket.upload}
              textLayout={screens.layouts?.[screenTicket.key] ?? screenTicket.recommended}
              fontFamily={TICKET_FONTS[screens.fontIndex ?? 1].family}
              logoUrl={brand.logoUrl}
              motion="static"
              layout="single"
              products={[product]}
              priceTick={index + 1}
              maxHeight={screenHeight}
            />
            <figcaption>
              {screenModel.size} screen {screenModel.model}
            </figcaption>
          </figure>
        )}
      </div>

      <div className={styles.now}>
        <span className={styles.live}>Live</span>
        <strong>{product.name}</strong>
        <span>
          {money(product.offer)} <s>{money(product.price)}</s> · SKU {product.sku}
        </span>
        <span className={styles.dots}>
          {products.map((p, i) => (
            <i key={p.sku} className={i === index % products.length ? styles.dotOn : ''} />
          ))}
        </span>
      </div>
    </div>
  );
};

export default OutputShowcase;
