"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

interface NavItem {
  name: string;
  subItems: string[];
}

// Only Platform's sub-items come from the design; the rest are placeholders.
const NAV_ITEMS: NavItem[] = [
  {
    name: 'Platform',
    subItems: ['Platform Overview', 'Automation and Templates', 'Integrations', 'Security and Scale', 'Why Ticket-IT'],
  },
  { name: 'Solutions', subItems: ['Shelf Ticketing', 'Digital Signage', 'ESL Management', 'Campaigns'] },
  { name: 'Retailers', subItems: ['Grocery', 'Pharmacy', 'Franchise Networks'] },
  { name: 'Resources', subItems: ['Documentation', 'Case Studies', 'Blog'] },
  { name: 'Contact', subItems: ['Sales', 'Support'] },
];


const Header = () => {
  const [activeNav, setActiveNav] = useState(NAV_ITEMS[0].name);
  const subItems = NAV_ITEMS.find((item) => item.name === activeNav)?.subItems ?? [];
  const [activeSub, setActiveSub] = useState(subItems[0]);

  const selectNav = (item: NavItem) => {
    setActiveNav(item.name);
    setActiveSub(item.subItems[0]);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoBlob}>
        <img src="/images/h-logo.png" alt="Ticket IT" className={styles.logo} />
      </div>

      <div className={styles.topBar}>
        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.name}
              className={`${styles.navItem} ${activeNav === item.name ? styles.active : ''}`}
              onClick={() => selectNav(item)}
            >
              {item.name}
              <svg className={styles.caret} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          ))}
        </nav>
        <Link href="/" className={styles.loginButton}>
          Login
        </Link>
      </div>

      <div className={styles.subNav}>
        <ul className={styles.subNavList}>
          {subItems.map((sub) => (
            <li key={sub}>
              <a
                href="#"
                className={`${styles.subNavItem} ${activeSub === sub ? styles.subActive : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSub(sub);
                }}
              >
                {sub}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
