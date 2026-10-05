import React from 'react';
import Header from '@/components/Header';
import LoginCard from '@/components/LoginCard';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.page}>
      <Header />
      <section className={styles.loginArea}>
        <LoginCard />
      </section>
    </main>
  );
}
