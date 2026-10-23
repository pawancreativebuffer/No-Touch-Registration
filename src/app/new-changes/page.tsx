import React from 'react';
import Header from '@/components/Header';
import SetupNavigator from '@/components/new-changes/SetupNavigator';
import styles from './page.module.css';

export const metadata = {
  title: 'Make Ticket-IT your own | Workspace Setup',
  description: 'Choose where you want to show up. Build your look, explore your options, and connect your products.',
};

export default function NewChangesPage() {
  return (
    <main className={styles.page}>
      <Header />
      <section className={styles.workspaceArea}>
        <SetupNavigator />
      </section>
    </main>
  );
}
