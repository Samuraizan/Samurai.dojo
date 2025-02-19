'use client';

import React, { useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import sharedStyles from '../styles/shared.module.css';
import Navigation from '../components/Navigation';

interface CommandCard {
  id: string;
  title: string;
  description: string;
  href: string;
  status?: 'active' | 'beta' | 'coming-soon';
}

const COMMAND_CARDS: CommandCard[] = [
  {
    id: 'ogsenpai',
    title: 'OGSenpai',
    description: 'AI-powered chat with OpenAI, DeepSeek, and ELIZA',
    href: '/commandcenter/ogsenpai',
    status: 'active'
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'System monitoring and analytics',
    href: '/commandcenter/dashboard',
    status: 'coming-soon'
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configure system preferences',
    href: '/commandcenter/settings',
    status: 'coming-soon'
  }
];

export default function CommandCenter() {
  const handleMouseMove = useCallback((e: MouseEvent) => {
    requestAnimationFrame(() => {
      const cards = document.getElementsByClassName(styles.bentoCard);
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
        backLink="/"
        backText="back to home"
        title="command center"
      />
      <div className={sharedStyles.contentContainer}>
        <div className={styles.bentoGrid}>
          <Link href="/commandcenter/ogsenpai">
            <div className={styles.bentoCard}>
              <span className={styles.cardTitle}>ogsenpai</span>
            </div>
          </Link>
          <Link href="/commandcenter/socialsenpai">
            <div className={styles.bentoCard}>
              <span className={styles.cardTitle}>socialsenpai</span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
} 