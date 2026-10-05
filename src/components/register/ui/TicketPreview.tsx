import React from 'react';
import { TestTicket, TextLayout } from '../data';
import { HEADER_FONT } from '../fonts';
import styles from './TicketPreview.module.css';

interface TicketPreviewProps {
  layout: TextLayout;
  fontFamily: string;
  header: string;
  colour1: string;
  colour2: string;
  ticket: TestTicket;
}

const Price: React.FC<{ value: string; className?: string }> = ({ value, className }) => {
  const [dollars, cents] = (value || '0').replace(/[^\d.]/g, '').split('.');
  return (
    <span className={`${styles.price} ${className ?? ''}`}>
      <sup>$</sup>
      {dollars || '0'}
      {cents && <sup>{cents.padEnd(2, '0').slice(0, 2)}</sup>}
    </span>
  );
};

const formatDate = (iso: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y.slice(2)}`;
};

/** A price ticket rendered in one of the text layouts, using the user's font and promo colours */
const TicketPreview: React.FC<TicketPreviewProps> = ({ layout, fontFamily, header, colour1, colour2, ticket }) => {
  const headerText = header || 'Special';
  const vars = {
    '--c1': colour1,
    '--c2': colour2,
    '--header-font': HEADER_FONT,
    '--chars': Math.max(headerText.length, 4),
    fontFamily,
  } as React.CSSProperties;
  const start = formatDate(ticket.startDate);
  const end = formatDate(ticket.endDate);
  const availability = start || end ? `Available ${start ? `from ${start} ` : ''}${end ? `until ${end}` : ''}` : 'Available while stocks last';

  return (
    <div className={`${styles.ticket} ${styles[layout]}`} style={vars}>
      <div className={styles.header}>
        <span>{headerText}</span>
      </div>

      <div className={styles.body}>
        {layout === 'variable' && (
          <>
            <p className={styles.desc}>{ticket.description || 'Description of product'}</p>
            <ul className={styles.lines}>
              <li>Product information, features and benefits</li>
              <li>Size, variant and pack details</li>
              <li>Extra details for the shopper</li>
            </ul>
            <Price value={ticket.price} />
          </>
        )}

        {layout === 'percent' && (
          <>
            <p className={styles.percent}>
              <small>At least</small> 60% <em>OFF</em>
            </p>
            <p className={styles.desc}>{ticket.description || 'Description of product'}</p>
            <table className={styles.table}>
              <tbody>
                {['14cm', '16cm', '18cm', '20cm'].map((s, i) => (
                  <tr key={s}>
                    <td>Item {s}</td>
                    <td>was ${89 + i * 10}.99</td>
                    <td>${19 + i * 3}.99</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {(layout === 'multibuy' || layout === 'variableWhite') && (
          <>
            <p className={styles.descCaps}>{ticket.description || 'Description of product'}</p>
            {ticket.deal && <p className={styles.deal}>{ticket.deal}</p>}
            <Price value={ticket.price} className={styles.bigPrice} />
            {ticket.unit && <p className={styles.unit}>{ticket.unit}</p>}
          </>
        )}

        {layout === 'wasnow' && (
          <>
            <p className={styles.percent}>
              <small>Over</small> 60% <em>OFF</em>
            </p>
            <p className={styles.desc}>{ticket.description || 'Description of product'}</p>
            <p className={styles.was}>WAS $269.99</p>
            <Price value={ticket.price} className={styles.bigPrice} />
          </>
        )}

        <p className={styles.footer}>{availability}</p>
      </div>
    </div>
  );
};

export default TicketPreview;
