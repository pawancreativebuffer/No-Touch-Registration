"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './LoginCard.module.css';
import form from './ui/Form.module.css';

const LoginCard = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prototype only: no backend call.
  };

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <img src="/images/logo.png" alt="Ticket IT" className={styles.logo} />
        <h2 className={styles.headline}>The ticketing solution that ticks all the boxes</h2>
        <p className={styles.content}>
          In-store tickets are critical as part of the path to purchase. In any retail
          transaction, communicating accurate pricing, savings, product details and benefits can
          be the difference between getting a profitable sale and not getting a sale at all.
        </p>
      </div>

      <div className={styles.right}>
        <h2 className={styles.headline}>Welcome back!</h2>
        <p className={styles.subline}>Login to continue</p>

        <form onSubmit={handleSubmit}>
          <div className={form.field}>
            <label htmlFor="login" className={form.label}>Username</label>
            <input
              id="login"
              className={form.input}
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className={form.field}>
            <label htmlFor="password" className={form.label}>Password</label>
            <input
              id="password"
              className={form.input}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className={styles.optionsRow}>
            <label className={styles.remember}>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember me
            </label>
            <a href="#" className={form.link}>Forgot Password</a>
          </div>

          <button type="submit" className={form.button}>
            <span className={form.buttonIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
            </span>
            <span className={form.buttonText}>Sign In</span>
          </button>

          <p className={styles.register}>
            Don&apos;t have an account?
            <Link href="/register" className={form.link}>Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginCard;
