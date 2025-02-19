'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

// Types
interface SectionRef {
  current: HTMLDivElement | null;
}

// Constants
const INTERSECTION_THRESHOLD = 0.5;
const IMAGE_QUALITY = 75;

export default function Home() {
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      threshold: INTERSECTION_THRESHOLD,
      rootMargin: '0px',
    };

    const sectionRefs: SectionRef[] = [section2Ref, section3Ref];
    
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            entry.target.classList.add(styles.visible);
          });
        }
      }
    }, observerOptions);

    for (const ref of sectionRefs) {
      if (ref.current) observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <main className={styles.main}>
      <section className={styles.heroSection}>
        <div className={styles.gifContainer}>
          <Image
            src="/assets/Samurai Slice.gif"
            alt="Samurai Slice Animation"
            fill
            priority
            quality={IMAGE_QUALITY}
            sizes="100vw"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </div>
      </section>

      <section className={styles.textSection} ref={section2Ref}>
        <div className={styles.textContent}>
          <h2>samurai.dojo</h2>
        </div>
      </section>

      <section className={styles.commandSection} ref={section3Ref}>
        <Link 
          href="/commandcenter" 
          className={styles.commandLink}
          aria-label="Go to Command Center"
        >
          <span>command center</span>
        </Link>
      </section>
    </main>
  );
} 