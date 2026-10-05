"use client";

import React, { useState } from 'react';
import CheckCircle from './CheckCircle';
import styles from './Carousel.module.css';

interface CarouselProps<T> {
  items: readonly T[];
  /** Index of the item in the centre */
  index: number;
  onIndexChange: (index: number) => void;
  /** Whether the centred item is the user's confirmed choice */
  selected: boolean;
  onSelect: () => void;
  renderItem: (item: T, isCenter: boolean) => React.ReactNode;
  label: string;
  /** Height of the centred item in px */
  height?: number;
}

const VISIBLE_EACH_SIDE = 2;

/** Cover-flow style picker: pink arrows, centred item larger, check circle confirms it */
function Carousel<T>({ items, index, onIndexChange, selected, onSelect, renderItem, label, height = 260 }: CarouselProps<T>) {
  const count = items.length;
  const go = (delta: number) => onIndexChange((index + delta + count) % count);

  // Signed distance of item i from the centre, taking the shorter way round the loop
  const offsetOf = (i: number, centre: number) => {
    const d = (((i - centre) % count) + count) % count;
    return d > count / 2 ? d - count : d;
  };

  // Items that wrap round the loop (e.g. from far left to far right) jump without animating,
  // so they don't fly across the stage. Tracked when the index changes.
  const [prevIndex, setPrevIndex] = useState(index);
  const [wrapped, setWrapped] = useState<number[]>([]);
  if (prevIndex !== index) {
    setPrevIndex(index);
    setWrapped(items.map((_, i) => i).filter((i) => Math.abs(offsetOf(i, index) - offsetOf(i, prevIndex)) > VISIBLE_EACH_SIDE));
  }

  return (
    <div className={styles.carousel}>
      <div className={styles.stage} style={{ height: height + 20 }}>
        <button type="button" className={`${styles.arrow} ${styles.prev}`} onClick={() => go(-1)} aria-label={`Previous ${label}`} />
        <div className={styles.track}>
          {items.map((item, i) => {
            const offset = offsetOf(i, index);
            const hidden = Math.abs(offset) > VISIBLE_EACH_SIDE;
            // Hidden items wait just off the edge so they slide in from the side
            const pos = Math.max(-VISIBLE_EACH_SIDE - 1, Math.min(VISIBLE_EACH_SIDE + 1, offset));
            return (
              <button
                type="button"
                key={i}
                className={`${styles.item} ${offset === 0 ? styles.center : ''}`}
                style={{
                  height,
                  transform: `translateX(${pos * 62}%) scale(${1 - Math.abs(pos) * 0.14})`,
                  zIndex: 10 - Math.abs(pos),
                  opacity: hidden ? 0 : 1,
                  pointerEvents: hidden ? 'none' : undefined,
                  transition: wrapped.includes(i) ? 'none' : undefined,
                }}
                onClick={() => (offset === 0 ? onSelect() : onIndexChange(i))}
                aria-label={`${label} ${i + 1}`}
                aria-hidden={hidden || undefined}
                tabIndex={hidden ? -1 : undefined}
              >
                {renderItem(item, offset === 0)}
              </button>
            );
          })}
        </div>
        <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={() => go(1)} aria-label={`Next ${label}`} />
      </div>
      <div className={styles.check}>
        <CheckCircle checked={selected} onClick={onSelect} label={`Select ${label}`} />
        <span className={styles.counter}>
          {index + 1} / {count}
        </span>
      </div>
    </div>
  );
}

export default Carousel;
