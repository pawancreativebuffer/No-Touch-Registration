"use client";

import React, { useState } from 'react';
import styles from './ShopSection.module.css';
import OrbitalHub, { OrbitalHubNode } from './OrbitalHub';
import { Solution } from '../register/flow';
import { PurchaseSetup, EslSetup, ScreenSetup } from '../register/state';
import PrintersPaperStep from '../register/steps/PrintersPaperStep';
import EslBuyStep from '../register/steps/EslBuyStep';
import ScreenBuyStep from '../register/steps/ScreenBuyStep';
import { eslLabelCount, screenCount } from '../register/pricing';

export type ShopLevel = 'shop-hub' | 'paper' | 'esl' | 'screens';

interface ShopSectionProps {
  solutions: Solution[];
  purchase: PurchaseSetup;
  onChangePurchase: (val: PurchaseSetup) => void;
  esl: EslSetup;
  onChangeEsl: (val: EslSetup) => void;
  screens: ScreenSetup;
  onChangeScreens: (val: ScreenSetup) => void;
  onBackToOverview?: () => void;
}

const ShopSection: React.FC<ShopSectionProps> = ({
  solutions,
  purchase,
  onChangePurchase,
  esl,
  onChangeEsl,
  screens,
  onChangeScreens,
  onBackToOverview,
}) => {
  const [level, setLevel] = useState<ShopLevel>('shop-hub');

  const isPaperSelected = solutions.includes('paper');
  const isEslSelected = solutions.includes('esl');
  const isScreensSelected = solutions.includes('screens');

  const isPaperDone = Boolean(purchase.printers.length > 0 || purchase.cart.length > 0);
  const isEslDone = Boolean(esl.selected.length > 0 && eslLabelCount(esl) > 0);
  const isScreensDone = Boolean(screens.selected.length > 0 && screenCount(screens) > 0);

  if (level === 'shop-hub') {
    const shopNodes: OrbitalHubNode[] = [
      {
        id: 'paper',
        label: 'Paper & Printers',
        subtitle: isPaperSelected ? 'Paper rolls, shells & printers' : 'Not selected',
        disabled: !isPaperSelected,
        completed: isPaperDone && isPaperSelected,
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
        ),
      },
      {
        id: 'esl',
        label: 'ESL Hardware',
        subtitle: isEslSelected ? 'Tags, shelf fixtures & access points' : 'Not selected',
        disabled: !isEslSelected,
        completed: isEslDone && isEslSelected,
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2"></rect>
            <line x1="6" y1="9" x2="10" y2="9"></line>
            <line x1="6" y1="13" x2="14" y2="13"></line>
            <circle cx="17" cy="9" r="1" fill="currentColor"></circle>
          </svg>
        ),
      },
      {
        id: 'screens',
        label: 'Digital Screens',
        subtitle: isScreensSelected ? 'Displays, mounts & network gear' : 'Not selected',
        disabled: !isScreensSelected,
        completed: isScreensDone && isScreensSelected,
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        ),
      },
    ];

    return (
      <div className={styles.sectionWrap}>
        {onBackToOverview && (
          <div className={styles.topBackBar}>
            <button type="button" className={styles.backBtn} onClick={onBackToOverview}>
              ← Setup
            </button>
          </div>
        )}
        <OrbitalHub
          center={{
            title: 'Shop',
            subtitle: onBackToOverview ? '← Back to Setup' : 'Hardware & Supplies',
            icon: (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            ),
            onClick: onBackToOverview,
          }}
          nodes={shopNodes}
          onNodeClick={(id) => {
            if (id === 'paper' && isPaperSelected) setLevel('paper');
            if (id === 'esl' && isEslSelected) setLevel('esl');
            if (id === 'screens' && isScreensSelected) setLevel('screens');
          }}
          caption="Click a hardware category to order. Use the centre or back button to return to setup."
        />
      </div>
    );
  }

  return (
    <div className={styles.sectionWrap}>
      <div className={styles.topBackBar}>
        <button type="button" className={styles.backBtn} onClick={() => setLevel('shop-hub')}>
          ← Shop hub
        </button>
      </div>

      <div>
        {level === 'paper' && (
          <PrintersPaperStep
            value={purchase}
            onChange={onChangePurchase}
            onBack={() => setLevel('shop-hub')}
            onNext={() => setLevel('shop-hub')}
            nextLabel="Save"
          />
        )}
        {level === 'esl' && (
          <EslBuyStep
            value={esl}
            onChange={onChangeEsl}
            onBack={() => setLevel('shop-hub')}
            onNext={() => setLevel('shop-hub')}
            nextLabel="Save"
          />
        )}
        {level === 'screens' && (
          <ScreenBuyStep
            value={screens}
            onChange={onChangeScreens}
            onBack={() => setLevel('shop-hub')}
            onNext={() => setLevel('shop-hub')}
            nextLabel="Save"
          />
        )}
      </div>
    </div>
  );
};

export default ShopSection;
