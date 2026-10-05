import React from 'react';
import { CORE_TEXTURES, PROMO_STYLES } from '../data';
import { HEADER_FONT } from '../fonts';
import styles from './TicketBackground.module.css';

interface TicketBackgroundProps {
  kind: 'everyday' | 'promo';
  variant: number;
  orientation: 'portrait' | 'landscape';
  header: string;
  colour1: string;
  colour2: string;
  logoUrl?: string;
  children?: React.ReactNode;
}

/**
 * A ticket background built from the user's brand colours and header.
 * Everyday backgrounds use the core textures; promo backgrounds use one of the promo styles.
 */
const TicketBackground: React.FC<TicketBackgroundProps> = ({
  kind,
  variant,
  orientation,
  header,
  colour1,
  colour2,
  logoUrl,
  children,
}) => {
  const style = kind === 'promo' ? PROMO_STYLES[variant % PROMO_STYLES.length] : 'core';
  const vars = {
    '--c1': colour1,
    '--c2': colour2,
    '--texture': kind === 'everyday' ? `url(${CORE_TEXTURES[variant % CORE_TEXTURES.length]})` : 'none',
    '--header-font': HEADER_FONT,
    '--chars': Math.max(header.length, 4),
  } as React.CSSProperties;

  return (
    <div className={`${styles.ticket} ${styles[orientation]} ${styles[style]}`} style={vars}>
      <div className={styles.header}>
        <span className={styles.headerText}>{header}</span>
      </div>
      <div className={styles.body}>
        {children}
        {logoUrl && <img src={logoUrl} alt="" className={styles.logo} />}
      </div>
    </div>
  );
};

export default TicketBackground;
