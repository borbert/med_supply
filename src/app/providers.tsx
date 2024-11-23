/**
 * Application Providers
 * 
 * This file contains all the providers that wrap the application,
 * including the session provider for user authentication state.
 */

'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentSession } from '@/lib/session'

// Define the User type
export type User = {
  id: string
  email: string
  name: string
  role: string
  clinicId: string
} | null

// Create the session context
const SessionContext = createContext<{
  user: User
  loading: boolean
  refreshSession: () => Promise<void>
}>({
  user: null,
  loading: true,
  refreshSession: async () => {}
})

// Hook to use the session context
export const useSession = () => useContext(SessionContext)

/**
 * Session Provider Component
 * 
 * Provides user session state to the application
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  // Function to refresh the session
  const refreshSession = async () => {
    try {
      const session = await getCurrentSession()
      setUser(session)
    } catch (error) {
      console.error('Error refreshing session:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // Initialize session on mount
  useEffect(() => {
    refreshSession()
  }, [])

  return (
    <SessionContext.Provider value={{ user, loading, refreshSession }}>
      {children}
    </SessionContext.Provider>
  )
}

/**
 * Root Providers Component
 * 
 * Wraps the application with all necessary providers
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
