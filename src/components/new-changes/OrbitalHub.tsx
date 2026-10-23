"use client";

import React from 'react';
import styles from './OrbitalHub.module.css';

export interface OrbitalHubNode {
  id: string;
  label: string;
  subtitle: string;
  icon: React.ReactNode;
  completed?: boolean;
  disabled?: boolean;
}

interface OrbitalHubProps {
  center: {
    title: string;
    subtitle: string;
    icon?: React.ReactNode;
    onClick?: () => void;
  };
  nodes: OrbitalHubNode[];
  onNodeClick: (id: string) => void;
  caption: string;
}

const OrbitalHub: React.FC<OrbitalHubProps> = ({
  center,
  nodes,
  onNodeClick,
  caption,
}) => {
  const getNodeClass = (index: number) => {
    const len = nodes.length;
    if (len === 2) {
      return index === 0 ? styles.nodeBiLeft : styles.nodeBiRight;
    }
    if (len === 3) {
      if (index === 0) return styles.nodeTriTop;
      if (index === 1) return styles.nodeTriLeft;
      return styles.nodeTriRight;
    }
    if (len === 5) {
      if (index === 0) return styles.nodePenta0;
      if (index === 1) return styles.nodePenta1;
      if (index === 2) return styles.nodePenta2;
      if (index === 3) return styles.nodePenta3;
      return styles.nodePenta4;
    }
    if (len === 6) {
      if (index === 0) return styles.nodeHexa0;
      if (index === 1) return styles.nodeHexa1;
      if (index === 2) return styles.nodeHexa2;
      if (index === 3) return styles.nodeHexa3;
      if (index === 4) return styles.nodeHexa4;
      return styles.nodeHexa5;
    }
    // Default 4 nodes: 0 = top, 1 = right, 2 = bottom, 3 = left
    if (index === 0) return styles.nodeTop;
    if (index === 1) return styles.nodeRight;
    if (index === 2) return styles.nodeBottom;
    return styles.nodeLeft;
  };

  return (
    <div className={styles.hubContainer}>
      <div className={styles.diagramArea}>
        {/* SVG Orbital dashed circle */}
        <svg className={styles.orbitSvg} viewBox="0 0 520 520">
          <circle cx="260" cy="260" r="195" className={styles.orbitPath} />
        </svg>

        {/* Center Node */}
        <button
          type="button"
          className={styles.centerNode}
          onClick={center.onClick}
          aria-label={center.title}
        >
          {center.icon && <span className={styles.centerIcon}>{center.icon}</span>}
          <span className={styles.centerTitle}>{center.title}</span>
          <span className={styles.centerSubtitle}>{center.subtitle}</span>
        </button>

        {/* Satellite Nodes */}
        {nodes.map((node, i) => {
          const posClass = getNodeClass(i);
          return (
            <button
              key={node.id}
              type="button"
              disabled={node.disabled}
              className={`${styles.satellite} ${posClass} ${node.completed ? styles.satelliteDone : ''} ${node.disabled ? styles.satelliteDisabled : ''}`}
              onClick={() => {
                if (!node.disabled) {
                  onNodeClick(node.id);
                }
              }}
              aria-disabled={node.disabled}
            >
              <div className={styles.satelliteCard}>
                <div className={styles.satelliteIconWrap}>
                  {node.icon}
                  {node.completed && (
                    <span className={styles.checkBadge} aria-label="Completed">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2.5 6 5 8.5 9.5 3.5"></polyline>
                      </svg>
                    </span>
                  )}
                </div>
                <div className={styles.satelliteTextWrap}>
                  <span className={styles.satelliteLabel}>{node.label}</span>
                  <span className={styles.satelliteSubtitle}>{node.subtitle}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className={styles.bottomCaption}>{caption}</p>
    </div>
  );
};

export default OrbitalHub;
