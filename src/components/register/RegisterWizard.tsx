"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Stepper from './Stepper';
import UserDetailsForm from './UserDetailsForm';
import PrintSizesStep from './steps/PrintSizesStep';
import BackgroundStep from './steps/BackgroundStep';
import FontLayoutStep from './steps/FontLayoutStep';
import PrintersPaperStep from './steps/PrintersPaperStep';
import { EMPTY_USER_DETAILS, REGISTER_STEPS, UserDetails } from './steps';
import {
  BackgroundSetup,
  EMPTY_FONT,
  EMPTY_PRINT,
  EMPTY_PURCHASE,
  everydayDefaults,
  FontSetup,
  PrintSetup,
  promoDefaults,
  PurchaseSetup,
} from './state';
import styles from './RegisterWizard.module.css';

const RegisterWizard = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [userDetails, setUserDetails] = useState<UserDetails>(EMPTY_USER_DETAILS);
  const [standardPrint, setStandardPrint] = useState<PrintSetup>(EMPTY_PRINT);
  const [promoPrint, setPromoPrint] = useState<PrintSetup>(EMPTY_PRINT);
  const [everyday, setEveryday] = useState<BackgroundSetup>(everydayDefaults);
  const [promo, setPromo] = useState<BackgroundSetup>(promoDefaults);
  const [font, setFont] = useState<FontSetup>(EMPTY_FONT);
  const [purchase, setPurchase] = useState<PurchaseSetup>(EMPTY_PURCHASE);

  const goTo = (s: number) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <UserDetailsForm
            values={userDetails}
            onChange={setUserDetails}
            onCancel={() => router.push('/')}
            onNext={() => goTo(1)}
          />
        );
      case 1:
        return (
          <PrintSizesStep
            key="standard"
            kind="Standard"
            value={standardPrint}
            onChange={setStandardPrint}
            onBack={() => goTo(0)}
            onNext={() => goTo(2)}
            nextLabel="Select your Promotional ticket sizes"
          />
        );
      case 2:
        return (
          <PrintSizesStep
            key="promo"
            kind="Promotional"
            value={promoPrint}
            onChange={setPromoPrint}
            onBack={() => goTo(1)}
            onNext={() => goTo(3)}
            nextLabel="Build your Everyday Ticket"
          />
        );
      case 3:
        return (
          <BackgroundStep
            key="everyday"
            kind="everyday"
            value={everyday}
            onChange={setEveryday}
            onBack={() => goTo(2)}
            onNext={() => goTo(4)}
            nextLabel="Build your Promo Ticket"
          />
        );
      case 4:
        return (
          <BackgroundStep
            key="promo"
            kind="promo"
            value={promo}
            onChange={setPromo}
            onBack={() => goTo(3)}
            onNext={() => goTo(5)}
            nextLabel="Select Font layout"
          />
        );
      case 5:
        return (
          <FontLayoutStep
            value={font}
            onChange={setFont}
            promo={promo}
            onBack={() => goTo(4)}
            onNext={() => goTo(6)}
            onOrderStock={() => goTo(6)}
          />
        );
      default:
        return (
          <PrintersPaperStep
            value={purchase}
            onChange={setPurchase}
            onBack={() => goTo(5)}
            onFinish={() => router.push('/')}
          />
        );
    }
  };

  return (
    <div className={styles.wizard}>
      <div className={styles.stepperCard}>
        <Stepper steps={REGISTER_STEPS} current={step} onStepClick={(s) => goTo(s)} />
      </div>
      {renderStep()}
    </div>
  );
};

export default RegisterWizard;
