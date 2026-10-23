"use client";

import React, { useState } from 'react';
import styles from './LivePreviewPanel.module.css';
import PaperTicket from '../register/ui/PaperTicket';
import EslLabel from '../register/ui/EslLabel';
import ScreenContent from '../register/ui/ScreenContent';
import { Solution } from '../register/flow';
import { BackgroundSetup, BrandSetup, brandColours, FontSetup, PrintSetup, EslSetup, ScreenSetup } from '../register/state';
import { findSize, PROMO_TYPES, PROMO_TYPE_LAYOUT } from '../register/data';
import { TICKET_FONTS } from '../register/fonts';
import { findEsl, findScreen, ESL_MODELS, SCREEN_MODELS } from '../register/devices';
import { Orientation, paperTickets } from '../register/paperTickets';
import { SAMPLE_PRODUCTS } from '../register/products';

interface LivePreviewPanelProps {
  solutions: Solution[];
  brand: BrandSetup;
  font: FontSetup;
  everyday: BackgroundSetup;
  promo: BackgroundSetup;
  standardPrint: PrintSetup;
  promoPrint: PrintSetup;
  esl: EslSetup;
  screens: ScreenSetup;
}

const DEFAULT_PROMO = {
  key: PROMO_TYPES[0].id,
  name: PROMO_TYPES[0].name,
  recommended: PROMO_TYPE_LAYOUT[PROMO_TYPES[0].id],
  style: PROMO_TYPES[0].style,
  header: PROMO_TYPES[0].header,
};

const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({
  solutions,
  brand,
  font,
  everyday,
  promo,
  standardPrint,
  promoPrint,
  esl,
  screens,
}) => {
  const [activeTab, setActiveTab] = useState<'paper' | 'esl' | 'screens'>('paper');

  // Ensure active tab is within selected solutions if possible
  const currentTab = solutions.includes(activeTab)
    ? activeTab
    : solutions[0] || 'paper';

  const activeFont = TICKET_FONTS[font.fontIndex] || TICKET_FONTS[0];
  const sampleData = {
    description: 'Fresh Bananas',
    unit: 'per kg',
    price: 3.49,
    was: 4.20,
    qty: 2,
    footer: 'Great value every day',
  };

  // Paper Ticket calculations
  const tickets = paperTickets(brand, everyday, promo);
  const promoTicket = tickets.find((t) => t.promoType);
  const sizeId = promoPrint.sizes[0] || standardPrint.sizes[0] || 'p-a4';
  const size = findSize(sizeId) || findSize('p-a4')!;
  const orientation: Orientation = size.id.startsWith('p-') ? 'portrait' : 'landscape';

  const live = promoTicket || {
    ...DEFAULT_PROMO,
    bg: () => ({
      type: 'design' as const,
      kind: 'promo' as const,
      variant: DEFAULT_PROMO.style,
      header: DEFAULT_PROMO.header,
      ...brandColours(brand, 'promo'),
      logoUrl: brand.logoUrl,
    }),
  };

  const liveLayout = font.layouts?.[live.key] || live.recommended;
  const liveBg = live.bg(orientation);

  // ESL calculation
  const eslModelId = esl.selected[0] || 'zkc23q';
  const eslModel = findEsl(eslModelId) || findEsl('zkc23q') || ESL_MODELS[0];

  // Screen calculation
  const screenModelId = screens.selected[0] || 'zkl290';
  const screenModel = findScreen(screenModelId) || findScreen('zkl290') || SCREEN_MODELS[0];

  const renderPreview = () => {
    if (currentTab === 'esl') {
      if (!eslModel) return null;
      const layoutId = (esl.layouts['everyday'] as any) || 'price';
      return (
        <div className={styles.ticketWrap}>
          <EslLabel
            model={eslModel}
            mode="everyday"
            style={esl.everydayStyle || 0}
            header={esl.everydayHeader || 'Everyday Value'}
            fontFamily={activeFont.family}
            layout={layoutId}
            product={SAMPLE_PRODUCTS[0]}
            logoUrl={brand.logoUrl}
            maxHeight={220}
          />
        </div>
      );
    }

    if (currentTab === 'screens') {
      if (!screenModel) return null;
      const textLayoutId = (screens.layouts['everyday'] as any) || 'price';
      return (
        <div className={styles.ticketWrap}>
          <ScreenContent
            model={screenModel}
            mode="everyday"
            style={screens.everydayStyle || 0}
            colour1={brand.colour1 || brand.promo1}
            colour2={brand.colour2 || brand.promo2}
            header={screens.everydayHeader || 'Everyday Value'}
            fontFamily={activeFont.family}
            layout={screens.layout || 'single'}
            textLayout={textLayoutId}
            products={[SAMPLE_PRODUCTS[0]]}
            logoUrl={brand.logoUrl}
            maxHeight={220}
          />
        </div>
      );
    }

    // Default: Paper
    return (
      <div
        className={styles.ticketWrap}
        style={{
          aspectRatio: `${size.cellW} / ${size.cellH}`,
        }}
      >
        <PaperTicket
          bg={liveBg}
          orientation={orientation}
          layout={liveLayout}
          data={sampleData}
          fontFamily={activeFont.family}
          fill
        />
      </div>
    );
  };

  const hasMultiple = solutions.length > 1;

  return (
    <aside className={styles.panel}>
      <div className={styles.card}>
        <div className={styles.kicker}>YOUR LOOK, EVERYWHERE</div>

        <div className={styles.header}>
          <div className={styles.title}>
            {currentTab === 'paper' && 'Paper preview'}
            {currentTab === 'esl' && 'ESL preview'}
            {currentTab === 'screens' && 'Screen preview'}
          </div>
          <div className={styles.sub}>Sample content - updates as you personalise</div>
        </div>

        {hasMultiple && (
          <div className={styles.tabs} role="tablist" aria-label="Preview type">
            {solutions.map((s) => (
              <button
                key={s}
                type="button"
                className={`${styles.tab} ${currentTab === s ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(s)}
              >
                {s === 'paper' ? 'Paper' : s === 'esl' ? 'ESL' : 'Screens'}
              </button>
            ))}
          </div>
        )}

        <div className={styles.previewContainer}>
          {renderPreview()}
        </div>

        <p className={styles.caption}>One brand. Paper, ESL and Digital Screens.</p>
      </div>
    </aside>
  );
};

export default LivePreviewPanel;
