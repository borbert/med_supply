/**
 * Application Providers Component
 * 
 * Wraps the application with necessary providers for:
 * - NextUI components and styling
 * - Theme management (light/dark mode)
 * - System theme detection and synchronization
 * 
 * This component should be used at the root level of the application
 * to ensure all features are available throughout the component tree.
 */

'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

/**
 * Providers Component
 * 
 * @param {object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to be wrapped with providers
 * @returns {JSX.Element} JSX element wrapping children with all necessary providers
 */
export function Providers({ children }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <NextUIProvider>
        {children}
      </NextUIProvider>
    </NextThemesProvider>
  )
}
