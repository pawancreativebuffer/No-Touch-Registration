"use client";

import React from 'react';
import styles from './ChecklistView.module.css';
import { AreaProgress, WorkspaceArea } from './types';

interface ChecklistViewProps {
  progress: AreaProgress;
  onSelectArea: (area: WorkspaceArea) => void;
  mediaSummary: string;
}

const ChecklistView: React.FC<ChecklistViewProps> = ({
  progress,
  onSelectArea,
  mediaSummary,
}) => {
  const items: {
    id: WorkspaceArea;
    title: string;
    desc: string;
    badge?: string;
    done: boolean;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'brand',
      title: 'Brand Identity',
      desc: 'Logo, store category, brand colours, promo colours and font choice.',
      badge: 'SHARED',
      done: progress.brand,
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
      title: 'Media & Device Design',
      desc: mediaSummary,
      done: progress.media,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      ),
    },
    {
      id: 'shop',
      title: 'Shop Hardware & Stock',
      desc: 'Printer lease, paper cartons, ESL fixtures and screen mounts.',
      done: progress.shop,
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
      title: 'Ticket Data Integration',
      desc: 'Spreadsheet product upload or retail POS sync (Shopify, Lightspeed, Retail Express, Odoo).',
      badge: 'AFTER SIGNUP',
      done: progress.data,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
      ),
    },
    {
      id: 'review',
      title: 'Review, Order & Go Live',
      desc: 'Review total setup, simulate checkout and go live checklist.',
      done: progress.review,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.checklist}>
      {items.map((item) => (
        <div key={item.id} className={`${styles.item} ${item.done ? styles.itemDone : ''}`}>
          <div className={styles.itemLeft}>
            <div className={styles.iconWrap}>{item.icon}</div>
            <div className={styles.info}>
              <div className={styles.titleRow}>
                <span className={styles.title}>{item.title}</span>
                {item.badge && <span className={styles.badge}>{item.badge}</span>}
              </div>
              <span className={styles.desc}>{item.desc}</span>
            </div>
          </div>

          <div className={styles.itemRight}>
            <span className={`${styles.statusPill} ${item.done ? styles.statusDone : ''}`}>
              {item.done ? '✓ Complete' : 'To Do'}
            </span>
            <button
              type="button"
              className={styles.actionButton}
              onClick={() => onSelectArea(item.id)}
            >
              {item.done ? 'Edit' : 'Configure'} →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChecklistView;
