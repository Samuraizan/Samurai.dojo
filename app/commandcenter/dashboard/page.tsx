'use client';

import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Dashboard() {
  return (
    <main className={styles.main}>
      <h1>command dashboard</h1>
      <div className={styles.navigation}>
        <Link href="/commandcenter" className={styles.link}>
          back to command center
        </Link>
        <Link href="/" className={styles.link}>
          back to home
        </Link>
      </div>
    </main>
  );
} 