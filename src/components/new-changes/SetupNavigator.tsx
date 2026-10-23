"use client";

import React, { useMemo, useState } from 'react';
import styles from './SetupNavigator.module.css';
import WorkspaceSidebar from './WorkspaceSidebar';
import LivePreviewPanel from './LivePreviewPanel';
import OrbitalHub, { OrbitalHubNode } from './OrbitalHub';
import ChecklistView from './ChecklistView';
import BrandSection from './BrandSection';
import MediaSection, { MediaBreadcrumbItem } from './MediaSection';
import ShopSection from './ShopSection';
import DataSection from './DataSection';
import ReviewSection from './ReviewSection';
import { AreaProgress, BrandSubStep, WorkspaceArea } from './types';
import { Solution } from '../register/flow';
import {
  BackgroundSetup,
  BRAND_DEFAULTS,
  BrandSetup,
  DATA_DEFAULTS,
  DataSetup,
  EMPTY_FONT,
  EMPTY_PRINT,
  EMPTY_PURCHASE,
  ESL_DEFAULTS,
  EslSetup,
  everydayDefaults,
  FontSetup,
  GOLIVE_DEFAULTS,
  GoLiveSetup,
  PrintSetup,
  promoDefaults,
  PurchaseSetup,
  SCREEN_DEFAULTS,
  ScreenSetup,
} from '../register/state';

const SetupNavigator: React.FC = () => {
  // Navigation & View Mode
  const [currentArea, setCurrentArea] = useState<WorkspaceArea>('overview');
  const [brandSubStep, setBrandSubStep] = useState<BrandSubStep>('hub');
  const [viewMode, setViewMode] = useState<'diagram' | 'checklist'>('diagram');
  const [mediaBreadcrumbs, setMediaBreadcrumbs] = useState<MediaBreadcrumbItem[]>([]);

  // Solution Selection
  const [solutions, setSolutions] = useState<Solution[]>(['paper']);

  // Global State
  const [brand, setBrand] = useState<BrandSetup>(BRAND_DEFAULTS);
  const [standardPrint, setStandardPrint] = useState<PrintSetup>(EMPTY_PRINT);
  const [promoPrint, setPromoPrint] = useState<PrintSetup>(EMPTY_PRINT);
  const [everyday, setEveryday] = useState<BackgroundSetup>(everydayDefaults);
  const [promo, setPromo] = useState<BackgroundSetup>(promoDefaults);
  const [font, setFont] = useState<FontSetup>(EMPTY_FONT);
  const [purchase, setPurchase] = useState<PurchaseSetup>(EMPTY_PURCHASE);
  const [esl, setEsl] = useState<EslSetup>(ESL_DEFAULTS);
  const [screens, setScreens] = useState<ScreenSetup>(SCREEN_DEFAULTS);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [data, setData] = useState<DataSetup>(DATA_DEFAULTS);
  const [goLive, setGoLive] = useState<GoLiveSetup>(GOLIVE_DEFAULTS);

  // Toggle Solution
  const toggleSolution = (s: Solution) => {
    if (solutions.includes(s)) {
      if (solutions.length === 1) return; // Keep at least one
      setSolutions(solutions.filter((x) => x !== s));
    } else {
      setSolutions([...solutions, s]);
    }
  };

  // Reset Demo State
  const resetDemo = () => {
    if (confirm('Reset demo state to defaults?')) {
      setSolutions(['paper']);
      setCurrentArea('overview');
      setBrandSubStep('hub');
      setViewMode('diagram');
      setBrand(BRAND_DEFAULTS);
      setStandardPrint(EMPTY_PRINT);
      setPromoPrint(EMPTY_PRINT);
      setEveryday(everydayDefaults);
      setPromo(promoDefaults);
      setFont(EMPTY_FONT);
      setPurchase(EMPTY_PURCHASE);
      setEsl(ESL_DEFAULTS);
      setScreens(SCREEN_DEFAULTS);
      setOrderPlaced(false);
      setData(DATA_DEFAULTS);
      setGoLive(GOLIVE_DEFAULTS);
    }
  };

  // Calculate Progress
  const progress: AreaProgress = useMemo(() => {
    return {
      brand: Boolean(brand.logoUrl || (brand.coloursChosen && font.fontChosen)),
      media: Boolean(everyday.aiDone || promo.promoTypes.length > 0 || standardPrint.sizes.length > 0 || esl.selected.length > 0 || screens.selected.length > 0),
      shop: Boolean(purchase.cart.length > 0 || purchase.printers.length > 0 || esl.selected.length > 0 || screens.selected.length > 0),
      data: Boolean(data.imported || data.helpRequested),
      review: orderPlaced,
    };
  }, [brand, font, everyday, promo, standardPrint, esl, screens, purchase, data, orderPlaced]);

  // Media dynamic text in node subtitle
  const mediaSummaryText = useMemo(() => {
    const list: string[] = [];
    if (solutions.includes('paper')) list.push('Paper');
    if (solutions.includes('esl')) list.push('ESL');
    if (solutions.includes('screens')) list.push('Digital Screens');
    if (list.length === 3) return 'Paper, ESL & Digital Screens';
    return list.join(' & ');
  }, [solutions]);

  // Overview Orbital Nodes (Matching Image 1)
  const overviewNodes: OrbitalHubNode[] = [
    {
      id: 'brand',
      label: 'Brand',
      subtitle: 'One look for all media',
      completed: progress.brand,
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
      id: 'media',
      label: 'Media',
      subtitle: mediaSummaryText,
      completed: progress.media,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
    },
    {
      id: 'shop',
      label: 'Shop',
      subtitle: 'One combined package',
      completed: progress.shop,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      ),
    },
    {
      id: 'data',
      label: 'Ticket Data',
      subtitle: 'After signup',
      completed: progress.data,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
      ),
    },
  ];

  const handleSelectArea = (area: WorkspaceArea) => {
    setCurrentArea(area);
    if (area === 'brand') setBrandSubStep('hub');
    if (area !== 'media') setMediaBreadcrumbs([]);
    setViewMode('diagram');
  };

  const getBreadcrumbTitle = () => {
    switch (currentArea) {
      case 'overview':
        return 'Setup';
      case 'brand':
        return brandSubStep === 'hub' ? 'Setup / Brand' : `Setup / Brand / ${brandSubStep}`;
      case 'media':
        return 'Setup / Media';
      case 'shop':
        return 'Setup / Shop';
      case 'data':
        return 'Setup / Ticket Data';
      case 'review':
        return 'Setup / Review & Checkout';
    }
  };

  return (
    <div className={styles.container}>
      {/* Row 1: Store Setup (Left) + Top Banner (Right) */}
      <div className={styles.topRowLayout}>
        <div className={styles.storeCol}>
          <WorkspaceSidebar
            section="storeOnly"
            currentArea={currentArea}
            onSelectArea={handleSelectArea}
            progress={progress}
            storeName={brand.storeName || 'Your retail store'}
          />
        </div>

        <header className={styles.topBanner}>
          <div className={styles.topRow}>
            <span className={styles.kicker}>YOUR STORE. YOUR CONTENT.</span>
            <button type="button" className={styles.resetBtn} onClick={resetDemo}>
              Reset demo ↺
            </button>
          </div>

          <h1 className={styles.headline}>Make Ticket-IT your own.</h1>
          <p className={styles.subheadline}>
            Choose where you want to show up. Build your look, explore your options, and connect your products when you&apos;re ready.
          </p>

          {/* Solution Selector Pills */}
          <div className={styles.solutionsRow} role="group" aria-label="Selected solutions">
            <button
              type="button"
              className={`${styles.solutionPill} ${solutions.includes('paper') ? styles.solutionPillActive : ''}`}
              onClick={() => toggleSolution('paper')}
            >
              <span>📄</span>
              <span>Paper</span>
              <span className={styles.pillBadge}>{solutions.includes('paper') ? '✓' : '+'}</span>
            </button>

            <button
              type="button"
              className={`${styles.solutionPill} ${solutions.includes('esl') ? styles.solutionPillActive : ''}`}
              onClick={() => toggleSolution('esl')}
            >
              <span>📟</span>
              <span>ESL</span>
              <span className={styles.pillBadge}>{solutions.includes('esl') ? '✓' : '+'}</span>
            </button>

            <button
              type="button"
              className={`${styles.solutionPill} ${solutions.includes('screens') ? styles.solutionPillActive : ''}`}
              onClick={() => toggleSolution('screens')}
            >
              <span>🖥️</span>
              <span>Digital Screens</span>
              <span className={styles.pillBadge}>{solutions.includes('screens') ? '✓' : '+'}</span>
            </button>
          </div>
        </header>
      </div>

      {/* Row 2: 3-Column Content Layout (Nav, Setup Card, Live Preview ALL TOP-ALIGNED!) */}
      <div className={styles.contentRowLayout}>
        {/* Left Column: Navigation & Review */}
        <div className={styles.navCol}>
          <WorkspaceSidebar
            section="navOnly"
            currentArea={currentArea}
            onSelectArea={handleSelectArea}
            progress={progress}
            storeName={brand.storeName || 'Your retail store'}
          />
        </div>

        {/* Center Column: Main Canvas */}
        <main className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.breadcrumb}>
              {currentArea !== 'overview' && (
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b8f9e', padding: 0 }}
                  onClick={() => handleSelectArea('overview')}
                >
                  Setup
                </button>
              )}
              {currentArea !== 'overview' && <span>/</span>}
              {currentArea === 'media' && mediaBreadcrumbs.length > 0 ? (
                mediaBreadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span>/</span>}
                    {idx < mediaBreadcrumbs.length - 1 ? (
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b8f9e', padding: 0 }}
                        onClick={crumb.onSelect}
                      >
                        {crumb.label}
                      </button>
                    ) : (
                      <span className={styles.breadcrumbCurrent}>{crumb.label}</span>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <span className={styles.breadcrumbCurrent}>{getBreadcrumbTitle().replace('Setup / ', '')}</span>
              )}
            </div>

            <button
              type="button"
              className={styles.toggleViewBtn}
              onClick={() => setViewMode(viewMode === 'diagram' ? 'checklist' : 'diagram')}
            >
              {viewMode === 'diagram' ? (
                <>
                  <span>View checklist</span>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" className={styles.btnIcon} aria-hidden="true">
                    <circle cx="4" cy="3" r="1.6" />
                    <circle cx="4" cy="8" r="1.6" />
                    <circle cx="4" cy="13" r="1.6" />
                    <circle cx="12" cy="3" r="1.6" />
                    <circle cx="12" cy="8" r="1.6" />
                    <circle cx="12" cy="13" r="1.6" />
                  </svg>
                </>
              ) : (
                <>
                  <span>View diagram</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={styles.btnIcon} aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Canvas Body */}
          {viewMode === 'checklist' ? (
            <ChecklistView
              progress={progress}
              onSelectArea={handleSelectArea}
              mediaSummary={mediaSummaryText}
            />
          ) : (
            <>
              {currentArea === 'overview' && (
                <OrbitalHub
                  center={{
                    title: 'Your setup',
                    subtitle: 'Choose an area',
                    icon: <span>✦</span>,
                  }}
                  nodes={overviewNodes}
                  onNodeClick={(id) => handleSelectArea(id as WorkspaceArea)}
                  caption="Start with your brand, then design for your selected media."
                />
              )}

              {currentArea === 'brand' && (
                <BrandSection
                  brand={brand}
                  onChangeBrand={setBrand}
                  font={font}
                  onChangeFont={setFont}
                  subStep={brandSubStep}
                  onSetSubStep={setBrandSubStep}
                  onBackToOverview={() => handleSelectArea('overview')}
                />
              )}

              {currentArea === 'media' && (
                <MediaSection
                  solutions={solutions}
                  brand={brand}
                  font={font}
                  onChangeFont={setFont}
                  everyday={everyday}
                  onChangeEveryday={setEveryday}
                  promo={promo}
                  onChangePromo={setPromo}
                  standardPrint={standardPrint}
                  onChangeStandardPrint={setStandardPrint}
                  promoPrint={promoPrint}
                  onChangePromoPrint={setPromoPrint}
                  esl={esl}
                  onChangeEsl={setEsl}
                  screens={screens}
                  onChangeScreens={setScreens}
                  onGoToShop={() => handleSelectArea('shop')}
                  onBackToOverview={() => handleSelectArea('overview')}
                  onPathChange={setMediaBreadcrumbs}
                />
              )}

              {currentArea === 'shop' && (
                <ShopSection
                  solutions={solutions}
                  purchase={purchase}
                  onChangePurchase={setPurchase}
                  esl={esl}
                  onChangeEsl={setEsl}
                  screens={screens}
                  onChangeScreens={setScreens}
                  onBackToOverview={() => handleSelectArea('overview')}
                />
              )}

              {currentArea === 'data' && (
                <DataSection
                  data={data}
                  onChangeData={setData}
                  solutions={solutions}
                  brand={brand}
                  font={font}
                  everyday={everyday}
                  promo={promo}
                  esl={esl}
                  screens={screens}
                  onBackToOverview={() => handleSelectArea('overview')}
                />
              )}

              {currentArea === 'review' && (
                <ReviewSection
                  solutions={solutions}
                  purchase={purchase}
                  esl={esl}
                  screens={screens}
                  orderPlaced={orderPlaced}
                  onSetOrderPlaced={setOrderPlaced}
                  data={data}
                  brand={brand}
                  font={font}
                  everyday={everyday}
                  promo={promo}
                  goLive={goLive}
                  onChangeGoLive={setGoLive}
                  onGoToProducts={() => handleSelectArea('data')}
                  onBackToOverview={() => handleSelectArea('overview')}
                />
              )}
            </>
          )}
        </main>

        {/* Right Column: Sticky Live Preview Panel */}
        <div className={styles.previewCol}>
          <LivePreviewPanel
            solutions={solutions}
            brand={brand}
            font={font}
            everyday={everyday}
            promo={promo}
            standardPrint={standardPrint}
            promoPrint={promoPrint}
            esl={esl}
            screens={screens}
          />
        </div>
      </div>
    </div>
  );
};

export default SetupNavigator;
