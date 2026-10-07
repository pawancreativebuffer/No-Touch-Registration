"use client";

import React, { useState } from 'react';
import styles from './TicketTabs.module.css';

export interface TicketTab {
  /** 'everyday' or a promotion type id */
  key: string;
  name: string;
  promo: boolean;
  /** Show a tick (e.g. its layout is chosen) */
  ticked?: boolean;
}

interface TicketTabsProps {
  tickets: TicketTab[];
  activeKey: string;
  onChange: (key: string) => void;
}

/** Everyday | Promotional tabs, with a row of promotion tabs inside Promotional. Used everywhere tickets are switched. */
const TicketTabs: React.FC<TicketTabsProps> = ({ tickets, activeKey, onChange }) => {
  const [lastPromo, setLastPromo] = useState<string | null>(null);
  const everyday = tickets.find((t) => !t.promo);
  const promos = tickets.filter((t) => t.promo);
  const active = tickets.find((t) => t.key === activeKey) ?? everyday ?? tickets[0];
  const onPromo = !!active?.promo;

  const tick = (on?: boolean) => on && <span className={styles.tick} aria-hidden="true" />;

  return (
    <>
      <div className={styles.tabs} role="tablist">
        {everyday && (
          <button
            type="button"
            role="tab"
            aria-selected={!onPromo}
            className={`${styles.tab} ${!onPromo ? styles.tabOn : ''}`}
            onClick={() => onChange(everyday.key)}
          >
            {tick(everyday.ticked)}
            Everyday
          </button>
        )}
        {promos.length > 0 && (
          <button
            type="button"
            role="tab"
            aria-selected={onPromo}
            className={`${styles.tab} ${onPromo ? styles.tabOn : ''}`}
            onClick={() => onChange(promos.find((t) => t.key === lastPromo)?.key ?? promos[0].key)}
          >
            {tick(promos.every((t) => t.ticked))}
            Promotional
          </button>
        )}
      </div>
      {onPromo && (
        <div className={styles.promoTabs} role="tablist" aria-label="Promotions">
          {promos.map((t) => (
            <button
              type="button"
              role="tab"
              key={t.key}
              aria-selected={active.key === t.key}
              className={`${styles.promoTab} ${active.key === t.key ? styles.promoTabOn : ''}`}
              onClick={() => {
                onChange(t.key);
                setLastPromo(t.key);
              }}
            >
              {tick(t.ticked)}
              {t.name}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default TicketTabs;
