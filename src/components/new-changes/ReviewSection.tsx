"use client";

import React, { useState } from 'react';
import styles from './MediaSection.module.css';
import { Solution } from '../register/flow';
import {
  BackgroundSetup,
  BrandSetup,
  DataSetup,
  FontSetup,
  GoLiveSetup,
  PurchaseSetup,
  EslSetup,
  ScreenSetup,
} from '../register/state';
import OrderStep from '../register/steps/OrderStep';
import GoLiveStep from '../register/steps/GoLiveStep';

interface ReviewSectionProps {
  solutions: Solution[];
  purchase: PurchaseSetup;
  esl: EslSetup;
  screens: ScreenSetup;
  orderPlaced: boolean;
  onSetOrderPlaced: (placed: boolean) => void;
  data: DataSetup;
  brand: BrandSetup;
  font: FontSetup;
  everyday: BackgroundSetup;
  promo: BackgroundSetup;
  goLive: GoLiveSetup;
  onChangeGoLive: (val: GoLiveSetup) => void;
  onGoToProducts: () => void;
  onBackToOverview?: () => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  solutions,
  purchase,
  esl,
  screens,
  orderPlaced,
  onSetOrderPlaced,
  data,
  brand,
  font,
  everyday,
  promo,
  goLive,
  onChangeGoLive,
  onGoToProducts,
  onBackToOverview,
}) => {
  const [tab, setTab] = useState<'order' | 'golive'>('order');

  const navNoop = {
    onBack: onBackToOverview ?? (() => {}),
    onNext: () => setTab('golive'),
    nextLabel: 'Go Live Checklist →',
  };

  return (
    <div className={styles.sectionWrap}>
      {onBackToOverview && (
        <div style={{ marginBottom: '14px' }}>
          <button type="button" className={styles.backBtn} onClick={onBackToOverview}>
            ← Setup
          </button>
        </div>
      )}
      <div style={{ marginBottom: '28px' }}>
        <h3
          style={{
            fontSize: '22px',
            fontWeight: 800,
            color: '#0f172a',
            margin: '0 0 8px 0',
            letterSpacing: '-0.02em',
          }}
        >
          Review &amp; Finish Signup
        </h3>
        <p
          style={{
            fontSize: '14px',
            color: '#64748b',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Review your equipment and subscriptions, place your order and verify device go-live.
        </p>
      </div>

      <div>
        {tab === 'order' && (
          <OrderStep
            solutions={solutions}
            purchase={purchase}
            esl={esl}
            screens={screens}
            placed={orderPlaced}
            onPlaced={() => onSetOrderPlaced(true)}
            {...navNoop}
          />
        )}
        {tab === 'golive' && (
          <GoLiveStep
            value={goLive}
            onChange={onChangeGoLive}
            data={data}
            solutions={solutions}
            brand={brand}
            font={font}
            everyday={everyday}
            promo={promo}
            esl={esl}
            screens={screens}
            onAddProducts={onGoToProducts}
            onBack={() => setTab('order')}
            onFinish={() => alert('Congratulations! Your Ticket-IT setup is ready to go live!')}
          />
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
