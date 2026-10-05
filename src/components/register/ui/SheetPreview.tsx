import React from 'react';
import { SheetSize } from '../data';
import styles from './SheetPreview.module.css';

interface SheetPreviewProps {
  size: SheetSize;
  /** Max rendered height in px; width follows the sheet's aspect ratio */
  height?: number;
}

/** Diagram of an A4 sheet split into tickets, like the size cards in the design */
const SheetPreview: React.FC<SheetPreviewProps> = ({ size, height = 180 }) => {
  const sheetW = size.cols * size.cellW;
  const sheetH = size.rows * size.cellH;

  return (
    <div
      className={`${styles.sheet} ${size.dashed ? styles.dashed : ''}`}
      style={{
        aspectRatio: `${sheetW} / ${sheetH}`,
        height,
        gridTemplateColumns: `repeat(${size.cols}, 1fr)`,
        gridTemplateRows: `repeat(${size.rows}, 1fr)`,
      }}
    >
      {Array.from({ length: size.cols * size.rows }, (_, i) => (
        <div key={i} className={styles.cell}>
          <div className={styles.label}>
            {size.name && <strong className={styles.name}>{size.name}</strong>}
            <strong className={styles.up}>{size.up}</strong>
            <span className={styles.dims}>{size.dims}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SheetPreview;
