import React from 'react';
import Header from '@/components/Header';
import Hub from '@/components/hub/Hub';
import styles from '../page.module.css';

export default function RegisterPage() {
  return (
    <main className={styles.page}>
      <Header />
      <section className={styles.registerArea}>
        <Hub />
      </section>
    </main>
  );
}
