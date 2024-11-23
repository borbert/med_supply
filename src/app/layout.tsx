/**
 * Root Layout
 * 
 * This is the root layout component that wraps all pages.
 * It provides:
 * - Global styles
 * - Session management
 * - Theme configuration
 */

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MedSupply - Clinic Ordering System',
  description: 'Streamline your medical supply ordering process',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
