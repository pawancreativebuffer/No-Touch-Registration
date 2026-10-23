"use client";

import React from 'react';
import styles from './WorkspaceSidebar.module.css';
import { AreaProgress, WorkspaceArea } from './types';

interface WorkspaceSidebarProps {
  currentArea: WorkspaceArea;
  onSelectArea: (area: WorkspaceArea) => void;
  storeName?: string;
  progress: AreaProgress;
  section?: 'storeOnly' | 'navOnly' | 'all';
}

const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({
  currentArea,
  onSelectArea,
  storeName = 'Your retail store',
  progress,
  section = 'all',
}) => {
  const completedCount = Object.values(progress).filter(Boolean).length;
  const progressPercent = (completedCount / 5) * 100;

  const navItems: { id: WorkspaceArea; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'overview',
      label: 'Setup overview',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
    },
    {
      id: 'brand',
      label: 'Brand',
      badge: 'SHARED',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      label: 'Media',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      ),
    },
    {
      id: 'shop',
      label: 'Shop',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      ),
    },
    {
      id: 'data',
      label: 'Ticket Data',
      badge: 'AFTER SIGNUP',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
      ),
    },
  ];

  if (section === 'storeOnly') {
    return (
      <div className={styles.sidebar}>
        <div className={styles.kicker}>YOUR WORKSPACE</div>
        <div className={styles.storeCard}>
          <div className={styles.storeLabel}>Store setup</div>
          <div className={styles.storeName}>{storeName}</div>
          <div className={styles.progressRow}>
            <div className={styles.progressText}>{completedCount} of 5 areas complete</div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'navOnly') {
    return (
      <div className={styles.sidebar}>
        <nav className={styles.nav} aria-label="Workspace areas">
          {navItems.map((item) => {
            const isActive = currentArea === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={() => onSelectArea(item.id)}
              >
                <span className={styles.navItemLeft}>
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                {item.badge && <span className={styles.badge}>{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        <div className={styles.footerBox}>
          <p className={styles.tagline}>
            One brand. One data connection. Design for every selected medium.
          </p>

          <button
            type="button"
            className={`${styles.reviewButton} ${currentArea === 'review' ? styles.reviewButtonActive : ''}`}
            onClick={() => onSelectArea('review')}
          >
            <span className={styles.reviewCheck}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span>Review & finish signup</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.kicker}>YOUR WORKSPACE</div>

      <div className={styles.storeCard}>
        <div className={styles.storeLabel}>Store setup</div>
        <div className={styles.storeName}>{storeName}</div>
        <div className={styles.progressRow}>
          <div className={styles.progressText}>{completedCount} of 5 areas complete</div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      <nav className={styles.nav} aria-label="Workspace areas">
        {navItems.map((item) => {
          const isActive = currentArea === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              onClick={() => onSelectArea(item.id)}
            >
              <span className={styles.navItemLeft}>
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </span>
              {item.badge && <span className={styles.badge}>{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      <div className={styles.footerBox}>
        <p className={styles.tagline}>
          One brand. One data connection. Design for every selected medium.
        </p>

        <button
          type="button"
          className={`${styles.reviewButton} ${currentArea === 'review' ? styles.reviewButtonActive : ''}`}
          onClick={() => onSelectArea('review')}
        >
          <span className={styles.reviewCheck}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
          <span>Review & finish signup</span>
        </button>
      </div>
    </aside>
  );
};

export default WorkspaceSidebar;
