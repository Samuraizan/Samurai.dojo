import React from 'react';
import Link from 'next/link';
import styles from '../styles/shared.module.css';

interface NavigationProps {
  backLink: string;
  backText: string;
  title?: string;
}

export default function Navigation({ backLink, backText, title }: NavigationProps) {
  return (
    <nav className={styles.navigation}>
      <Link href={backLink} className={styles.navigationLink}>
        {backText}
      </Link>
      {title && <span className={styles.navigationLink}>{title}</span>}
    </nav>
  );
} 