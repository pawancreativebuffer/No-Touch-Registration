"use client";

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Stepper from './Stepper';
import UserDetailsForm from './UserDetailsForm';
import SolutionStep from './steps/SolutionStep';
import BrandStep from './steps/BrandStep';
import PrintSizesStep from './steps/PrintSizesStep';
import BackgroundStep from './steps/BackgroundStep';
import FontLayoutStep from './steps/FontLayoutStep';
import PrintersPaperStep from './steps/PrintersPaperStep';
import EslChooseStep from './steps/EslChooseStep';
import EslDesignStep from './steps/EslDesignStep';
import EslFontStep from './steps/EslFontStep';
import { eslFromPaper } from './eslTickets';
import EslBuyStep from './steps/EslBuyStep';
import ScreenChooseStep from './steps/ScreenChooseStep';
import ScreenDesignStep from './steps/ScreenDesignStep';
import ScreenMotionStep from './steps/ScreenMotionStep';
import { screensFromPaper } from './screenTickets';
import ScreenBuyStep from './steps/ScreenBuyStep';
import OrderStep from './steps/OrderStep';
import ProductsStep from './steps/ProductsStep';
import GoLiveStep from './steps/GoLiveStep';
import { EMPTY_USER_DETAILS, UserDetails } from './steps';
import { buildSteps, Solution, StepId } from './flow';
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
} from './state';
import styles from './RegisterWizard.module.css';

// Footer button text the Paper steps already used, kept as it was
const PAPER_NEXT_LABELS: Partial<Record<StepId, string>> = {
  'paper-sizes-everyday': 'Select your Everyday ticket sizes',
  'paper-sizes-promo': 'Select your Promotional ticket sizes',
  'paper-bg-everyday': 'Build your Everyday Ticket',
  'paper-bg-promo': 'Build your Promotional Ticket',
  'paper-font': 'Select Font layout',
  'paper-buy': 'Buy Printers & Paper',
};

const RegisterWizard = () => {
  const router = useRouter();
  const [stepId, setStepId] = useState<StepId>('start');
  const [furthest, setFurthest] = useState(0);
  const [userDetails, setUserDetails] = useState<UserDetails>(EMPTY_USER_DETAILS);
  const [solutions, setSolutions] = useState<Solution[]>([]);
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

  const steps = useMemo(() => buildSteps(solutions), [solutions]);
  const index = Math.max(0, steps.findIndex((s) => s.id === stepId));
  const nextId = steps[index + 1]?.id;
  const nextLabel = (nextId && PAPER_NEXT_LABELS[nextId]) || steps[index + 1]?.label || '';

  const goTo = (i: number) => {
    const target = steps[Math.max(0, Math.min(steps.length - 1, i))];
    // First time on the ESL design step with Paper chosen: start from the Paper designs
    if (target.id === 'esl-design' && solutions.includes('paper') && !esl.fromPaper) setEsl(eslFromPaper(esl, promo, font));
    if (target.id === 'screen-content' && solutions.includes('paper') && !screens.fromPaper) setScreens(screensFromPaper(screens, everyday, promo, font));
    setStepId(target.id);
    setFurthest((f) => Math.max(f, i));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const goToId = (id: StepId) => goTo(steps.findIndex((s) => s.id === id));
  const next = () => goTo(index + 1);
  const back = () => goTo(index - 1);

  // Changing the solutions changes the steps after this one, so they must be walked through again
  const changeSolutions = (value: Solution[]) => {
    setSolutions(value);
    setFurthest(index);
  };

  const nav = { onBack: back, onNext: next, nextLabel };

  const renderStep = () => {
    switch (stepId) {
      case 'start':
        return (
          <UserDetailsForm
            values={userDetails}
            onChange={setUserDetails}
            onCancel={() => router.push('/')}
            onNext={next}
            nextLabel={nextLabel}
          />
        );
      case 'solution':
        return <SolutionStep value={solutions} onChange={changeSolutions} {...nav} />;
      case 'brand':
        return <BrandStep value={brand} onChange={setBrand} solutions={solutions} {...nav} />;
      case 'paper-sizes-everyday':
        return <PrintSizesStep key="standard" kind="Everyday" value={standardPrint} onChange={setStandardPrint} {...nav} />;
      case 'paper-sizes-promo':
        return <PrintSizesStep key="promo" kind="Promotional" value={promoPrint} onChange={setPromoPrint} {...nav} />;
      case 'paper-bg-everyday':
        return <BackgroundStep key="everyday" kind="everyday" value={everyday} onChange={setEveryday} brand={brand} sizes={standardPrint.sizes} {...nav} />;
      case 'paper-bg-promo':
        return <BackgroundStep key="promo" kind="promo" value={promo} onChange={setPromo} brand={brand} sizes={promoPrint.sizes} {...nav} />;
      case 'paper-font':
        return (
          <FontLayoutStep
            value={font}
            onChange={setFont}
            everyday={everyday}
            promo={promo}
            brand={brand}
            onOrderStock={() => goToId('paper-buy')}
            {...nav}
          />
        );
      case 'paper-buy':
        return <PrintersPaperStep value={purchase} onChange={setPurchase} {...nav} />;
      case 'esl-choose':
        return <EslChooseStep value={esl} onChange={setEsl} logoUrl={brand.logoUrl} {...nav} />;
      case 'esl-design':
        return <EslDesignStep value={esl} onChange={setEsl} brand={brand} {...nav} />;
      case 'esl-font':
        return <EslFontStep value={esl} onChange={setEsl} brand={brand} {...nav} />;
      case 'esl-buy':
        return <EslBuyStep value={esl} onChange={setEsl} {...nav} />;
      case 'screen-choose':
        return <ScreenChooseStep value={screens} onChange={setScreens} brand={brand} {...nav} />;
      case 'screen-content':
        return <ScreenDesignStep value={screens} onChange={setScreens} brand={brand} {...nav} />;
      case 'screen-motion':
        return <ScreenMotionStep value={screens} onChange={setScreens} brand={brand} {...nav} />;
      case 'screen-buy':
        return <ScreenBuyStep value={screens} onChange={setScreens} {...nav} />;
      case 'order':
        return (
          <OrderStep
            solutions={solutions}
            purchase={purchase}
            esl={esl}
            screens={screens}
            placed={orderPlaced}
            onPlaced={() => setOrderPlaced(true)}
            {...nav}
          />
        );
      case 'products':
        return (
          <ProductsStep
            value={data}
            onChange={setData}
            solutions={solutions}
            brand={brand}
            font={font}
            everyday={everyday}
            promo={promo}
            esl={esl}
            screens={screens}
            {...nav}
          />
        );
      case 'golive':
        return (
          <GoLiveStep
            value={goLive}
            onChange={setGoLive}
            data={data}
            solutions={solutions}
            brand={brand}
            font={font}
            everyday={everyday}
            promo={promo}
            esl={esl}
            screens={screens}
            onAddProducts={() => goToId('products')}
            onBack={back}
            onFinish={() => router.push('/')}
          />
        );
    }
  };

  return (
    <div className={styles.wizard}>
      <aside className={styles.stepperCard}>
        <Stepper steps={steps} current={index} furthest={furthest} onStepClick={goTo} />
      </aside>
      <div key={stepId} className={styles.content}>
        {renderStep()}
      </div>
    </div>
  );
};

export default RegisterWizard;
