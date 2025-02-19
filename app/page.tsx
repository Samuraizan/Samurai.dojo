/**
 * Landing Page (/)
 * 
 * This is the main entry point of the application.
 * It contains three sections:
 * 1. Hero Section - Displays the Samurai animation
 * 2. Title Section - Shows "Samurai.Dojo" on first scroll
 * 3. Entry Section - Shows "OGSenpai" on second scroll with link to dashboard
 */

import { redirect } from 'next/navigation'

export default function HomePage() {
  redirect('/dashboard')
}
