'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShieldCheck, User } from 'lucide-react'

/**
 * @typedef {Object} HeaderProps
 * @property {string} title - The header title
 * @property {string} [description] - Optional description text
 * @property {boolean} [isAdmin=false] - Whether the user is an admin
 * @property {boolean} [showRoleToggle=false] - Whether to show role toggle button
 * @property {Function} [onRoleToggle] - Callback when role is toggled
 * @property {React.ReactNode} [actions] - Additional action components
 */

/**
 * Header component with role badge and optional role toggle
 * @param {HeaderProps} props
 */
export function Header({ 
  title, 
  description, 
  isAdmin = false, 
  showRoleToggle = false,
  onRoleToggle,
  actions 
}) {
  return (
    <div className="flex flex-col gap-4 pb-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <Badge 
            variant={isAdmin ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            {isAdmin ? <ShieldCheck className="h-3 w-3" /> : <User className="h-3 w-3" />}
            {isAdmin ? 'Admin' : 'Clinic User'}
          </Badge>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-4">
        {showRoleToggle && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRoleToggle}
          >
            Toggle Role (Demo)
          </Button>
        )}
        {actions}
      </div>
    </div>
  )
}
