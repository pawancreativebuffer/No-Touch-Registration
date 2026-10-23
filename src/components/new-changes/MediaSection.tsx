"use client";

import React, { useEffect, useState } from 'react';
import styles from './MediaSection.module.css';
import OrbitalHub, { OrbitalHubNode } from './OrbitalHub';
import { Solution } from '../register/flow';
import {
  BackgroundSetup,
  BrandSetup,
  FontSetup,
  PrintSetup,
  EslSetup,
  ScreenSetup,
} from '../register/state';
import { PRINT_METHODS, PrintMethod, PROMO_TYPES, PromoTypeId } from '../register/data';
import PrintSizesStep from '../register/steps/PrintSizesStep';
import BackgroundStep from '../register/steps/BackgroundStep';
import FontLayoutStep from '../register/steps/FontLayoutStep';
import EslChooseStep from '../register/steps/EslChooseStep';
import EslDesignStep from '../register/steps/EslDesignStep';
import EslFontStep from '../register/steps/EslFontStep';
import ScreenChooseStep from '../register/steps/ScreenChooseStep';
import ScreenDesignStep from '../register/steps/ScreenDesignStep';
import ScreenMotionStep from '../register/steps/ScreenMotionStep';

export interface MediaBreadcrumbItem {
  label: string;
  onSelect: () => void;
}

export type MediaLevel =
  // Orbital Hub levels
  | 'media-hub'
  | 'paper-hub'
  | 'paper-everyday-hub'
  | 'paper-promo-hub'
  | 'esl-hub'
  | 'esl-everyday-hub'
  | 'esl-promo-hub'
  | 'screens-hub'
  | 'screens-everyday-hub'
  | 'screens-promo-hub'
  // Everyday tools
  | 'everyday-print-method'
  | 'everyday-orientation'
  | 'everyday-sizes'
  | 'everyday-backgrounds'
  | 'everyday-layout'
  // Promo tools
  | 'promo-types'
  | 'promo-print-method'
  | 'promo-orientation'
  | 'promo-sizes'
  | 'promo-backgrounds'
  | 'promo-layout'
  // ESL Everyday tools
  | 'esl-everyday-choose'
  | 'esl-everyday-design'
  | 'esl-everyday-layout'
  // ESL Promo tools
  | 'esl-promo-types'
  | 'esl-promo-design'
  | 'esl-promo-layout'
  // Screen Everyday tools
  | 'screens-everyday-choose'
  | 'screens-everyday-design'
  | 'screens-everyday-motion'
  // Screen Promo tools
  | 'screens-promo-types'
  | 'screens-promo-design'
  | 'screens-promo-motion';

interface MediaSectionProps {
  solutions: Solution[];
  brand: BrandSetup;
  font: FontSetup;
  onChangeFont: (font: FontSetup) => void;
  everyday: BackgroundSetup;
  onChangeEveryday: (val: BackgroundSetup) => void;
  promo: BackgroundSetup;
  onChangePromo: (val: BackgroundSetup) => void;
  standardPrint: PrintSetup;
  onChangeStandardPrint: (val: PrintSetup) => void;
  promoPrint: PrintSetup;
  onChangePromoPrint: (val: PrintSetup) => void;
  esl: EslSetup;
  onChangeEsl: (val: EslSetup) => void;
  screens: ScreenSetup;
  onChangeScreens: (val: ScreenSetup) => void;
  onGoToShop: () => void;
  onBackToOverview: () => void;
  onPathChange?: (items: MediaBreadcrumbItem[]) => void;
}

const MediaSection: React.FC<MediaSectionProps> = ({
  solutions,
  brand,
  font,
  onChangeFont,
  everyday,
  onChangeEveryday,
  promo,
  onChangePromo,
  standardPrint,
  onChangeStandardPrint,
  promoPrint,
  onChangePromoPrint,
  esl,
  onChangeEsl,
  screens,
  onChangeScreens,
  onGoToShop,
  onBackToOverview,
  onPathChange,
}) => {
  const [level, setLevel] = useState<MediaLevel>('media-hub');

  // If active level is in a solution that gets unselected from top pills, reset to media-hub
  useEffect(() => {
    if (level.startsWith('esl') && !solutions.includes('esl')) {
      setLevel('media-hub');
    }
    if (level.startsWith('screens') && !solutions.includes('screens')) {
      setLevel('media-hub');
    }
    if (level.startsWith('paper') && !solutions.includes('paper')) {
      setLevel('media-hub');
    }
  }, [solutions, level]);

  // Breadcrumb synchronization
  useEffect(() => {
    if (!onPathChange) return;

    const baseMedia: MediaBreadcrumbItem = {
      label: 'Media',
      onSelect: () => setLevel('media-hub'),
    };

    if (level === 'media-hub') {
      onPathChange([baseMedia]);
      return;
    }

    if (level === 'paper-hub') {
      onPathChange([
        baseMedia,
        { label: 'Paper', onSelect: () => setLevel('paper-hub') },
      ]);
      return;
    }

    if (level === 'paper-everyday-hub') {
      onPathChange([
        baseMedia,
        { label: 'Paper', onSelect: () => setLevel('paper-hub') },
        { label: 'Everyday', onSelect: () => setLevel('paper-everyday-hub') },
      ]);
      return;
    }

    if (level === 'everyday-print-method') {
      onPathChange([
        baseMedia,
        { label: 'Paper', onSelect: () => setLevel('paper-hub') },
        { label: 'Everyday', onSelect: () => setLevel('paper-everyday-hub') },
        { label: 'Printing method', onSelect: () => { } },
      ]);
      return;
    }

    if (level === 'everyday-orientation') {
      onPathChange([
        baseMedia,
        { label: 'Paper', onSelect: () => setLevel('paper-hub') },
        { label: 'Everyday', onSelect: () => setLevel('paper-everyday-hub') },
        { label: 'Orientation', onSelect: () => { } },
      ]);
      return;
    }

    if (level === 'everyday-sizes') {
      onPathChange([
        baseMedia,
        { label: 'Paper', onSelect: () => setLevel('paper-hub') },
        { label: 'Everyday', onSelect: () => setLevel('paper-everyday-hub') },
        { label: 'Sizes', onSelect: () => { } },
      ]);
      return;
    }

    if (level === 'everyday-backgrounds') {
      onPathChange([
        baseMedia,
        { label: 'Paper', onSelect: () => setLevel('paper-hub') },
        { label: 'Everyday', onSelect: () => setLevel('paper-everyday-hub') },
        { label: 'Backgrounds', onSelect: () => { } },
      ]);
      return;
    }

    if (level === 'everyday-layout') {
      onPathChange([
        baseMedia,
        { label: 'Paper', onSelect: () => setLevel('paper-hub') },
        { label: 'Everyday', onSelect: () => setLevel('paper-everyday-hub') },
        { label: 'Layout', onSelect: () => { } },
      ]);
      return;
    }

    if (level === 'paper-promo-hub') {
      onPathChange([
        baseMedia,
        { label: 'Paper', onSelect: () => setLevel('paper-hub') },
        { label: 'Promotions', onSelect: () => setLevel('paper-promo-hub') },
      ]);
      return;
    }

    if (level === 'promo-types') {
      onPathChange([
        baseMedia,
        { label: 'Paper', onSelect: () => setLevel('paper-hub') },
        { label: 'Promotions', onSelect: () => setLevel('paper-promo-hub') },
        { label: 'Promotion types', onSelect: () => { } },
      ]);
      return;
    }

    if (level === 'promo-print-method') {
      onPathChange([
        baseMedia,
        { label: 'Paper', onSelect: () => setLevel('paper-hub') },
        { label: 'Promotions', onSelect: () => setLevel('paper-promo-hub') },
        { label: 'Printing method', onSelect: () => { } },
      ]);
      return;
    }

    if (level === 'promo-orientation') {
      onPathChange([
        baseMedia,
        { label: 'Paper', onSelect: () => setLevel('paper-hub') },
        { label: 'Promotions', onSelect: () => setLevel('paper-promo-hub') },
        { label: 'Orientation', onSelect: () => { } },
      ]);
      return;
    }

    if (level === 'promo-sizes') {
      onPathChange([
        baseMedia,
        { label: 'Paper', onSelect: () => setLevel('paper-hub') },
        { label: 'Promotions', onSelect: () => setLevel('paper-promo-hub') },
        { label: 'Sizes', onSelect: () => { } },
      ]);
      return;
    }

    if (level === 'promo-backgrounds') {
      onPathChange([
        baseMedia,
        { label: 'Paper', onSelect: () => setLevel('paper-hub') },
        { label: 'Promotions', onSelect: () => setLevel('paper-promo-hub') },
        { label: 'Backgrounds', onSelect: () => { } },
      ]);
      return;
    }

    if (level === 'promo-layout') {
      onPathChange([
        baseMedia,
        { label: 'Paper', onSelect: () => setLevel('paper-hub') },
        { label: 'Promotions', onSelect: () => setLevel('paper-promo-hub') },
        { label: 'Layout', onSelect: () => { } },
      ]);
      return;
    }

    // ESL Hubs & Tools
    if (level === 'esl-hub') {
      onPathChange([
        baseMedia,
        { label: 'ESL', onSelect: () => setLevel('esl-hub') },
      ]);
      return;
    }

    if (level === 'esl-everyday-hub') {
      onPathChange([
        baseMedia,
        { label: 'ESL', onSelect: () => setLevel('esl-hub') },
        { label: 'Everyday', onSelect: () => setLevel('esl-everyday-hub') },
      ]);
      return;
    }

    if (level === 'esl-promo-hub') {
      onPathChange([
        baseMedia,
        { label: 'ESL', onSelect: () => setLevel('esl-hub') },
        { label: 'Promotions', onSelect: () => setLevel('esl-promo-hub') },
      ]);
      return;
    }

    if (level === 'esl-everyday-choose') {
      onPathChange([
        baseMedia,
        { label: 'ESL', onSelect: () => setLevel('esl-hub') },
        { label: 'Everyday', onSelect: () => setLevel('esl-everyday-hub') },
        { label: 'Hardware', onSelect: () => { } },
      ]);
      return;
    }

    if (level === 'esl-everyday-design') {
      onPathChange([
        baseMedia,
        { label: 'ESL', onSelect: () => setLevel('esl-hub') },
        { label: 'Everyday', onSelect: () => setLevel('esl-everyday-hub') },
        { label: 'Design', onSelect: () => { } },
      ]);
      return;
    }

    if (level === 'esl-everyday-layout') {
      onPathChange([
        baseMedia,
        { label: 'ESL', onSelect: () => setLevel('esl-hub') },
        { label: 'Everyday', onSelect: () => setLevel('esl-everyday-hub') },
        { label: 'Layout', onSelect: () => { } },
      ]);
      return;
    }

    if (level === 'esl-promo-types') {
      onPathChange([
        baseMedia,
        { label: 'ESL', onSelect: () => setLevel('esl-hub') },
        { label: 'Promotions', onSelect: () => setLevel('esl-promo-hub') },
        { label: 'Promotion types', onSelect: () => { } },
      ]);
      return;
    }

    if (level === 'esl-promo-design') {
      onPathChange([
        baseMedia,
        { label: 'ESL', onSelect: () => setLevel('esl-hub') },
        { label: 'Promotions', onSelect: () => setLevel('esl-promo-hub') },
        { label: 'Design', onSelect: () => { } },
      ]);
      return;
    }

    if (level === 'esl-promo-layout') {
      onPathChange([
        baseMedia,
        { label: 'ESL', onSelect: () => setLevel('esl-hub') },
        { label: 'Promotions', onSelect: () => setLevel('esl-promo-hub') },
        { label: 'Layout', onSelect: () => { } },
      ]);
      return;
    }

    // Screens Hubs & Tools
    if (level === 'screens-hub') {
      onPathChange([
        baseMedia,
        { label: 'Digital Screens', onSelect: () => setLevel('screens-hub') },
      ]);
      return;
    }

    if (level === 'screens-everyday-hub') {
      onPathChange([
        baseMedia,
        { label: 'Digital Screens', onSelect: () => setLevel('screens-hub') },
        { label: 'Everyday', onSelect: () => setLevel('screens-everyday-hub') },
      ]);
      return;
    }

    if (level === 'screens-promo-hub') {
      onPathChange([
        baseMedia,
        { label: 'Digital Screens', onSelect: () => setLevel('screens-hub') },
        { label: 'Promotions', onSelect: () => setLevel('screens-promo-hub') },
      ]);
      return;
    }

    if (level === 'screens-everyday-choose') {
      onPathChange([
        baseMedia,
        { label: 'Digital Screens', onSelect: () => setLevel('screens-hub') },
        { label: 'Everyday', onSelect: () => setLevel('screens-everyday-hub') },
        { label: 'Hardware', onSelect: () => { } },
      ]);
      return;
    }

    if (level === 'screens-everyday-design') {
      onPathChange([
        baseMedia,
        { label: 'Digital Screens', onSelect: () => setLevel('screens-hub') },
        { label: 'Everyday', onSelect: () => setLevel('screens-everyday-hub') },
        { label: 'Design', onSelect: () => { } },
      ]);
      return;
    }

    if (level === 'screens-everyday-motion') {
      onPathChange([
        baseMedia,
        { label: 'Digital Screens', onSelect: () => setLevel('screens-hub') },
        { label: 'Everyday', onSelect: () => setLevel('screens-everyday-hub') },
        { label: 'Layout', onSelect: () => { } },
      ]);
      return;
    }

    if (level === 'screens-promo-types') {
      onPathChange([
        baseMedia,
        { label: 'Digital Screens', onSelect: () => setLevel('screens-hub') },
        { label: 'Promotions', onSelect: () => setLevel('screens-promo-hub') },
        { label: 'Promotion types', onSelect: () => { } },
      ]);
      return;
    }

    if (level === 'screens-promo-design') {
      onPathChange([
        baseMedia,
        { label: 'Digital Screens', onSelect: () => setLevel('screens-hub') },
        { label: 'Promotions', onSelect: () => setLevel('screens-promo-hub') },
        { label: 'Design', onSelect: () => { } },
      ]);
      return;
    }

    if (level === 'screens-promo-motion') {
      onPathChange([
        baseMedia,
        { label: 'Digital Screens', onSelect: () => setLevel('screens-hub') },
        { label: 'Promotions', onSelect: () => setLevel('screens-promo-hub') },
        { label: 'Layout', onSelect: () => { } },
      ]);
      return;
    }
  }, [level, onPathChange]);

  // Back button renderer for sub-tools matching Image 2
  const renderBackBtn = (targetLevel: MediaLevel, label: string) => (
    <button
      type="button"
      className={styles.backBtn}
      onClick={() => setLevel(targetLevel)}
    >
      ← {label}
    </button>
  );

  /* =========================================================================
     LEVEL 1: MEDIA HUB (Matching Screenshot 1)
     Center: Media | Satellites: Paper, ESL, Digital Screens
  ========================================================================= */
  if (level === 'media-hub') {
    const isPaperSelected = solutions.includes('paper');
    const isEslSelected = solutions.includes('esl');
    const isScreensSelected = solutions.includes('screens');

    const isPaperDone = Boolean(
      standardPrint.method ||
      standardPrint.sizes.length > 0 ||
      promoPrint.sizes.length > 0 ||
      everyday.aiDone ||
      everyday.portraitChosen ||
      everyday.landscapeChosen ||
      everyday.orientationChosen ||
      everyday.backgroundChosen ||
      promo.promoTypes.length > 0
    );
    const isEslDone = Boolean(
      esl.everydayChosen ||
      esl.fontChosen ||
      esl.promoDesignChosen ||
      esl.layoutsChosen.length > 0 ||
      (esl.promoTypes.length > 0 && esl.promoDesignChosen)
    );
    const isScreensDone = Boolean(
      screens.everydayChosen ||
      screens.aiDone ||
      screens.motionChosen ||
      screens.promoDesignChosen ||
      screens.layoutsChosen.length > 0 ||
      (screens.promoTypes.length > 0 && (screens.promoDesignChosen || screens.motionChosen))
    );

    const mediaNodes: OrbitalHubNode[] = [
      {
        id: 'paper',
        label: 'Paper',
        subtitle: isPaperSelected ? 'Promotions & Everyday' : 'Not selected',
        disabled: !isPaperSelected,
        completed: isPaperDone && isPaperSelected,
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        ),
      },
      {
        id: 'esl',
        label: 'ESL',
        subtitle: isEslSelected ? 'Promotions & Everyday' : 'Not selected',
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
        subtitle: isScreensSelected ? 'Promotions & Everyday' : 'Not selected',
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
        <div className={styles.topBackBar}>
          <button type="button" className={styles.backBtn} onClick={onBackToOverview}>
            ← Setup
          </button>
        </div>
        <OrbitalHub
          center={{
            title: 'Media',
            subtitle: '← Back one level',
            icon: (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            ),
            onClick: onBackToOverview,
          }}
          nodes={mediaNodes}
          onNodeClick={(id) => {
            if (id === 'paper' && isPaperSelected) setLevel('paper-hub');
            if (id === 'esl' && isEslSelected) setLevel('esl-hub');
            if (id === 'screens' && isScreensSelected) setLevel('screens-hub');
          }}
          caption="Click a tool to go deeper. Use the centre or breadcrumb to go back."
        />
      </div>
    );
  }

  /* =========================================================================
     LEVEL 2: PAPER HUB (Matching Screenshot 2)
     Center: Paper | Satellites: Everyday, Promotions
  ========================================================================= */
  if (level === 'paper-hub') {
    const isEverydayDone = Boolean(
      standardPrint.method ||
      standardPrint.sizes.length > 0 ||
      everyday.portraitChosen ||
      everyday.landscapeChosen ||
      everyday.aiDone ||
      everyday.orientationChosen
    );
    const isPromoDone = Boolean(
      promo.promoTypes.length > 0 ||
      promoPrint.method ||
      promo.portraitChosen ||
      promo.landscapeChosen ||
      promoPrint.sizes.length > 0 ||
      promo.aiDone ||
      promo.orientationChosen
    );

    const paperNodes: OrbitalHubNode[] = [
      {
        id: 'everyday',
        label: 'Everyday',
        subtitle: 'Everyday product tickets',
        completed: isEverydayDone,
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        ),
      },
      {
        id: 'promo',
        label: 'Promotions',
        subtitle: 'Specials, sales & offers',
        completed: isPromoDone,
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
        ),
      },
    ];

    return (
      <div className={styles.sectionWrap}>
        <div className={styles.topBackBar}>
          <button type="button" className={styles.backBtn} onClick={() => setLevel('media-hub')}>
            ← Media hub
          </button>
        </div>
        <OrbitalHub
          center={{
            title: 'Paper',
            subtitle: '← Back one level',
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            ),
            onClick: () => setLevel('media-hub'),
          }}
          nodes={paperNodes}
          onNodeClick={(id) => {
            if (id === 'everyday') setLevel('paper-everyday-hub');
            if (id === 'promo') setLevel('paper-promo-hub');
          }}
          caption="Click a tool to go deeper. Use the centre or breadcrumb to go back."
        />
      </div>
    );
  }

  /* =========================================================================
     LEVEL 3: PAPER EVERYDAY HUB (Matching Screenshot 3)
     Center: Everyday | Satellites (Pentagon):
     0: Printing method, 1: Orientation, 2: Sizes, 3: Backgrounds, 4: Layout
  ========================================================================= */
  if (level === 'paper-everyday-hub') {
    const everydayNodes: OrbitalHubNode[] = [
      {
        id: 'printing-method',
        label: 'Printing method',
        subtitle: 'Choose your options',
        completed: Boolean(standardPrint.method),
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
        ),
      },
      {
        id: 'orientation',
        label: 'Orientation',
        subtitle: 'Choose your options',
        completed: Boolean(everyday.orientationChosen),
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"></rect>
            <path d="M8 21h8"></path>
            <path d="M12 17v4"></path>
          </svg>
        ),
      },
      {
        id: 'sizes',
        label: 'Sizes',
        subtitle: 'Choose your options',
        completed: Boolean(standardPrint.sizes.length > 0),
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        ),
      },
      {
        id: 'backgrounds',
        label: 'Backgrounds',
        subtitle: 'Choose, upload or use AI',
        completed: Boolean(
          everyday.backgroundChosen ||
          everyday.portraitChosen ||
          everyday.landscapeChosen ||
          everyday.aiDone ||
          Boolean(everyday.uploadUrl)
        ),
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
          </svg>
        ),
      },
      {
        id: 'layout',
        label: 'Layout',
        subtitle: 'Headers & field layouts',
        completed: Boolean(font.layoutsChosen.includes('everyday') || font.layoutChosen),
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        ),
      },
    ];

    return (
      <div className={styles.sectionWrap}>
        <div className={styles.topBackBar}>
          <button type="button" className={styles.backBtn} onClick={() => setLevel('paper-hub')}>
            ← Paper hub
          </button>
        </div>
        <OrbitalHub
          center={{
            title: 'Everyday',
            subtitle: '← Back one level',
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            ),
            onClick: () => setLevel('paper-hub'),
          }}
          nodes={everydayNodes}
          onNodeClick={(id) => {
            if (id === 'printing-method') setLevel('everyday-print-method');
            if (id === 'orientation') setLevel('everyday-orientation');
            if (id === 'sizes') setLevel('everyday-sizes');
            if (id === 'backgrounds') setLevel('everyday-backgrounds');
            if (id === 'layout') setLevel('everyday-layout');
          }}
          caption="Click a tool to go deeper. Use the centre or breadcrumb to go back."
        />
      </div>
    );
  }

  /* =========================================================================
     TOOL VIEW: Everyday Printing Method
  ========================================================================= */
  if (level === 'everyday-print-method') {
    const methods: { id: PrintMethod; title: string; subtitle: string; desc: string; icon: string }[] = [
      {
        id: 'colour',
        title: 'Full Colour Printer',
        subtitle: 'Blank perforated stock',
        desc: 'Print your tickets to a full colour laser printer directly on blank micro-perforated stock.',
        icon: '🎨',
      },
      {
        id: 'mono',
        title: 'Black & White Laser',
        subtitle: 'Pre-printed branded shells',
        desc: 'Print live ticket content and prices onto pre-printed perforated shells using standard black and white laser printers.',
        icon: '📄',
      },
    ];

    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('paper-everyday-hub', 'Everyday hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Printing Method</h3>
            <p className={styles.subStepDesc}>Choose how your Everyday product tickets will be printed in store.</p>
          </div>
        </div>

        <div className={styles.optionsGrid}>
          {methods.map((m) => {
            const isSelected = standardPrint.method === m.id;
            return (
              <div
                key={m.id}
                className={`${styles.optionCard} ${isSelected ? styles.optionCardActive : ''}`}
                onClick={() => onChangeStandardPrint({ ...standardPrint, method: m.id })}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardIconWrap}>{m.icon}</div>
                  <div className={styles.radioCircle}>
                    {isSelected && <div className={styles.radioDot} />}
                  </div>
                </div>
                <div className={styles.cardTitle}>{m.title}</div>
                <div className={styles.cardSubtitle}>{m.subtitle}</div>
                <div className={styles.cardDesc}>{m.desc}</div>
              </div>
            );
          })}
        </div>

        <div className={styles.actionFooter}>
          <button
            type="button"
            className={styles.doneBtn}
            onClick={() => {
              if (!standardPrint.method) {
                onChangeStandardPrint({ ...standardPrint, method: 'colour' });
              }
              setLevel('paper-everyday-hub');
            }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
     TOOL VIEW: Everyday Orientation
  ========================================================================= */
  if (level === 'everyday-orientation') {
    const currentOrientation = everyday.orientation || 'both';

    const handleSelectOrientation = (mode: 'portrait' | 'landscape' | 'both') => {
      onChangeEveryday({
        ...everyday,
        orientation: mode,
        orientationChosen: true,
      });
    };

    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('paper-everyday-hub', 'Everyday hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Ticket Orientation</h3>
            <p className={styles.subStepDesc}>Select preferred layout orientation for your Everyday product tickets.</p>
          </div>
        </div>

        <div className={styles.optionsGrid}>
          {/* Portrait Card */}
          <div
            className={`${styles.optionCard} ${currentOrientation === 'portrait' ? styles.optionCardActive : ''}`}
            onClick={() => handleSelectOrientation('portrait')}
          >
            <div className={styles.cardHeader}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>PORTRAIT</span>
              <div className={styles.radioCircle}>
                {currentOrientation === 'portrait' && <div className={styles.radioDot} />}
              </div>
            </div>
            <div className={styles.visualFrame}>
              <div className={styles.miniTicketPortrait}>
                <div className={styles.miniHeader} />
                <div className={styles.miniLine} />
                <div className={styles.miniLine} style={{ width: '60%' }} />
                <div className={styles.miniPrice} />
              </div>
            </div>
            <div className={styles.cardTitle}>Portrait Format</div>
            <div className={styles.cardSubtitle}>Vertical Tickets</div>
            <div className={styles.cardDesc}>Ideal for shelf edges, bottle talkers, and narrow vertical display channels.</div>
          </div>

          {/* Landscape Card */}
          <div
            className={`${styles.optionCard} ${currentOrientation === 'landscape' ? styles.optionCardActive : ''}`}
            onClick={() => handleSelectOrientation('landscape')}
          >
            <div className={styles.cardHeader}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>LANDSCAPE</span>
              <div className={styles.radioCircle}>
                {currentOrientation === 'landscape' && <div className={styles.radioDot} />}
              </div>
            </div>
            <div className={styles.visualFrame}>
              <div className={styles.miniTicketLandscape}>
                <div className={styles.miniHeader} />
                <div className={styles.miniLine} />
                <div className={styles.miniPrice} />
              </div>
            </div>
            <div className={styles.cardTitle}>Landscape Format</div>
            <div className={styles.cardSubtitle}>Horizontal Tickets</div>
            <div className={styles.cardDesc}>Ideal for wide shelf talkers, promotional headers, end-caps, and checkout displays.</div>
          </div>

          {/* Both Card */}
          <div
            className={`${styles.optionCard} ${currentOrientation === 'both' ? styles.optionCardActive : ''}`}
            onClick={() => handleSelectOrientation('both')}
          >
            <div className={styles.cardHeader}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>BOTH FORMATS</span>
              <div className={styles.radioCircle}>
                {currentOrientation === 'both' && <div className={styles.radioDot} />}
              </div>
            </div>
            <div className={styles.visualFrame} style={{ gap: '10px' }}>
              <div className={styles.miniTicketPortrait} style={{ width: '32px', height: '52px' }}>
                <div className={styles.miniHeader} />
                <div className={styles.miniPrice} />
              </div>
              <div className={styles.miniTicketLandscape} style={{ width: '56px', height: '36px' }}>
                <div className={styles.miniHeader} />
                <div className={styles.miniPrice} />
              </div>
            </div>
            <div className={styles.cardTitle}>Both Formats</div>
            <div className={styles.cardSubtitle}>Maximum Flexibility</div>
            <div className={styles.cardDesc}>Configures templates for both portrait and landscape so you can print any size anywhere.</div>
          </div>
        </div>

        <div className={styles.actionFooter}>
          <button
            type="button"
            className={styles.doneBtn}
            onClick={() => {
              if (!everyday.orientationChosen) {
                onChangeEveryday({
                  ...everyday,
                  orientation: everyday.orientation || 'both',
                  orientationChosen: true,
                });
              }
              setLevel('paper-everyday-hub');
            }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
     TOOL VIEW: Everyday Sizes
  ========================================================================= */
  if (level === 'everyday-sizes') {
    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('paper-everyday-hub', 'Everyday hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Everyday Ticket Sizes</h3>
            <p className={styles.subStepDesc}>Choose the ticket sizes you use for everyday product pricing.</p>
          </div>
        </div>

        <div className={styles.stepContainer}>
          <PrintSizesStep
            kind="Everyday"
            value={standardPrint}
            onChange={onChangeStandardPrint}
            onBack={() => setLevel('paper-everyday-hub')}
            onNext={() => setLevel('paper-everyday-hub')}
            nextLabel="Done"
            hideMethod
            hideTitleBar
          />
        </div>
      </div>
    );
  }

  /* =========================================================================
     TOOL VIEW: Everyday Backgrounds
  ========================================================================= */
  if (level === 'everyday-backgrounds') {
    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('paper-everyday-hub', 'Everyday hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Everyday Ticket Backgrounds</h3>
            <p className={styles.subStepDesc}>Select curated textures, let AI generate custom backgrounds, or upload your artwork.</p>
          </div>
        </div>

        <div className={styles.stepContainer}>
          <BackgroundStep
            kind="everyday"
            value={everyday}
            onChange={onChangeEveryday}
            brand={brand}
            sizes={standardPrint.sizes}
            onBack={() => setLevel('paper-everyday-hub')}
            onNext={() => {
              onChangeEveryday({
                ...everyday,
                backgroundChosen: true,
                portraitChosen: everyday.portraitChosen || true,
                landscapeChosen: everyday.landscapeChosen || true,
              });
              setLevel('paper-everyday-hub');
            }}
            nextLabel="Done"
          />
        </div>
      </div>
    );
  }

  /* =========================================================================
     TOOL VIEW: Everyday Layout
  ========================================================================= */
  if (level === 'everyday-layout') {
    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('paper-everyday-hub', 'Everyday hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Everyday Layout</h3>
            <p className={styles.subStepDesc}>Pick ticket header title and field layout for everyday tickets.</p>
          </div>
        </div>

        <div className={styles.stepContainer}>
          <FontLayoutStep
            value={font}
            onChange={onChangeFont}
            everyday={everyday}
            onChangeEveryday={onChangeEveryday}
            promo={promo}
            brand={brand}
            targetMode="everyday"
            onOrderStock={onGoToShop}
            onBack={() => setLevel('paper-everyday-hub')}
            onNext={() => setLevel('paper-everyday-hub')}
            nextLabel="Done"
          />
        </div>
      </div>
    );
  }

  /* =========================================================================
     LEVEL 3: PAPER PROMOTIONS HUB
     Center: Promotions | Satellites:
     0: Promotion types, 1: Sizes, 2: Backgrounds, 3: Layout
  ========================================================================= */
  if (level === 'paper-promo-hub') {
    const promoNodes: OrbitalHubNode[] = [
      {
        id: 'promo-types',
        label: 'Promotion types',
        subtitle: 'Specials, sales & offers',
        completed: Boolean(promo.promoTypes.length > 0),
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
        ),
      },
      {
        id: 'promo-print-method',
        label: 'Printing method',
        subtitle: 'Choose your options',
        completed: Boolean(promoPrint.method),
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
        ),
      },
      {
        id: 'promo-orientation',
        label: 'Orientation',
        subtitle: 'Choose your options',
        completed: Boolean(promo.orientationChosen),
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"></rect>
            <path d="M8 21h8"></path>
            <path d="M12 17v4"></path>
          </svg>
        ),
      },
      {
        id: 'promo-sizes',
        label: 'Sizes',
        subtitle: 'Choose your options',
        completed: Boolean(promoPrint.sizes.length > 0),
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        ),
      },
      {
        id: 'promo-backgrounds',
        label: 'Backgrounds',
        subtitle: 'Choose, upload or use AI',
        completed: Boolean(
          promo.backgroundChosen ||
          promo.aiDone ||
          Boolean(promo.uploadUrl) ||
          Object.keys(promo.typeUploads || {}).length > 0 ||
          Object.keys(promo.typeStyles || {}).length > 0 ||
          promo.portraitChosen ||
          promo.landscapeChosen
        ),
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
          </svg>
        ),
      },
      {
        id: 'promo-layout',
        label: 'Layout',
        subtitle: 'Headers & field layouts',
        completed: Boolean(font.layoutsChosen.some((k) => k !== 'everyday') || font.layoutChosen),
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        ),
      },
    ];

    return (
      <div className={styles.sectionWrap}>
        <div className={styles.topBackBar}>
          <button type="button" className={styles.backBtn} onClick={() => setLevel('paper-hub')}>
            ← Paper hub
          </button>
        </div>
        <OrbitalHub
          center={{
            title: 'Promotions',
            subtitle: '← Back one level',
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
            ),
            onClick: () => setLevel('paper-hub'),
          }}
          nodes={promoNodes}
          onNodeClick={(id) => {
            if (id === 'promo-types') setLevel('promo-types');
            if (id === 'promo-print-method') setLevel('promo-print-method');
            if (id === 'promo-orientation') setLevel('promo-orientation');
            if (id === 'promo-sizes') setLevel('promo-sizes');
            if (id === 'promo-backgrounds') setLevel('promo-backgrounds');
            if (id === 'promo-layout') setLevel('promo-layout');
          }}
          caption="Click a tool to go deeper. Use the centre or breadcrumb to go back."
        />
      </div>
    );
  }

  /* =========================================================================
     TOOL VIEW: Promotion Types
  ========================================================================= */
  if (level === 'promo-types') {
    const togglePromoType = (typeId: PromoTypeId) => {
      const exists = promo.promoTypes.includes(typeId);
      const updated = exists
        ? promo.promoTypes.filter((t) => t !== typeId)
        : [...promo.promoTypes, typeId];
      onChangePromo({ ...promo, promoTypes: updated });
    };

    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('paper-promo-hub', 'Promotions hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Promotion Types</h3>
            <p className={styles.subStepDesc}>Select which promotional ticket campaigns you run in your store.</p>
          </div>
        </div>

        <div className={styles.optionsGrid}>
          {PROMO_TYPES.map((pt) => {
            const isSelected = promo.promoTypes.includes(pt.id);
            return (
              <div
                key={pt.id}
                className={`${styles.optionCard} ${isSelected ? styles.optionCardActive : ''}`}
                onClick={() => togglePromoType(pt.id)}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardIconWrap}>🏷️</div>
                  <div className={styles.radioCircle}>
                    {isSelected && <div className={styles.radioDot} />}
                  </div>
                </div>
                <div className={styles.cardTitle}>{pt.name}</div>
                <div className={styles.cardSubtitle}>Header: &ldquo;{pt.header}&rdquo;</div>
                <div className={styles.cardDesc}>{pt.description}</div>
              </div>
            );
          })}
        </div>

        <div className={styles.actionFooter}>
          <button
            type="button"
            className={styles.doneBtn}
            onClick={() => {
              if (promo.promoTypes.length === 0) {
                onChangePromo({ ...promo, promoTypes: ['special', 'sale'] });
              }
              setLevel('paper-promo-hub');
            }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
     TOOL VIEW: Promo Printing Method
  ========================================================================= */
  if (level === 'promo-print-method') {
    const methods: { id: PrintMethod; title: string; subtitle: string; desc: string; icon: string }[] = [
      {
        id: 'colour',
        title: 'Full Colour Printer',
        subtitle: 'Blank perforated stock',
        desc: 'Print your promotional tickets to a full colour laser printer directly on blank micro-perforated stock.',
        icon: '🎨',
      },
      {
        id: 'mono',
        title: 'Black & White Laser',
        subtitle: 'Pre-printed branded shells',
        desc: 'Print live promotional ticket content and prices onto pre-printed perforated shells using standard black and white laser printers.',
        icon: '📄',
      },
    ];

    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('paper-promo-hub', 'Promotions hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Printing Method</h3>
            <p className={styles.subStepDesc}>Choose how your Promotional product tickets will be printed in store.</p>
          </div>
        </div>

        <div className={styles.optionsGrid}>
          {methods.map((m) => {
            const isSelected = promoPrint.method === m.id;
            return (
              <div
                key={m.id}
                className={`${styles.optionCard} ${isSelected ? styles.optionCardActive : ''}`}
                onClick={() => onChangePromoPrint({ ...promoPrint, method: m.id })}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardIconWrap}>{m.icon}</div>
                  <div className={styles.radioCircle}>
                    {isSelected && <div className={styles.radioDot} />}
                  </div>
                </div>
                <div className={styles.cardTitle}>{m.title}</div>
                <div className={styles.cardSubtitle}>{m.subtitle}</div>
                <div className={styles.cardDesc}>{m.desc}</div>
              </div>
            );
          })}
        </div>

        <div className={styles.actionFooter}>
          <button
            type="button"
            className={styles.doneBtn}
            onClick={() => {
              if (!promoPrint.method) {
                onChangePromoPrint({ ...promoPrint, method: 'colour' });
              }
              setLevel('paper-promo-hub');
            }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
     TOOL VIEW: Promo Orientation
  ========================================================================= */
  if (level === 'promo-orientation') {
    const currentOrientation = promo.orientation || 'both';

    const handleSelectOrientation = (mode: 'portrait' | 'landscape' | 'both') => {
      onChangePromo({
        ...promo,
        orientation: mode,
        orientationChosen: true,
      });
    };

    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('paper-promo-hub', 'Promotions hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Promotional Ticket Orientation</h3>
            <p className={styles.subStepDesc}>Select preferred layout orientation for your Promotional product tickets.</p>
          </div>
        </div>

        <div className={styles.optionsGrid}>
          {/* Portrait Card */}
          <div
            className={`${styles.optionCard} ${currentOrientation === 'portrait' ? styles.optionCardActive : ''}`}
            onClick={() => handleSelectOrientation('portrait')}
          >
            <div className={styles.cardHeader}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>PORTRAIT</span>
              <div className={styles.radioCircle}>
                {currentOrientation === 'portrait' && <div className={styles.radioDot} />}
              </div>
            </div>
            <div className={styles.visualFrame}>
              <div className={styles.miniTicketPortrait}>
                <div className={styles.miniHeader} style={{ background: '#eb2771' }} />
                <div className={styles.miniLine} />
                <div className={styles.miniLine} style={{ width: '60%' }} />
                <div className={styles.miniPrice} style={{ background: '#eb2771' }} />
              </div>
            </div>
            <div className={styles.cardTitle}>Portrait Format</div>
            <div className={styles.cardSubtitle}>Vertical Tickets</div>
            <div className={styles.cardDesc}>Ideal for shelf edges, bottle talkers, and narrow vertical display channels.</div>
          </div>

          {/* Landscape Card */}
          <div
            className={`${styles.optionCard} ${currentOrientation === 'landscape' ? styles.optionCardActive : ''}`}
            onClick={() => handleSelectOrientation('landscape')}
          >
            <div className={styles.cardHeader}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>LANDSCAPE</span>
              <div className={styles.radioCircle}>
                {currentOrientation === 'landscape' && <div className={styles.radioDot} />}
              </div>
            </div>
            <div className={styles.visualFrame}>
              <div className={styles.miniTicketLandscape}>
                <div className={styles.miniHeader} style={{ background: '#eb2771' }} />
                <div className={styles.miniLine} />
                <div className={styles.miniPrice} style={{ background: '#eb2771' }} />
              </div>
            </div>
            <div className={styles.cardTitle}>Landscape Format</div>
            <div className={styles.cardSubtitle}>Horizontal Tickets</div>
            <div className={styles.cardDesc}>Ideal for wide shelf talkers, promotional headers, end-caps, and checkout displays.</div>
          </div>

          {/* Both Card */}
          <div
            className={`${styles.optionCard} ${currentOrientation === 'both' ? styles.optionCardActive : ''}`}
            onClick={() => handleSelectOrientation('both')}
          >
            <div className={styles.cardHeader}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>BOTH FORMATS</span>
              <div className={styles.radioCircle}>
                {currentOrientation === 'both' && <div className={styles.radioDot} />}
              </div>
            </div>
            <div className={styles.visualFrame} style={{ gap: '10px' }}>
              <div className={styles.miniTicketPortrait} style={{ width: '32px', height: '52px' }}>
                <div className={styles.miniHeader} style={{ background: '#eb2771' }} />
                <div className={styles.miniPrice} style={{ background: '#eb2771' }} />
              </div>
              <div className={styles.miniTicketLandscape} style={{ width: '56px', height: '36px' }}>
                <div className={styles.miniHeader} style={{ background: '#eb2771' }} />
                <div className={styles.miniPrice} style={{ background: '#eb2771' }} />
              </div>
            </div>
            <div className={styles.cardTitle}>Both Formats</div>
            <div className={styles.cardSubtitle}>Maximum Flexibility</div>
            <div className={styles.cardDesc}>Configures templates for both portrait and landscape so you can print any size anywhere.</div>
          </div>
        </div>

        <div className={styles.actionFooter}>
          <button
            type="button"
            className={styles.doneBtn}
            onClick={() => {
              if (!promo.orientationChosen) {
                onChangePromo({
                  ...promo,
                  orientation: promo.orientation || 'both',
                  orientationChosen: true,
                });
              }
              setLevel('paper-promo-hub');
            }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
     TOOL VIEW: Promo Sizes
  ========================================================================= */
  if (level === 'promo-sizes') {
    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('paper-promo-hub', 'Promotions hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Promotional Ticket Sizes</h3>
            <p className={styles.subStepDesc}>Choose ticket sizes used for promotional campaigns and special offers.</p>
          </div>
        </div>

        <div className={styles.stepContainer}>
          <PrintSizesStep
            kind="Promotional"
            value={promoPrint}
            onChange={onChangePromoPrint}
            onBack={() => setLevel('paper-promo-hub')}
            onNext={() => setLevel('paper-promo-hub')}
            nextLabel="Done"
            hideMethod
            hideTitleBar
          />
        </div>
      </div>
    );
  }

  /* =========================================================================
     TOOL VIEW: Promo Backgrounds
  ========================================================================= */
  if (level === 'promo-backgrounds') {
    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('paper-promo-hub', 'Promotions hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Promotional Ticket Backgrounds</h3>
            <p className={styles.subStepDesc}>Select high-impact promo backgrounds, generate with AI, or upload templates.</p>
          </div>
        </div>

        <div className={styles.stepContainer}>
          <BackgroundStep
            kind="promo"
            value={promo}
            onChange={onChangePromo}
            brand={brand}
            sizes={promoPrint.sizes}
            onBack={() => setLevel('paper-promo-hub')}
            onNext={() => {
              onChangePromo({ ...promo, backgroundChosen: true });
              setLevel('paper-promo-hub');
            }}
            nextLabel="Done"
          />
        </div>
      </div>
    );
  }

  /* =========================================================================
     TOOL VIEW: Promo Layout
  ========================================================================= */
  if (level === 'promo-layout') {
    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('paper-promo-hub', 'Promotions hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Promotional Layout</h3>
            <p className={styles.subStepDesc}>Choose ticket field layout for promotional designs.</p>
          </div>
        </div>

        <div className={styles.stepContainer}>
          <FontLayoutStep
            value={font}
            onChange={onChangeFont}
            everyday={everyday}
            promo={promo}
            brand={brand}
            targetMode="promo"
            onOrderStock={onGoToShop}
            onBack={() => setLevel('paper-promo-hub')}
            onNext={() => setLevel('paper-promo-hub')}
            nextLabel="Done"
          />
        </div>
      </div>
    );
  }

  /* =========================================================================
     LEVEL 2: ESL HUB
     Center: ESL | Satellites: Everyday, Promotions
  ========================================================================= */
  if (level === 'esl-hub') {
    const isEverydayDone = Boolean(esl.everydayChosen || esl.fontChosen || esl.layoutsChosen.includes('everyday'));
    const isPromoDone = Boolean(esl.promoTypes.length > 0);

    const eslNodes: OrbitalHubNode[] = [
      {
        id: 'everyday',
        label: 'Everyday',
        subtitle: 'Design & layout',
        completed: isEverydayDone,
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
        id: 'promo',
        label: 'Promotions',
        subtitle: 'Promotional campaigns & styling',
        completed: isPromoDone,
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
        ),
      },
    ];

    return (
      <div className={styles.sectionWrap}>
        <div className={styles.topBackBar}>
          <button type="button" className={styles.backBtn} onClick={() => setLevel('media-hub')}>
            ← Media hub
          </button>
        </div>
        <OrbitalHub
          center={{
            title: 'ESL',
            subtitle: '← Back one level',
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="6" y1="9" x2="10" y2="9"></line>
                <line x1="6" y1="13" x2="14" y2="13"></line>
                <circle cx="17" cy="9" r="1" fill="currentColor"></circle>
              </svg>
            ),
            onClick: () => setLevel('media-hub'),
          }}
          nodes={eslNodes}
          onNodeClick={(id) => {
            if (id === 'everyday') setLevel('esl-everyday-hub');
            if (id === 'promo') setLevel('esl-promo-hub');
          }}
          caption="Click a tool to go deeper. Use the centre or breadcrumb to go back."
        />
      </div>
    );
  }

  /* =========================================================================
     LEVEL 3: ESL EVERYDAY HUB
     Center: Everyday | Satellites: Design, Layout
  ========================================================================= */
  if (level === 'esl-everyday-hub') {
    const eslEverydayNodes: OrbitalHubNode[] = [
      {
        id: 'esl-everyday-design',
        label: 'Design',
        subtitle: 'Titles & template styles',
        completed: Boolean(esl.everydayChosen),
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
          </svg>
        ),
      },
      {
        id: 'esl-everyday-layout',
        label: 'Layout',
        subtitle: 'Price & field layouts',
        completed: Boolean(esl.layoutsChosen.includes('everyday')),
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        ),
      },
    ];

    return (
      <div className={styles.sectionWrap}>
        <div className={styles.topBackBar}>
          <button type="button" className={styles.backBtn} onClick={() => setLevel('esl-hub')}>
            ← ESL hub
          </button>
        </div>
        <OrbitalHub
          center={{
            title: 'Everyday',
            subtitle: '← Back one level',
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="6" y1="9" x2="10" y2="9"></line>
                <line x1="6" y1="13" x2="14" y2="13"></line>
                <circle cx="17" cy="9" r="1" fill="currentColor"></circle>
              </svg>
            ),
            onClick: () => setLevel('esl-hub'),
          }}
          nodes={eslEverydayNodes}
          onNodeClick={(id) => {
            if (id === 'esl-everyday-design') setLevel('esl-everyday-design');
            if (id === 'esl-everyday-layout') setLevel('esl-everyday-layout');
          }}
          caption="Click a tool to go deeper. Use the centre or breadcrumb to go back."
        />
      </div>
    );
  }

  /* =========================================================================
     LEVEL 3: ESL PROMOTIONS HUB
     Center: Promotions | Satellites: Promotion types, Design, Layout
  ========================================================================= */
  if (level === 'esl-promo-hub') {
    const eslPromoNodes: OrbitalHubNode[] = [
      {
        id: 'esl-promo-types',
        label: 'Promotion types',
        subtitle: 'Sale, clearance & specials',
        completed: Boolean(esl.promoTypes.length > 0),
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
        ),
      },
      {
        id: 'esl-promo-design',
        label: 'Design',
        subtitle: 'Templates for promo types',
        completed: Boolean(esl.promoDesignChosen || Object.keys(esl.typeStyles || {}).length > 0),
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
          </svg>
        ),
      },
      {
        id: 'esl-promo-layout',
        label: 'Layout',
        subtitle: 'Headers & promo layouts',
        completed: Boolean(esl.promoTypes.some((t) => esl.layoutsChosen.includes(t))),
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        ),
      },
    ];

    return (
      <div className={styles.sectionWrap}>
        <div className={styles.topBackBar}>
          <button type="button" className={styles.backBtn} onClick={() => setLevel('esl-hub')}>
            ← ESL hub
          </button>
        </div>
        <OrbitalHub
          center={{
            title: 'Promotions',
            subtitle: '← Back one level',
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
            ),
            onClick: () => setLevel('esl-hub'),
          }}
          nodes={eslPromoNodes}
          onNodeClick={(id) => {
            if (id === 'esl-promo-types') setLevel('esl-promo-types');
            if (id === 'esl-promo-design') {
              if (esl.promoTypes.length === 0) {
                onChangeEsl({ ...esl, promoTypes: ['special', 'sale'] });
              }
              setLevel('esl-promo-design');
            }
            if (id === 'esl-promo-layout') {
              if (esl.promoTypes.length === 0) {
                onChangeEsl({ ...esl, promoTypes: ['special', 'sale'] });
              }
              setLevel('esl-promo-layout');
            }
          }}
          caption="Click a tool to go deeper. Use the centre or breadcrumb to go back."
        />
      </div>
    );
  }

  /* =========================================================================
     TOOL VIEWS: ESL Everyday Tools
  ========================================================================= */
  if (level === 'esl-everyday-choose') {
    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('esl-everyday-hub', 'Everyday hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Choose ESL Hardware</h3>
            <p className={styles.subStepDesc}>Select electronic shelf label models and sizes for everyday shelf ticketing.</p>
          </div>
        </div>

        <div className={styles.stepContainer}>
          <EslChooseStep
            value={esl}
            onChange={onChangeEsl}
            logoUrl={brand.logoUrl}
            onBack={() => setLevel('esl-everyday-hub')}
            onNext={() => setLevel('esl-everyday-hub')}
            nextLabel="Done"
          />
        </div>
      </div>
    );
  }

  if (level === 'esl-everyday-design') {
    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('esl-everyday-hub', 'Everyday hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Everyday ESL Design</h3>
            <p className={styles.subStepDesc}>Pick ticket header title and e-ink template style for everyday shelf displays.</p>
          </div>
        </div>

        <div className={styles.stepContainer}>
          <EslDesignStep
            value={esl}
            onChange={onChangeEsl}
            brand={brand}
            targetMode="everyday"
            onBack={() => setLevel('esl-everyday-hub')}
            onNext={() => {
              onChangeEsl({ ...esl, everydayChosen: true });
              setLevel('esl-everyday-hub');
            }}
            nextLabel="Done"
          />
        </div>
      </div>
    );
  }

  if (level === 'esl-everyday-layout') {
    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('esl-everyday-hub', 'Everyday hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Everyday ESL Layout</h3>
            <p className={styles.subStepDesc}>Choose field layouts and typography for everyday ESL tickets.</p>
          </div>
        </div>

        <div className={styles.stepContainer}>
          <EslFontStep
            value={esl}
            onChange={onChangeEsl}
            brand={brand}
            brandFontIndex={font.fontIndex}
            targetMode="everyday"
            onBack={() => setLevel('esl-everyday-hub')}
            onNext={() => setLevel('esl-everyday-hub')}
            nextLabel="Done"
          />
        </div>
      </div>
    );
  }

  /* =========================================================================
     TOOL VIEWS: ESL Promo Tools
  ========================================================================= */
  if (level === 'esl-promo-types') {
    const toggleEslPromoType = (typeId: PromoTypeId) => {
      const exists = esl.promoTypes.includes(typeId);
      const updated = exists
        ? esl.promoTypes.filter((t) => t !== typeId)
        : [...esl.promoTypes, typeId];
      onChangeEsl({ ...esl, promoTypes: updated });
    };

    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('esl-promo-hub', 'Promotions hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>ESL Promotion Types</h3>
            <p className={styles.subStepDesc}>Select which promotional ticket campaigns you run on electronic shelf labels.</p>
          </div>
        </div>

        <div className={styles.optionsGrid}>
          {PROMO_TYPES.map((pt) => {
            const isSelected = esl.promoTypes.includes(pt.id);
            return (
              <div
                key={pt.id}
                className={`${styles.optionCard} ${isSelected ? styles.optionCardActive : ''}`}
                onClick={() => toggleEslPromoType(pt.id)}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardIconWrap}>🏷️</div>
                  <div className={styles.radioCircle}>
                    {isSelected && <div className={styles.radioDot} />}
                  </div>
                </div>
                <div className={styles.cardTitle}>{pt.name}</div>
                <div className={styles.cardSubtitle}>Header: &ldquo;{pt.header}&rdquo;</div>
                <div className={styles.cardDesc}>{pt.description}</div>
              </div>
            );
          })}
        </div>

        <div className={styles.actionFooter}>
          <button
            type="button"
            className={styles.doneBtn}
            onClick={() => {
              if (esl.promoTypes.length === 0) {
                onChangeEsl({ ...esl, promoTypes: ['special', 'sale'] });
              }
              setLevel('esl-promo-hub');
            }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  if (level === 'esl-promo-design') {
    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('esl-promo-hub', 'Promotions hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Promotional ESL Design</h3>
            <p className={styles.subStepDesc}>Customize ticket styles and e-ink color highlights for each promotional campaign.</p>
          </div>
        </div>

        <div className={styles.stepContainer}>
          <EslDesignStep
            value={esl}
            onChange={onChangeEsl}
            brand={brand}
            targetMode="promo"
            onBack={() => setLevel('esl-promo-hub')}
            onNext={() => {
              onChangeEsl({ ...esl, promoDesignChosen: true });
              setLevel('esl-promo-hub');
            }}
            nextLabel="Done"
          />
        </div>
      </div>
    );
  }

  if (level === 'esl-promo-layout') {
    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('esl-promo-hub', 'Promotions hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Promotional ESL Layout</h3>
            <p className={styles.subStepDesc}>Choose headers and price field layouts for promotional ESL tickets.</p>
          </div>
        </div>

        <div className={styles.stepContainer}>
          <EslFontStep
            value={esl}
            onChange={onChangeEsl}
            brand={brand}
            brandFontIndex={font.fontIndex}
            targetMode="promo"
            onBack={() => setLevel('esl-promo-hub')}
            onNext={() => setLevel('esl-promo-hub')}
            nextLabel="Done"
          />
        </div>
      </div>
    );
  }

  /* =========================================================================
     LEVEL 2: DIGITAL SCREENS HUB
     Center: Digital Screens | Satellites: Everyday, Promotions
  ========================================================================= */
  if (level === 'screens-hub') {
    const isEverydayDone = Boolean(
      screens.everydayChosen ||
      screens.aiDone ||
      screens.motionChosen ||
      screens.layoutsChosen.includes('everyday')
    );
    const isPromoDone = Boolean(
      screens.promoDesignChosen ||
      (screens.promoTypes.length > 0 && (screens.promoDesignChosen || screens.motionChosen))
    );

    const screensNodes: OrbitalHubNode[] = [
      {
        id: 'everyday',
        label: 'Everyday',
        subtitle: 'Design & layout',
        completed: isEverydayDone,
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        ),
      },
      {
        id: 'promo',
        label: 'Promotions',
        subtitle: 'Promo campaigns & animations',
        completed: isPromoDone,
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
        ),
      },
    ];

    return (
      <div className={styles.sectionWrap}>
        <div className={styles.topBackBar}>
          <button type="button" className={styles.backBtn} onClick={() => setLevel('media-hub')}>
            ← Media hub
          </button>
        </div>
        <OrbitalHub
          center={{
            title: 'Digital Screens',
            subtitle: '← Back one level',
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            ),
            onClick: () => setLevel('media-hub'),
          }}
          nodes={screensNodes}
          onNodeClick={(id) => {
            if (id === 'everyday') setLevel('screens-everyday-hub');
            if (id === 'promo') setLevel('screens-promo-hub');
          }}
          caption="Click a tool to go deeper. Use the centre or breadcrumb to go back."
        />
      </div>
    );
  }

  /* =========================================================================
     LEVEL 3: DIGITAL SCREENS EVERYDAY HUB
     Center: Everyday | Satellites: Design, Layout
  ========================================================================= */
  if (level === 'screens-everyday-hub') {
    const screensEverydayNodes: OrbitalHubNode[] = [
      {
        id: 'screens-everyday-design',
        label: 'Design',
        subtitle: 'Titles & screen designs',
        completed: Boolean(screens.everydayChosen || screens.aiDone),
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
          </svg>
        ),
      },
      {
        id: 'screens-everyday-motion',
        label: 'Layout',
        subtitle: 'Price & motion layout',
        completed: Boolean(screens.layoutsChosen.includes('everyday')),
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        ),
      },
    ];

    return (
      <div className={styles.sectionWrap}>
        <div className={styles.topBackBar}>
          <button type="button" className={styles.backBtn} onClick={() => setLevel('screens-hub')}>
            ← Screens hub
          </button>
        </div>
        <OrbitalHub
          center={{
            title: 'Everyday',
            subtitle: '← Back one level',
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            ),
            onClick: () => setLevel('screens-hub'),
          }}
          nodes={screensEverydayNodes}
          onNodeClick={(id) => {
            if (id === 'screens-everyday-design') setLevel('screens-everyday-design');
            if (id === 'screens-everyday-motion') setLevel('screens-everyday-motion');
          }}
          caption="Click a tool to go deeper. Use the centre or breadcrumb to go back."
        />
      </div>
    );
  }

  /* =========================================================================
     LEVEL 3: DIGITAL SCREENS PROMOTIONS HUB
     Center: Promotions | Satellites: Promotion types, Design, Layout
  ========================================================================= */
  if (level === 'screens-promo-hub') {
    const screensPromoNodes: OrbitalHubNode[] = [
      {
        id: 'screens-promo-types',
        label: 'Promotion types',
        subtitle: 'Select promo campaigns',
        completed: Boolean(screens.promoTypes.length > 0),
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
        ),
      },
      {
        id: 'screens-promo-design',
        label: 'Design',
        subtitle: 'Promo templates & graphics',
        completed: Boolean(
          screens.promoDesignChosen ||
          screens.aiDone ||
          Object.keys(screens.typeStyles || {}).length > 0 ||
          Object.keys(screens.typeUploads || {}).length > 0
        ),
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
          </svg>
        ),
      },
      {
        id: 'screens-promo-motion',
        label: 'Layout',
        subtitle: 'Promo motion & layouts',
        completed: Boolean(
          screens.motionChosen ||
          screens.promoTypes.some((t) => screens.layoutsChosen.includes(t))
        ),
        icon: (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        ),
      },
    ];

    return (
      <div className={styles.sectionWrap}>
        <div className={styles.topBackBar}>
          <button type="button" className={styles.backBtn} onClick={() => setLevel('screens-hub')}>
            ← Screens hub
          </button>
        </div>
        <OrbitalHub
          center={{
            title: 'Promotions',
            subtitle: '← Back one level',
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
            ),
            onClick: () => setLevel('screens-hub'),
          }}
          nodes={screensPromoNodes}
          onNodeClick={(id) => {
            if (id === 'screens-promo-types') setLevel('screens-promo-types');
            if (id === 'screens-promo-design') {
              if (screens.promoTypes.length === 0) {
                onChangeScreens({ ...screens, promoTypes: ['special', 'sale'] });
              }
              setLevel('screens-promo-design');
            }
            if (id === 'screens-promo-motion') {
              if (screens.promoTypes.length === 0) {
                onChangeScreens({ ...screens, promoTypes: ['special', 'sale'] });
              }
              setLevel('screens-promo-motion');
            }
          }}
          caption="Click a tool to go deeper. Use the centre or breadcrumb to go back."
        />
      </div>
    );
  }

  /* =========================================================================
     TOOL VIEWS: Digital Screens Everyday Tools
  ========================================================================= */
  if (level === 'screens-everyday-choose') {
    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('screens-everyday-hub', 'Everyday hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Choose Screen Hardware</h3>
            <p className={styles.subStepDesc}>Select digital display sizes, screen models, and mount options.</p>
          </div>
        </div>

        <div className={styles.stepContainer}>
          <ScreenChooseStep
            value={screens}
            onChange={onChangeScreens}
            brand={brand}
            onBack={() => setLevel('screens-everyday-hub')}
            onNext={() => setLevel('screens-everyday-hub')}
            nextLabel="Done"
          />
        </div>
      </div>
    );
  }

  if (level === 'screens-everyday-design') {
    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('screens-everyday-hub', 'Everyday hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Everyday Screen Design</h3>
            <p className={styles.subStepDesc}>Pick ticket header title and design templates for high-definition digital screens.</p>
          </div>
        </div>

        <div className={styles.stepContainer}>
          <ScreenDesignStep
            value={screens}
            onChange={onChangeScreens}
            brand={brand}
            targetMode="everyday"
            onBack={() => setLevel('screens-everyday-hub')}
            onNext={() => {
              onChangeScreens({ ...screens, everydayChosen: true });
              setLevel('screens-everyday-hub');
            }}
            nextLabel="Done"
          />
        </div>
      </div>
    );
  }

  if (level === 'screens-everyday-motion') {
    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('screens-everyday-hub', 'Everyday hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Everyday Screen Layout</h3>
            <p className={styles.subStepDesc}>Configure layouts, typography, and motion transitions for everyday screen content.</p>
          </div>
        </div>

        <div className={styles.stepContainer}>
          <ScreenMotionStep
            value={screens}
            onChange={onChangeScreens}
            brand={brand}
            brandFontIndex={font.fontIndex}
            targetMode="everyday"
            onBack={() => setLevel('screens-everyday-hub')}
            onNext={() => {
              onChangeScreens({ ...screens, motionChosen: true });
              setLevel('screens-everyday-hub');
            }}
            nextLabel="Done"
          />
        </div>
      </div>
    );
  }

  /* =========================================================================
     TOOL VIEWS: Digital Screens Promo Tools
  ========================================================================= */
  if (level === 'screens-promo-types') {
    const toggleScreensPromoType = (typeId: PromoTypeId) => {
      const exists = screens.promoTypes.includes(typeId);
      const updated = exists
        ? screens.promoTypes.filter((t) => t !== typeId)
        : [...screens.promoTypes, typeId];
      onChangeScreens({ ...screens, promoTypes: updated });
    };

    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('screens-promo-hub', 'Promotions hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Digital Screen Promotion Types</h3>
            <p className={styles.subStepDesc}>Select which promotional campaigns you feature on digital screens.</p>
          </div>
        </div>

        <div className={styles.optionsGrid}>
          {PROMO_TYPES.map((pt) => {
            const isSelected = screens.promoTypes.includes(pt.id);
            return (
              <div
                key={pt.id}
                className={`${styles.optionCard} ${isSelected ? styles.optionCardActive : ''}`}
                onClick={() => toggleScreensPromoType(pt.id)}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardIconWrap}>🏷️</div>
                  <div className={styles.radioCircle}>
                    {isSelected && <div className={styles.radioDot} />}
                  </div>
                </div>
                <div className={styles.cardTitle}>{pt.name}</div>
                <div className={styles.cardSubtitle}>Header: &ldquo;{pt.header}&rdquo;</div>
                <div className={styles.cardDesc}>{pt.description}</div>
              </div>
            );
          })}
        </div>

        <div className={styles.actionFooter}>
          <button
            type="button"
            className={styles.doneBtn}
            onClick={() => {
              if (screens.promoTypes.length === 0) {
                onChangeScreens({ ...screens, promoTypes: ['special', 'sale'] });
              }
              setLevel('screens-promo-hub');
            }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  if (level === 'screens-promo-design') {
    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('screens-promo-hub', 'Promotions hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Promotional Screen Design</h3>
            <p className={styles.subStepDesc}>Build promotional campaign content and templates for digital screens.</p>
          </div>
        </div>

        <div className={styles.stepContainer}>
          <ScreenDesignStep
            value={screens}
            onChange={onChangeScreens}
            brand={brand}
            targetMode="promo"
            onBack={() => setLevel('screens-promo-hub')}
            onNext={() => {
              onChangeScreens({ ...screens, promoDesignChosen: true });
              setLevel('screens-promo-hub');
            }}
            nextLabel="Done"
          />
        </div>
      </div>
    );
  }

  if (level === 'screens-promo-motion') {
    return (
      <div className={styles.sectionWrap}>
        <div className={styles.subStepHeader}>
          {renderBackBtn('screens-promo-hub', 'Promotions hub')}
          <div className={styles.titleWrap}>
            <h3 className={styles.subStepTitle}>Promotional Screen Layout</h3>
            <p className={styles.subStepDesc}>Configure animations, transitions, and layouts for promotional screen campaigns.</p>
          </div>
        </div>

        <div className={styles.stepContainer}>
          <ScreenMotionStep
            value={screens}
            onChange={onChangeScreens}
            brand={brand}
            brandFontIndex={font.fontIndex}
            targetMode="promo"
            onBack={() => setLevel('screens-promo-hub')}
            onNext={() => {
              onChangeScreens({ ...screens, motionChosen: true });
              setLevel('screens-promo-hub');
            }}
            nextLabel="Done"
          />
        </div>
      </div>
    );
  }

  return null;
};

export default MediaSection;
