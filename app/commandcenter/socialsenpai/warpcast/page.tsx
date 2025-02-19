'use client';

import React from 'react';
import styles from './page.module.css';
import sharedStyles from '../../../styles/shared.module.css';
import Navigation from '../../../components/Navigation';

export default function Warpcast() {
  return (
    <main className={sharedStyles.mainContainer}>
      <Navigation 
        backLink="/commandcenter/socialsenpai"
        backText="back to socialsenpai console"
      />
      <div className={sharedStyles.contentContainer}>
      </div>
    </main>
  );
} 