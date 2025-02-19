'use client';

import React from 'react';
import sharedStyles from '../../styles/shared.module.css';
import Navigation from '../../components/Navigation';
import Terminal from './components/Terminal';

export default function OGSenpai() {
  return (
    <main className={sharedStyles.mainContainer}>
      <Navigation 
        backLink="/commandcenter"
        backText="back to command center"
      />
      <div className={sharedStyles.contentContainer}>
        <Terminal prompt="ogsenpai>" />
      </div>
    </main>
  );
} 