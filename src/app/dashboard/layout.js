/**
 * Dashboard Layout
 * 
 * Layout wrapper for all dashboard pages
 */

'use client'

import AuthenticatedLayout from '../layout.authenticated'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-full flex-col">
      {children}
    </div>
  )
}
