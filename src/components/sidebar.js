/**
 * Sidebar Navigation Component
 * 
 * Provides the main navigation interface for the application.
 * Features:
 * - Responsive design
 * - Active route highlighting
 * - Icon-based navigation
 * - Color-coded sections
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Box, LayoutDashboard, Settings, ShoppingCart } from 'lucide-react'

/**
 * Navigation Routes Configuration
 * 
 * Defines the main navigation structure of the application.
 * Each route includes:
 * - Label: Display name
 * - Icon: Lucide icon component
 * - href: Route path
 * - color: Accent color for the icon
 */
const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-500'
  },
  {
    label: 'Inventory',
    icon: Box,
    href: '/inventory',
    color: 'text-violet-500'
  },
  {
    label: 'Orders',
    icon: ShoppingCart,
    href: '/orders',
    color: 'text-pink-500'
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    color: 'text-emerald-500'
  }
]

/**
 * Sidebar Component
 * 
 * Renders the main navigation sidebar with:
 * - Application branding
 * - Navigation links with icons
 * - Active route highlighting
 * - Responsive layout adjustments
 */
export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col gap-4 border-r bg-gray-50/40 px-2 py-4">
      {/* App Branding */}
      <div className="px-3 py-2">
        <h2 className="text-lg font-semibold">MedSupply</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-1 flex-col gap-1">
        {routes.map(route => {
          const Icon = route.icon
          return (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 ${
                pathname === route.href ? 'bg-gray-100' : ''
              }`}
            >
              <Icon className={`h-5 w-5 ${route.color}`} />
              <span>{route.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
