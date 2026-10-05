import React from 'react';
import Header from '@/components/Header';
import RegisterWizard from '@/components/register/RegisterWizard';
import styles from '../page.module.css';

export default function RegisterPage() {
  return (
    <main className={styles.page}>
      <Header />
      <section className={styles.registerArea}>
        <RegisterWizard />
      </section>
    </main>
  );
}
