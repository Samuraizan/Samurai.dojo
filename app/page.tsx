/**
 * Landing Page (/)
 * 
 * This is the main entry point of the application.
 * It contains three sections:
 * 1. Hero Section - Displays the Samurai animation
 * 2. Title Section - Shows "Samurai.Dojo" on first scroll
 * 3. Entry Section - Shows "OGSenpai" on second scroll with link to dashboard
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { type FC } from 'react'

// Types
type ScrollStage = 0 | 1 | 2
type SectionProps = {
  isVisible: boolean
  children: React.ReactNode
}

// Reusable Components
const AnimatedSection: FC<SectionProps> = ({ isVisible, children }) => (
  <section className="min-h-screen flex items-center justify-center">
    <div
      className={`transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      {children}
    </div>
  </section>
)

// Constants
const SCROLL_THRESHOLDS = {
  TITLE: 0.5,
  ENTRY: 1.5,
}

export default function LandingPage() {
  const [scrollStage, setScrollStage] = useState<ScrollStage>(0)

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY
    const windowHeight = window.innerHeight

    if (scrollPosition < windowHeight * SCROLL_THRESHOLDS.TITLE) {
      setScrollStage(0)
    } else if (scrollPosition < windowHeight * SCROLL_THRESHOLDS.ENTRY) {
      setScrollStage(1)
    } else {
      setScrollStage(2)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <AnimatedSection isVisible={true}>
        <div className="w-[960px] h-[540px] relative">
          <Image
            src="/assets/Samurai Slice 960x540.gif"
            alt="Samurai Slice Animation"
            width={960}
            height={540}
            className="object-contain"
            priority
            unoptimized
          />
        </div>
      </AnimatedSection>

      {/* Title Section */}
      <AnimatedSection isVisible={scrollStage >= 1}>
        <h1 className="text-6xl font-bold text-center">
          Samurai.Dojo
        </h1>
      </AnimatedSection>

      {/* Entry Section */}
      <AnimatedSection isVisible={scrollStage >= 2}>
        <Link 
          href="/commandcenter" 
          className="text-4xl text-gray-400 hover:text-white transition-colors duration-300"
        >
          Command Center
        </Link>
      </AnimatedSection>
    </main>
  )
}
