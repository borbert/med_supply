'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShieldCheck, User } from 'lucide-react'

interface HeaderProps {
  title: string
  description?: string
  isAdmin?: boolean
  showRoleToggle?: boolean
  onRoleToggle?: () => void
  actions?: React.ReactNode
}

export function Header({ 
  title, 
  description, 
  isAdmin = false, 
  showRoleToggle = false,
  onRoleToggle,
  actions 
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between space-y-2">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <Badge 
            variant={isAdmin ? "default" : "secondary"}
            className="flex items-center gap-1"
          >
            {isAdmin ? <ShieldCheck className="h-3 w-3" /> : <User className="h-3 w-3" />}
            {isAdmin ? 'Admin' : 'Clinic User'}
          </Badge>
        </div>
        {description && (
          <p className="text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
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
