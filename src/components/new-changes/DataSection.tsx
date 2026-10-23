"use client";

import React from 'react';
import { Solution } from '../register/flow';
import {
  BackgroundSetup,
  BrandSetup,
  DataSetup,
  FontSetup,
  EslSetup,
  ScreenSetup,
} from '../register/state';
import ProductsStep from '../register/steps/ProductsStep';

interface DataSectionProps {
  data: DataSetup;
  onChangeData: (val: DataSetup) => void;
  solutions: Solution[];
  brand: BrandSetup;
  font: FontSetup;
  everyday: BackgroundSetup;
  promo: BackgroundSetup;
  esl: EslSetup;
  screens: ScreenSetup;
  onBackToOverview?: () => void;
}

const DataSection: React.FC<DataSectionProps> = ({
  data,
  onChangeData,
  solutions,
  brand,
  font,
  everyday,
  promo,
  esl,
  screens,
  onBackToOverview,
}) => {
  return (
    <div>
      {onBackToOverview && (
        <div style={{ marginBottom: '14px' }}>
          <button
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              background: '#f8fafc',
              color: '#334e68',
              fontSize: '13px',
              fontWeight: 600,
              border: '1px solid #dbe2ea',
              cursor: 'pointer',
              lineHeight: 1.4,
            }}
            onClick={onBackToOverview}
          >
            ← Setup
          </button>
        </div>
      )}
      <ProductsStep
        value={data}
        onChange={onChangeData}
        solutions={solutions}
        brand={brand}
        font={font}
        everyday={everyday}
        promo={promo}
        esl={esl}
        screens={screens}
        onBack={() => {}}
        onNext={() => {}}
        nextLabel="Done"
      />
    </div>
  );
};

export default DataSection;
