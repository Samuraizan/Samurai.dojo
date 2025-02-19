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

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const [scrollStage, setScrollStage] = useState(0)

  // Handle scroll events to control content visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight

      // Define scroll stages based on window height
      if (scrollPosition < windowHeight * 0.5) {
        setScrollStage(0) // Initial stage - only animation visible
      } else if (scrollPosition < windowHeight * 1.5) {
        setScrollStage(1) // First scroll - show title
      } else {
        setScrollStage(2) // Second scroll - show entry link
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section - Samurai Animation */}
      <section className="flex min-h-screen flex-col items-center justify-center" id="hero-section">
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
      </section>

      {/* Title Section - Samurai.Dojo */}
      <section className="min-h-screen flex items-center justify-center" id="title-section">
        <div className={`transform transition-all duration-1000 ${
          scrollStage >= 1 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-6xl font-bold text-white text-center">
            Samurai.Dojo
          </h1>
        </div>
      </section>

      {/* Entry Section - Command Center */}
      <section className="min-h-screen flex items-center justify-center" id="entry-section">
        <div className={`transform transition-all duration-1000 ${
          scrollStage >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <Link 
            href="/commandcenter" 
            className="text-4xl text-gray-400 hover:text-white transition-colors duration-300"
          >
            Command Center
          </Link>
        </div>
      </section>
    </main>
  )
}
