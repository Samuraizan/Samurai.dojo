'use client';

import React, { useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import sharedStyles from '../../styles/shared.module.css';
import Navigation from '../../components/Navigation';

export default function SocialSenpai() {
  const handleMouseMove = useCallback((e: MouseEvent) => {
    requestAnimationFrame(() => {
      const cards = document.getElementsByClassName(styles.bentoItem);
      for (const card of Array.from(cards)) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      }
    });
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <main className={sharedStyles.mainContainer}>
      <Navigation 
        backLink="/commandcenter"
        backText="back to command center"
      />
      <div className={sharedStyles.contentContainer}>
        <div className={styles.dashboardGrid}>
          <Link href="/commandcenter/socialsenpai/warpcast" className={styles.cardLink}>
            <div className={styles.bentoItem}>
              <h2 className={styles.mainTitle}>warpcast</h2>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
} 