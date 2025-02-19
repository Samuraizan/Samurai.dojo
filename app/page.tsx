/**
 * Landing Page (/)
 * 
 * This is the main entry point of the application.
 * It contains three sections:
 * 1. Hero Section - Displays the GM logo
 * 2. Title Section - Shows "Samurai.Dojo"
 * 3. Entry Section - Shows Command Center link
 */

'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import dynamic from 'next/dynamic'

const SamuraiSlice = dynamic(() => import('./components/animation/SamuraiSlice'), {
  ssr: false
})

const Section = ({ children }: { children: React.ReactNode }) => (
  <section className="h-screen flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="text-center"
    >
      {children}
    </motion.div>
  </section>
)

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start", "end"]
  })

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white">
      <Section>
        <SamuraiSlice />
      </Section>

      <Section>
        <h2 className="text-4xl font-semibold">samurai.dojo</h2>
      </Section>

      <Section>
        <Link href="/agents" className="text-2xl lowercase text-white/70 hover:text-white transition-colors">
          command center
        </Link>
      </Section>
    </div>
  )
}
