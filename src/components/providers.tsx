/**
 * Application Providers Component
 * 
 * Wraps the application with necessary providers for:
 * - NextUI components and styling
 * - Theme management (light/dark mode)
 * - System theme detection and synchronization
 * - Next-Auth session management
 * 
 * This component should be used at the root level of the application
 * to ensure all features are available throughout the component tree.
 */

'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'

/**
 * Providers Component
 * 
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to be wrapped with providers
 * 
 * Implements:
 * - NextUI Provider for component styling and functionality
 * - Next Themes Provider for theme management
 * - System theme detection and preference sync
 * - Next-Auth Session Provider for authentication
 */
export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<NextUIProvider>
				{/* Theme Provider with system theme detection */}
				<NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
					{children}
				</NextThemesProvider>
			</NextUIProvider>
		</SessionProvider>
	)
}
