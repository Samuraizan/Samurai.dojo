import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Samurai Dojo',
  description: 'Welcome to the Samurai Dojo - Command Center',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
