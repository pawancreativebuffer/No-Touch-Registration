import React from 'react';
import TicketBackground from './TicketBackground';
import { money, TicketLayoutId } from '../data';
import { Orientation, TicketBg } from '../paperTickets';
import { splitPrice } from '../products';
import styles from './PaperTicket.module.css';

/** Product and price details printed on a ticket */
export interface TicketData {
  description: string;
  unit: string;
  price: number;
  was: number;
  qty: number;
  footer: string;
}

const Price: React.FC<{ value: number; className?: string }> = ({ value, className }) => {
  const { dollars, cents } = splitPrice(value);
  return (
    <span className={`${styles.price} ${className ?? ''}`}>
      <sup>$</sup>
      {dollars}
      <sup>{cents}</sup>
    </span>
  );
};

/** The text of a ticket laid out in one of the text layouts */
const TicketText: React.FC<{ layout: TicketLayoutId; data: TicketData; fontFamily: string }> = ({ layout, data, fontFamily }) => {
  const saving = Math.max(0, data.was - data.price);
  const percent = data.was > 0 ? Math.round((saving / data.was) * 100) : 0;
  const desc = <p className={styles.desc}>{data.description || 'Description of product'}</p>;
  const unit = data.unit && <p className={styles.unit}>{data.unit}</p>;

  return (
    <div className={`${styles.text} ${styles[layout]}`} style={{ fontFamily }}>
      {layout === 'standard' && (
        <>
          {desc}
          <Price value={data.price} className={styles.big} />
          {unit}
        </>
      )}
      {layout === 'feature' && (
        <>
          {desc}
          <ul className={styles.lines}>
            <li>Product information and benefits</li>
            <li>Size, variant and pack details</li>
            <li>Extra details for the shopper</li>
          </ul>
          <Price value={data.price} />
        </>
      )}
      {layout === 'multibuy' && (
        <>
          {desc}
          <p className={styles.deal}>{data.qty > 1 ? `${data.qty} for` : 'Buy more & save'}</p>
          <Price value={data.price} className={styles.big} />
          {unit}
        </>
      )}
      {layout === 'save' && (
        <>
          <Price value={data.price} className={styles.big} />
          <span className={styles.strip}>Save {money(saving)}</span>
          {desc}
        </>
      )}
      {layout === 'percent' && (
        <>
          <p className={styles.percent}>{percent}% off</p>
          <Price value={data.price} className={styles.big} />
          {desc}
        </>
      )}
      {layout === 'wasnow' && (
        <>
          <Price value={data.price} className={styles.big} />
          <span className={`${styles.strip} ${styles.was}`}>Was {money(data.was)}</span>
          {desc}
        </>
      )}
      {layout === 'members' && (
        <>
          <div className={styles.members}>
            <div>
              <small>Members</small>
              <Price value={data.price} />
            </div>
            <div>
              <small>Non-members</small>
              <Price value={data.was} />
            </div>
          </div>
          {desc}
        </>
      )}
      {layout === 'new' && (
        <>
          <span className={styles.badge}>New</span>
          <Price value={data.price} className={styles.big} />
          {desc}
        </>
      )}
      <p className={styles.footer}>{data.footer}</p>
    </div>
  );
};

interface PaperTicketProps {
  bg: TicketBg;
  orientation: Orientation;
  layout: TicketLayoutId;
  data: TicketData;
  fontFamily: string;
  /** Stretch into the parent box instead of keeping the A-size shape */
  fill?: boolean;
}

/** A finished Paper ticket: the chosen background with the text layout on top */
const PaperTicket: React.FC<PaperTicketProps> = ({ bg, orientation, layout, data, fontFamily, fill }) => {
  const text = <TicketText layout={layout} data={data} fontFamily={fontFamily} />;
  if (bg.type === 'image') {
    return (
      <div className={`${styles.image} ${styles[orientation]} ${fill ? styles.fill : ''}`} style={{ backgroundImage: `url("${bg.url}")` }}>
        <div className={styles.imageBody}>{text}</div>
      </div>
    );
  }
  return (
    <TicketBackground
      kind={bg.kind}
      variant={bg.variant}
      orientation={orientation}
      header={bg.header}
      colour1={bg.colour1}
      colour2={bg.colour2}
      logoUrl={bg.logoUrl}
      fill={fill}
    >
      {text}
    </TicketBackground>
  );
};

export default PaperTicket;
